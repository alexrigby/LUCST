import fetchData from "/js/modules/universalFunctions.js";
import {getHruData} from "/js/modules/hru_dataFunctions.js";
import { updateCurrentScenario } from "/js/main.js";
import { choropleth } from "/js/modules/choroplethFunctions.js";
import { getSwatPlantList, getPlantData } from "/js/modules/plantFunctions.js";
import { getConsPractice, getCurveNumer, getManN, getLanduseData, getUrbanList} from "/js/modules/landuseFunctions.js";
import {updateTooltips} from "/js/modules/mapFunctions.js"


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
  //Gets the names of the output values (column headers) and add them to a select 
  //maybe better to delete unwanted headers by name? 
  const outputNames = clean.columns.splice(7)
  //console.log('Output Names', outputNames)
  const outputNameOptions = outputNames.map((el, i) => {
    return `<option value=${el}>${el}</option>`;
  });
  const outputOps = document.getElementById("output")
  outputOps.innerHTML = `${outputNameOptions}` + `<option value="flo_out" selected >flo_out</option>`
  // window.OUTPUTOPS = [...outputNameOptions]
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
function getMainChan(data) {
  const filteredData = data.filter(record => record.out_tot == 0);
  return filteredData[0].name
}


async function downloadHydrographCsv(data, fileName) {
  // var myFile = new Blob([data], { type: 'data:text/csv;charset=utf-8,' });
  // document.getElementById('downloadPlot').setAttribute('href', 'data:text/csv;charset=utf-8,'+escape(data));
  // document.getElementById('downloadPlot').setAttribute('download', fileName);
  await fetch('http://localhost:8000/sendplotdata', { method: "POST", headers: {
    'Content-Type': 'application/json' },
    body: JSON.stringify({plot: data, scenario: window.currentScenario, name: fileName})
  }).then(res => res.text()).then(data => console.log(data));
}



