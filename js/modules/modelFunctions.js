import cleanHru from "/js/modules/hru_dataFunctions.js";
import fetchData from "/js/modules/universalFunctions.js";


function cleanSim(data) {
    return d3.tsvParse(data
        // Remove the header line produced by SWAT+ Editor
        .substring(data.indexOf('\n') + 1)
        // First, remove all spaces and replace with tabs
        .replace(/  +/gm, '\t')
        // Then remove all leading and trailing tabs
        .replace(/^\t|\t$/gm, '')
    );
}

//found on stack overflow, coverts date to jday(day of the year)
function dayNo(y, m, d) {
    return --m >= 0 && m < 12 && d > 0 && d < 29 + (
        4 * (y = y & 3 || !(y % 25) && y & 15 ? 0 : 1) + 15662003 >> m * 2 & 3
    ) && m * 31 - (m > 1 ? (1054267675 >> m * 3 - 6 & 7) - y : 0) + d;
}



export function modelRun() {
    fetchData('/data/TxtInOut/time.sim')
        .then(data => {
            // Clean the dataset...
            const cleanSimFile = cleanSim(data);
            console.log('time.sim', cleanSimFile)

            const runModelButton = document.getElementById("runSWATButton")
            runModelButton.addEventListener('click', () => {
                const startDate = document.getElementById("startDate").value
                const endDate = document.getElementById("endDate").value

                //replaces te end year and start year in time.sim with the year selected in the form
                cleanSimFile[0].yrc_end = `${endDate.slice(0, -6)}`
                cleanSimFile[0].yrc_start = `${startDate.slice(0, -6)}`
                
                // split("-").join(",")
                // formats the date from YYYY-MM-DD to YYYY,M,D for use in the dayNo function
                const newStartDate = startDate.replace(/\b0/g, '').split("-");
                const newEndDate = endDate.replace(/\b0/g, '').split("-");
                
                //converts the date from string to int
                const newSDInt =  newStartDate.map(el => 
                    parseInt(el)
                ); 
                const newEDInt =  newEndDate.map(el => 
                    parseInt(el)
                ); 
               
             //Returns jDay from date
                const sJday = dayNo(newSDInt[0], newSDInt[1], newSDInt[2])
                const eJday = dayNo(newEDInt[0], newEDInt[1], newEDInt[2])
                console.log('start jDay', sJday)
                console.log('end jDay', eJday)

                //adds new julian day to time.sim file
                cleanSimFile[0].day_start = `${sJday}`
                cleanSimFile[0].day_end = `${eJday}`
                console.log('time.sim', cleanSimFile)
               
            })
        });
}




export default modelRun