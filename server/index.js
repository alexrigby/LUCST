const http = require("http");
const { readdirSync } = require("fs");
const { copySync } = require("fs-extra");
const path = require("path");
const express = require("express");
const cors = require("cors");
const { config } = require("./config");
const fs = require("fs");
const { runSwat, getScenarios, getHRU, saveHRU, savePlotData } = require("./api");


const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Add API methods here
// - METHOD: RunSWAT
app.get("/runswat", runSwat);

// - METHOD: getScenarios
app.get("/getscenarios", (_, res) => {
  res.send(getScenarios());
});

// - METHOD: getHRU
app.post("/gethru", (req, res) => {
    getHRU(req, res);
  });

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


// - METHOD: saveHRU
app.post("/savehru", saveHRU);

// - METHOD: sendPlant
app.post("/sendplant", (req, res) => {
  savePlant(req, res);
});

// - METHOD: sendLum
app.post("/sendlum", (req, res) => {
  saveLum(req, res);
});


//METHOD: sendplotData //NOT USED ATM
app.post("/sendplotdata", savePlotData);

app.use(function (req, res, next) {
  // req.set('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.set("Cache-Control", "no-cache, no-store, must-revalidate");
  res.set("Cache-Control", "must-revalidate");
});

const server = http.createServer(app);
// server.writeHead({"Cache-Control": "max-age=0, no-cache, no-store, must-revalidate"})

server.listen(config().server_port);
console.log(`SWAT Server Listening on Port ${config().server_port}`);

// PRIVATE API METHODS
// getScenarios
// function getScenarios() {
//   // console.log(readdir(path.resolve(__dirname, config().swat_scenarios)))
//   // console.log( readdirSync(path.resolve(__dirname, config().swat_scenarios), { withFileTypes: true }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name))
//   return readdirSync(path.resolve(__dirname, config().swat_scenarios), {
//     withFileTypes: true,
//   })
//     .filter((dirent) => dirent.isDirectory())
//     .map((dirent) => dirent.name);
// }
// stats.birthtime

// API METHOD: getScenarios
// Get Scenarios
// function getScenarios(res) {
//   res.send(getScenarios());
// }

// function getHRU(req, res) {
//   let scenario = req.body.scenario;

//   if (getScenarios().includes(scenario)) {
//     try {
//       const hru = fs.readFileSync(
//         path.resolve(
//           __dirname,
//           `${config().swat_scenarios}${scenario}/TxtInOut/hru-data.hru`
//         )
//       );
//       res.send({ code: 1, message: "HRU sent", hru });
//     } catch {
//       res.send({ code: 0, message: "HRU failed to send" });
//     }
//   } else {
//     res.send({ code: 0, message: "Invalid scenario" });
//   }
// }

// API METHOD: saveHRU
// // Save HRU to disk
// function saveHRU(req, res) {
//   let scenario = req.body.scenario;
//   let tsv = convertToTSV(req.body.hru);

//   if (getScenarios().includes(scenario) && scenario !== "Default") {
//     try {
//       fs.writeFileSync(
//         path.resolve(
//           __dirname,
//           `${config().swat_scenarios}${scenario}/TxtInOut/hru-data.hru`
//         ),
//         tsv
//       );
//       res.send({ code: 1, message: `Successfully saved hru to disk` });
//     } catch {
//       res.send({ code: 0, message: "HRU failed to save" });
//     }
//   } else {
//     res.send({ code: 0, message: "Requested invalid scenario" });
//   }
// }

// // API METHOD: savePlotData
// function savePlotData(req, res) {
//   let scenario = req.body.scenario;
//   let csv = convertToCSV(req.body.plot);
//   let name = req.body.name;

//   if (getScenarios().includes(scenario)) {
//     try {
//       fs.writeFileSync(
//         path.resolve(
//           __dirname,
//           `${config().swat_scenarios}${scenario}/${name}.csv`
//         ),
//         csv
//       );
//       res.send({ code: 1, massage: `Raw plot data saved to scenario` });
//     } catch {
//       res.send({ code: 0, message: "Failed to save" });
//     }
//   } else {
//     res.send({ code: 0, messgae: "Error" });
//   }
// }

// API METHOD: SavePlant
// Save plant file to disk
function savePlant(req, res) {
  let scenario = req.body.scenario;
  let tsv = convertToTSV(req.body.plant);

  if (getScenarios().includes(scenario) && scenario !== "Default") {
    try {
      fs.writeFileSync(
        path.resolve(
          __dirname,
          `${config().swat_scenarios}${scenario}/TxtInOut/plant.ini`
        ),
        tsv
      );
      res.send({ code: 1, message: `Successfully saved plant file to disk` });
    } catch {
      res.send({ code: 0, message: "Plant file failed to save" });
    }
  } else {
    res.send({ code: 0, message: "Requested invalid scenario" });
  }
}

// API METHOD: SaveLum
// Save landuse file to disk
function saveLum(req, res) {
  let scenario = req.body.scenario;
  let tsv = convertToTSV(req.body.lum);

  console.log(tsv);
  console.log(scenario);

  if (getScenarios().includes(scenario) && scenario !== "Default") {
    try {
      fs.writeFileSync(
        path.resolve(
          __dirname,
          `${config().swat_scenarios}${scenario}/TxtInOut/landuse.lum`
        ),
        tsv
      );
      res.send({ code: 1, message: `Successfully saved landuse file to disk` });
    } catch {
      res.send({ code: 0, message: "Landuse file failed to save" });
    }
  } else {
    res.send({ code: 0, message: "Requested invalid scenario" });
  }
}

// API METHOD: createScenario
// Create Scenario
function createScenario(res, scenario) {
  // TODO: DO SOME CHECKS ON THE SCENARIO STRING!!!
  try {
    copySync(
      path.resolve(
        __dirname,
        config().swat_scenarios + config().swat_default_scenario
      ),
      path.resolve(__dirname, config().swat_scenarios + scenario),
      { overwrite: false, errorOnExist: true }
    );
    res.send({ code: 1, scenario: scenario });
  } catch (err) {
    console.log(err);
    // Directory already exists, or copying failed.
    res.send({ code: 0 });
  }
}

// API METHOD: deleteScenario
// delete scenario
function deleteScenario(res, scenario) {
  const dir = path.resolve(__dirname, config().swat_scenarios + scenario);
  fs.rmdir(dir, { recursive: true }, (err) => {
    if (err) {
      throw err;
    }
    console.log(`${dir} is deleted!`);
    res.send(`${scenario} is deleted!`);
  });
}

// HELPERS

const convertToTSV = (data) => {
  // Convert dataset to TSV and print
  const headers = Object.keys(data[0]);
  const tsv = [
    headers.join("\t"),
    ...data.map((row) => headers.map((fieldName) => row[fieldName]).join("\t")),
  ].join("\r\n");

  return tsv;
};


