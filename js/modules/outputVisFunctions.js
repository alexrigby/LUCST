import fetchData from "/js/modules/universalFunctions.js";
import { getHruData } from "/js/modules/hru_dataFunctions.js";
import { updateCurrentScenario } from "/js/main.js";
import { choropleth } from "/js/modules/choroplethFunctions.js";
import { getSwatPlantList, getPlantData } from "/js/modules/plantFunctions.js";
import { getConsPractice, getCurveNumer, getManN, getLanduseData, getUrbanList, getTileDrain, getSepticData, getFilterStrip, getGrassedWw } from "/js/modules/landuseFunctions.js";
import { HOST } from "../main.js"




function cleanTxt(data) {

  const clean = d3.tsvParse(data
    // Remove the header line produced by SWAT+ Editor
    .substring(data.indexOf('\n') + 1)
    // First, remove all spaces and replace with tabs
    .replace(/  +/gm, '\t')
    // Then remove all leading and trailing tabs
    .replace(/^\t|\t$/gm, '')
  );
  //removes the line which displays units from output data
  const noUnits = clean.filter(clean => clean.jday != 'ha');
  return noUnits
}

const convertToCSV = (data) => {
  // Convert dataset to TSV and print
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row => headers.map(fieldName => row[fieldName]).join(','))
  ].join('\r\n');

  return csv;
}

function cleanCsvOutput(data) {

  const clean = d3.csvParse(data
    // Remove the header line produced by SWAT+ Editor
    .substring(data.indexOf('\n') + 1)
    // First, remove all spaces and replace with nothing
    .replace(/ +/gm, '')
    //might work, adds 0 in front of all single didgit numbers, test if vega-lite accepts it 
    .replace(/\b(\d{1})\b/g, '0$1')
    // Then remove all leading and trailing tabs
    //.replace(/^\t|\t$/gm)
  );
  const outputNames = clean.columns.splice(7)
  window.OUTPUTNAMES = [...outputNames]

  //removes the line which displays units from output data
  const noUnits = clean.filter(clean => clean.flo_out != 'm^03/s');
  return noUnits
}

function cleanDefaultCsvOutput(data) {

  const clean = d3.csvParse(data
    // Remove the header line produced by SWAT+ Editor
    .substring(data.indexOf('\n') + 1)
    // First, remove all spaces and replace with nothing
    .replace(/ +/gm, '')
    //might work, adds 0 in front of all single didgit numbers, test if vega-lite accepts it 
    .replace(/\b(\d{1})\b/g, '0$1')
    // Then remove all leading and trailing tabs
    //.replace(/^\t|\t$/gm)
  );
  //removes the line which displays units from output data
  const noUnits = clean.filter(clean => clean.flo_out != 'm^03/s');

  return noUnits

}

//Combines the day, month and year to make a new feild; "date"
function getDate(data) {
  const date = data.map(record => record.yr + '-' + record.mon + '-' + record.day);
  //  console.log('new date collumn', date);
  return date
}

//Gets the channel names from hru-data.hru
function getName(data) {
  const names = data.map(record => record.name);
  const namesUnique = new Set([...names]);
  return Array.from(namesUnique)
}


//Gets the data for the selected channels 
function getChannelData(data, name) {
  const filteredData = data.filter(record => record.name === name);
  // console.log("selected channel Data", filteredData);
  return filteredData
}

function cleanTxtOutput(data) {
  return d3.tsvParse(data
    // Remove the header line produced by SWAT+ Editor
    .substring(data.indexOf('\n') + 1)
    // First, remove all spaces and replace with tabs
    .replace(/  +/gm, '\t')
    // Then remove all leading and trailing tabs
    .replace(/^\t|\t$/gm, '')
  );
}


function downloadHydrographCsv(data, fileName) {
  document.getElementById('downloadPlot').setAttribute('href', 'data:text/csv;charset=utf-8,' + escape(data));
  document.getElementById('downloadPlot').setAttribute('download', fileName);

}

async function getMainChan() {
  await fetchData(`/catchment/Scenarios/Default/TxtInOut/chandeg.con`)
    .then(data => {
      //clean txt file
      const clean = cleanTxtOutput(data);
      const filteredData = clean.filter(record => record.out_tot == 0);
      // console.log(filteredData[0].name)
      const mainChan = filteredData[0].name
      window.MAINCHAN = mainChan
    });
}

