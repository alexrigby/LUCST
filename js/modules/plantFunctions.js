
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




const convertToTSV = (data) => {
  // Convert dataset to TSV and print
  const headers = Object.keys(data[0]);
  const tsv = [
    headers.join('\t'),
    ...data.map(row => headers.map(fieldName => row[fieldName]).join('\t'))
  ].join('\r\n');

  return tsv;
}

export function newPlantType() {

  //   const pcomOptions = getPlantComTypes(window.PLANTnames)
  //     console.log(pcomOptions)

  //   const pcomTypesOptions = pcomOptions.map((el, i) => {
  //     return `<option value=${el}></option>`;
  //   });
  // document.getElementById("luPlantComDatalist").innerHTML = `${pcomTypesOptions}`

  //defines all Plant form inputs as constants
  const plantComName = document.getElementById("plantNamesDatalist");
  const plantCnt = document.getElementById("plt_cnt")
  plantCnt.setAttribute('value', 1)
  const iniRotationYear = document.getElementById("rot_yr_ini")
  iniRotationYear.setAttribute('value', 1)
  const plantName = document.getElementById("plt_name")
  const landcoverStatus = document.getElementById("lc_statusDatalist")
  const iniLai = document.getElementById("lai_init")
  iniLai.setAttribute('value', 2)
  const iniBm = document.getElementById("bm_init")
  iniBm.setAttribute('value', 2000)
  const iniPhu = document.getElementById("phu_init")
  iniPhu.setAttribute('value', 0)
  const plantPopulation = document.getElementById("plnt_pop")
  plantPopulation.setAttribute('value', 0)
  const iniYrs = document.getElementById("yrs_init")
  iniYrs.setAttribute('value', 1)
  const iniRsd = document.getElementById("rsd_init")
  iniRsd.setAttribute('value', 10000)
  iniRsd.setAttribute('step', 10000)

  const newPlantTypeButton = document.getElementById("newPlantButton")
  //adds input values to new object when button is clicked
  newPlantTypeButton.addEventListener('click', () => {
    const newPlantSelection = new Object();
    newPlantSelection.pcom_name = plantComName.value;
    newPlantSelection.plt_cnt = plantCnt.value;
    newPlantSelection.rot_yr_ini = iniRotationYear.value;
    newPlantSelection.plt_name = plantName.value;
    newPlantSelection.lc_status = landcoverStatus.value;
    newPlantSelection.lai_init = iniLai.value + '.00000';
    newPlantSelection.bm_init = iniBm.value + '.00000';
    newPlantSelection.phu_init = iniPhu.value + '.00000';
    newPlantSelection.plnt_pop = plantPopulation.value + '.00000';
    newPlantSelection.yrs_init = iniYrs.value + '.00000';
    newPlantSelection.rsd_init = iniRsd.vale + '.00000';


    console.log(newPlantSelection)
    //adds form data to plant.ini file
    window.LLYFNIPlant.push(newPlantSelection)
    //converts file and links to download button 
    const newPlantTypeFile = convertToTSV(window.LLYFNIPlant)
    downloadPlantButton(newPlantTypeFile, "plant.ini")
  });
}


function getPlantComTypes(data) {
  const plantCom = data.map(record => record.name);
  return plantCom
}


function downloadPlantButton(data, fileName) {
  var myFile = new Blob([data], { type: 'text/plain' });
  document.getElementById('downloadPlant').setAttribute('href', window.URL.createObjectURL(myFile));
  document.getElementById('downloadPlant').setAttribute('download', fileName);
}


//exports functions 
export default {
  newPlantType,
  cleanPlant,
  getPlantOptions
}

