import fetchData from "/js/modules/fetchData.js";
import { updateCurrentScenario } from "/js/main.js";
import { choropleth } from "/js/modules/choroplethFunctions.js";
import { HOST } from "../main.js"
import { getSwatPlantList } from "./getSwatPlantList.js"
import { getTsvFileOptions } from "./getTsvFileOptions.js"
import { cleanPlantIni } from "./cleanPlantIni.js"
import { getInputFileData, getLanduseData, getHruData } from "./getInputFileData.js";
import { cleanTsvSwatFiles } from "./cleanTsvSwatFiles.js";



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

//finds channel with 0 out_tot in chandeg.con to find the main channel
// function getMainChan(data) {
//   const filteredData = data.filter(record => record.out_tot == 0);
//   // console.log(filteredData[0].name)
//   return filteredData[0].name
// }


// async function downloadHydrographCsv(data, fileName) {
//   // var myFile = new Blob([data], { type: 'data:text/csv;charset=utf-8,' });
//   // document.getElementById('downloadPlot').setAttribute('href', 'data:text/csv;charset=utf-8,'+escape(data));
//   // document.getElementById('downloadPlot').setAttribute('download', fileName);
//   await fetch(`http://${HOST}:8000/sendplotdata`, { method: "POST", headers: {
//     'Content-Type': 'application/json' },
//     body: JSON.stringify({plot: data, scenario: window.currentScenario, name: fileName})
//   }).then(res => res.text()).then(data => console.log(data));
// }

