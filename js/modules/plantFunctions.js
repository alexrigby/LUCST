import fetchData from "/js/modules/universalFunctions.js";
import { HOST } from "../main.js"


export async function getPlantData(scenario) {
  await fetchData(`/catchment/Scenarios/${scenario}/TxtInOut/plant.ini`)
    .then(data => {
      const cleanPlantData = cleanPlant(data);

      window.catchmentPlant = [...cleanPlantData];
      // console.log(cleanPlantData)

    });
}


// Return an object array from cleaned TSV data with D3.tsvParse
export function cleanPlants(data) {
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


// import * as d3 from "d3";
// import d3 from "d3";
// plant.ini//


//checks for word in string 
const hasWord = (str, word) =>
  str.split(/\s+/).includes(word);


// Return an object array from cleaned TSV data with D3.tsvParse for plant.ini
export function cleanPlant(data) {
  if (hasWord(data, "SWAT+") == true) {
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
  } else {
    const clean = d3.tsvParse(data
      // First, remove all spaces and replace with tabs
      .replace(/  +/gm, '\t')
      // Then remove all leading and trailing tabs
      .replace(/^\t|\t$/gm, ''),

    );

    return clean

  }


}


export function getPlantOptions(data) {
  const plants = data.map(record => record.name);
  // console.log(landuses);
  return plants
}



function getPlantDescriptions(data) {
  const plants = data.map(record => record.description);
  // console.log(landuses);
  return plants
}

export async function getSwatPlantList(scenario) {
  // auto fill name datalist from plants.plt, add _comm to planr name
  await fetchData(`/catchment/Scenarios/${scenario}/TxtInOut/plants.plt`)
    .then(async function (data) {
      const cleanPlantTypes = cleanPlants(data);
      //gets the plant type names from plants.plt
      const plantTypeNames = await getPlantOptions(cleanPlantTypes);
      //gets the plant descriptions from plant.plt
      const plantDescriptions = await getPlantDescriptions(cleanPlantTypes)
      //returns the plant descriptions as a tooltip
      const plantDOptions = plantDescriptions.map((el, i) => {
        return `${el}`
      });

      window.plantDescriptions = [...plantDOptions]
      //maps the plant names and assignes each to an option value for the datalist
      const plantOptions = plantTypeNames.map((el, i) => {
        return `<option data-toggle="tooltip" title="${plantDOptions[i]}">${el}</option>`;

      });
      document.getElementById("plantNames").innerHTML = `<option disabled selected value>-- select --</option> ${plantOptions}`
      document.getElementById("luPlantCom").innerHTML = `<option disabled selected value>-- select --</option> ${plantOptions}`
    });
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


function getPlantComTypes(data) {
  const plantCom = data.map(record => record.pcom_name);
  return plantCom
}

//exported to main.js to make the plant form
export async function newPlantType() {

  //creats pop up plant form, open with button, close with click on Body
  document.getElementById("openPlantForm").onclick = openPlantForm;
  document.getElementById("popUpClose").onmousedown = closePlantForm;
  function openPlantForm() {
    document.getElementById("plantForm").style.display = "block";
    document.getElementById("result").innerHTML = "";
  }
  function closePlantForm() {
    document.getElementById("plantForm").style.display = "none";
  }


  // const plantsOptionsList = getPlantOptions(window.PLANToptions);
  // console.log(plantsOptionsList)
  // const plantOptions = plantsOptionsList.map((el, i) => {
  //   return `<option value=${el}></option>`;
  // });
  // document.getElementById("plantNames").innerHTML = `${plantOptions}`


 const plantComName = document.getElementById("plantComName");


  //defines all Plant form inputs as constants, adding default values to the input feilds
  const plantName = document.getElementById("plantNames");
  plantName.addEventListener('change', () => {
    // const plantComNameSlice = plantComName.value
   plantComName.setAttribute('value', plantName.value + "_comm")
    //  plantName.setAttribute('value', plantComNameSlice)
    //auto fills lu name with plant comm + _lum
    const luName = document.getElementById("luName")
    luName.setAttribute('value', plantName.value + "_lum")
    // const LuPlantCom = document.getElementById("luPlantCom")
    // LuPlantCom.setAttribute('value', plantComName)
  });
  // const plantCnt = document.getElementById("plt_cnt")
  // plantCnt.setAttribute('value', 1)
  const iniRotationYear = document.getElementById("rot_yr_ini")
  iniRotationYear.setAttribute('value', 1)
  // const plantName = document.getElementById("plt_name")
  //cuts '_comm' of the ed of plantComName and asignes the string as plantName


  const landcoverStatus = document.getElementById("lc_status")
  const iniLai = document.getElementById("lai_init")
  iniLai.setAttribute('value', 0)

  //makes usre if there is no landcover there is no initial leaf area index
  landcoverStatus.addEventListener('change', () => {
    if (landcoverStatus.value !== "y") {
      iniLai.setAttribute('value', 0)
      iniLai.setAttribute('min', 0)
      iniLai.setAttribute('max', 0)


    } else {
      iniLai.setAttribute('max', 300)
      iniLai.setAttribute('min', 1)
      iniLai.setAttribute('value', 1)

    }
  })
  document.getElementById("openPlantForm").addEventListener('click', () => {
    if (landcoverStatus.value !== "y") {
      iniLai.setAttribute('value', 0)
      iniLai.setAttribute('min', 0)
      iniLai.setAttribute('max', 0)
    } else {
      iniLai.setAttribute('max', 300)
      iniLai.setAttribute('min', 1)
      iniLai.setAttribute('value', 1)
    }
  })
  const iniBm = document.getElementById("bm_init")
  iniBm.setAttribute('value', 20000)
  const iniPhu = document.getElementById("phu_init")
  iniPhu.setAttribute('value', 0)
  const plantPopulation = document.getElementById("plantPop")
  plantPopulation.setAttribute('value', 1)
  const iniYrs = document.getElementById("yrs_init")
  iniYrs.setAttribute('value', 0)
  const iniRsd = document.getElementById("rsd_init")
  iniRsd.setAttribute('value', 10000)
  iniRsd.setAttribute('step', 10000)

  const newPlantTypeButton = document.getElementById("newPlantButton")
  //adds input values to new object when button is clicked
  newPlantTypeButton.addEventListener('click', async () => {
    const newPlantSelection = new Object();
    newPlantSelection.pcom_name = plantComName.value;
    newPlantSelection.plt_cnt = 1
    newPlantSelection.rot_yr_ini = iniRotationYear.value;
    newPlantSelection.plt_name = plantName.value;
    newPlantSelection.lc_status = landcoverStatus.value;
    newPlantSelection.lai_init = iniLai.value + '.00000';
    newPlantSelection.bm_init = iniBm.value + '.00000';
    newPlantSelection.phu_init = iniPhu.value + '.00000';
    newPlantSelection.plnt_pop = plantPopulation.value + '.00000';
    newPlantSelection.yrs_init = iniYrs.value + '.00000';
    newPlantSelection.rsd_init = iniRsd.value + '.00000';
    // console.log(plantPopulation.value)
    // DO IT LIKE THIS!
    // const newPlantSelection = {
    //   pcom_name: plantComName.value,
    //   plt_cnt: plantCnt.value,
    //   ...
    // }



    // console.log(newPlantSelection)
    //adds form data to plant.ini file


   await validateForm()
   async function validateForm() {

      // var form = document.getElementById("plantForm")
      // var inputs = form.getElementsByTagName("input") 
      // var selects = document.getElementById("plantNames")

      // console.log(selects)

      if (!iniRotationYear.value || !plantName.value || !landcoverStatus.value || !iniLai.value || !iniBm.value || !iniPhu.value || !iniYrs.value || !iniRsd.value || !plantPopulation.value) {
        alert("Please fill all the inputs")
      }
      else {
        window.catchmentPlant.push(newPlantSelection)
        //converts file and links to download button 
        // const newPlantTypeFile = convertToTSV(window.catchmentPlant)
        // downloadPlantButton(newPlantTypeFile, "plant.ini")
        await sendPlantFile(window.catchmentPlant);
        // DO SOME STUFF WITH THE RESPONSE.


        alert('New plant comunity written: ' + plantName.value + "_comm")
      }
    }

    const pcomOptions = getPlantComTypes(window.catchmentPlant)

    const pcomTypesOptions = pcomOptions.map((el, i) => {
      return `<option data-toggle="tooltip" value=${el}>${el}</option>`;
    });
    document.getElementById("luPlantCom").innerHTML = `<option disabled selected value>-- select -- </option> ${pcomTypesOptions} <option title = "null"> null </option>`;






  });
}







//  function downloadPlantButton(data, fileName) {
//   var myFile = new Blob([data], { type: 'text/plain' });
//   document.getElementById('downloadPlant').setAttribute('href', window.URL.createObjectURL(myFile));
//   document.getElementById('downloadPlant').setAttribute('download', fileName);
// }

async function sendPlantFile(data) {
  await fetch(`http://${HOST}:8000/sendplant`, {
    method: "POST", headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ plant: data, scenario: window.currentScenario })
  }).then(res => res.text()).then(data => console.log(data));
}


//exports functions 
export default {
  newPlantType,
  cleanPlant,
  getPlantOptions,
  getSwatPlantList,

  getPlantData,
}

