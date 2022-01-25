//CLEANS REGULAR TSV SWAT+ INPUT FILES AND EXTRACTS NAMES OF ITEMS 

//checks for word in string 
const hasWord = (str, word) =>
    str.split(/\s+/).includes(word);

// Return an object array from cleaned TSV data with D3.tsvParse
export function cleanTsvSwatFiles(data) {
    if (hasWord(data, "written") === true) {
        const clean = d3.tsvParse(data
            // Remove the header line produced by SWAT+ Edito
            .substring(data.indexOf('\n') + 1)
            // First, remove all spaces and replace with tabs
            .replace(/  +/gm, '\t')
            // Then remove all leading and trailing tabs
            .replace(/^\t|\t$/gm, '')
        );
        return clean
    } else {
        const clean = d3.tsvParse(data
            // First, remove all spaces and replace with tabs
            .replace(/  +/gm, '\t')
            // Then remove all leading and trailing tabs
            .replace(/^\t|\t$/gm, '')
        );
        return clean
    }
}

export default {
    cleanTsvSwatFiles
}