export async function getHydrographOutputOptions() {
  await fetchData(`/catchment/Scenarios/Default/TxtInOut/channel_sd_day.csv`)
    .then(data => {

      const cleanOutPut = cleanCsvOutput(data);

      //Gets the names of the output values (column headers) and add them to a select 
      const outputNameOptions = window.OUTPUTNAMES.map((el, i) => {
        return `<option value=${el}>${el}</option>`;
      })
      const outputOps = document.getElementById("output")
      outputOps.innerHTML = `<option style="background-color:grey" value="flo_out">flo_out</option>` + `${outputNameOptions}`
    })
}

export async function getHydrographOptions() {
  await getMainChan()
  await fetchData(`/catchment/Scenarios/Default/TxtInOut/channel_sd_day.csv`)
    .then(data => {

      const cleanOutput = cleanCsvOutput(data);
      //adds "date" to the array 
      const date = getDate(cleanOutput);
      for (var i = 0; i < cleanOutput.length; i++) {
        cleanOutput[i]['date'] = date[i];
      }

      //gets the channel names and adds  them to the select list
      const channelNames = getName(cleanOutput)
      const channelOptions = channelNames.map((el, i) => {
        return `<option class="channelNames" value=${el}>${el}</option>`;
      });
      const chanOpts = document.getElementById("channel")
      chanOpts.innerHTML = `<option style="background-color:grey" title="main channel" class= "channelNames" value= ${window.MAINCHAN}> ${window.MAINCHAN}</option>` + `${channelOptions}`
    })
}

//function to get the Default data to display as a background plot on  the time series
async function getDefaultTimeSeriesData() {
  await fetchData('/catchment/Scenarios/Default/TxtInOut/channel_sd_day.csv')
    .then(data => {
      const cleanOutput = cleanDefaultCsvOutput(data);

      const date = getDate(cleanOutput);
      for (var i = 0; i < cleanOutput.length; i++) {
        cleanOutput[i]['date'] = date[i];
      }

      window.defaultPlotData = [...cleanOutput]

    })
}




export async function hydrograph(scenario) {
  await fetchData(`/catchment/Scenarios/${scenario}/TxtInOut/channel_sd_day.csv`)
    .then(async data => {

      await getDefaultTimeSeriesData()
      const cleanOutput = cleanCsvOutput(data);
      // console.log(cleanOutput)
      //adds "date" to the array 
      const date = getDate(cleanOutput);
      for (var i = 0; i < cleanOutput.length; i++) {
        cleanOutput[i]['date'] = date[i];
      }

      const chanOpts = document.getElementById("channel")
      // when user Selects channel or output filters the data and plots 
      const outputOps = document.getElementById("output");
      const hydrographSelect = [chanOpts, outputOps]


      async function plotHydrograph() {

        const defaultOutput = "default_" + outputOps.value
        //gets data from default scenario for comparison plot
        const defaultChannel = await getChannelData(window.defaultPlotData, chanOpts.value)
        const defaultPlotData = defaultChannel.map(el => (
          {
            date: el.date,
            [defaultOutput]: el[outputOps.value],
          }
        ));

        const currentChannel = await getChannelData(cleanOutput, chanOpts.value);

        // function returns the values of selected output
        const plotData = currentChannel.map(el => (
          {
            date: el.date,
            [outputOps.value]: el[outputOps.value],
          }
        ));

        // calcumates the maximun value of that plot and sets the axis to that value + 10% (may be usless)
        const defaultplotvalues = defaultPlotData.map(record => record[defaultOutput]);
        let maxDefault = Math.max(...defaultplotvalues)
        const currentplotvalues = plotData.map(record => record[outputOps.value])
        let maxCurrent = Math.max(...currentplotvalues)
        let maxTotalValue = Math.max(...[maxCurrent, maxDefault])
        let percentageOfTotal = (10 / 100) * maxTotalValue
        let axisMax = maxTotalValue + percentageOfTotal


        // maps default and current scenario plots together to get data to plot
        const combinedPlotData = defaultPlotData.map((item, i) => Object.assign({}, item, plotData[i]));

        //download the data plotted as a csv
        const plotDownload = convertToCSV(plotData)

        const plotDownloadButton = document.getElementById("downloadPlot")
        plotDownloadButton.addEventListener('click', () => {
          downloadHydrographCsv(plotDownload, outputOps.value + " for " + chanOpts.value + " in " + window.currentScenario + ".csv")
        })


        var original = {
          $schema: 'https://vega.github.io/schema/vega-lite/v5.json',

          "title": outputOps.value + " for " + chanOpts.value,
          "data": { "values": combinedPlotData },
          "repeat": {
            "layer": [outputOps.value, defaultOutput]
          },


          // "vconcat": [{

          "spec": {
            "width": "container",
            "height": "300",
            "mark": "line",

            "encoding": {
              "x": {
                "timeUnit": "yearmonthdate",
                "field": "date",
                "title": "date",
                "type": "temporal",
                "axis": { "title": "" }
              },
              "y": {
                "field": { "repeat": "layer" },
                "type": "quantitative",
                "axis": { "title": "" },
                "scale": { "domain": [0, axisMax] }
              },
              "color": {
                "datum": { "repeat": "layer" },
                "type": "nominal",
                "legend": {
                  "orient": "top-right"
                }
              },
              "strokeDash": {
                "datum": { "repeat": "layer" },
                "type": "nominal"
              }
            }
          }
        }
        vegaEmbed('#vis', original);
      }

      //call plotHydrograph out side of an event listner so it plots when the page loads
      await plotHydrograph()
      hydrographSelect.forEach(el => {

        el.addEventListener('change', async () => {
          //call plotHydrograph so it is called when change is made in the select list
          await plotHydrograph()
        })
      })
    });
}



