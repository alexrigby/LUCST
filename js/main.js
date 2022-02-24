import { newPlantCommunityForm } from "/js/modules/newPlantCommunityForm.js";
import { hydrograph } from "/js/modules/hydrograph.js";
import { choropleth } from "/js/modules/choropleth.js";
import { getTsvFileOptions } from "./modules/getTsvFileOptions.js";
import {
  getInputFileData,
  getLanduseData,
} from "./modules/getInputFileData.js";
import { newLanduseForm } from "./modules/NewLandUseForm.js";
import { updateCurrentScenario } from "./modules/updateCurentScenario.js";
import { scenarioOptions } from "./modules/sceanrioOptions.js";
import { defaultChannelData } from "./modules/defaultChannelData.js";
import { generateMap } from "./modules/generateMap.js";
import { lassoSelectionControl } from "./modules/lassoControl.js";
import { createNewScenarioButton } from "./modules/createNewScenarioButton.js";

const dev = new URL(window.location).searchParams.get("dev") === "1";
// export const HOST = dev ? "localhost" : "5.67.118.6";
export const HOST = "localhost";
//run for dev with ?dev=1
//if ipv4 chnage change value


export async function getHruData(scenario) {
  console.log('getHRUData', scenario)
  // await fetchData(`/catchment/Scenarios/${scenario}/TxtInOut/hru-data.hru`)
  // const test = await fetch(`http://${HOST}:8000/test`).then(res => res.text()).then(data => console.log(data))
   await fetch(`http://${HOST}:8000/getHRUData`).then(res => res.text()).then(data => console.log(data))
//  return await fetch(`http://${HOST}:8000/getHRUData`, {
//     method: 'POST', headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ scenario: window.currentScenario })
//   }).then(res => res.json()).then(data => data)

}



// Has the page loaded fully yet?
window.init = false;

await defaultChannelData();
await scenarioOptions();
const hrudata = await getHruData('Default')
console.log(hrudata)
await getInputFileData("Default");
await getLanduseData("Default");
await choropleth("Default");
await getTsvFileOptions("Default", "plants.plt", "plantNames");
await getTsvFileOptions("Default", "grassedww.str", "grww");
await getTsvFileOptions("Default", "urban.urb", "urbanLUList");
await getTsvFileOptions("Default", "ovn_table.lum", "manN");
await getTsvFileOptions("Default", "cons_practice.lum", "cons");
await getTsvFileOptions("Default", "cntable.lum", "cn2Options");
await getTsvFileOptions("Default", "tiledrain.str", "tile");
await getTsvFileOptions("Default", "septic.str", "sep");
await getTsvFileOptions("Default", "filterstrip.str", "vfs");
await hydrograph("Default");
await generateMap();
await newPlantCommunityForm();
await newLanduseForm();
updateCurrentScenario("Default");
lassoSelectionControl("Default");
createNewScenarioButton();
