//CLEANS REGULAR TSV SWAT+ INPUT FILES AND EXTRACTS NAMES OF ITEMS 
import { hasWord } from "./cleanPlantIni.js"

// Return an object array from cleaned TSV data with D3.tsvParse
export function cleanTsvSwatFiles(data) {
    // if the file has the word "written" it needs more cleaning as it is from default or out of SWAT+ editor
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
        // if the file has no words it has already been cleaned by LUCST and needs less cleaning
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