import fetchData from "/js/modules/universalFunctions.js";
import cleanHru from "/js/modules/hru_dataFunctions.js";


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


export function hydrograph() {
  // Assign the specification to a local variable vlSpec.
  var origional = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',


    "data": {
      "url": "/data/TxtInOut/channel_sd_day.csv"
    },

    "vconcat": [{

      "width": "1350",
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
          "field": "flo_out",
          "type": "quantitative",
          "title": "flow (m³/s)",
        }
      }
    }, {
      "width": "1350",
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
          "field": "flo_out",
          "type": "quantitative",
          "axis": { "tickCount": 3, "grid": false },
          "title": "flow (m³/s)",
        }
      }
    }]
  }

  vegaEmbed('#vis', origional);
};

export function newHydrograph() {
  // Assign the specification to a local variable vlSpec.
  var origional = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',


    "data": {
      "url": "/data/TxtInOut/output/channel_sd_day.csv"
    },

    "vconcat": [{

      "width": "1350",
      "mark": {
        "type": "line",
        "color": "red"
      },
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
          "field": "flo_out",
          "type": "quantitative",
          "title": "flow (m³/s)",
        }
      }
    }, {
      "width": "1350",
      "height": 60,
      "mark": {
        "type": "line",
        "color": "red"
      },
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
          "field": "flo_out",
          "type": "quantitative",
          "axis": { "tickCount": 3, "grid": false },
          "title": "flow (m³/s)",
        }
      }
    }]
  }

  vegaEmbed('#vis2', origional);
};

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



export function scenarioOptions(){
    fetch('http://localhost:8000/getscenarios')
   .then(response => response.json()) 
   .then(data => {
    const scenarioCount = data.length;
  let button = "";
  //loops over the scenario names asigning new button for each name
  //calls variable i assignes index 0 to it, button count has to be grater than i, increment i by 1 each time
  for (let i = 0; i < scenarioCount; i++) {
    button += `
    <button class="tablinks">${data[i]}</button>`
  }
    document.getElementById("scenarioTab").innerHTML = button
})
};

export default {
  hydrograph,
  newHydrograph,
  // graphTab,
  scenarioOptions
}
