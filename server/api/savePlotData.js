//NOT ACTUALY BEING USED RIGHT NOW


// API METHOD: savePlotData
const fs = require("fs")
const getScenarios = require("./getScenarios")
const config = require("./config")

module.exports = (req, res) => {
    let scenario = req.body.scenario;
    let csv = convertToCSV(req.body.plot);
    let name = req.body.name;
  
    if (getScenarios().includes(scenario)) {
      try {
        fs.writeFileSync(
          path.resolve(
            __dirname,
            `${config().swat_scenarios}${scenario}/${name}.csv`
          ),
          csv
        );
        res.send({ code: 1, massage: `Raw plot data saved to scenario` });
      } catch {
        res.send({ code: 0, message: "Failed to save" });
      }
    } else {
      res.send({ code: 0, messgae: "Error" });
    }
  }
  
  const convertToCSV = (data) => {
    // Convert dataset to TSV and print
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(","),
      ...data.map((row) => headers.map((fieldName) => row[fieldName]).join(",")),
    ].join("\r\n");
  
    return csv;
  };