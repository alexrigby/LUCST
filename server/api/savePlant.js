const fs = require("fs");
const getScenarios = require("./getScenarios");
const { config } = require("./config");
const path = require("path");


// API METHOD: SavePlant
// Save plant file to disk
module.exports = (req, res) => {
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

  const convertToTSV = (data) => {
    // Convert dataset to TSV and print
    const headers = Object.keys(data[0]);
    const tsv = [
        headers.join("\t"),
        ...data.map((row) => headers.map((fieldName) => row[fieldName]).join("\t")),
    ].join("\r\n");

    return tsv;
};
