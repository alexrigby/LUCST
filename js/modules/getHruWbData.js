import api from "../api.js";

export async function getHruWbData(scenario) {
 return await fetch(api.getHruWbData, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ scenario }),
  })
    .then((res) => res.text())
}

export default getHruWbData;