const path = require("path");
const { config } = require("./config");

module.exports = (req, res) => {
  let scenario = req.query.scenario;
  // console.log(scenario);
  // res.send(scenario);
  if (scenario !== null && scenario !== "Default") {
    runSWAT(res, scenario);
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

// API METHOD: runSwat
// Run SWAT
function runSWAT(res, scenario) {
  const process = require("child_process").spawn(
    path.resolve(
      __dirname,
      `${config().swat_scenarios}${scenario}/TxtInOut/${config().swat_exe}`
    ),
    [],
    {
      cwd: `${config().swat_scenarios_root}${scenario}/TxtInOut/`,
      maxBuffer: 1024 * 1024 * 1024,
    }
  );

  // Data to the screen while model is executing successfully
  process.stdout.on("data", (data) => {
    console.log(`${data}`);
  });

  // Log error message
  process.stderr.on("data", (data) => {
    console.log(`${data}`);
    res.send({
      code: 0,
      message: `Error running swat for scenario: ${scenario}`,
    });
  });

  // Perform any tasks when done if needed...
  process.on("close", (code) => {
    console.log("done");
    res.send({
      code: 1,
      message: `Swat ran successfully for scenario: ${scenario}`,
    });
  });
}
