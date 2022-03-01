import api from "../api.js";

export async function getHruWbData(scenario) {
  await fetch(api.getHruWbData, {
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

export default getHruWbData;