import { HOST } from "../main.js";
import { scenarioOptions } from "./sceanrioOptions.js";

export function createNewScenarioButton(){
const createNewScenarioButton = document.getElementById("createNewScenario");
createNewScenarioButton.addEventListener("click", async function (e) {
    // console.log(window.currentScenarioVersion)
    e.preventDefault();
    let newScenarioVersion = window.currentScenarioVersion;
    console.log(newScenarioVersion)
    let newScenario = prompt("Enter name of new scenario", "Scenario " + `${newScenarioVersion}`);

    // Escape hatch
    if (newScenario === null) return;

    let scenarioList = null;
    let scenarioExists = false;
    await fetch(`http://${HOST}:8000/getscenarios`)
        .then(response => response.json())
        .then(data => {
            scenarioList = data;
            window.currentScenarioVersion = data.length;
        });
    if (newScenario === "Default") {
        console.error("New scenario cannot be 'Default'");
        window.alert("New scenario cannot be 'Default'");
    } else {
        if (scenarioList !== null && scenarioList !== undefined && typeof scenarioList === 'object') {
            scenarioList.forEach((el, i, arr) => {
                if (newScenario === el) {
                    scenarioExists = true;
                }
            });
            if (scenarioExists === false) {
                await fetch(`http://${HOST}:8000/createScenario?scenario=${newScenario}`)
                    .then(res => res.json())
                    .then(async data => {
                        if (data.code === 1) {
                            await scenarioOptions();
                            document.querySelector(`[data-scenario="${newScenario}"]`).click();
                        } else {
                            console.error(`Could not create new scenario: Err ${data.code}, ${data?.message}`);
                            window.alert(`Could not create new scenario: Err ${data.code}, ${data?.message}`);
                        }
                    });
                // updateCurrentScenario(newScenario);
                window.currentScenario = newScenario;
            } else {
                console.error(`Scenario with name ${newScenario} already exists`);
                window.alert(`Scenario with name ${newScenario} already exists`);
            }
        } else {
            console.error("Could not fetch Scenario List");
            throw new Error("Could not fetch scenario list");
        }
    }

})
}; 


export default { 
    createNewScenarioButton
}