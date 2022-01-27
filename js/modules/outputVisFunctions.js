import fetchData from "/js/modules/fetchData.js";
import { choropleth } from "/js/modules/choroplethFunctions.js";
import { HOST } from "../main.js"
import { getSwatPlantList } from "./getSwatPlantList.js"
import { getTsvFileOptions } from "./getTsvFileOptions.js"
import { getInputFileData, getLanduseData, getHruData } from "./getInputFileData.js";
import { updateCurrentScenario } from "./updateCurentScenario.js"
import { TsvOrCsvConverter } from "./TsvOrCsvConverter.js"
import { cleanTsvSwatFiles } from "./cleanTsvSwatFiles.js";
import { cleanCsvOutput, cleanDefaultCsvOutput } from "./cleanCsvOutputFiles.js";
import { getNames } from "./getNamesAndDescriptions.js"


//Combines the day, month and year to make a new feild; "date"
function getDate(data) {
  const date = data.map(record => record.yr + '-' + record.mon + '-' + record.day);
  //  console.log('new date collumn', date);
  return date
}

//Gets the data for the selected channels 
function getChannelData(data, name) {
  const filteredData = data.filter(record => record.name === name);
  //console.log("selected channel Data", filteredData);
  return filteredData
}


function downloadHydrographCsv(data, fileName) {
  document.getElementById('downloadPlot').setAttribute('href', 'data:text/csv;charset=utf-8,' + escape(data));
  document.getElementById('downloadPlot').setAttribute('download', fileName);
}

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

export async function getHydrographOutputOptions() {
  await fetchData(`/catchment/Scenarios/Default/TxtInOut/channel_sd_day.csv`)
    .then(data => {
     cleanCsvOutput(data);
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
      const channelNumbers = getNames(cleanOutput)
      const uniqueNumbers = new Set([...channelNumbers])
      const uniqueNumbersArray = Array.from(uniqueNumbers)
      const channelOptions = uniqueNumbersArray.map((el, i) => {
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
        const plotDownload = TsvOrCsvConverter(plotData, ',')

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



export default {
  hydrograph,
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