import fetchData from "/js/modules/universalFunctions.js";

// import * as d3 from "d3";
//landuse.lum//

export function getLanduseData(scenario){
fetchData(`/catchment/Scenarios/${scenario}/TxtInOut/landuse.lum`)
  .then(data => {
      const cleanLanduseData = cleanLanduse(data);
      // console.log(cleanLanduseData)
      const landuseTypes = getLanduseTypes(cleanLanduseData);
      window.catchmentLanduse = [...landuseTypes];
      window.catchmentLanduseEdit = [...cleanLanduseData];
// console.log(window.catchmentLanduseEdit)
  });
}

// Return an object array from cleaned TSV data with D3.tsvParse
export function cleanLanduse(data) {
  if (hasWord(data, "written") === true){
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
    const clean =  d3.tsvParse(data
        // First, remove all spaces and replace with tabs
        .replace(/  +/gm, '\t')
        // Then remove all leading and trailing tabs
        .replace(/^\t|\t$/gm, '')
      );
      return clean
    }
}
//checks for word in string 
const hasWord = (str, word) =>
str.split(/\s+/).includes(word);

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



export function getGrassedWw(scenario){
  // auto fill mannings n datalist from ovn_mann.lum
  fetchData(`/catchment/Scenarios/${scenario}/TxtInOut/grassedww.str`)
  .then(function (data) {
    const cleanNData = cleanLanduse(data);
    
    const nNames = getLanduseTypes(cleanNData);
    
    const manNDescriptions = getLUDescriptions(cleanNData)
    const manNDOptions = manNDescriptions.map((el, i)=> {
      return `"${el}"`
    }); 
    // console.log(manNDOptions)
    const nOptions = nNames.map((el, i) => {
      return `<option title=${manNDOptions[i]} value=${el}>${el}</option>`;
    });
    // console.log(nOptions)
    document.getElementById("grww").innerHTML = `<option disabled selected value>-- select -- </option>  ${nOptions} <option title = "null"> null </option>`
  });
  }


export function getFilterStrip(scenario){
  fetchData(`/catchment/Scenarios/${scenario}/TxtInOut/filterstrip.str`)
  .then(function (data) {
    const cleanTileData = cleanLanduse(data);
    const tileNames = getLanduseTypes(cleanTileData);
    const tileDescriptions = getLUDescriptions(cleanTileData)
    const tileDOptions = tileDescriptions.map((el, i)=> {
      return `"${el}"`
    }); 
    const tileOptions = tileNames.map((el, i) => {
      return `<option title=${tileDOptions[i]} value=${el}>${el}</option>`;
    });
    
    document.getElementById("vfs").innerHTML = `<option disabled selected value>-- select -- </option> ${tileOptions}<option title = "null"> null </option>`
  });
}

export function getSepticData(scenario){
  fetchData(`/catchment/Scenarios/${scenario}/TxtInOut/septic.str`)
  .then(function (data) {
    const cleanTileData = cleanLanduse(data);
    const tileNames = getLanduseTypes(cleanTileData);
    const tileDescriptions = getLUDescriptions(cleanTileData)
    const tileDOptions = tileDescriptions.map((el, i)=> {
      return `"${el}"`
    }); 
    const tileOptions = tileNames.map((el, i) => {
      return `<option title=${tileDOptions[i]} value=${el}>${el}</option>`;
    });
    
    document.getElementById("sep").innerHTML = `<option disabled selected value>-- select -- </option> ${tileOptions}<option title = "null"> null </option>`
  });
}

export function getTileDrain(scenario){
  fetchData(`/catchment/Scenarios/${scenario}/TxtInOut/tiledrain.str`)
  .then(function (data) {
    const cleanTileData = cleanLanduse(data);
    const tileNames = getLanduseTypes(cleanTileData);
    const tileDescriptions = getLUDescriptions(cleanTileData)
    const tileDOptions = tileDescriptions.map((el, i)=> {
      return `"${el}"`
    }); 
    const tileOptions = tileNames.map((el, i) => {
      return `<option title=${tileDOptions[i]} value=${el}>${el}</option>`;
    });
    
    document.getElementById("tile").innerHTML = `<option disabled selected value>-- select -- </option> ${tileOptions}<option title = "null"> null </option>`
  });
}

export function getCurveNumer(scenario){
//auto fill cn number Datalist from cntable.lum
fetchData(`/catchment/Scenarios/${scenario}/TxtInOut/cntable.lum`)
.then(function (data) {
  const cleanCnData = cleanLanduse(data);
  const cnNames = getLanduseTypes(cleanCnData);
  const cnDescriptions = getLUDescriptions(cleanCnData)
  const cnDOptions = cnDescriptions.map((el, i)=> {
    return `"${el}"`
  }); 
  const cnOptions = cnNames.map((el, i) => {
    return `<option title=${cnDOptions[i]} value=${el}>${el}</option>`;
  });
  
  document.getElementById("cn2Options").innerHTML = `<option disabled selected value>-- select -- </option> ${cnOptions}<option title = "null"> null </option>`
});
}

export function getConsPractice(scenario){
//auto fill  cons practice datalist from Cons_practice.lum
fetchData(`/catchment/Scenarios/${scenario}/TxtInOut/cons_practice.lum`)
.then(function (data) {
  const cleanConsData = cleanLanduse(data);
  const consNames = getLanduseTypes(cleanConsData);
  const consDescriptions = getLUDescriptions(cleanConsData)
  const consDOptions = consDescriptions.map((el, i)=> {
    return `"${el}"`
  }); 
  const consOptions = consNames.map((el, i) => {
    return `<option title=${consDOptions[i]} value=${el}>${el}</option>`;
  });
  document.getElementById("cons").innerHTML = `<option disabled selected value>-- select -- </option> ${consOptions}<option title = "null"> null </option>`
});
}

