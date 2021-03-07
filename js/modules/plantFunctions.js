// import * as d3 from "d3";
// import d3 from "d3";
// plant.ini//

// Return an object array from cleaned TSV data with D3.tsvParse for plant.ini
export function cleanPlant(data) {

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
  }


  export function getPlantOptions(data) {
    const plants = data.map(record => record.name);
   // console.log(landuses);
  return plants
  }

export function populatePlantTypeForm (){

  const plantsOptions = window.PLANTnames.map((el, i) => {
    return `<option value=${el}></option>`;
  });
 
  document.getElementsById('plantsOptions').innerHTML =`${plantsOptions}`
}


const convertToTSV = (data) => {
  // Convert dataset to TSV and print
  const headers = Object.keys(data[0]);
  const tsv = [
    headers.join('\t'),
    ...data.map(row => headers.map(fieldName => row[fieldName]).join('\t'))
  ].join('\r\n');

  return tsv;
}

export function newPlantType(){

const newPlantTypeButton = document.getElementById("newPlantButton")

newPlantTypeButton.addEventListener('click', () => {
    const plantComName = document.getElementById("plantNames").value;
    const plantCnt = document.getElementById("plt_cnt").value;
    const iniRotationYear = document.getElementById("rot_yr_ini").value;
    const plantName = document.getElementById("plt_name").value;
    const landcoverStatus= document.getElementById("lc_status").value;
    const iniLai = document.getElementById("lai_init").value;
    const iniBm = document.getElementById("bm_init").value;
    const iniPhu= document.getElementById("phu_init").value;
    const plantPopulation = document.getElementById("plnt_pop").value;
    const iniYrs= document.getElementById("yrs_init").value;
    const iniRsd= document.getElementById("rsd_init").value;

    const newPlantSelection = new Object();
    newPlantSelection.pcom_name = plantComName;
    newPlantSelection.plt_cnt = plantCnt;
    newPlantSelection.rot_yr_ini = iniRotationYear;
    newPlantSelection.plt_name = plantName;
    newPlantSelection.lc_status = landcoverStatus;
    newPlantSelection.lai_init = iniLai;
    newPlantSelection.bm_init = iniBm;
    newPlantSelection.phu_init = iniPhu;
    newPlantSelection.plnt_pop = plantPopulation;
    newPlantSelection.yrs_init =iniYrs;
    newPlantSelection.rsd_init = iniRsd;
      
 
console.log(window.LLYFNIPlant)
    console.log(newPlantSelection)

    window.LLYFNIPlant.push(newPlantSelection)

    const newPlantTypeFile = convertToTSV(window.LLYFNIPlant)
    downloadPlantButton(newPlantTypeFile, "plant.ini")
});
}

function downloadPlantButton(data, fileName) {
  var myFile = new Blob([data], { type: 'text/plain' });
  document.getElementById('downloadPlant').setAttribute('href', window.URL.createObjectURL(myFile));
  document.getElementById('downloadPlant').setAttribute('download', fileName);

}


  //exports functions 
  export default { 
    newPlantType,
    populatePlantTypeForm,
    cleanPlant,
    getPlantOptions
  }

