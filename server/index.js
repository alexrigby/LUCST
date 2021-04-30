const http = require('http');
const express = require('express');
const config = require('./config.json');

const app = express();

// Add API methods here
// - METHOD: RunSWAT
app.get("/runswat", (req, res) => {
    runSWAT(res);
});

const server = http.createServer(app);

server.listen(config.server_port);
console.log(`SWAT Server Listening on Port ${config.server_port}`);

// Run SWAT
function runSWAT(res) {
    const process = require('child_process').spawn(config.swat_exe, [], { cwd: config.swat_models, maxBuffer: 1024 * 1024 * 1024});

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


