import fetchData from "/js/modules/universalFunctions.js";

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

function getLUDescriptions(data) {
  const plants = data.map(record => record.description);
  // console.log(landuses);
  return plants
}

export function getLanduseTypes(data) {
  const landuses = data.map(record => record.name);
  // console.log(landuses);
  return landuses
}


export function getCurveNumer(scenario){
//auto fill cn number Datalist from cntable.lum
fetchData(`/LLYFNI2/Scenarios/${scenario}/TxtInOut/cntable.lum`)
.then(function (data) {
  const cleanCnData = cleanLanduse(data);
  const cnNames = getLanduseTypes(cleanCnData);
  const cnDescriptions = getLUDescriptions(cleanCnData)
  const cnDOptions = cnDescriptions.map((el, i)=> {
    return `${el}`
  }); 
  const cnOptions = cnNames.map((el, i) => {
    return `<option title=${cnDOptions[i]} value=${el}>${el}</option>`;
  });
  
  document.getElementById("cn2Options").innerHTML = `${cnOptions}`
});
}

export function getConsPractice(scenario){
//auto fill  cons practice datalist from Cons_practice.lum
fetchData(`/LLYFNI2/Scenarios/${scenario}/TxtInOut/cons_practice.lum`)
.then(function (data) {
  const cleanConsData = cleanLanduse(data);
  const consNames = getLanduseTypes(cleanConsData);
  const consDescriptions = getLUDescriptions(cleanConsData)
  const consDOptions = consDescriptions.map((el, i)=> {
    return `${el}`
  }); 
  const consOptions = consNames.map((el, i) => {
    return `<option title=${consDOptions[i]} value=${el}>${el}</option>`;
  });
  document.getElementById("cons").innerHTML = `${consOptions}`
});
}

export function getManN(scenario){
// auto fill mannings n datalist from ovn_mann.lum
fetchData(`/LLYFNI2/Scenarios/${scenario}/TxtInOut/ovn_table.lum`)
.then(function (data) {
  const cleanNData = cleanLanduse(data);
  const nNames = getLanduseTypes(cleanNData);
  const manNDescriptions = getLUDescriptions(cleanNData)
  const manNDOptions = manNDescriptions.map((el, i)=> {
    return `${el}`
  }); 
  const nOptions = nNames.map((el, i) => {
    return `<option title=${manNDOptions[i]} value=${el}>${el}</option>`;
  });
  document.getElementById("manN").innerHTML = `${nOptions}`
});
}

//exported to main.js to make the landuseform
export function landuseTypes() {

  //makes luForm popup by pressing button, close by clicking on body
  document.getElementById("openLuForm").onclick = openLuForm;
  document.getElementById("popupClose").onclick = closeLuForm;
  function openLuForm() {
    document.getElementById("luForm").style.display = "block";
    document.getElementById("result").innerHTML = "";
  }
  function closeLuForm() {
    document.getElementById("luForm").style.display = "none";
  }

  //declaring form elements as onsctants, adding default values
  const newLuButton = document.getElementById("newLuButton");

  const luName = document.getElementById("luName");
  const luCalGroup = document.getElementById("calGroup")
  luCalGroup.setAttribute('value', 'null')
  const plantCom = document.getElementById("luPlantComselect")
  const luMgt = document.getElementById("luMgt")
  luMgt.setAttribute('value', 'null')
  const cn2 = document.getElementById("cn2")
  const consPractice = document.getElementById("consPracticeDatalist")
  // consPractice.setAttribute('value', 'up_down_slope')
  const urban = document.getElementById("urban")
  urban.setAttribute('value', 'null')
  const urbRo = document.getElementById("urbRo")
  urbRo.setAttribute('value', 'null')
  const ovMann = document.getElementById("ovMannDatalist")
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




  //onclick of 'make' makes new landuse file
  newLuButton.addEventListener('click', () => {

    //new landuse object
    const newLu = new Object();
    newLu.name = luName.value;
    newLu.cal_group = luCalGroup.value;
    newLu.plnt_com = plantCom.value;
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

    

    //adds the new landuse to landuse.window object
    window.LLYFNILanduseEdit.push(newLu)
    //converts landuse.window object to TSV and downloads as txt
    // const newLanduseFile = convertToTSV(window.LLYFNILanduseEdit)
    // downloadLuButton(newLanduseFile, "landuse.lum")
    sendLanduseFile(window.LLYFNILanduseEdit);
    alert('New land use written: ' + luName.value)
  });

}







// function downloadLuButton(data, fileName) {
//   var myFile = new Blob([data], { type: 'text/plain' });
//   document.getElementById('downloadLanduse').setAttribute('href', window.URL.createObjectURL(myFile));
//   document.getElementById('downloadLanduse').setAttribute('download', fileName);

function sendLanduseFile(data) {
  fetch('http://localhost:8000/sendlum', { method: "POST", headers: {
    'Content-Type': 'application/json' },
    body: JSON.stringify({lum: data, scenario: window.currentScenario})
  }).then(res => res.text()).then(data => console.log(data));
}

// }
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
  getLanduseTypes,
getConsPractice,
getCurveNumer,
getManN,
}

