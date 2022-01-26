//CHECK IF CAN BE DITCHED AND USE GETtSVfILEoPTIONS INSTEAD



import { fetchData } from "./fetchData.js"
import { cleanTsvSwatFiles } from "./cleanTsvSwatFiles.js"
import { getDescriptions } from "./getNamesAndDescriptions.js";

export function getPlantOptions(data) {
  const plants = data.map(record => record.name);
  // console.log(landuses);
  return plants
}


export async function getSwatPlantList(scenario) {
  // auto fill name datalist from plants.plt, add _comm to planr name
  await fetchData(`/catchment/Scenarios/${scenario}/TxtInOut/plants.plt`)
    .then(async function (data) {
      const cleanPlantTypes = cleanTsvSwatFiles(data);
      //gets the plant type names from plants.plt
      const plantTypeNames = await getPlantOptions(cleanPlantTypes);
      //gets the plant descriptions from plant.plt
      const plantDescriptions = await getDescriptions(cleanPlantTypes)
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

export default {
  getSwatPlantList, 
  getPlantOptions
}
