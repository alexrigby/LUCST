const http = require("http");
const { readdirSync } = require("fs");
const { copySync } = require("fs-extra");
const path = require("path");
const express = require("express");
const cors = require("cors");
const { config } = require("./config");
const fs = require("fs");
const { runSwat, getScenarios, getHRU, saveHRU, savePlotData, savePlant, saveLum, createScenario} = require("./api");


const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));


// - METHOD: RunSWAT
app.get("/runswat", runSwat);

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


// PRIVATE METHOD: createScenario
app.get("/createscenario", (req, res) => {
  // Get scenario param
  let scenario = req.query.scenario;
  if (scenario !== null && scenario !== "Default") {
    createScenario(res, scenario);
  } else {
    res.send({
      code: 0,
      message:
        scenario === "Default"
          ? "Scenario cannot be named Default"
          : "Invalid scenario name",
    });
  }
});






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




