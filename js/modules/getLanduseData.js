import { cleanTsvSwatFiles } from "./cleanTsvSwatFiles.js";
import api from "../api.js";

export async function getLanduseData(scenario) {
  await fetch(api.getLanduseData, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ scenario }),
  })
    .then((res) => res.text())
    .then((data) => {
      const cleanLanduseData = cleanTsvSwatFiles(data);
      window.catchmentLanduseEdit = [...cleanLanduseData];
    });
}




export default getLanduseData;