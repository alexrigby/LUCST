//OPENS PLANT FORM AND CREATES NEW PLANT COMMUNITY ADDED TO PLANT.INI WITH FORM INPUT DATA
import { HOST } from "../main.js";
import { getPlantComNames } from "./getNamesAndDescriptions.js"
import { openCloseForm } from "./openCloseForm.js";



//exported to main.js to make the plant form
export async function newPlantCommunityForm() {

  openCloseForm("openPlantForm", "plantForm","result","popUpClose")

  //defines all Plant form inputs as constants, adding default values to the input feilds
  const plantComName = document.getElementById("plantComName");
  const plantName = document.getElementById("plantNames");
  plantName.addEventListener('change', () => {
    plantComName.setAttribute('value', plantName.value + "_comm")
    //auto fills lu name with plant comm + _lum
    const luName = document.getElementById("luName")
    luName.setAttribute('value', plantName.value + "_lum")
  });
  // const plantCnt = document.getElementById("plt_cnt")
  // plantCnt.setAttribute('value', 1)
  const iniRotationYear = document.getElementById("rot_yr_ini")
  iniRotationYear.setAttribute('value', 1)
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
  //adds form values to object 'newPlantSelection' when 'make' is clicked
  newPlantTypeButton.addEventListener('click', async () => {
    const newPlantSelection = {
      pcom_name: plantComName.value,
      plt_cnt: 1,
      rot_yr_ini: iniRotationYear.value,
      plt_name: plantName.value,
      lc_status: landcoverStatus.value,
      lai_init: iniLai.value + '.00000',
      bm_init: iniBm.value + '.00000',
      phu_init: iniPhu.value + '.00000',
      plnt_pop: plantPopulation.value + '.00000',
      yrs_init: iniYrs.value + '.00000',
      rsd_init: iniRsd.value + '.00000'
    }

    // Makes sure all input feilds have values before the new plant type is saved to 'plant.ini'
    await validateForm()
    async function validateForm() {
      if (!iniRotationYear.value || !plantName.value || !landcoverStatus.value || !iniLai.value || !iniBm.value || !iniPhu.value || !iniYrs.value || !iniRsd.value || !plantPopulation.value) {
        alert("Please fill all the inputs")
      }
      else {
        //adds new plant community to the window plant comm file
        window.catchmentPlant.push(newPlantSelection)
        //sends catchmentPlant to server to be downloaded
        await sendPlantFile(window.catchmentPlant);
        alert('New plant comunity written: ' + plantName.value + "_comm")
      }
    }

    // gets the new plant community and adds it to plant cselect list in landuse form
    const pcomNames = getPlantComNames(window.catchmentPlant)
    document.getElementById("luPlantCom").innerHTML = `<option disabled selected value>-- select -- </option> ${pcomNames} <option title = "null"> null </option>`;
  });
}

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
  newPlantCommunityForm
}



// OLD DOWNLOAD BUTTON FUNCTION< DOWNLOADS PLAIN TEXT FLES TO 'DOWNLOADS' FOLDER
//  function downloadPlantButton(data, fileName) {
//   var myFile = new Blob([data], { type: 'text/plain' });
//   document.getElementById('downloadPlant').setAttribute('href', window.URL.createObjectURL(myFile));
//   document.getElementById('downloadPlant').setAttribute('download', fileName);
// }