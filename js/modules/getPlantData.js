import { fetchData } from "./fetchData.js";
import { cleanPlantIni } from "./cleanPlantIni.js";


export async function getPlantData(scenario) {
  await fetchData(`/catchment/Scenarios/${scenario}/TxtInOut/plant.ini`)
    .then(data => {
      const cleanPlantData = cleanPlantIni(data);

      window.catchmentPlant = [...cleanPlantData];
      // console.log(cleanPlantData)

    });
}

export default {
  getPlantData
}