// import * as d3 from "d3";
// import { tsv } from 'tsv';
// const tsv = require('tsv').tsv;
// import tsv from 'tsv';


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







export function populateTable(data) {

  const rowCount = data.hrus.length;
  let table = "";
  //loops over the data asigning new row each time
  //calls variable i assignes index 0 to it, row count has to be grater than i, increment i by 1 each time
  for (let i = 0; i < rowCount; i++) {
    table += `
              <tr>
                  <td>${data.hrus[i]}</td>
                  <td>${data.landuse[i]}</td>
                  <td><button class="lulc-edit-button" data-hru=${data.hrus[i]}>Edit</button></td>
                  <td class="newLanduse"></td>
              </tr>`;
    //use`` to insert HTML elements straight from javascript, use ${} to input Javascript elements
  }

  const landuseTypesOptions = window.LLYFNILanduse.map((el, i) => {
    return `<option value=${el}></option>`;
  });

  table +=
    `<tr>
        <td>${'Change All'}</td>
        <td><input list="landuseTypes"  name="landuseTypes">
            <datalist id="landuseTypes">${landuseTypesOptions}
             </datalist>
         </td>
         <td><button class="lulc-editAll-button" data-hru=${data.hrus}> EDIT </button></td>
         <td class=allNewlanduse></td>
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
      // console.log(el.dataset.hru)
      const newLanduse = window.prompt(`Update Landuse for HRU: ${el.dataset.hru}`);
      console.log(newLanduse);
      //Adding LANDUSE changes to the table ----- need to look inot, only populates row 0----------
      document.getElementsByClassName("newLanduse")[i].innerHTML = `${newLanduse}`;
      // UPDATE THE DATASET
      window.LLYFNIData[el.dataset.hru - 1].lu_mgt = `${newLanduse.toLowerCase()}_lum`;
      console.log(window.LLYFNIData);

      console.log(convertToTSV(window.LLYFNIData));
    })
  })

  const lulcEditAllButton = document.querySelector(".lulc-editAll-button");

  lulcEditAllButton.addEventListener("click", () => {
    const allNewLanduse = window.prompt(`Update Landuse for HRUs: ${lulcEditAllButton.dataset.hru}`);
    document.querySelector(".allNewlanduse").innerHTML = `${allNewLanduse}`;

    // Converts a comma delimited string to an array of strings (ids).
    const hrusToUpdate = lulcEditAllButton.dataset.hru.split(",");
    //console.log(hrusToUpdate);


    hrusToUpdate.forEach((el, i, arr) => {
      window.LLYFNIData[parseInt(el) - 1].lu_mgt = `${allNewLanduse.toLowerCase()}_lum`
    });
    // console.log(window.LLYFNIData);
    const newHruData = convertToTSV(window.LLYFNIData);



    var fileName = 'hru-data.hru';
    var fileContent = newHruData;
    var myFile = new Blob([fileContent], { type: 'text/plain' });


    document.getElementById('download').setAttribute('href', window.URL.createObjectURL(myFile));
    document.getElementById('download').setAttribute('download', fileName);

  });



}







export default {
  populateTable,
  cleanHru,
  getHru,
  updateHru,
}