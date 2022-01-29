import { getPlantComNames } from "./getNamesAndDescriptions.js";

//opens and closes plant and landuse forms
export function openCloseForm(openId, formId, hideId, closeId) {
    //when landuse form button is clicked.............
    document.getElementById(openId).addEventListener("click", async () => {
        //display land use form and....
        document.getElementById(formId).style.display = "block";
        //hide land use chnage table and .....
        document.getElementById(hideId).innerHTML = "";
        //get plant community names and ads them to the plant community select list on the landuse form
        const pcomOptions = await getPlantComNames(window.catchmentPlant)
        document.getElementById("luPlantCom").innerHTML = `<option disabled selected value>-- select -- </option> ${pcomOptions} <option title = "null"> null </option>`;
    })
    //when the map is cliscked form closes
    document.getElementById(closeId).onclick = closeLuForm;
    function closeLuForm() {
        document.getElementById(formId).style.display = "none";
    }
}


export default {
    openCloseForm
}