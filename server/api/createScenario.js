// API METHOD: createScenario
// Create Scenario
const { config } = require("./config");
const fs = require("fs");
const path = require("path");
const { copySync } = require("fs-extra");


// PRIVATE METHOD: createScenario
module.exports = (req, res) => {
  // Get scenario param
  let scenario = req.query.scenario;
  if (scenario !== null && scenario !== "Default") {
    createScenario(res, scenario);
  } else {
    res.send({
      code: 0,
      message:
        scenario === "Default"
          ? "Scenario cannot be named Default"
          : "Invalid scenario name",
    });
  }
};

function createScenario(res, scenario) {
  // TODO: DO SOME CHECKS ON THE SCENARIO STRING!!!
  try {
    copySync(
      path.resolve(
        __dirname,
        config().swat_scenarios + config().swat_default_scenario
      ),
      path.resolve(__dirname, config().swat_scenarios + scenario),
      { overwrite: false, errorOnExist: true }
    );
    res.send({ code: 1, scenario: scenario });
  } catch (err) {
    console.log(err);
    // Directory already exists, or copying failed.
    res.send({ code: 0 });
  }
};