export function hydrograph(scenario) {


  fetchData(`/catchment/Scenarios/${scenario}/TxtInOut/channel_sd_day.csv`)
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
      chanOpts.innerHTML = `${channelOptions}` + `<option class= "channelNames" value= ${window.MAINCHAN} selected> ${window.MAINCHAN}</option>`
      // window.CHANOPS = [...channelOptions];

      // when user Selects channel or output filters the data and plots 
      const channelSelect = document.getElementById("channel")
      const outputSelect = document.getElementById("output")
      const hydrographSelect = [channelSelect, outputSelect]

     

       function  plotHydrograph() {
          const channel = getChannelData(cleanOutput, chanOpts.value);
          // console.log('channel',channel)
          const outputOps = document.getElementById("output").value;
          // console.log(outputOps)

          // function returns the values of selected output
          const plotData = channel.map(el => (
            {
              date: el.date,
              [outputOps]: el[outputOps],
            }
          ));
          //download the data plotted as a csv
          // const plotDownload = convertToCSV(plotData)
          // console.log(plotDownload)

          const plotDownloadButton = document.getElementById("downloadPlot")
          plotDownloadButton.addEventListener('click', () => {
         downloadHydrographCsv(plotData, outputOps +" for "+ chanOpts.value + " in " + window.currentScenario)
           alert("Raw CSV " + '"'+outputOps +" for "+ chanOpts.value + '"' + " saved to " + '"'+window.currentScenario+'"'  )
        })

          // const selectedOutput = channel.map(function (value, index) { return value[outputOps.value]; });

          // console.log(outputOps, " for ", chanOpts.value, " plotted")

          var original = {
            $schema: 'https://vega.github.io/schema/vega-lite/v5.json',

            "title": outputOps + " for " + chanOpts.value,
            "data": { "values": plotData },

            "vconcat": [{

              "width": "container",
              "mark": "line",
              "encoding": {
                "x": {
                  "timeUnit": "yearmonthdate",
                  "field": "date",
                  "title": "date",
                  "type": "temporal",
                  "scale": { "domain": { "param": "brush" } },
                  "axis": { "title": "" }
                },
                "y": {
                  "field": [outputOps],
                  "type": "quantitative",
                  // "title": "flow (m³/s)",
                }
              }
            }, {
              "width": "container",
              "height": 60,
              "mark": "line",
              "params": [{
                "name": "brush",
                "select": { "type": "interval", "encodings": ["x"] }
              }],
              "encoding": {
                "x": {
                  "timeUnit": "yearmonthdate",
                  "field": "date",
                  "title": "date",
                  "type": "temporal"
                },
                "y": {
                  "field": [outputOps],
                  "type": "quantitative",
                  "axis": { "tickCount": 3, "grid": false },
                }
              }
            }]
          }
          vegaEmbed('#vis', original);

        }

        //call plotHydrograph out side of an event listner so it plots when the page loads
        plotHydrograph()
        hydrographSelect.forEach(el => {
          el.addEventListener('change', () => {
            //call plotHydrograph so it is called when change is made in the select list
            plotHydrograph()
          })
      })
     



    });


  fetchData(`/catchment/Scenarios/${scenario}/TxtInOut/chandeg.con`)
    .then(data => {
      //clean txt file
      const clean = cleanTxtOutput(data);
      //finds name of the main channnel
      const mainChan = getMainChan(clean)
      //console.log('main channel name', mainChan)
      window.MAINCHAN = mainChan
      //channel select
      // const channel = document.getElementById('channel')
      // //output select
      // const output = document.getElementById('output')
      // //selects the main chanel to plot
      // const mainChanButton = document.getElementById('mainChan')
      // mainChanButton.addEventListener('click', () => {
      //   channel.innerHTML = `<option value=${mainChan}>${mainChan}</option>`;
      // });
      // //selcets flo_out to plot
      // const floOutButton = document.getElementById('floOut')
      // floOutButton.addEventListener('click', () => {
      //   output.innerHTML = `<option value=flo_out>flo_out</option>`;
      // })

      //resets both selections 
      // const resetPlot = document.getElementById("resetPlot")
      // resetPlot.addEventListener('click', () => {
      //   channel.innerHTML = `${window.CHANOPS}`
      //   output.innerHTML = `${window.OUTPUTOPS}`
      // })
    });

}



export async function scenarioOptions() {
  await fetch('http://localhost:8000/getscenarios')
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
        button.addEventListener('click', () => {


          updateCurrentScenario(data[i]);
          getPlantData(data[i]);
          // console.log(window.catchmentPlant)
          getSwatPlantList(data[i]);
          getUrbanList(data[i]);
          getConsPractice(data[i]);
          getCurveNumer(data[i]);
          getManN(data[i]);
          getHruData(data[i]);
          getLanduseData(data[i]);
         
        //  updateTooltips()
         
          // Update vis panel
          if (data.includes(data[i])) {
            hydrograph(data[i])
            choropleth(data[i])
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

            runswatbuttonvis.addEventListener('click', () => {
              document.querySelector('#vis').innerHTML = "";
              document.querySelector('#choro').innerHTML = "";
              // document.querySelector('#vis').innerHTML = `<div class="progressBarBorder"> 
              //  <div id="progressBar" class="swatProgressBar">0% </div>
              //  </div>`
               document.querySelector('#vis').innerHTML = `<div class="swatrunning"> 
                <div class="swatloadingspinner"></div>
               </div>`
              // swatProgressBar()
              fetch(`http://localhost:8000/runswat?scenario=${data[i]}`).then((res) => {
                res.json().then((d) => {
                  if (d.code === 1) {
                    console.log(d.message);
                    //  console.log('swat ran', data[i])
                    hydrograph(data[i])
                    choropleth(data[i])
                  }
                })
              })
            });
            runswatbuttonvis.innerText = `Run SWAT model for ${data[i]}`;
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
  scenarioOptions
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