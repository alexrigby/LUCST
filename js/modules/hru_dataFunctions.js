import { updateTooltips } from "/js/modules/mapFunctions.js";
import fetchData from "/js/modules/universalFunctions.js";
import { HOST } from "../main.js"

export async function getHruData(scenario) {
  await fetchData(`/catchment/Scenarios/${scenario}/TxtInOut/hru-data.hru`)
    .then(async data => {


      // Clean the dataset...
      const cleanHruData = cleanHru(data);

      // Saving a copy of the dataset

      // Replace this with a state management solution
      window.catchmentData = [...cleanHruData];
      // console.log('chd', cleanHruData);
      updateTooltips(cleanHruData)
      // console.log(window.catchmentData)
    });
}


export function cleanHru(data) {
  //checks to see if the SWAT+ editor header line is on file (has word "written") 
  //if true deletes first line, if not neeps first line
  if (hasWord(data, "written") === true) {
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
    const clean = d3.tsvParse(data
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


export function getHru(data, id) {
  const filteredData = data.filter(record => record.id == id);
  return filteredData[0].lu_mgt
}


export function updateHru(data, id, lu_mgt) {
  const newData = [...data];
  newData[id - 1] = {
    ...newData[id - 1],
    lu_mgt
  }
  return newData;
}

export async function getUrbanList(scenario) {
  //gets the urban landuse
  await fetchData(`/catchment/Scenarios/${scenario}/TxtInOut/urban.urb`)
    .then(async function (data) {
      const cleanUrban = cleanPlants(data);
      const urbanNames = await getPlantOptions(cleanUrban);
      const urbanDescription = await getPlantDescriptions(cleanUrban)
      const urbanDOptions = urbanDescription.map((el, i) => {
        return `${el}`
      });
      const urbanOptions = urbanNames.map((el, i) => {
        return `<option data-toggle="tooltip" title="${urbanDOptions[i]}"> ${el + '_comm'}</option>`;
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
    `Plant Community: ${record.plnt_com}
  Curve Number: ${record.cn2}
  Conservation Practice: ${record.cons_prac}
  Manning's n: ${record.ov_mann}`);
  // console.log(landuses);
  return landuses
}

export async function populateTable(data) {
  const landuseTypes = await getLanduseTypes(window.catchmentLanduseEdit)
  const landuseTooltip = await getLanduseTooltip(window.catchmentLanduseEdit)


  //  const hruData = window.catchmentData
  // console.log(hruData)
  const landuseTypesOptions = landuseTypes.map((el, i) => {
    return `<option title="${landuseTooltip[i]}" value=${el}>${el}</option>`;
  });


  const rowCount = data.hrus.length;

  // convert HRUS to integr to be passed by map
  const shpFileHrus = data.hrus.map(function (v) {
    return parseInt(v);
  })

  //  console.log(window.catchmentData)
  // map HRUs(from shapefile) to id's from window.catchmentData to display correct hru lu_mgt in table
  const hruLuSelection = shpFileHrus.map(shpHru => {

    const obj = window.catchmentData.find(record => record.id == shpHru);
    return { ...shpHru, ...obj };
  })
  console.log(hruLuSelection)

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
    //use`` to insert HTML elements straight from javascript, use ${} to input Javascript elements
  }





  // console.log(document.getElementsByClassName("hruSummary"))
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
      //console.log(hrusToUpdate);


      hrusToUpdate.forEach((el, i, arr) => {
        window.catchmentData[parseInt(el) - 1].lu_mgt = `${allNewLanduse}`

      });

      updateTooltips(window.catchmentData)
      // const newHruData = convertToTSV(window.catchmentData);

      // downloadButton(newHruData, 'hru-data.hru');
      await downloadButton(window.catchmentData, 'hru-data.hru');
      alert('New hru_data file writen')
    }
  });

  const lulcClearButton = document.querySelector(".lulc-clear");
  lulcClearButton.addEventListener('click', () => {
    document.getElementById("hruTable").style.display = "none";
  });

}


async function downloadButton(data) {
  await fetch(`http://${HOST}:8000/sendhru`, {
    method: "POST", headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ hru: data, scenario: window.currentScenario })
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