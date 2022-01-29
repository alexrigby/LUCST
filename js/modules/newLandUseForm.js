//SAVES NEW LAND USE TO LANDUSE.LUM FROM INPUT FORM DATA
import { HOST } from "../main.js";
import { getPlantComNames } from "./getNamesAndDescriptions.js";
import { openCloseForm } from "./openCloseForm.js";
 

//exported to main.js to make the landuseform
export async function newLanduseForm() {
  openCloseForm("openLuForm", "luForm","result","popupClose")

  // asigning form inpupt feilds by id to constants
  const newLuButton = document.getElementById("newLuButton");
  const luName = document.getElementById("luName");
  const luCalGroup = document.getElementById("calGroup")
  const plantCom = document.getElementById("luPlantCom")
  const luMgt = document.getElementById("luMgt")
  const cn2 = document.getElementById("cn2Options")
  const consPractice = document.getElementById("cons")
  const urban = document.getElementById("urbanLUList")
  const urbRo = document.getElementById("urbRo")
  const ovMann = document.getElementById("manN")
  const tile = document.getElementById("tile")
  const sep = document.getElementById("sep")
  const vfs = document.getElementById("vfs")
  const grww = document.getElementById("grww")
  const bmp = document.getElementById("bmp")

  //adding default values to some of the input feilds
  luCalGroup.setAttribute('value', 'null')
  luMgt.setAttribute('value', 'null')
  bmp.setAttribute('value', 'null')

  //if the plant community is selected then the Urban and Urban washoff are set to null. 
  plantCom.addEventListener("change", async () => {
    if (plantCom.value !== "null") {
      document.getElementById("urbanLUList").innerHTML = `<option title="null" value="null" selected> null </option>`
      document.getElementById("urbRo").innerHTML = `<option title="null" value="null" selected> null </option>`
      // document.getElementById("urbanLU").style.background = "light-gray"
      luName.value = plantCom.value.substr(0, plantCom.value.length - 5) + "_lum";
    } else {
      await getUrbanList(window.currentScenario)
      document.getElementById("urbRo").innerHTML = `<option disabled selected value>-- select -- </option> 
      <option value="buildup_washoff">buildup_washoff</option>
      <option value="usgs_reg">usgs_reg</option>
      <option value="null">null</option>`
    }
  })

  //if the urban and urban washoff are selcted the plant community is set to null
  urban.addEventListener("change", async () => {
    if (urban.value !== "null") {
      document.getElementById("luPlantCom").innerHTML = `<option title="null" value="null" selected> null </option>`
      luName.value = urban.value.substring(0, 4) + '_lum';
    } else {
      document.getElementById("luPlantCom").innerHTML = `<option disabled selected value>-- select -- </option>  ${await getPlantComNames(window.catchmentPlant)} <option title = "null"> null </option>`
    }
  })


  //onclick of 'make' makes new landuse file, add all the input feild values to a new array
  newLuButton.addEventListener('click', async () => {
    //new landuse object
    const newLu = {
      name: luName.value,
      cal_group: luCalGroup.value,
      plnt_com: plantCom.value,
      mgt: luMgt.value,
      cn2: cn2.value,
      cons_prac: consPractice.value,
      urban: urban.value,
      urb_ro: urbRo.value,
      ov_mann: ovMann.value,
      tile: tile.value,
      sep: sep.value,
      vfs: vfs.value,
      grww: grww.value,
      bmp: bmp.value
    }

    //if an of the feilds have no value then the new file will not be written.
    await validateForm()
    async function validateForm() {
      if (!luName.value || !luCalGroup.value || !plantCom.value || !luMgt.value || !cn2.value || !consPractice.value || !urban.value || !urbRo.value || !ovMann.value || !tile.value || !sep.value || !vfs.value || !grww.value || !bmp.value) {
        alert("Please fill all the inputs");
      }
      //if all feilds have a value the form is written
      else {
        window.catchmentLanduseEdit.push(newLu)
        await sendLanduseFile(window.catchmentLanduseEdit);
        alert('New land use written: ' + luName.value)
      }
    }

  })
}

//Sends new landuse file to the server
async function sendLanduseFile(data) {
  await fetch(`http://${HOST}:8000/sendlum`, {
    method: "POST", headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ lum: data, scenario: window.currentScenario })
  }).then(res => res.text()).then(data => console.log(data));
}


//exports functions
export default {
  newLanduseForm,
}

