// API METHOD: createScenario
// Create Scenario
const { config } = require("./config")
const fs = require("fs")
const path = require("path")
const { copySync } = require("fs-extra");

module.exports = (res, scenario) => {
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
  }