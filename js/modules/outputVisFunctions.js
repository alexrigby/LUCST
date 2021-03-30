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

    "width": "container",
    "data": {
      "url": "/data/TxtInOut/channel_sd_day.csv"
    },
    "transorm": [
      {
        "lookup": "date",
        "from": {
          "data": {
            "url": "data/TxtInOut/output/channel_sd_day.csv"
          },
          "key": "date",
          "fields": ["flo_out"],
        },
        "as": "scenario1",
      }
    ],

  
  "layer": [
    {

      "mark": { "type":"line", "color":"red"},
      "encoding": {
        "x": {
          "field": "date",
          "type": "temporal"
        },
        "y": {
          "field": "flo_out",
          "type": "quantitative",
          "title": "flow out "
        },
      }
    },
    {
      "mark": {"type":"line", "color":"green"}, 
      "encoding": {
        "x": {
          "field": "date",
          "type": "temporal"
        },
        "y": {
          "field": "scenario1",
          "type": "quantitative"
        }
      }
    }
  ]
 

};


vegaEmbed('#vis', origional);
};
























    // "repeat": {
    //   "layer": ["flo_out", "scenario1"]
    // },
//     "spec": {
//       "mark": "line",
//       "encoding": {
//         "x": {

//           "field": "date",
//           "type": "temporal"
//         },
//         "y": {
//           // "field": { "repeat": "layer" },
//           "field":"scenario1",
//           "type": "quantitative"
//         },
//       },

//     }
//   };

//   vegaEmbed('#vis', origional);
// };






















//  var origional = {
//   $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
//   "datasets": {
//     "origional": 
//        {"url":"/data/TxtInOut/channel_sd_day.csv",
//       "format": {"parse":{"date":"date"}}
//       },
//    
//     "editted": 
//       {"url":"/data/TxtInOut/output/channel_sd_day1.csv",
//       "format": {"parse":{"date":"date"}}
//       },
//    
//   },

//   "data":{"name":"origional"},
//   "transorm":[
//     {
//       "lookup":"flo_out",
//       "from":{"data": {"name":"editted"},"key":"date","fields":["flo_out1"]}
//     }
//   ],


//   "encoding": {
//     "x": {
//       "field": "date",
//       "type": "temporal"
//     }
//   },
//   "layer": [
//     {
//       "mark": { "type":"line", "color":"red"},
//       "encoding": {
//         "y": {
//           "field": "flo_out",
//           "type": "quantitative"
//         }
//       }
//     },
//     {
//       "mark": "line",
//       "encoding": {
//         "y": {
//           "field": "flo_out1",
//           "type": "quantitative"
//         }
//       }
//     }
//   ],
//   "resolve": { "scale": { "y": "dependent" } }

// };


// vegaEmbed('#vis', origional);
// };














//  var origional = {
//   $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
//   "datasets": {
//     "origional": [
//        {"url":"/data/TxtInOut/channel_sd_day.csv",
//       "format": {"parse":{"date":"date"}}
//       },
//     ],
//     "editted": [
//       {"url":"/data/TxtInOut/output/channel_sd_day1.csv",
//       "format": {"parse":{"date":"date"}}
//       },
//     ]
//   },

//   "data":{"name":"origional"},
//   "transorm":[
//     {
//       "lookup":"flo_out",
//       "from":{"data": {"name":"editted"},"key":"date","fields":["flo_out1"]}
//     }
//   ],

// "hconcat":[{
// "width":"container",
// "params": [{
//   "name": "brush",
//   "select": {"type": "interval", "encodings": ["x"]}
// }],
// "encoding": {
//   "x": {
//     "field": "date",
//    "type":"temporal"
//   }
// },

// "layer":[
//   {
// "mark": "line",
// "encoding": {
//   "y": {"field": "flo_out",
//    "type": "quantitative"}
// }
//   },
// {
//   "mark":"line",
//   "encoding":{
// "y":{"field":"flo_out1",
//  "type": "quantitative"}
//   }
// }
// ],
// "resolve": {"scale": {"y": "dependent"}}


