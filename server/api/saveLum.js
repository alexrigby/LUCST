// API METHOD: SaveLum
// Save landuse file to disk
const fs = require("fs");
const getScenarios = require("./getScenarios");
const { config } = require("./config");
const path = require("path");
const convertToTSV = require("./convertToTSV")


module.exports = (req, res) => {
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