export async function scenarioOptions() {
  await fetch(`http://${HOST}:8000/getscenarios`)
    .then(response => response.json())
    .then(data => {
      const scenarioCount = data.length;

      window.currentScenarioVersion = scenarioCount;

      //loops over the scenario names asigning new button for each name
      //calls variable i assignes index 0 to it, button count has to be grater than i, increment i by 1 each time
      document.getElementById("scenarioTab").innerHTML = "";
      for (let i = 0; i < scenarioCount; i++) {
        let button = document.createElement('button');
        button.classList.add('tablinks');
        button.innerHTML = data[i];

        button.dataset.scenario = data[i];


        // Tab button event (click)
        button.addEventListener('click', async () => {
          document.getElementById("hruTable").style.display = "none";

          document.querySelector('#vis').innerHTML = `<div class="swatrunning"> 
          <div class="swatloadingspinner"></div>
         </div>`
          document.querySelector('#choro').classList.add('choroHide')
          updateCurrentScenario(data[i]);

          await getPlantData(data[i]);
          await getSwatPlantList(data[i]);
          await getUrbanList(data[i]);
          await getConsPractice(data[i]);
          await getCurveNumer(data[i]);
          await getManN(data[i]);
          await getHruData(data[i]);
          await getLanduseData(data[i]);
          await getTileDrain(data[i]);
          await getSepticData(data[i]);
          await getFilterStrip(data[i]);
          await getGrassedWw(data[i]);

          // Update vis panel
          if (data.includes(data[i])) {
            await hydrograph(data[i])
            await choropleth(data[i])
            document.querySelector('#choro').classList.remove('choroHide')
          } else {
            document.querySelector('#vis').innerHTML = "";
            document.querySelector('#choro').innerHTML = "";
            document.querySelector('#vis').innerHTML = "Could not fetch scenarios"
          }

          if (data[i] === 'Default') {
            document.querySelector('#runswatbuttonvis') && document.querySelector('#runswatbuttonvis').remove();
          } else {
            document.querySelector('#runswatbuttonvis') && document.querySelector('#runswatbuttonvis').remove();
            const runswatbuttonvis = document.createElement('button');
            runswatbuttonvis.setAttribute('id', 'runswatbuttonvis');
            runswatbuttonvis.setAttribute('class', 'runSwatButton')

            runswatbuttonvis.addEventListener('click', async () => {
              document.getElementById("hruTable").style.display = "none";
              document.querySelector('#vis').innerHTML = "";
              document.querySelector('#choro').innerHTML = "";
              document.querySelector('#vis').innerHTML = `<div class="swatrunning"> 
                <div class="swatloadingspinner"></div>
               </div>`
              await fetch(`http://${HOST}:8000/runswat?scenario=${data[i]}`).then(async (res) => {
                await res.json().then(async (d) => {
                  if (d.code === 1) {
                    console.log(d.message);
                    await hydrograph(data[i])
                    await choropleth(data[i])
                  }
                })
              })
            });
            runswatbuttonvis.innerText = `Run SWAT+ for ${data[i]}`;
            document.querySelector('#runswatbuttonviscontainer').appendChild(runswatbuttonvis);

          }

        });

        document.getElementById("scenarioTab").appendChild(button);

        // Set current scenario to the LATEST scenario.
        updateCurrentScenario(data[i]);


      }

    })
};


export default {
  hydrograph,
  scenarioOptions,
  getHydrographOptions,
  getHydrographOutputOptions
}

