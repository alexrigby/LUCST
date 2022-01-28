import { choropleth } from "/js/modules/choropleth.js";
import { HOST } from "../main.js"
import { getTsvFileOptions } from "./getTsvFileOptions.js"
import { getInputFileData, getLanduseData, getHruData } from "./getInputFileData.js";
import { updateCurrentScenario } from "./updateCurentScenario.js"
import { hydrograph } from "./hydrograph.js";


export async function scenarioOptions() {
    await fetch(`http://${HOST}:8000/getscenarios`)
      .then(response => response.json())
      .then(data => {
        const scenarioCount = data.length;
  
        window.currentScenarioVersion = scenarioCount;
        // console.log(data)
        //loops over the scenario names asigning new button for each name
        //calls variable i assignes index 0 to it, button count has to be grater than i, increment i by 1 each time
        document.getElementById("scenarioTab").innerHTML = "";
        for (let i = 0; i < scenarioCount; i++) {
          let button = document.createElement('button');
          button.classList.add('tablinks');
          button.innerHTML = data[i];
          button.dataset.scenario = data[i];
  
          // Tab button event (click)
          button.addEventListener('click', async () => {
            document.getElementById("hruTable").style.display = "none";
  
            document.querySelector('#vis').innerHTML = `<div class="swatrunning"> 
            <div class="swatloadingspinner"></div>
           </div>`
            document.querySelector('#choro').classList.add('choroHide')
            updateCurrentScenario(data[i]);
  
            await getHruData(data[i])
            await getInputFileData(data[i])
            await getLanduseData(data[i])
            await getTsvFileOptions(data[i], "plants.plt", "plantNames")
            await getTsvFileOptions(data[i], "grassedww.str", "grww")
            await getTsvFileOptions(data[i], "urban.urb", "urbanLUList", "_comm")
            await getTsvFileOptions(data[i], "ovn_table.lum", "manN")
            await getTsvFileOptions(data[i], "cons_practice.lum", "cons")
            await getTsvFileOptions(data[i], "cntable.lum", "cn2Options")
            await getTsvFileOptions(data[i], "tiledrain.str", "tile")
            await getTsvFileOptions(data[i], "septic.str", "sep")
            await getTsvFileOptions(data[i], "filterstrip.str", "vfs")
            await getTsvFileOptions(data[i], "grassedww.str", "grww")
            //  updateTooltips(data[i])
  
            // Update vis panel
            if (data.includes(data[i])) {
              await hydrograph(data[i])
              await choropleth(data[i])
              document.querySelector('#choro').classList.remove('choroHide')
            } else {
              document.querySelector('#vis').innerHTML = "";
              document.querySelector('#choro').innerHTML = "";
              document.querySelector('#vis').innerHTML = "Could not fetch scenarios"
            }
  
            if (data[i] === 'Default') {
              document.querySelector('#runswatbuttonvis') && document.querySelector('#runswatbuttonvis').remove();
            } else {
              document.querySelector('#runswatbuttonvis') && document.querySelector('#runswatbuttonvis').remove();
              const runswatbuttonvis = document.createElement('button');
              runswatbuttonvis.setAttribute('id', 'runswatbuttonvis');
              runswatbuttonvis.setAttribute('class', 'runSwatButton')
  
              runswatbuttonvis.addEventListener('click', async () => {
                document.getElementById("hruTable").style.display = "none";
                document.querySelector('#vis').innerHTML = "";
                document.querySelector('#choro').innerHTML = "";
                // document.querySelector('#vis').innerHTML = `<div class="progressBarBorder"> 
                //  <div id="progressBar" class="swatProgressBar">0% </div>
                //  </div>`
                document.querySelector('#vis').innerHTML = `<div class="swatrunning"> 
                  <div class="swatloadingspinner"></div>
                 </div>`
                // swatProgressBar()
                await fetch(`http://${HOST}:8000/runswat?scenario=${data[i]}`).then(async (res) => {
                  await res.json().then(async (d) => {
                    if (d.code === 1) {
                      console.log(d.message);
                      //  console.log('swat ran', data[i])
                      await hydrograph(data[i])
                      await choropleth(data[i])
                    }
                  })
                })
              });
              runswatbuttonvis.innerText = `Run SWAT+ for ${data[i]}`;
              document.querySelector('#runswatbuttonviscontainer').appendChild(runswatbuttonvis);
            }
          });
          document.getElementById("scenarioTab").appendChild(button);
          // Set current scenario to the LATEST scenario.
          updateCurrentScenario(data[i]);
          // window.currentScenario = data[i];
        }
      })
  };

  export default {
      scenarioOptions
  }