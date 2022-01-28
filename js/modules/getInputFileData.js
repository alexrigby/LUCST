
import { fetchData } from "./fetchData.js";
import { cleanPlantIni } from "./cleanPlantIni.js";
import { cleanTsvSwatFiles } from "./cleanTsvSwatFiles.js";
import { updateTooltips } from "./updateTooltips.js";

//GETS PLANT.INI, CLEANS DATA AND MAKES WINDOW OBJECT
export async function getInputFileData(scenario) {
  await fetchData(`/catchment/Scenarios/${scenario}/TxtInOut/plant.ini`)
    .then(data => {
      const cleanPlantData = cleanPlantIni(data);
      window.catchmentPlant = [...cleanPlantData];
    });
}

//GETS LANDUSE.LUM, CLEANS DATA AND MAKES WINDOW OBJECT
export async function getLanduseData(scenario) {
  await fetchData(`/catchment/Scenarios/${scenario}/TxtInOut/landuse.lum`)
    .then(async data => {
      const cleanLanduseData = cleanTsvSwatFiles(data);
      window.catchmentLanduseEdit = [...cleanLanduseData];
    });
}

//GETS HRU-DATA.HRU, CLEANS DATA, MAKES WINDOW OBJECT AND UPDATES TOOLTIPS ON THE MAP
export async function getHruData(scenario) {
  await fetchData(`/catchment/Scenarios/${scenario}/TxtInOut/hru-data.hru`)
    .then(async data => {
      const cleanHruData = cleanTsvSwatFiles(data);
      window.catchmentData = [...cleanHruData];
      updateTooltips(cleanHruData)
    });
}


//ATEMPT TO CONBINE FUNCTIONS, BUT WONT ACCEPT WINDOW AS ARGUMENT FOR FUNCTION............... REVISIT
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

