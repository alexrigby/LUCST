const path = require("path");
const { readdirSync } = require("fs");
const { config } = require("./config");

module.exports = () => {
  // console.log(readdir(path.resolve(__dirname, config().swat_scenarios)))
  // console.log( readdirSync(path.resolve(__dirname, config().swat_scenarios), { withFileTypes: true }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name))
  return readdirSync(path.resolve(__dirname, config().swat_scenarios), {
    withFileTypes: true,
  })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
};
