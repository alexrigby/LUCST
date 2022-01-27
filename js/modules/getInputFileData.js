import { fetchData } from "./fetchData.js";
import { cleanPlantIni } from "./cleanPlantIni.js";
import { cleanTsvSwatFiles } from "./cleanTsvSwatFiles.js";
import { updateTooltips } from "./updateTooltips.js";


export async function getInputFileData(scenario) {
  await fetchData(`/catchment/Scenarios/${scenario}/TxtInOut/plant.ini`)
    .then(data => {
      const cleanPlantData = cleanPlantIni(data);
      window.catchmentPlant = [...cleanPlantData];
    });
}

export async function getLanduseData(scenario) {
  await fetchData(`/catchment/Scenarios/${scenario}/TxtInOut/landuse.lum`)
    .then(async data => {
      const cleanLanduseData = cleanTsvSwatFiles(data);
      window.catchmentLanduseEdit = [...cleanLanduseData];
    });
}

export async function getHruData(scenario) {
  await fetchData(`/catchment/Scenarios/${scenario}/TxtInOut/hru-data.hru`)
    .then(async data => {
      const cleanHruData = cleanTsvSwatFiles(data);
      window.catchmentData = [...cleanHruData];
      updateTooltips(cleanHruData)
    });
}


// export async function getLanduseData(scenario, file, cleaner, windowName) {
//   await fetchData(`/catchment/Scenarios/${scenario}/TxtInOut/${file}`)
//     .then(async data => {
//       const cleanLanduseData = cleaner(data);
//       windowName = [...cleanLanduseData];
//     });
// }

export default {
  getInputFileData,
  getLanduseData, 
  getHruData
}

