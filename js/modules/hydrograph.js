//CLEANS CURRENTSCENARIO CVS CHANNEL_SD_DAY DATA AND PLOTS IT ON THE TIME SERIES ALONG WITH DEFAULT DATA

import { TsvOrCsvConverter } from "./TsvOrCsvConverter.js";
import { cleanCsvOutput } from "./cleanCsvOutput.js";
import { getDate } from "./getDefaultChannelData.js";
import { getChannelData } from "./getChannelData.js";



//NEED TO SEPERATE GETCHANNELDATA
export async function hydrograph(scenario) {
  await getChannelData(scenario)
 
    .then(async (data) => {
      // clean and parse the csv file
      const cleanChannelOutput = cleanCsvOutput(data);
      const channelData = cleanChannelOutput.csvData;

      //adds day, mon and year together to make "date", date column added to the JSON
      const date = getDate(channelData);
      for (var i = 0; i < channelData.length; i++) {
        channelData[i]["date"] = date[i];
      }

      //gets the selected channel number and output name
      const chanOpts = document.getElementById("channel");
      const outputOps = document.getElementById("output");
      const hydrographSelect = [chanOpts, outputOps];

      async function plotHydrograph() {
        ///////making default plot data
        const defaultOutput = "default_" + outputOps.value;
        //gets  default all default data for selected channel
        const defaultChannel = await getChannelValues(
          window.defaultPlotData,
          chanOpts.value
        );
        //makes object from the selected channel output name (defaultOutput) and the date
        const defaultPlotData = defaultChannel.map((el) => ({
          date: el.date,
          [defaultOutput]: el[outputOps.value],
        }));
        const currentChannel = await getChannelValues(channelData, chanOpts.value);
        ////////makes current scenario plot data
        // function returns the values of selected output
        const plotData = currentChannel.map((el) => ({
          date: el.date,
          [outputOps.value]: el[outputOps.value],
        }));

        // calcumates the maximun value of that plot and sets the axis to that value + 10% (may be usless)
        const defaultplotvalues = defaultPlotData.map(
          (record) => record[defaultOutput]
        );
        let maxDefault = Math.max(...defaultplotvalues);
        const currentplotvalues = plotData.map(
          (record) => record[outputOps.value]
        );
        let maxCurrent = Math.max(...currentplotvalues);
        let maxTotalValue = Math.max(...[maxCurrent, maxDefault]);
        let percentageOfTotal = (10 / 100) * maxTotalValue;
        let axisMax = maxTotalValue + percentageOfTotal;

        // maps default and current scenario plots together to gmake one dataset to plot; 'combinedPlotData
        const combinedPlotData = defaultPlotData.map((item, i) =>
          Object.assign({}, item, plotData[i])
        );

        //download the data plotted as a csv
        const plotDownload = TsvOrCsvConverter(plotData, ",");
        const plotDownloadButton = document.getElementById("downloadPlot");
        plotDownloadButton.addEventListener("click", () => {
          downloadHydrographCsv(
            plotDownload,
            outputOps.value +
            " for " +
            chanOpts.value +
            " in " +
            window.currentScenario +
            ".csv"
          );
        });

        //vega-lite used to plot the time series
        var original = {
          $schema: "https://vega.github.io/schema/vega-lite/v5.json",
          title: outputOps.value + " for " + chanOpts.value,
          data: { values: combinedPlotData },
          repeat: {
            layer: [outputOps.value, defaultOutput],
          },
          spec: {
            width: "container",
            height: "300",
            mark: "line",
            encoding: {
              x: {
                timeUnit: "yearmonthdate",
                field: "date",
                title: "date",
                type: "temporal",
                axis: { title: "" },
              },
              y: {
                field: { repeat: "layer" },
                type: "quantitative",
                axis: { title: "" },
                scale: { domain: [0, axisMax] },
              },
              color: {
                datum: { repeat: "layer" },
                type: "nominal",
                legend: {
                  orient: "top-right",
                },
              },
              strokeDash: {
                datum: { repeat: "layer" },
                type: "nominal",
              },
            },
          },
        };
        vegaEmbed("#vis", original);
      }

      //call plotHydrograph out side of an event listner so it plots when the page loads
      await plotHydrograph();
      hydrographSelect.forEach((el) => {
        el.addEventListener("change", async () => {
          //call plotHydrograph so it is called when change is made in the select list
          await plotHydrograph();
        });
      });
    });
}

//Gets the data for the selected channels
function getChannelValues(data, name) {
  const filteredData = data.filter((record) => record.name === name);
  return filteredData;
}

//makes button to download csv file to downloads folder
function downloadHydrographCsv(data, fileName) {
  document
    .getElementById("downloadPlot")
    .setAttribute("href", "data:text/csv;charset=utf-8," + escape(data));
  document.getElementById("downloadPlot").setAttribute("download", fileName);
}

export default {
  hydrograph,
};

///TRYING TO GET BRUSH PARAMATER TO WRK WITH 2 DATASETS

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