//   },
//   {
//      "width":"container",
//      "mark": {"type": "line",
//      "interpolate":"monotone"},
//     "encoding": {
//       "x": {"type":"temporal", "field": "date", "format":"%d, %Y", 
//       "bin": {"maxbins": 400, "extent": {"param": "brush"}}},
//       "y": {"type": "quantitative", "field": "flo_out"}
//     }
//   }
// ],
// "config":{
//   "line": {"color":"blue"},
//   "axis":{"aria":"false"}
// }
// };

// var edittedOutput = {
//   $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
//   "background": "transparent",
//   "data": {"url":"/data/TxtInOut/output//channel_sd_day.csv",
// "format": {"parse":{"date":"date"}}
// },
// "hconcat":[{
// "width":"container",
// "params": [{
//   "name": "brush",
//   "select": {"type": "interval", "encodings": ["x"]}
// }],
//   "mark": {"type": "line",
//   "interpolate":"monotone"},
//   "encoding": {
//     "x": {"type":"temporal", "field": "date"},
//     "y": {"type": "quantitative", "field": "flo_out"},
//     }
//   },
//   {
//      "width":"container",
//      "mark": {"type": "line",
//      "interpolate":"monotone"},
//     "encoding": {
//       "x": {"type":"temporal", "field": "date", "format":"%d, %Y", 
//       "bin": {"maxbins": 400, "extent": {"param": "brush"}}},
//       "y": {"type": "quantitative", "field": "flo_out"},

//     }
//   }
// ],
// "config":{
//   "line": {"color":"red"},
//   "veiw":{
//     "stroke": "transparent"
//     }

// }
// };
// Embed the visualization in the container with id `vis`
//vegaEmbed('#vis', origional);

// vegaEmbed('#vis', edittedOutput);
//}

export default hydrograph

// export function hydrograph() {

//   //------------------------1. PREPARATION-------------------------//
//   //-----------------------------SVG-------------------------------//
//   const width = 960;
//   const height = 500;
//   const margin = 5;
//   const padding = 5;
//   const adj = 30;

//   // we are appending SVG first
//   const svg = d3.select("div#container").append("svg")
//     .attr("preserveAspectRatio", "xMinYMin meet")
//     .attr("viewBox", "-"
//       + adj + " -"
//       + adj + " "
//       + (width + adj * 3) + " "
//       + (height + adj * 3))
//     .style("padding", padding)
//     .style("margin", margin)
//     .classed("svg-content", true);

//   //-----------------------------DATA------------------------------//
//   const timeConv = d3.timeParse("%d-%b-%Y");

//  const dataset = fetchData('/data/TxtInOut/channel_sd_day.txt')
//     dataset.then(data => {
//       const cleanOutput1 = cleanTxt(data);
// console.log(cleanOutput1)

//       const slices = cleanOutput1.columns.slice(1).map(function(id) {
//           return {
//               id: id,
//               values: data.map(function(d){
//                   return {
//                       date: timeConv(d.date),
//                       measurement: +d[id]
//                   };
//               })
//           };
//       });

//   console.log("Column headers", data.columns);
//   console.log("Column headers without date", data.columns.slice(1));
//   // returns the sliced dataset
//   console.log("Slices",slices);  
//   // returns the first slice
//   console.log("First slice",slices[0]);
//   // returns the array in the first slice
//   console.log("A array",slices[0].values);   
//   // returns the date of the first row in the first slice
//   console.log("Date element",slices[0].values[0].date);  
//   // returns the array's length
//   console.log("Array length",(slices[0].values).length);

//   //----------------------------SCALES-----------------------------//

//   //-----------------------------AXES------------------------------//

//   //----------------------------LINES------------------------------//

//   //-------------------------2. DRAWING----------------------------//

//   //-----------------------------AXES------------------------------//

//   //----------------------------LINES------------------------------// 

// })
// }









