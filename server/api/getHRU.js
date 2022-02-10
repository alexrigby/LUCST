const fs = require("fs");
const getScenarios = require("./getScenarios")

module.exports = (req, res) => {
    let scenario = req.body.scenario;
  
    if (getScenarios().includes(scenario)) {
      try {
        const hru = fs.readFileSync(
          path.resolve(
            __dirname,
            `${config().swat_scenarios}${scenario}/TxtInOut/hru-data.hru`
          )
        );
        res.send({ code: 1, message: "HRU sent", hru });
      } catch {
        res.send({ code: 0, message: "HRU failed to send" });
      }
    } else {
      res.send({ code: 0, message: "Invalid scenario" });
    }
  }
