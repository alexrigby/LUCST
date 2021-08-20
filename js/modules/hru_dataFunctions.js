import {updateTooltips} from "/js/modules/mapFunctions.js";
import fetchData from "/js/modules/universalFunctions.js";
import {HOST} from "../main.js"
//hru_data.hru//

//making function dynamic means that catchment Data is wread from the correct HRU each time
export function getHruData(scenario){
  fetchData(`/catchment/Scenarios/${scenario}/TxtInOut/hru-data.hru`)
      .then(data => {
        
      
          // Clean the dataset...
          const cleanHruData = cleanHru(data);
         
          // Saving a copy of the dataset
  
          // Replace this with a state management solution
          window.catchmentData = [...cleanHruData];
          // console.log('chd', cleanHruData);
          updateTooltips(cleanHruData, 'test')
          // console.log(window.catchmentData)
      });
  }



// Return an object array from cleaned TSV data with D3.tsvParse 
/**
 * 
 * @param {*} data 
 */


export function cleanHru(data) {
//checks to see if the SWAT+ editor header line is on file (has word "written") 
//if true deletes first line, if not neeps first line
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

//Select HRU's lu_mgt by its id
//e.g(console.log(getHru(cleanHruData250))
/**
 * @name getHru
 * @param {*} data // A dataset
 * @param {*} id // An ID
 */
export function getHru(data, id) {
  const filteredData = data.filter(record => record.id == id);
  return filteredData[0].lu_mgt
}

// Update selected HRU lu_mgt
/**
 * @name updateHru
 * @param {*} data // dataset
 * @param {*} id // id of HRU
 * @param {*} lu_mgt // Selects lu_mgt(can change to any variable in dataset)
 */
export function updateHru(data, id, lu_mgt) {
  const newData = [...data];
  newData[id - 1] = {
    ...newData[id - 1],
    lu_mgt
  }
  return newData;
}

export function getUrbanList(scenario){
  //gets the urban landuse
  fetchData(`/catchment/Scenarios/${scenario}/TxtInOut/urban.urb`)
  .then(function(data){
    const cleanUrban = cleanPlants(data);
    const urbanNames = getPlantOptions(cleanUrban);
    const urbanDescription = getPlantDescriptions(cleanUrban)
    const urbanDOptions = urbanDescription.map((el, i)=> {
      return `${el}`
    });
  const urbanOptions = urbanNames.map((el,i)=>{
    return `<option data-toggle="tooltip" title="${urbanDOptions[i]}"> ${el +'_comm'}</option>`;
  });
  document.getElementById("urbanPlant").innerHTML = `${urbanOptions}`
  });
  }
  

function getLanduseTypes(data) {
  const landuses = data.map(record => record.name);
  // console.log(landuses);
  return landuses
}

function getLanduseTooltip(data) {
 
  const landuses = data.map(record => 
  ` Plant Community: ${record.plnt_com}
  Curve Number: ${record.cn2}
  Conservation Practice: ${record.cons_prac}
  Manning's n: ${record.ov_mann}`);
  // console.log(landuses);
  return landuses
}

export function populateTable(data) {
  const landuseTypes = getLanduseTypes(window.catchmentLanduseEdit)
  const landuseTooltip = getLanduseTooltip(window.catchmentLanduseEdit)
  
  
//  const hruData = window.catchmentData
// console.log(hruData)
  const landuseTypesOptions = landuseTypes.map((el, i) => {
    return `<option title="${landuseTooltip[i]}" value=${el}>${el}</option>`;
  });


  const rowCount = data.hrus.length;
// convert HRUS to integr to be passed by map
  const shpFileHrus = data.hrus.map(function(v){
    return parseInt(v);
  })
// map HRUs(from shapefile) to id's from window.catchmentData to display correct hru lu_mgt in table
  const hruLuSelection = shpFileHrus.map(shpHru => {
    const obj = window.catchmentData.find(record => record.id == shpHru);
    return {...shpHru, ...obj };
  })


 
  
  
  let table = "";

  table  +=
  `<tr class="hruSummary">
       <td > ${data.hrus.length} of ${window.catchmentData.length} selected</br>
       
      </td>
       <td> <button class="lulc-clear">CLEAR</button> <button class="lulc-editAll-button" data-hru=${data.hrus}> SAVE ALL </button></td>
       <td class="allNewlanduse">
       <select class="allLanduseTypes" id="allLanduseDatalist">
       <option value="default" selected="selected" disabled></option>
       ${landuseTypesOptions}
        </select></td>
   </tr>
   `
  ;
  //loops over the data asigning new row each time
  //calls variable i assignes index 0 to it, row count has to be grater than i, increment i by 1 each time
  for (let i = 0; i < rowCount; i++) {
    table += `
              <tr>
                  <td>${data.hrus[i]}</td>
                  <td>${hruLuSelection[i].lu_mgt}
                  <button class="lulc-edit-button" data-hru=${data.hrus[i]}>Save</button>
                  </td>
                  <td class="newLanduse">
                  <select class ="landuseTypes" id="landuseDatalist">
                  <option value="default" selected="selected" disabled>
                        </option>
                  ${landuseTypesOptions}
                   </select></td>
              </tr>`;
    //use`` to insert HTML elements straight from javascript, use ${} to input Javascript elements
  }



 

// console.log(document.getElementsByClassName("hruSummary"))
    document.getElementById("result").innerHTML = table ;

  const convertToTSV = (data) => {
    // Convert dataset to TSV and print
    const headers = Object.keys(data[0]);
    const tsv = [
      headers.join('\t'),
      ...data.map(row => headers.map(fieldName => row[fieldName]).join('\t'))
    ].join('\r\n');

    return tsv;
  }


 
 

  //assignes the butons called above to a variable
  const lulcEditButtons = document.querySelectorAll(".lulc-edit-button");

  lulcEditButtons.forEach((el, i, arr) => {
    el.addEventListener("click", () => {
      const landuseSelection = document.querySelectorAll(".landuseTypes");
      const newLanduse = landuseSelection[i].value;
    
  
      // UPDATE THE DATASET
      window.catchmentData[el.dataset.hru - 1].lu_mgt = `${newLanduse}`;


      // const newHruData = convertToTSV(window.catchmentData);
      downloadButton(window.catchmentData, 'hru-data.hru');
      updateTooltips(window.catchmentData)
    })
  })

  const lulcEditAllButton = document.querySelector(".lulc-editAll-button");

  lulcEditAllButton.addEventListener("click", () => {
    const allLanduseSelection = document.querySelector(".allLanduseTypes");
    const allNewLanduse = allLanduseSelection.value;
  //   document.querySelector(".allNewlanduse").innerHTML = `${allNewLanduse}`;
  //   document.querySelectorAll(".newLanduse").innerHTML = `${allNewLanduse}`;

    // Converts a comma delimited string to an array of strings (ids).
    const hrusToUpdate = lulcEditAllButton.dataset.hru.split(",");
    //console.log(hrusToUpdate);


    hrusToUpdate.forEach((el, i, arr) => {
      window.catchmentData[parseInt(el) - 1].lu_mgt = `${allNewLanduse}`
     
    });
    updateTooltips(window.catchmentData)
    // const newHruData = convertToTSV(window.catchmentData);

    // downloadButton(newHruData, 'hru-data.hru');
    downloadButton(window.catchmentData, 'hru-data.hru');
    alert('New hru_data file writen')
  });

  const lulcClearButton = document.querySelector(".lulc-clear");
  lulcClearButton.addEventListener('click', ()=>{
    document.getElementById("hruTable").style.display = "none";
  });

}


function downloadButton(data, fileName) {
  // var myFile = new Blob([data], { type: 'text/plain' });
  // document.getElementById('download').setAttribute('href', window.URL.createObjectURL(myFile));
  // document.getElementById('download').setAttribute('download', fileName);
  // console.log(data);
  fetch(`http://${HOST}:8000/sendhru`, { method: "POST", headers: {
    'Content-Type': 'application/json' },
    body: JSON.stringify({hru: data, scenario: window.currentScenario})
  }).then(res => res.text()).then(data => console.log(data));

}



export default {
  populateTable,
  cleanHru,
  getHru,
  updateHru,
  getHruData,
  getUrbanList
}