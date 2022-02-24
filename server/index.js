const http = require("http");
const { readdirSync } = require("fs");
const { copySync } = require("fs-extra");
const path = require("path");
const express = require("express");
const cors = require("cors");
const { config } = require("./config");
const fs = require("fs");
const { runSwat, getScenarios, getHRU, saveHRU, savePlotData, savePlant, saveLum, createScenario, getHRUData} = require("./api");




const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.get("/test", ( req, res) => {
 console.log("test"),
 res.send("test")
})
// - METHOD: RunSWAT
app.get("/runswat", runSwat);


app.get("/getHRUData", (req, res) => {
  console.log('getHRUData')
  res.send('getherdata')
  // console.log('getHRUData')
  // getHRUData(req, res)
  // let scenario = req.body.scenario;
// res.send({'test2': "test2"})
// console.log('getHRUData', scenario)
//   if (getScenarios().includes(scenario)) {
//       try {
//           fs.readFileSync(
//               path.resolve(
//                   __dirname,
//                   `${config().swat_scenarios}${scenario}/TxtInOut/hru-data.hru`
//               ),
//           );
//           res.send({ code: 1, message: 'successfully uploaded hru_data.hru'});
//       } catch {
//           res.send({ code: 0, message: 'failed to read hru_data.hru'});
//       }
//   } 
})

// - METHOD: getScenarios
app.get("/getscenarios", (_, res) => {
  res.send(getScenarios());
});

// - METHOD: getHRU
app.post("/gethru", getHRU)


// - METHOD: saveHRU
app.post("/savehru", saveHRU);

// - METHOD: sendPlant
app.post("/sendplant", savePlant)


// - METHOD: sendLum
app.post("/sendlum", saveLum)


//METHOD: sendplotData //NOT USED ATM
app.post("/sendplotdata", savePlotData);
 
// - METHOD: createScenario
app.get("/createscenario", createScenario)



//stops server from cacheing
app.use(function (req, res, next) {
  // req.set('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.set("Cache-Control", "no-cache, no-store, must-revalidate");
  res.set("Cache-Control", "must-revalidate");
});



const server = http.createServer(app);
// server.writeHead({"Cache-Control": "max-age=0, no-cache, no-store, must-revalidate"})

server.listen(config().server_port);
console.log(`SWAT Server Listening on Port ${config().server_port}`);









//NOT USED AT THE MOMENT
// - METHOD: deleteScenario
// TODO: Make this soft-delete instead (flags in a file to track soft-deleted scenarios)
// app.get("/deletescenario",(req, res)=>{
//   let scenario = req.query.scenario;
//   if(scenario !== null) {
//     deleteScenario(res, scenario);
// } else {
//     res.send({ "code": 0 });
// }
// });




