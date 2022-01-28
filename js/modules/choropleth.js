import fetchData from "/js/modules/fetchData.js"
import { HOST } from "../main.js"
import { cleanCsvOutput } from "./cleanCsvOutput.js";


export async function choropleth(scenario) {
    //NEED TO SWAP FOR AN API OPTION
    await fetchData(`/catchment/Scenarios/${scenario}/TxtInOut/hru_wb_mon.csv`)
        .then(data => {
            //clean HRU_data.hru csv file, into headers and data
            const cleanHRUOutput = cleanCsvOutput(data)
            const hruParamaters = cleanHRUOutput.columnHeaders
            const hruData = cleanHRUOutput.csvData
            //adds hru paramaters (column headers) to select list in 'plot choropleth box'
            const hruParamaterOptions = hruParamaters.map((el, i) => {
                return `<option value=${el}>${el}</option>`;
            });
            const hruOutputOps = document.getElementById("wbOutput")
            hruOutputOps.innerHTML = `${hruParamaterOptions}`

            //gets each month and year value and adds it to a collumn called 'date' in hruData
            const date = getShortDate(hruData);
            for (var i = 0; i < hruData.length; i++) {
                hruData[i]['date'] = date[i];
            }

            //gets the available months and adds  them to the select list in 'plot choropleth' box
            const monNames = getEachMonth(hruData)
            const monOptions = monNames.map((el, i) => {
                return `<option value=${el}>${el}</option>`;
            });
            const monOpts = document.getElementById("month")
            monOpts.innerHTML = `${monOptions}`


            //when user chnages month or header plot changes for seletion
            const selectOutput = document.getElementById("wbOutput")
            const choroplethSelect = [monOpts, selectOutput]

            //for each element in the choroplethSelect object (both month and header select lists) a 'change' event listner is added. When the 
            // event listner is triggerd 'plotChoropleth()' is called
            choroplethSelect.forEach(async el => {
                el.addEventListener('change', async () => {
                    await plotChoropleth()
                })


                async function plotChoropleth() {
                    //fillters hruData for selected Month
                    const month = getDisplayData(hruData, monOpts.value);
                    //gets the selected output name
                    const outputOps = document.getElementById("wbOutput").value;

                    //returns data for selected output name for selected month for each hru(Unit) as an object
                    const plotData = month.map(el => (
                        {
                            unit: el.unit,
                            [outputOps]: el[outputOps],
                        }
                    ));

                    //NEED TO SWAP FOR AN API OPTION
                    //takes the shapefile and returns geojson object where we can access the properties 
                    await shp("catchment/Watershed/Shapes/hrus2.zip").then(function (geojson) {

                        var choro = {

                            "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
                            "width": "container",
                            "height": "300",
                            "title": outputOps + " for " + monOpts.value,
                            //uses the geojson as main data source (gets coordinates and HRUS key)
                            "data": {
                                "values": geojson,
                                "format": {
                                    "type": "json",
                                    "property": "features",
                                }
                            },
                            //maps 'unit' from plotData to 'HRUS' in geojson and extracts specified outputOps data
                            "transform": [{
                                "lookup": "properties.HRUS",
                                "from": {
                                    "data": {
                                        "values": plotData,
                                    },
                                    "key": "unit",
                                    "fields": [outputOps],
                                }
                            }],
                            // sets projection type to mercator
                            "projection": { "type": "mercator" },
                            "mark": "geoshape",
                            //encodes the user selected output option on the choropleth
                            "encoding": {
                                "color": {
                                    "field": outputOps,
                                    //need to add some logic so 'et' dosent have mm value
                                    "title": outputOps + " mm",
                                    "type": "quantitative"
                                }
                            }
                        }
                        vegaEmbed('#choro', choro);
                        window.HRU1Coordinates = geojson.features[0].geometry.bbox
                    })
                }
                await plotChoropleth()
            })
        });
}

//Gets the newly created date names (yyyy-mm) from hru-wb 
function getEachMonth(data) {
    const names = data.map(record => record.date);
    const namesUnique = new Set([...names]);
    return Array.from(namesUnique)
}

//Returns the data for the selected date and output from hru_wb
function getDisplayData(data, outputHeader) {
    const filteredData = data.filter(record => record.date === outputHeader);
    // console.log("selected channel Data", filteredData);
    return filteredData
}


//Combines the month and year to make a new feild; "date", allows monthly interigations of output variables
function getShortDate(data) {
    const date = data.map(record => record.yr + '-' + record.mon);
    return date
}

export default {
    choropleth,

}