//NEED TO WORK OUT HOW TO RETURN THE RESPONSE FROM THE THEN FUNCTION

import api from "../api.js";

export async function getChannelData(scenario) {
  await fetch(api.getChannelData, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ scenario }),
  })
    .then((res) => res.text())
    .then((data) => {
      const resText = [...data];
      return resText;
    })
}

export default getChannelData;