const fs = require("fs");
const getScenarios = require("./getScenarios");
const { config } = require("./config");
const path = require("path");

module.exports = (req, res) => {
  let scenario = req.body.scenario;
  if (getScenarios().includes(scenario)) {
    const channelData = fs.readFileSync(
      path.resolve(
        __dirname,
        `${config().swat_scenarios}${scenario}/TxtInOut/channel_sd_day.csv`
      )
    );
    res.send(channelData);
  }
};