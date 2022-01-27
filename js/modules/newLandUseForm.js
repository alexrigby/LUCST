//SAVES NEW LAND USE TO LANDUSE.LUM FROM INPUT FORM DATA


import { HOST } from "../main.js";
import { getPlantComNames } from "./getNamesAndDescriptions.js";


//exported to main.js to make the landuseform
export async function newLanduseForm() {

  //makes luForm popup by pressing button and updates plant selection, close by clicking on body
  document.getElementById("openLuForm").addEventListener("click", async () => {
   
    document.getElementById("luForm").style.display = "block";
    document.getElementById("result").innerHTML = "";

    const pcomOptions = await getPlantComNames(window.catchmentPlant)
    document.getElementById("luPlantCom").innerHTML = `<option disabled selected value>-- select -- </option> ${pcomOptions} <option title = "null"> null </option>`;
  })
  document.getElementById("popupClose").onclick = closeLuForm;
  function closeLuForm() {
    document.getElementById("luForm").style.display = "none";
  }

  //declaring form elements as onsctants, adding default values
  const newLuButton = document.getElementById("newLuButton");

  const luName = document.getElementById("luName");
  const luCalGroup = document.getElementById("calGroup")
  luCalGroup.setAttribute('value', 'null')
  const plantCom = document.getElementById("luPlantCom")
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
  const luMgt = document.getElementById("luMgt")
  luMgt.setAttribute('value', 'null')
  const cn2 = document.getElementById("cn2Options")
  const consPractice = document.getElementById("cons")
  // consPractice.setAttribute('value', 'up_down_slope')
  const urban = document.getElementById("urbanLUList")
  //stops a plant community being picked if urban landuse is chosen 
  urban.addEventListener("change", async () => {
    if (urban.value !== "null") {
      document.getElementById("luPlantCom").innerHTML = `<option title="null" value="null" selected> null </option>`
      luName.value = urban.value.substring(0, 4) + '_lum';
    } else {
      document.getElementById("luPlantCom").innerHTML = `<option disabled selected value>-- select -- </option>  ${await getPlantComNames(window.catchmentPlant)} <option title = "null"> null </option>`
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

    await validateForm()

    async function validateForm() {
      if (!luName.value || !luCalGroup.value || !plantCom.value || !luMgt.value || !cn2.value || !consPractice.value || !urban.value || !urbRo.value || !ovMann.value || !tile.value || !sep.value || !vfs.value || !grww.value || !bmp.value) {
        alert("Please fill all the inputs");
      }
      else {
        window.catchmentLanduseEdit.push(newLu)
        await sendLanduseFile(window.catchmentLanduseEdit);
        alert('New land use written: ' + luName.value)
      }
    }

  })
}


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

