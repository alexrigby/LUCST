//UPDATES ALL DATA TO THAT OF THE SELECTED SCENARIO IN THE SCENARIO TAB
import { choropleth } from "/js/modules/choropleth.js";
import { HOST } from "../main.js";
import { getTsvFileOptions } from "./getTsvFileOptions.js";
import { getHRUData } from "./getHRUData.js";
import { updateCurrentScenario } from "./updateCurentScenario.js";
import { hydrograph } from "./hydrograph.js";
import { lassoSelectionControl } from "./lassoControl.js";
import { getLanduseData } from "./getLanduseData.js";
import { getPlantData } from "./getPlantData.js";
import api from "../api.js";

export async function scenarioOptions() {
  await fetch(api.getScenarios)
    // sends list of scenarios as JSON
    .then((response) => response.json())
    //uses the JSON of scenarios to do stuff.....
    .then((data) => {
      console.log(data)
      //find number of scenarios
      const scenarioCount = data.length;
      window.currentScenarioVersion = scenarioCount;

      //loops over the scenario names asigning new button for each name
      //calls variable i assignes index 0 to it, button count has to be grater than i, increment i by 1 each time
      document.getElementById("scenarioTab").innerHTML = "";
      for (let i = 0; i < scenarioCount; i++) {
        let button = document.createElement("button");
        button.classList.add("tablinks");
        button.innerHTML = data[i];
        button.dataset.scenario = data[i];

        // Tab button event (click)
        button.addEventListener("click", async () => {
          //clears the current HRU selection
          document.getElementById("hruTable").style.display = "none";
          // adding class to vis box for loading screen
          document.querySelector("#vis").innerHTML = `<div class="swatrunning"> 
            <div class="swatloadingspinner"></div>
           </div>`;
          document.querySelector("#choro").classList.add("choroHide");

          //data = all scenarios, data[i] is the current scenario
          //activates the selected scenario
          updateCurrentScenario(data[i]);

          //calls each functions that take data from scenarios so the correct scenario data is displayed
          await getHRUData(data[i]);
          await getPlantData(data[i]);
          await getLanduseData(data[i]);
          await getTsvFileOptions(data[i], "plants.plt", "plantNames");
          await getTsvFileOptions(data[i], "grassedww.str", "grww");
          await getTsvFileOptions(data[i], "urban.urb", "urbanLUList", "_comm");
          await getTsvFileOptions(data[i], "ovn_table.lum", "manN");
          await getTsvFileOptions(data[i], "cons_practice.lum", "cons");
          await getTsvFileOptions(data[i], "cntable.lum", "cn2Options");
          await getTsvFileOptions(data[i], "tiledrain.str", "tile");
          await getTsvFileOptions(data[i], "septic.str", "sep");
          await getTsvFileOptions(data[i], "filterstrip.str", "vfs");
          await getTsvFileOptions(data[i], "grassedww.str", "grww");
          lassoSelectionControl(data[i]);

          // Update vis panel
          if (data.includes(data[i])) {
            await hydrograph(data[i]);
            await choropleth(data[i]);
            document.querySelector("#choro").classList.remove("choroHide");
          } else {
            document.querySelector("#vis").innerHTML = "";
            document.querySelector("#choro").innerHTML = "";
            document.querySelector("#vis").innerHTML =
              "Could not fetch scenarios";
          }

          // if the scenario is === default then remove runswatbutton
          if (data[i] === "Default") {
            document.querySelector("#runswatbuttonvis") &&
              document.querySelector("#runswatbuttonvis").remove();
            //if scenario isnt default then create a button
          } else {
            document.querySelector("#runswatbuttonvis") &&
              document.querySelector("#runswatbuttonvis").remove();
            const runswatbuttonvis = document.createElement("button");
            runswatbuttonvis.setAttribute("id", "runswatbuttonvis");
            runswatbuttonvis.setAttribute("class", "runSwatButton");
            //when the button is clicked hide the table, hydrograph and choropleth
            runswatbuttonvis.addEventListener("click", async () => {
              document.getElementById("hruTable").style.display = "none";
              document.querySelector("#vis").innerHTML = "";
              document.querySelector("#choro").innerHTML = "";
              //add class to the vis pannel which controls loading spinner
              document.querySelector(
                "#vis"
              ).innerHTML = `<div class="swatrunning"> 
                  <div class="swatloadingspinner"></div>
                 </div>`;
              await fetch(
                `http://${HOST}:8000/runswat?scenario=${data[i]}`
              ).then(async (res) => {
                await res.json().then(async (d) => {
                  //if SWAT+ ran correctly msend the code 1, call hydrograph and choropleth functions to update the plotts with the new data
                  if (d.code === 1) {
                    console.log(d.message);
                    //  console.log('swat ran', data[i])
                    await hydrograph(data[i]);
                    await choropleth(data[i]);
                  }
                });
              });
            });
            runswatbuttonvis.innerText = `Run SWAT+ for ${data[i]}`;
            document
              .querySelector("#runswatbuttonviscontainer")
              .appendChild(runswatbuttonvis);
          }
        });
        document.getElementById("scenarioTab").appendChild(button);
        // Set current scenario to the LATEST scenario.
        updateCurrentScenario(data[i]);
      }
    });
}

export default {
  scenarioOptions,
};
