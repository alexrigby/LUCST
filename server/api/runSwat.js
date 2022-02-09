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
