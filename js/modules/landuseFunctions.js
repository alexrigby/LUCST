import d3 from "d3";
//landuse.lum//



// Return an object array from cleaned TSV data with D3.tsvParse
export function cleanLanduse(data) {
    return d3.tsvParse(data
      // Remove the header line produced by SWAT+ Editor
      .substring(data.indexOf('\n') + 1)
      // First, remove all spaces and replace with tabs
      .replace(/  +/gm, '\t')
      // Then remove all leading and trailing tabs
      .replace(/^\t|\t$/gm, '')
    );
  }

  //exports functions
  export default cleanLanduse