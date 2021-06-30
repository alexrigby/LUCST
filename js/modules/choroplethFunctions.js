import fetchData from "/js/modules/universalFunctions.js"

//Initially cleans the HRU-wb.csv file for maipulation
function cleanCsvOutput(data) {

    const clean = d3.csvParse(data
        // Remove the header line produced by SWAT+ Editor
        .substring(data.indexOf('\n') + 1)
        // First, remove all spaces and replace with nothing
        .replace(/ +/gm, '')
        //   might work, adds 0 in front of all single didgit numbers, test if vega-lite accepts it 
        .replace(/\b(\d{1})\b/g, '0$1')
        // Then remove all leading and trailing tabs
        .replace(/^\t|\t$/gm)
    );
    // splice the collumn names that we dont wnat to display in the plot options then return collumn names as select options
    const outputNames = clean.columns.splice(7)
    // console.log('Output Names', outputNames)
    const outputNameOptions = outputNames.map((el, i) => {
        return `<option value=${el}>${el}</option>`;
    });
    const outputOps = document.getElementById("wbOutput")
    outputOps.innerHTML = `${outputNameOptions}`
    // + `<option value="percip" default> percip </option>`
    // removes the line which displays units from output data so it isnt plotted
    const noUnits = clean.filter(clean => clean.precip != 'mm');
    return noUnits
}

//Combines the month and year to make a new feild; "date", allows monthly interigations of output variables
function getShortDate(data) {
    const date = data.map(record => record.yr + '-' + record.mon);
    //  console.log('new date collumn', date);
    return date
}

//Gets the newly created date names (yyyy-mm) from hru-wb 
function getDate(data) {
    const names = data.map(record => record.date);
    const namesUnique = new Set([...names]);
    return Array.from(namesUnique)
}

//Returns the data for the selected date and output from hru_wb
function getDisplayData(data, name) {
    const filteredData = data.filter(record => record.date === name);
    // console.log("selected channel Data", filteredData);
    return filteredData
}




export function choropleth() {
    //NEED TO SWAP FOR AN API OPTION
    fetchData('LLYFNI2/Scenarios/Default/TxtInOut/hru_wb_mon.csv')
        .then(data => {
            const cleanOutput = cleanCsvOutput(data)
            const date = getShortDate(cleanOutput);
            //gets the short date and adds it to hru_wb
            for (var i = 0; i < cleanOutput.length; i++) {
                cleanOutput[i]['date'] = date[i];
            }

            //gets the available months and adds  them to the select list
            const monNames = getDate(cleanOutput)
            const monOptions = monNames.map((el, i) => {
                return `<option value=${el}>${el}</option>`;
            });
            const monOpts = document.getElementById("month")
            monOpts.innerHTML = `${monOptions}`

            //when user chnages month or output plot changes for seletion
            const selectMonth = document.getElementById("month");
            const selectOutput = document.getElementById("wbOutput")
            const choroplethSelect = [selectMonth, selectOutput]

            choroplethSelect.forEach(el => {
                el.addEventListener('change', () => {
                    plotChoropleth()
                })
                function plotChoropleth() {
                    const month = getDisplayData(cleanOutput, monOpts.value);

                    const outputOps = document.getElementById("wbOutput").value;
                    // console.log(outputOps)

                    //returns the selected output values for each hru(Unit) for the selected month in an array
                    const plotData = month.map(el => (
                        {
                            unit: el.unit,
                            [outputOps]: el[outputOps],
                        }
                    ));
                    // console.log(outputOps, " for ", monOpts.value, plotData)

                    //NEED TO SWAP FOR AN API OPTION
                    //takes the shapefile and returns geojson object where we can access the properties 
                    shp("/data/shpfiles/hru2.zip").then(function (geojson) {


                        var choro = {

                            "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
                            "width": "400",
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
                    })
                }
                plotChoropleth()
            })
        });

}

export default choropleth