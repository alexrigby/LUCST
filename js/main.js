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

// TODO:
// Replace all occurences of HOST with an import from api.
import { HOST as _HOST } from "./api.js";
export const HOST = _HOST;

// FIXME:
// Update host based on dev query string as below.
// const dev = new URL(window.location).searchParams.get("dev") === "1";

// Has the page loaded fully yet?
window.init = false;

await defaultChannelData();
await scenarioOptions();
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
