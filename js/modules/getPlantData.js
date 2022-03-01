import api from "../api.js";
import { cleanPlantIni } from "./cleanPlantIni.js";

export async function getPlantData(scenario) {
  await fetch(api.getPlantData, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ scenario }),
  })
    .then((res) => res.text())
    .then((data) => {
      const cleanPlantData = cleanPlantIni(data);
      window.catchmentPlant = [...cleanPlantData];
    });
}

// export async function getInputFileData(scenario) {
//     await fetchData(`/catchment/Scenarios/${scenario}/TxtInOut/plant.ini`).then(
//       (data) => {
//         const cleanPlantData = cleanPlantIni(data);
//         window.catchmentPlant = [...cleanPlantData];
//       }
//     );
//   }


export default getPlantData;