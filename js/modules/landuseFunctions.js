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

//makes luForm popup by pressing landuse.lum
  document.getElementById("openLuForm").onclick = openLuForm;
  document.getElementById("popupClose").onclick = closeLuForm;
  function openLuForm() {
    document.getElementById("luForm").style.display = "block";
  }
  function closeLuForm() {
    document.getElementById("luForm").style.display = "none";
  }
  const newLuButton = document.getElementById("newLuButton");

  const luName = document.getElementById("luName");
  const luCalGroup = document.getElementById("luCalGroup")
  luCalGroup.setAttribute('value', 'null')
  const plantCom = document.getElementById("luPlantCom")
  const luMgt = document.getElementById("luMgt")
  luMgt.setAttribute('value', 'null')
  const cn2 = document.getElementById("cn2")
  const consPractice = document.getElementById("consPractice")
  consPractice.setAttribute('value', 'up_down_slope')
  const urban = document.getElementById("urban")
  urban.setAttribute('value', 'null')
  const urbRo = document.getElementById("urbRo")
  urbRo.setAttribute('value', 'null')
  const ovMann = document.getElementById("ovMann")
  const tile = document.getElementById("tile")
  tile.setAttribute('value', 'null')
  const sep = document.getElementById("sep")
  sep.setAttribute('value', 'null')
  const vfs = document.getElementById("vfs")
  vfs.setAttribute('value', 'null')
  const grww = document.getElementById("grww")
  grww.setAttribute('value', 'null')
  const bmp = document.getElementById("bmp")
  bmp.setAttribute('value', 'null')


  newLuButton.addEventListener('click', () => {


    const newLu = new Object();
    newLu.name = luName.value;
    newLu.cal_group = luCalGroup.value;
    newLu.plt_com = plantCom.value;
    newLu.mgt = luMgt.value;
    newLu.cn2 = cn2.value;
    newLu.cons_prac = consPractice.value;
    newLu.urban = urban.value;
    newLu.urb_ro = urbRo.value;
    newLu.ov_mann = ovMann.value
    newLu.tile = tile.value;
    newLu.sep = sep.value;
    newLu.vfs = vfs.value;
    newLu.grww = grww.value;
    newLu.bmp = bmp.value;

    window.LLYFNILanduseEdit.push(newLu)

    const newLanduseFile = convertToTSV(window.LLYFNILanduseEdit)
    downloadLuButton(newLanduseFile, "landuse.lum")
    console.log(window.LLYFNILanduseEdit)
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

