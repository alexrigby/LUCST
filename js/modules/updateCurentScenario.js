//UPDATES THE CURRENT SCENARIO TO THE SELECTED SCENARIO

export function updateCurrentScenario(scenario) {
    //whichever scenario is selected that is set as the 'window.currentScenario' object
    window.currentScenario = scenario;
    
    // Update scenario tab
    // Reset tab view
    Array.from(document.getElementsByClassName('tablinks')).forEach((el, i, arr) => {
        el.classList.remove('scenario-active');
    })
    // Set active tab button
    document.querySelector(`[data-scenario="${scenario}"]`).classList.add('scenario-active');
    // TODO: Call Hydrograph()

    console.log('CURRENT SCENARIO: ', window.currentScenario)

}

export default {
    updateCurrentScenario
}