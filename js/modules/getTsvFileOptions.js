// CLEANS TSV INPUT FILES, ADDS NAMES TO SELECT LISTS AND DESCRIPTIONS TO TOOLTIPS
// getTsvFileOptions("scenario", "SWAT+ file name", "select list id")

import { cleanTsvSwatFiles } from "./cleanTsvSwatFiles.js";
import { getNames } from "./getNamesAndDescriptions.js";
import { getDescriptions } from "./getNamesAndDescriptions.js";
import { fetchData } from "./fetchData.js"

export async function getTsvFileOptions(scenario, file, id) {
    await fetchData(`/catchment/Scenarios/${scenario}/TxtInOut/${file}`)
      .then(async function (data) {
        const cleanData = cleanTsvSwatFiles(data);
        const names = await getNames(cleanData);
        const descriptions = await getDescriptions(cleanData)
        const descriptionOptions = descriptions.map((el, i) => {
          return `"${el}"`
        });
        const options = names.map((el, i) => {
          return `<option title=${descriptionOptions[i]} value=${el}>${el}</option>`;
        });
        document.getElementById(id).innerHTML = `<option disabled selected value>-- select -- </option>  ${options} <option title = "null"> null </option>`
      });
  }
  
  
  export default {
      getTsvFileOptions
  }