function downloadHydrographCsv(data, fileName) {
  // var myFile = new Blob([data], { type: 'data:text/csv;charset=utf-8,' });
  // console.log(myFile)
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
      //maybe better to delete unwanted headers by name? 
      // const outputNames = cleanOutPut.columns.splice(7)
      //console.log('Output Names', outputNames)
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
      // console.log(cleanOutput)
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
      // const channelSelect = document.getElementById("channel")
      // const outputSelect = document.getElementById("output")
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


        // console.log(defaultPlotData)
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
          //  console.log(plotDownload)
          //  alert("Raw CSV " + '"'+outputOps +" for "+ chanOpts.value + '"' + " saved to " + '"'+window.currentScenario+'"'  )
        })

        // const selectedOutput = channel.map(function (value, index) { return value[outputOps.value]; });


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
            //  "transform":[{
            //    "lookup": "date",
            //    "from": {
            //      "data": {
            //        "values": defaultPlotData,
            //      },
            //      "key":"date",
            //      "fields":[outputOps],
            //     }
            //  }],

            "encoding": {
              "x": {
                "timeUnit": "yearmonthdate",
                "field": "date",
                "title": "date",
                "type": "temporal",
                // "scale": { "domain": { "param": "brush" } },
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
          // },
          // {
          //   "width": "container",
          //   "height": 60,
          //   "mark": "line",
          //   "params": [{
          //     "name": "brush",
          //     "select": { "type": "interval", "encodings": ["x"] }
          //   }],
          //   "encoding": {
          //     "x": {
          //       "timeUnit": "yearmonthdate",
          //       "field": "date",
          //       "title": "date",
          //       "type": "temporal"
          //     },
          //     "y": {
          //       "field": [outputOps],
          //       "type": "quantitative",
          //       "axis": { "tickCount": 3, "grid": false },
          //     }
          //   }
          // }]
        }
        vegaEmbed('#vis', original);
      }
      //     var original = {
      //       $schema: 'https://vega.github.io/schema/vega-lite/v5.json',

      //       "title": outputOps.value + " for " + chanOpts.value,
      //       "data": { "values": combinedPlotData },

      //       "vconcat": [
      //         {
      //           "height": 240,
      //           "width": "container",
      //           "encoding": {
      //             "x": {
      //               "scale": { "extent": { "param": "brush", "encoding": "x" } },
      //               "timeUnit": "yearmonthdate",
      //               "field": "date",
      //               "title": "date",
      //               "type": "temporal",

      //               "axis": { "title": "" }
      //             },
      //           },
      //           "layer": [
      //             {
      //               "mark": "line",
      //               "encoding": {
      //                 "y": {
      //                   "field": outputOps.value,
      //                   "type": "quantitative",
      //                   "axis": { "title": "" },
      //                   // "scale": { "domain": [0, axisMax] }
      //                 },
      //               }
      //             },
      //             {
      //               "mark": "line",
      //               "encoding": {
      //                 "y": {
      //                   "field": defaultOutput,
      //                   "type": "quantitative",
      //                   "axis": { "title": "" },

      //                 }
      //               }
      //             },
      //           ],
      //         },
      //       {
      //         "height": 60,
      //         "width": "container",
      //         "mark":"line",
      //         "params": [{
      //           "name": "brush",
      //           "select": { "type": "interval", "encodings": ["x"] },
      //         }],
      //         "encoding": {
      //           "x": {
      //             "field": "date",
      //             "timeUnit": "yearmonthdate",
      //             "title": "date",
      //             "type": "temporal",
      //             "axis": { "title": "" },

      //           },
      //         },
      //         "layer": [
      //           {
      //             "mark": "line",
      //             "encoding": {
      //               "y": {
      //                 "field": outputOps.value,
      //                 "type": "quantitative",
      //                 "axis": { "title": "" },
      //                 // "scale": { "domain": [0, axisMax] }
      //               },
      //             }
      //           },
      //           {
      //             "mark": "line",
      //             "encoding": {
      //               "y": {
      //                 "field": defaultOutput,
      //                 "type": "quantitative",
      //                 "axis": { "title": "" },

      //               }
      //             }
      //           }
      //         ]
      //       }
      //       ]
      //   }
      //   vegaEmbed('#vis', original);
      // }

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
      // console.log(data)
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

          await getHruData(data[i])
          await getInputFileData(data[i])
          await getLanduseData(data[i])
          await getSwatPlantList(data[i]);


          await getTsvFileOptions(data[i], "grassedww.str", "grww")
          await getTsvFileOptions(data[i], "urban.urb", "urbanLUList", "_comm")
          await getTsvFileOptions(data[i], "ovn_table.lum", "manN")
          await getTsvFileOptions(data[i], "cons_practice.lum", "cons")
          await getTsvFileOptions(data[i], "cntable.lum", "cn2Options")
          await getTsvFileOptions(data[i], "tiledrain.str", "tile")
          await getTsvFileOptions(data[i], "septic.str", "sep")
          await getTsvFileOptions(data[i], "filterstrip.str", "vfs")
          await getTsvFileOptions(data[i], "grassedww.str", "grww")
          //  updateTooltips(data[i])

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
              // document.querySelector('#vis').innerHTML = `<div class="progressBarBorder"> 
              //  <div id="progressBar" class="swatProgressBar">0% </div>
              //  </div>`
              document.querySelector('#vis').innerHTML = `<div class="swatrunning"> 
                <div class="swatloadingspinner"></div>
               </div>`
              // swatProgressBar()
              await fetch(`http://${HOST}:8000/runswat?scenario=${data[i]}`).then(async (res) => {
                await res.json().then(async (d) => {
                  if (d.code === 1) {
                    console.log(d.message);
                    //  console.log('swat ran', data[i])
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
        // window.currentScenario = data[i];

      }

    })
};

// function swatProgressBar() {
//   var elem = document.getElementById("progressBar");
//   var width = 20;
//   var id = setInterval(frame, 10);
//   function frame() {
//     if (width >= 100) {
//       clearInterval(id);
//     } else {
//       width++;
//       elem.style.width = width + '%';
//       elem.innerHTML = width * 1 + '%';
//     }
//   }
// }

export default {
  hydrograph,
  //newHydrograph,
  // graphTab,
  scenarioOptions,
  getHydrographOptions,
  getHydrographOutputOptions
}







// export function hydrograph() {
//   // Assign the specification to a local variable vlSpec.
//   var origional = {
//     $schema: 'https://vega.github.io/schema/vega-lite/v5.json',


//     "data": {
//       "url": "/data/TxtInOut/channel_sd_day.csv"
//     },

//     "vconcat": [{

//       "width": "1350",
//       "mark": "line",
//       "encoding": {
//         "x": {
//           "timeUnit": "yearmonthdate",
//           "field": "date",
//           "title": "date",
//           "type": "temporal",
//           "scale": { "domain": { "param": "brush" } },
//           "axis": { "title": "" }
//         },
//         "y": {
//           "field": "flo_out",
//           "type": "quantitative",
//           "title": "flow (m³/s)",
//         }
//       }
//     }, {
//       "width": "1350",
//       "height": 60,
//       "mark": "line",
//       "params": [{
//         "name": "brush",
//         "select": { "type": "interval", "encodings": ["x"] }
//       }],
//       "encoding": {
//         "x": {
//           "timeUnit": "yearmonthdate",
//           "field": "date",
//           "title": "date",
//           "type": "temporal"
//         },
//         "y": {
//           "field": "flo_out",
//           "type": "quantitative",
//           "axis": { "tickCount": 3, "grid": false },
//           "title": "flow (m³/s)",
//         }
//       }
//     }]
//   }

//   vegaEmbed('#vis', origional);
// };

// export function newHydrograph() {
//   // Assign the specification to a local variable vlSpec.
//   var origional = {
//     $schema: 'https://vega.github.io/schema/vega-lite/v5.json',


//     "data": {
//       "url": "/data/TxtInOut/output/channel_sd_day.csv"
//     },

//     "vconcat": [{

//       "width": "1350",
//       "mark": {
//         "type": "line",
//         "color": "red"
//       },
//       "encoding": {
//         "x": {
//           "timeUnit": "yearmonthdate",
//           "field": "date",
//           "title": "date",
//           "type": "temporal",
//           "scale": { "domain": { "param": "brush" } },
//           "axis": { "title": "" }
//         },
//         "y": {
//           "field": "flo_out",
//           "type": "quantitative",
//           "title": "flow (m³/s)",
//         }
//       }
//     }, {
//       "width": "1350",
//       "height": 60,
//       "mark": {
//         "type": "line",
//         "color": "red"
//       },
//       "params": [{
//         "name": "brush",
//         "select": { "type": "interval", "encodings": ["x"] }
//       }],
//       "encoding": {
//         "x": {
//           "timeUnit": "yearmonthdate",
//           "field": "date",
//           "title": "date",
//           "type": "temporal"
//         },
//         "y": {
//           "field": "flo_out",
//           "type": "quantitative",
//           "axis": { "tickCount": 3, "grid": false },
//           "title": "flow (m³/s)",
//         }
//       }
//     }]
//   }

//   vegaEmbed('#vis2', origional);
// };

// export function graphTab() {
//   //opens and closes the hydrograph tabs
//   document.getElementById("scenario1Tab").onmousedown = openScenario1;
//   document.getElementById("defaultTab").onmousedown = openDefault;
//   function openDefault() {
//     document.getElementById("vis").style.display = "block";
//     document.getElementById("vis2").style.display = "none";
//   }
//   function openScenario1() {
//     document.getElementById("vis2").style.display = "block";
//     document.getElementById("vis").style.display = "none";
//   }
// };