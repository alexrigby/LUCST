const http = require('http');
const { readdirSync } = require('fs');
const { copySync } = require('fs-extra');
const path = require('path');
const express = require('express');
const cors = require('cors');
const config = require('./config.json');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(express.json({limit: '50mb'}));

// Add API methods here
// - METHOD: RunSWAT
app.get("/runswat", (req, res) => {
    runSWAT(res);
});
// - METHOD: getScenarios
app.get("/getscenarios", (req, res) => {
    getScenarios(res);
})
// PRIVATE METHOD: createScenario
app.get("/createscenario", (req, res) => {
    // Get scenario param
    let scenario = req.query.scenario;
    if(scenario !== null) {
        createScenario(res, scenario);
    } else {
        res.send({ "code": 0 });
    }
});

// - METHOD: deleteScenario
// TODO: Make this soft-delete instead (flags in a file to track soft-deleted scenarios)
app.get("/deletescenario",(req, res)=>{
  let scenario = req.query.scenario;
  if(scenario !== null) {
    deleteScenario(res, scenario);
} else {
    res.send({ "code": 0 });
}  
});


// - METHOD: sendHRU
app.post("/sendhru", (req, res) => {
    console.log(convertToTSV(req.body));
    res.send("check console")
});

const server = http.createServer(app);

server.listen(config.server_port);
console.log(`SWAT Server Listening on Port ${config.server_port}`);

// API METHOD: getScenarios
// Get Scenarios
function getScenarios(res) {

    function getDirectories(src) {
        return readdirSync(path.resolve(__dirname, src), { withFileTypes: true }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);
    }

    res.send(getDirectories(config.swat_scenarios))
}

// API METHOD: createScenario
// Create Scenario
function createScenario(res, scenario) {
    // TODO: DO SOME CHECKS ON THE SCENARIO STRING!!!
    try {
        copySync(path.resolve(__dirname, config.swat_scenarios + config.swat_default_scenario), path.resolve(__dirname, config.swat_scenarios + scenario), { overwrite: false, errorOnExist: true });
        res.send({ "code": 1, "scenario": scenario })
    } catch (err) {
        console.log(err);
        // Directory already exists, or copying failed.
        res.send({ "code": 0 });
    }
}

// API METHOD: deleteScenario
// delete scenario
function deleteScenario(res, scenario) {
    const dir = path.resolve(__dirname, config.swat_scenarios + scenario)
    fs.rmdir(dir, { recursive: true }, (err) => {
        if (err) {
            throw err;
        }
        console.log(`${dir} is deleted!`);
        res.send(`${scenario} is deleted!`)
    });
}


// API METHOD: runSwat
// Run SWAT
function runSWAT(res) {
    const process = require('child_process').spawn(__dirname + '/../' + config.swat_exe, [], { cwd: config.swat_models, maxBuffer: 1024 * 1024 * 1024});

    // Data to the screen while model is executing successfully
    process.stdout.on('data', data => {
        console.log(`${data}`);
    });
    
    // Log error message
    process.stderr.on('data', (data) => {
        console.log(`${data}`);
        res.send({ "code": 0 });
    });
    
    // Perform any tasks when done if needed...
    process.on('close', (code) => {  
        console.log('done');
        res.send({ "code": 1 });
    });
}


// HELPERS

const convertToTSV = (data) => {
    // Convert dataset to TSV and print
    const headers = Object.keys(data[0]);
    const tsv = [
      headers.join('\t'),
      ...data.map(row => headers.map(fieldName => row[fieldName]).join('\t'))
    ].join('\r\n');

    return tsv;
  }