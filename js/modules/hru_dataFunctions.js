import {updateTooltips} from "/js/modules/mapFunctions.js";

//hru_data.hru//


// Return an object array from cleaned TSV data with D3.tsvParse 
/**
 * 
 * @param {*} data 
 */
export function cleanHru(data) {
  return d3.tsvParse(data
    // Remove the header line produced by SWAT+ Editor
    .substring(data.indexOf('\n') + 1)
    // First, remove all spaces and replace with tabs
    .replace(/  +/gm, '\t')
    // Then remove all leading and trailing tabs
    .replace(/^\t|\t$/gm, '')
  );
}



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


function getLanduseTypes(data) {
  const landuses = data.map(record => record.name);
  // console.log(landuses);
  return landuses
}

function getLanduseTooltip(data) {
  const landuses = data.map(record => "plant:"+'"'+record.plnt_com+'".' + "cn:" +'"'+ record.cn2 + '".' + "conservation:" +'"'+ record.cons_prac +'".'+ "n:" +'"'+ record.ov_mann+'"');
  // console.log(landuses);
  return landuses
}

export function populateTable(data) {
  const landuseTypes = getLanduseTypes(window.LLYFNILanduseEdit)
  const landuseDescription = getLanduseTooltip(window.LLYFNILanduseEdit)
  const landuseTooltip = landuseDescription.map((el, i)=> {
    return `${el}`
  });

  const landuseTypesOptions = landuseTypes.map((el, i) => {
    return `<option title=${landuseTooltip[i]} value=${el}>${el}</option>`;
  });


  const rowCount = data.hrus.length;
  let table = "";
  //loops over the data asigning new row each time
  //calls variable i assignes index 0 to it, row count has to be grater than i, increment i by 1 each time
  for (let i = 0; i < rowCount; i++) {
    table += `
              <tr>
                  <td>${data.hrus[i]}</td>
                  <td>${data.landuse[i]}
                  <button class="lulc-edit-button" data-hru=${data.hrus[i]}>Edit</button>
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



  table +=
    `<tr>
         <td><button class="lulc-editAll-button" data-hru=${data.hrus}> EDIT ALL </button></td>
         <td><button class="lulc-clear">CLEAR</button></td>
         <td class="allNewlanduse">
         <select class="allLanduseTypes" id="allLanduseDatalist">
         <option value="default" selected="selected" disabled>
                        </option>
         ${landuseTypesOptions}
          </select></td>
     </tr>`
    ;



  const convertToTSV = (data) => {
    // Convert dataset to TSV and print
    const headers = Object.keys(data[0]);
    const tsv = [
      headers.join('\t'),
      ...data.map(row => headers.map(fieldName => row[fieldName]).join('\t'))
    ].join('\r\n');

    return tsv;
  }


 
 

  document.getElementById("result").innerHTML = table;
  //assignes the butons called above to a variable
  const lulcEditButtons = document.querySelectorAll(".lulc-edit-button");

  lulcEditButtons.forEach((el, i, arr) => {
    el.addEventListener("click", () => {
      const landuseSelection = document.querySelectorAll(".landuseTypes");
      const newLanduse = landuseSelection[i].value;
    
  
      // UPDATE THE DATASET
      window.LLYFNIData[el.dataset.hru - 1].lu_mgt = `${newLanduse}`;


      const newHruData = convertToTSV(window.LLYFNIData);
      downloadButton(newHruData, 'hru-data.hru');
      updateTooltips()
    })
  })

  const lulcEditAllButton = document.querySelector(".lulc-editAll-button");

  lulcEditAllButton.addEventListener("click", () => {
    const allLanduseSelection = document.querySelector(".allLanduseTypes");
    const allNewLanduse = allLanduseSelection.value;
    document.querySelector(".allNewlanduse").innerHTML = `${allNewLanduse}`;
    document.querySelectorAll(".newLanduse").innerHTML = `${allNewLanduse}`;

    // Converts a comma delimited string to an array of strings (ids).
    const hrusToUpdate = lulcEditAllButton.dataset.hru.split(",");
    //console.log(hrusToUpdate);


    hrusToUpdate.forEach((el, i, arr) => {
      window.LLYFNIData[parseInt(el) - 1].lu_mgt = `${allNewLanduse}`
     
    });
    updateTooltips()
    // const newHruData = convertToTSV(window.LLYFNIData);

    // downloadButton(newHruData, 'hru-data.hru');
    downloadButton(window.LLYFNIData, 'hru-data.hru');
    alert('New hru_data file writen')
  });

  const lulcClearButton = document.querySelector(".lulc-clear");
  lulcClearButton.addEventListener('click', ()=>{
    document.getElementById("result").innerHTML = "";
  });
}


function downloadButton(data, fileName) {
  // var myFile = new Blob([data], { type: 'text/plain' });
  // document.getElementById('download').setAttribute('href', window.URL.createObjectURL(myFile));
  // document.getElementById('download').setAttribute('download', fileName);
  // console.log(data);
  fetch('http://localhost:8000/sendhru', { method: "POST", headers: {
    'Content-Type': 'application/json' },
    body: JSON.stringify({hru: data, scenario: window.currentScenario})
  }).then(res => res.text()).then(data => console.log(data));

}



export default {
  populateTable,
  cleanHru,
  getHru,
  updateHru,
}