// const { convertToTSV } = require("/server/convertToTSV");
const fs = require("fs");
const getScenarios = require("./getScenarios");
const { config } = require("./config");
const path = require("path");

module.exports = (req, res) => {
    let scenario = req.body.scenario;
    let tsv = convertToTSV(req.body.hru);

    if (getScenarios().includes(scenario) && scenario !== "Default") {
        try {
            fs.writeFileSync(
                path.resolve(
                    __dirname,
                    `${config().swat_scenarios}${scenario}/TxtInOut/hru-data.hru`
                ),
                tsv
            );
            res.send({ code: 1, message: `Successfully saved hru to disk` });
        } catch {
            res.send({ code: 0, message: "HRU failed to save" });
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
