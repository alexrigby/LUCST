// import * as d3 from "d3";
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

export function getLanduseTypes(data) {
  const landuses = data.map(record => record.name);
  // console.log(landuses);
  return landuses
}

export function landuseTypes() {
  const newLuButton = document.getElementById("newLuButton");


  newLuButton.addEventListener('click', () => {
    const luName = document.getElementById("luName").value;
    const luCalGroup = document.getElementById("luCalGroup").value;
    const plantCom = document.getElementById("luPlantCom").value;
    const luMgt = document.getElementById("luMgt").value;
    const cn2 = document.getElementById("cn2").value;
    const consPractice = document.getElementById("consPractice").value;
    const urban = document.getElementById("urban").value;
    const urbRo = document.getElementById("urbRo").value;
    const ovMann = document.getElementById("ovMann").value;
    const tile = document.getElementById("tile").value;
    const sep = document.getElementById("sep").value;
    const vfs = document.getElementById("vfs").value;
    const grww = document.getElementById("grww").value;
    const bmp = document.getElementById("bmp").value;

    const newLu = new Object();
    newLu.name = luName;
    newLu.cal_group = luCalGroup;
    newLu.plt_com = plantCom;
    newLu.mgt = luMgt;
    newLu.cn2 = cn2;
    newLu.cons_prac = consPractice;
    newLu.urban = urban;
    newLu.urb_ro = urbRo;
    newLu.ov_mann = ovMann
    newLu.tile = tile;
    newLu.sep = sep;
    newLu.vfs = vfs;
    newLu.grww= grww;
    newLu.bmp = bmp;


    window.LLYFNILanduseEdit.push(newLu)
  
    const newLanduseFile = convertToTSV(window.LLYFNILanduseEdit)
    downloadLuButton(newLanduseFile, "landuse.lum")
    console.log(window.LLYFNILanduseEdit)
    // const landuseTypesOptions = window.LLYFNILconst  = document.getElementById("").value;anduse.map((el, i) => {
    //   return `<option value=${el}></option>`;
    // });

    // document.getElementById("luPlantCom").innerHTML = `${landuseTypesOptions}`
  });
}

function downloadLuButton(data, fileName) {
  var myFile = new Blob([data], { type: 'text/plain' });
  document.getElementById('downloadLanduse').setAttribute('href', window.URL.createObjectURL(myFile));
  document.getElementById('downloadLanduse').setAttribute('download', fileName);

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

  //exports functions
  export default {
    landuseTypes,
    cleanLanduse,
    getLanduseTypes
  }