export function getManN(scenario){
// auto fill mannings n datalist from ovn_mann.lum
fetchData(`/catchment/Scenarios/${scenario}/TxtInOut/ovn_table.lum`)
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
  document.getElementById("manN").innerHTML = `<option disabled selected value>-- select -- </option>  ${nOptions} <option title = "null"> null </option>`
});
}

export function getUrbanList(scenario){
  //gets the urban landuse
  fetchData(`/catchment/Scenarios/${scenario}/TxtInOut/urban.urb`)
  .then(function(data){
    const cleanUrban = cleanLanduse(data);
    const urbanNames = getLanduseTypes(cleanUrban);
    const urbanDescription = getLUDescriptions(cleanUrban)
    
    const urbanDOptions = urbanDescription.map((el, i)=> {
      return `${el}`
    });
    console.log(cleanUrban)

  const urbanOptions = urbanNames.map((el,i)=>{
    return `<option data-toggle="tooltip" title="${urbanDOptions[i]}"> ${el +'_comm'}</option>`
  });
  document.getElementById("urbanLUList").innerHTML = `<option disabled selected value>-- select -- </option> ${urbanOptions} <option title = "null"> null </option>`
  });
  }
  
function getPlantComTypes(data) {
  const plantCom = data.map(record => record.pcom_name);
 const plantTypes = plantCom.map((el, i) => {
  return `<option value=${el}>${el}</option>`;
});
return plantTypes
}


//exported to main.js to make the landuseform
export function landuseTypes() {
 
  //makes luForm popup by pressing button and updates plant selection, close by clicking on body
  document.getElementById("openLuForm").addEventListener("click",()=>{
    const pcomOptions = getPlantComTypes(window.catchmentPlant)
    document.getElementById("luForm").style.display = "block";
    document.getElementById("result").innerHTML = "";
   
    // console.log(pcomOptions)
    // const pcomTypesOptions = pcomOptions.map((el, i) => {
    //   return `<option value=${el}>${el}</option>`;
    // });
    document.getElementById("luPlantCom").innerHTML = `<option disabled selected value>-- select -- </option> ${pcomOptions} <option title = "null"> null </option>`;
  }) 
  document.getElementById("popupClose").onclick = closeLuForm;
  function closeLuForm() {
    document.getElementById("luForm").style.display = "none";
  }


 
  

    // console.log(pcomOptions)


    

  //declaring form elements as onsctants, adding default values
  const newLuButton = document.getElementById("newLuButton");

  const luName = document.getElementById("luName");
  const luCalGroup = document.getElementById("calGroup")
  luCalGroup.setAttribute('value', 'null')
  const plantCom = document.getElementById("luPlantCom")

  plantCom.addEventListener("change", () =>{
    if (plantCom.value !== "null"){
      document.getElementById("urbanLUList").innerHTML = `<option title="null" value="null" selected> null </option>`
      document.getElementById("urbRo").innerHTML = `<option title="null" value="null" selected> null </option>`
      // document.getElementById("urbanLU").style.background = "light-gray"
      luName.value = plantCom.value.substr(0, plantCom.value.length -5) + "_lum";
    } else {
      document.getElementById("urbanLUList").innerHTML = `<option disabled selected value>-- select -- </option>  ${getUrbanList(window.currentScenario)} <option title = "null"> null </option>`
      document.getElementById("urbRo").innerHTML = `<option disabled selected value>-- select -- </option> 
      <option value="buildup_washoff">buildup_washoff</option>
      <option value="usgs_reg">usgs_reg</option>
      <option value="null">null</option>`
    }
  })

  const luMgt = document.getElementById("luMgt")
  luMgt.setAttribute('value', 'null')
  const cn2 = document.getElementById("cn2Options")
  const consPractice = document.getElementById("cons")
  // consPractice.setAttribute('value', 'up_down_slope')
  const urban = document.getElementById("urbanLUList")
  //stops a plant community being picked if urban landuse is chosen 
 urban.addEventListener("change", () =>{
    if (urban.value !== "null"){
      document.getElementById("luPlantCom").innerHTML = `<option title="null" value="null" selected> null </option>`
      luName.value = urban.value.substring(0, 4) +'_lum';
    } else {
      document.getElementById("luPlantCom").innerHTML = `<option disabled selected value>-- select -- </option>  ${getPlantComTypes(window.catchmentPlant)} <option title = "null"> null </option>`
    }
  })
 
  const urbRo = document.getElementById("urbRo")
  urbRo.setAttribute('value', 'null')
  const ovMann = document.getElementById("manN")
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

    validateForm()

    function validateForm(){
      
      // var form = document.getElementById("luForm")
      // var inputs = form.getElementsByTagName("input") 
      // var selects = document.querySelectorAll(".luRequired")
    
      // console.log(selects)
             
           if(!luName.value || !luCalGroup.value || !plantCom.value || !luMgt.value || !cn2.value || !consPractice.value || !urban.value || !urbRo.value || !ovMann.value || !tile.value || !sep.value || !vfs.value || !grww.value || !bmp.value) {
            alert("Please fill all the inputs");

          }
          else {
            window.catchmentLanduseEdit.push(newLu)
    
            sendLanduseFile(window.catchmentLanduseEdit);
            alert('New land use written: ' + luName.value)
          }
        }

})
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
getLanduseData,
getUrbanList,
getTileDrain,
getSepticData,
getFilterStrip,
getGrassedWw,
}

