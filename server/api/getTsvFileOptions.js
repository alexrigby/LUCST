//RECEIVES SCENARIO AND FILE NAME FROM THE SERVER
const fs = require("fs");
const getScenarios = require("./getScenarios");
const { config } = require("./config");
const path = require("path");

module.exports = (req, res) => {
  let scenario = req.body.scenario;
  let file = req.body.file;
  if (getScenarios().includes(scenario)) {
    const data = fs.readFileSync(
      path.resolve(
        __dirname,
        `${config().swat_scenarios}${scenario}/TxtInOut/${file}`
      )
    );
    res.send(data);
  }
};