import { updateTooltips } from "./updateTooltips.js";
import fetchData from "/js/modules/fetchData.js";
import { HOST } from "../main.js"
import { cleanTsvSwatFiles } from "./cleanTsvSwatFiles.js"
import { getNames } from "./getNamesAndDescriptions.js"



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



function getLanduseTooltip(data) {
  const landuses = data.map(record =>
    `Plant Community: ${record.plnt_com}
  Curve Number: ${record.cn2}
  Conservation Practice: ${record.cons_prac}
  Manning's n: ${record.ov_mann}`);
  // console.log(landuses);
  return landuses
}

export async function populateTable(data) {
  const landuseTypes = await getNames(window.catchmentLanduseEdit)
  const landuseTooltip = await getLanduseTooltip(window.catchmentLanduseEdit)
  const landuseTypesOptions = landuseTypes.map((el, i) => {
    return `<option title="${landuseTooltip[i]}" value=${el}>${el}</option>`;
  });

  const rowCount = data.hrus.length;

  // convert HRUS to integr to be passed by map
  const shpFileHrus = data.hrus.map(function (v) {
    return parseInt(v);
  })

  // map HRUs(from shapefile) to id's from window.catchmentData to display correct hru lu_mgt in table
  const hruLuSelection = shpFileHrus.map(shpHru => {

    const obj = window.catchmentData.find(record => record.id == shpHru);
    return { ...shpHru, ...obj };
  })


  let table = "";

  table +=
    `<tr class="hruSummary">
       <td > ${data.hrus.length} of ${window.catchmentData.length} selected</br>
       
      </td>
       <td> <button class="lulc-clear">CLEAR</button> <button class="lulc-editAll-button" data-hru=${data.hrus}> SAVE ALL </button></td>
       <td class="allNewlanduse">
       <select class="allLanduseTypes" id="allLanduseDatalist">
       <option selected="selected" disabled></option>
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
                  <td><span class="currentLu"> ${hruLuSelection[i].lu_mgt} </span> <button class="lulc-edit-button" data-hru=${data.hrus[i]}>Save</button>
                  </td>
                  <td class="newLanduse">
                  <select class ="landuseTypes" id="landuseDatalist">
                  <option selected="selected" disabled>
                        </option>
                  ${landuseTypesOptions}
                   </select></td>
              </tr>`;
  }

  document.getElementById("result").innerHTML = table;

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
    el.addEventListener("click", async () => {
      const landuseSelection = document.querySelectorAll(".landuseTypes");
      const newLanduse = landuseSelection[i].value;
      console.log(newLanduse)
      if (!newLanduse) {
        alert("Please select land use");
      }
      else {
        // UPDATE THE DATASET
        window.catchmentData[el.dataset.hru - 1].lu_mgt = `${newLanduse}`;

        //assinges the new land use selection to the 'current landuse' collumn
        const currentLu = document.querySelectorAll(".currentLu");
        currentLu[i].innerHTML = newLanduse


        // const newHruData = convertToTSV(window.catchmentData);
        await downloadButton(window.catchmentData, 'hru-data.hru');
        updateTooltips(window.catchmentData)
      }
    })
  })

  const lulcEditAllButton = document.querySelector(".lulc-editAll-button");

  lulcEditAllButton.addEventListener("click", async () => {
    const allLanduseSelection = document.querySelector(".allLanduseTypes");
    const allNewLanduse = allLanduseSelection.value;
    const allCurrentLu = document.querySelectorAll(".currentLu");
    if (!allNewLanduse) {
      alert("Please select land use");
    }
    else {

      //loops over all 'current landuse' feilds assigning the new selected laduse

      allCurrentLu.forEach((el, i) => {
        el.innerHTML = allNewLanduse
      })

      // Converts a comma delimited string to an array of strings (ids).
      const hrusToUpdate = lulcEditAllButton.dataset.hru.split(",");
 
      hrusToUpdate.forEach((el, i, arr) => {
        window.catchmentData[parseInt(el) - 1].lu_mgt = `${allNewLanduse}`

      });
     
      updateTooltips(window.catchmentData)
      await downloadButton(window.catchmentData, 'hru-data.hru');
      alert('New hru_data file writen')
    }
  });

  const lulcClearButton = document.querySelector(".lulc-clear");
  lulcClearButton.addEventListener('click', () => {
    document.getElementById("hruTable").style.display = "none";
  });

}


async function downloadButton(data, fileName) {
  // var myFile = new Blob([data], { type: 'text/plain' });
  // document.getElementById('download').setAttribute('href', window.URL.createObjectURL(myFile));
  // document.getElementById('download').setAttribute('download', fileName);
  // console.log(data);
  await fetch(`http://${HOST}:8000/sendhru`, {
    method: "POST", headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ hru: data, scenario: window.currentScenario })
  }).then(res => res.text()).then(data => console.log(data));

}



export default {
  populateTable,
  getHru,
  updateHru,
}

//HOW DATA SHOULD BE UPLOADED TO SERVER WITH GET REQUEST, NOT STRAIGHT FROM DISK LOCATION
//making function dynamic means that catchment Data is wread from the correct HRU each time
// export async function getHruData(scenario) {
//   console.log('getHRUData', scenario)
//   await fetchData(`/catchment/Scenarios/${scenario}/TxtInOut/hru-data.hru`)
//   // await fetch(`http://${HOST}:8000/gethru`, {
//   //   method: 'POST', headers: {
//   //     'Content-Type': 'application/json'
//   //   },
//   //   body: JSON.stringify({ scenario: window.currentScenario })
//   // })

//     .then(res => res.text()).then(data => {
//       console.log('Got HRU Data',data)
//       // console.log(`/catchment/Scenarios/${scenario}/TxtInOut/hru-data.hru`)
//       // Clean the dataset...
//       const cleanHruData = cleanHru(data);

//       // Saving a copy of the dataset

//       // Replace this with a state management solution
//       window.catchmentData = [...cleanHruData];
//       // console.log('chd', cleanHruData);
//       updateTooltips(cleanHruData, 'test')

//     });
// }