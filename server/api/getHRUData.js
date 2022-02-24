const convertToTSV = require("./convertToTSV")
const fs = require("fs");
const getScenarios = require("./getScenarios");
const { config } = require("./config");
const path = require("path");


module.exports = (req, res) => {
    let scenario = req.body.scenario;
  console.log('getHRUData', scenario)
    if (getScenarios().includes(scenario)) {
        try {
            fs.readFileSync(
                path.resolve(
                    __dirname,
                    `${config().swat_scenarios}${scenario}/TxtInOut/hru-data.hru`
                ),
            );
            res.send({ code: 1, message: 'successfully uploaded hru_data.hru'});
        } catch {
            res.send({ code: 0, message: 'failed to read hru_data.hru'});
        }
    } 
};