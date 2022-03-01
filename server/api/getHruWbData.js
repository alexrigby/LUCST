const fs = require("fs");
const getScenarios = require("./getScenarios");
const { config } = require("./config");
const path = require("path");

module.exports = (req, res) => {
  let scenario = req.body.scenario;
  if (getScenarios().includes(scenario)) {
    const wbData = fs.readFileSync(
      path.resolve(
        __dirname,
        `${config().swat_scenarios}${scenario}/TxtInOut/hru_wb_mon.csv`
      )
    );
    res.send(wbData);
  }
};