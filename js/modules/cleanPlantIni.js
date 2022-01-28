// CLEANS PLANT.INI FILE 

//checks for word in string 
export const hasWord = (str, word) =>
  str.split(/\s+/).includes(word);

// Return an object array from cleaned TSV data with D3.tsvParse for plant.ini
export function cleanPlantIni(data) {
  // if the file has the word "SWAT+" it means it has been produced by SWAT+ editor i.e 'default' scenario therfore it will be in an irregular format and 
  //needs cleaning
  if (hasWord(data, "SWAT+") == true) {
    // delete header line creted by SWAT+
    data = data.substring(data.indexOf('\n') + 1);

    // Get data headers only
    const dataHeaders = data
      // Get the first line (replicated for some reason), index 0
      .match(/^(.*)$/m)[0]
      // Replace all spaces with tabs
      .replace(/  +/g, '\t')
      // Remove preceeding and trailing tabs
      .replace(/^\t|\t$/gm, '');

    // Chop off the header we already extracted
    const dataBody = data.substring(
      // Go to the end of the first line
      data.indexOf('\n') + 1)
      // Replace all spaces with tabs
      .replace(/  +/g, '\t')
      // Remove preceeding and trailing tabs
      .replace(/^\t|\t$/gm, '');

    // Create an array of all strings delimited by the newline char
    const fragmentedBody = dataBody.split("\n");

    // A string to build up the body again
    let cleanedBody = "";

    // Loop over every body fragment...
    fragmentedBody.forEach((el, i) => {
      // Remove the newline character from EVERY fragment
      const cleanedEl = el.trim();
      // Apply a tab to the end of every ODD fragment
      if (i % 2 == 0) {
        cleanedBody = cleanedBody + cleanedEl + "\t"
        // Apply a new line char to the end of every EVEN fragment
      } else {
        cleanedBody = cleanedBody + cleanedEl + "\n"
      }
    })
    // Return a d3 TSV parsed dataset (headers + newline + cleanedbody)
    return d3.tsvParse(dataHeaders + "\n" + cleanedBody.trim());


    //if the file dosent have the word "SWAT+" it has already been cleaned by LUCST and only needs parsing from TSV to JSON
  } else {
    const clean = d3.tsvParse(data
      // First, remove all spaces and replace with tabs
      .replace(/  +/gm, '\t')
      // Then remove all leading and trailing tabs
      .replace(/^\t|\t$/gm, ''),

    );
    return clean
  }
}

export default {
  cleanPlantIni,
  hasWord
}