//CLEANS SWAT+ CSV OUTPUT FILES, RETURNS CLEAN DATA AND COLLUMN HEADRS
// TO USE: 
// const cleanCsv = cleanCsvOutput(data)
// const csvData = cleanCsv.csvData
// const csvheaders = cleanCsv.columnHeaders

export function cleanCsvOutput(data) {
    const clean = d3.csvParse(data
        // Remove the header line produced by SWAT+ Editor
        .substring(data.indexOf('\n') + 1)
        // First, remove all spaces and replace with nothing
        .replace(/ +/gm, '')
        // Then remove all leading and trailing tabs
        // .replace(/^\t|\t$/gm)
    );
    const columnHeaders = clean.columns.splice(7)
    // window.OUTPUTNAMES = [...outputNames]

    //removes the line which displays units from output data (where there is no name)
    const noUnits = clean.filter(clean => clean.name != "");

    return {
        "csvData": noUnits,
        "columnHeaders": columnHeaders
    }
}




export default {
    cleanCsvOutput,
}