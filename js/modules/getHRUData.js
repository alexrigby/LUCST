import { cleanTsvSwatFiles } from "./cleanTsvSwatFiles.js";
import { updateTooltips } from "./updateTooltips.js";
import api from "../api.js";

export async function getHRUData(scenario) {
  await fetch(api.getHRUData, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ scenario }),
  })
    .then((res) => res.text())
    .then((data) => {
      const cleanHruData = cleanTsvSwatFiles(data);
      window.catchmentData = [...cleanHruData];
      updateTooltips(cleanHruData);
    });
}

export default getHRUData;
