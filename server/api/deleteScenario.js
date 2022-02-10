// // API METHOD: deleteScenario
// // delete scenario
// const fs = require("fs");
// const getScenarios = require("./getScenarios")
// const path = require("path");
// const { config } = require("./config");

// function deleteScenario(res, scenario) {
//     const dir = path.resolve(__dirname, config().swat_scenarios + scenario);
//     fs.rmdir(dir, { recursive: true }, (err) => {
//       if (err) {
//         throw err;
//       }
//       console.log(`${dir} is deleted!`);
//       res.send(`${scenario} is deleted!`);
//     });
//   }