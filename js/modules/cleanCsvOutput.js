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
        //might work, adds 0 in front of all single didgit numbers, test if vega-lite accepts it 
        .replace(/\b(\d{1})\b/g, '0$1')
        // Then remove all leading and trailing tabs
        // .replace(/^\t|\t$/gm)
    );
    const columnHeaders = clean.columns.splice(7)
    // window.OUTPUTNAMES = [...outputNames]

    //removes the line which displays units from output data
    const noUnits = clean.filter(clean => clean.precip != 'mm');

    return {
        "csvData": noUnits,
        "columnHeaders": columnHeaders
    }
}




export default {
    cleanCsvOutput,
}