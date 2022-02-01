


function openPlantForm() {
    document.getElementById("plantForm").style.display = "block";
    document.getElementById("result").innerHTML = "";
    document.getElementById("hruTable").style.display = "none";
}

function openLuForm() {
    document.getElementById("luForm").style.display = "block";
    document.getElementById("result").innerHTML = "";
    document.getElementById("hruTable").style.display = "none";
}

function closeLuForm() {
    document.getElementById("luForm").style.display = "none";
}
function closePlantForm() {
    document.getElementById("plantForm").style.display = "none";
}

//when Default is selected there is no lasso tools available
export function lassoSelectionControl(scenario) {
    if (scenario === "Default") {
        document.getElementById("lassoControls").style.display = "none";
        document.getElementById("lassoButtonControl").style.display = "none";

        document.getElementById("openPlantForm").onclick = closePlantForm;
        document.getElementById("openLuForm").onclick = closeLuForm;
        //when default scenario is selected no table is shown
        document.getElementById("hruTable").style.display = "none";

    }
    else {
        document.getElementById("lassoControls").style.display = "block";
        document.getElementById("lassoButtonControl").style.display = "block";
        document.getElementById("openPlantForm").onclick = openPlantForm;
        document.getElementById("openLuForm").onclick = openLuForm;
        // document.getElementById("hruTable").style.display = "block";
    }
}


export default {
    lassoSelectionControl
}
