//GETS THE DEFAULT CHANNEL_SD_DAY OUTPUT VALUES AND MAKES 'window.defaultPlotData', 
// PARAMATER NAMES AND CHANNEL NUMBERS AND ADDS THEM TO THE SELECT LIST IN 'PLOT TIME SERIES' BOX
import { fetchData } from "./fetchData.js"
import { cleanCsvOutput } from "./cleanCsvOutput.js";
import { getNames } from "./getNamesAndDescriptions.js";
import { cleanTsvSwatFiles } from "./cleanTsvSwatFiles.js";
import api from "../api.js";

export async function defaultChannelData(scenario) {
    await getMainChan();
    await fetch(api.getDefaultChannelData, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ scenario }),
    })
        .then((res) => res.text())
        .then(data => {
    
            //cleans channel_sd_day, returns paresd data and list of headings
            const cleanChannelOutput = cleanCsvOutput(data);
            const channelParamaters = cleanChannelOutput.columnHeaders
            const channelData = cleanChannelOutput.csvData

            //uses channel_day headers to make 'output' select list of channel paramaters for 'plot time' series box 
            const outputNameOptions = channelParamaters.map((el, i) => {
                return `<option value=${el}>${el}</option>`;
            })

            const outputOps = document.getElementById("output")
            outputOps.innerHTML = `<option style="background-color:grey" value="flo_out">flo_out</option>` + `${outputNameOptions}`

            //gets the channel numbers and adds  them to the 'channel' select list in 'plot time series' box
            const channelNumbers = getNames(channelData)
            const uniqueNumbers = new Set([...channelNumbers])
            const uniqueNumbersArray = Array.from(uniqueNumbers)

            const channelNumbersSelect = uniqueNumbersArray.map((el, i) => {
                return `<option class="channelNames" value=${el}>${el}</option>`;
            });
            const chanOpts = document.getElementById("channel")
            //used main channel as default data set when hydrograph loads
            chanOpts.innerHTML = `<option style="background-color:grey" title="main channel" class= "channelNames" value= ${window.MAINCHAN}> ${window.MAINCHAN}</option>` + `${channelNumbersSelect}`;

            //creates date parsable in vega-lite from SWAT+ output
            const date = getDate(channelData);
            //loops over the channel_sd_day data and adds the collumn 'date'
            for (var i = 0; i < channelData.length; i++) {
                channelData[i]['date'] = date[i];
            }

            //window.defaultPlotData is the  default scenarios 'channel_sd_day output' 
            // left as window object as I didnt want to call the function every time I plotted a new hydrograph
            window.defaultPlotData = [...channelData]
        })
}

//Searches 'chandeg.con' txt/tsv file for out_tot == 0 (this is the main channel)
async function getMainChan() {
    await fetchData(`/catchment/Scenarios/Default/TxtInOut/chandeg.con`)
        .then(data => {
            //clean txt file
            const clean = cleanTsvSwatFiles(data);
            const filteredData = clean.filter(record => record.out_tot == 0);
            // console.log(filteredData[0].name)
            const mainChan = filteredData[0].name
            window.MAINCHAN = mainChan
        });
}


//Combines the day, month and year to make a new feild for vega-lite to plott from; "date"
export function getDate(data) {
    const date = data.map(record => record.yr + '-' + record.mon + '-' + record.day);
    //  console.log('new date collumn', date);
    return date
}


export default {
    defaultChannelData,
    getDate
}