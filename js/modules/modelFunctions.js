// import cleanHru from "/js/modules/hru_dataFunctions.js";
// import fetchData from "/js/modules/universalFunctions.js";



// function cleanSim(data) {
//     return d3.tsvParse(data
//         // Remove the header line produced by SWAT+ Editor
//         .substring(data.indexOf('\n') + 1)
//         // First, remove all spaces and replace with tabs
//         .replace(/  +/gm, '\t')
//         // Then remove all leading and trailing tabs
//         .replace(/^\t|\t$/gm, '')
//     );
// }

// const convertToTSV = (data) => {
//     // Convert dataset to TSV and print
//     const headers = Object.keys(data[0]);
//     const tsv = [
//         headers.join('\t'),
//         ...data.map(row => headers.map(fieldName => row[fieldName]).join('\t'))
//     ].join('\r\n');

//     return tsv;
// }


// //found on stack overflow, coverts date to jday(day of the year)
// function dayNo(y, m, d) {
//     return --m >= 0 && m < 12 && d > 0 && d < 29 + (
//         4 * (y = y & 3 || !(y % 25) && y & 15 ? 0 : 1) + 15662003 >> m * 2 & 3
//     ) && m * 31 - (m > 1 ? (1054267675 >> m * 3 - 6 & 7) - y : 0) + d;
// }



// //function for time.sim controls
// export function timeSim() {
//     fetchData('/data/TxtInOut/time.sim')
//         .then(data => {
//             // Clean the dataset...
//             const cleanSimFile = cleanSim(data);
//             // console.log('time.sim', cleanSimFile)

//             const runModelButton = document.getElementById("timeSimButton")
//             // runModelButton.addEventListener('click', () => {
//             //     const startDate = document.getElementById("startDate").value
//             //     const endDate = document.getElementById("endDate").value

//             //     //replaces te end year and start year in time.sim with the year selected in the form
//             //     cleanSimFile[0].yrc_end = `${endDate.slice(0, -6)}`
//             //     cleanSimFile[0].yrc_start = `${startDate.slice(0, -6)}`

//             //     // split("-").join(",")
//             //     // formats the date from YYYY-MM-DD to YYYY,M,D for use in the dayNo function
//             //     const newStartDate = startDate.replace(/\b0/g, '').split("-");
//             //     const newEndDate = endDate.replace(/\b0/g, '').split("-");

//             //     //converts the date from string to int
//             //     const newSDInt = newStartDate.map(el =>
//             //         parseInt(el)
//             //     );
//             //     const newEDInt = newEndDate.map(el =>
//             //         parseInt(el)
//             //     );

//             //     //Returns jDay from date
//             //     const sJday = dayNo(newSDInt[0], newSDInt[1], newSDInt[2])
//             //     const eJday = dayNo(newEDInt[0], newEDInt[1], newEDInt[2])
//             //     // console.log('start jDay', sJday)
//             //     // console.log('end jDay', eJday)

//             //     //adds new julian day to time.sim file
//             //     cleanSimFile[0].day_start = `${sJday}`
//             //     cleanSimFile[0].day_end = `${eJday}`
//             //     // console.log('time.sim', cleanSimFile)
//             //     //converts form JSOn to TSV
//             //     const newTimeSimFile = convertToTSV(cleanSimFile)
//             //     console.log(cleanSimFile)

//             //     downloadSimFile(newTimeSimFile, "time.sim")
//             // })
//         });
// }

// function downloadSimFile(data, fileName) {
//     var myFile = new Blob([data], { type: 'text/plain' });
//     document.getElementById('simDownload').setAttribute('href', window.URL.createObjectURL(myFile));
//     document.getElementById('simDownload').setAttribute('download', fileName);
//   }

// //returns the line coding aa
// function selectPrtSection(data, s1, s2) {
//     const clean = (data
//         // Remove the header line produced by SWAT+ Editor
//         .substring(data.indexOf('\n') + 1)
//         // First, remove all spaces and replace with tabs
//         .replace(/  +/gm, '\t')
//         // Then remove all leading and trailing tabs
//         .replace(/^\t|\t$/gm, ''))
//     //splits the file by line break
//     const newLines = clean.split('\n')
//     //creats new object with lines between index 2 and 4
//     const section = newLines.slice(s1, s2);
//     //joins the lines
//     const prtSection = section.join('\n')
//     //parses the text
//     const jsonClean = d3.tsvParse(prtSection)
//     return jsonClean
// }

// //retunrs all the printable output options
// function cleanPrtOutputOps(data) {
//     const clean = iniCleanData(data)
//     //splits the file by line break
//     const newLines = clean.split('\n')
//     //creats new object with lines between index 4 and 6
//     const ops = newLines.slice(8);
//     //joins the lines
//     const prtOps = ops.join('\n')
//     //parses the text
//     const jsonClean = d3.tsvParse(prtOps)
//     return jsonClean
// }

// //makes sure that channel_sd daily is always selected
// function prtChannelSd(data, id) {
//     const filteredData = data.filter(record => record.objects == id);
//     filteredData[0].daily = `${'y'}`
// }

// //function for print controls
// export function printPrt() {
//     fetchData('/data/TxtInOut/print.prt')
//         .then(data => {
//             //use to add control on warm up period of model 
//             const warmUp = selectPrtSection(data, 0, 2)
//             // console.log('warm up period option', warmUp)
//             // returns line coding aa - no need to alter
//             const aa = selectPrtSection(data, 2, 4)
//             //csv output option- make sure its alwasy set to 'y'
//             const formatOps = selectPrtSection(data, 4, 6)
//             // console.log('output format option', formatOps)
//             //retuns line coding soil out - No need to alter
//             const soilOut = selectPrtSection(data, 6, 8)
//             //option for what opbects to print - make sure channel_sd_day is always selected
//             const outputOpts = selectPrtSection(data, 8)
//             // console.log('output print ops', outputOpts)

//             const setParamButton = document.getElementById("timeSimButton")
//             const warmUpPeriod = document.getElementById("warmUp")

//             // setParamButton.addEventListener('click', () => {
//             //     //sets warm up period to user defined length 
//             //     warmUp[0].nyskip = `${warmUpPeriod.value}`
//             //     // makes sure csv is always printed
//             //     formatOps[0].csvout = `${'y'}`
//             //     // makes sure channel_sd day is always printed
//             //     prtChannelSd(outputOpts, "channel_sd")
//             //     //join all together, warmup-formatops-outputopts
                
                
//             //     const warmUpTsv = convertToTSV(warmUp)
//             //     const aaTsv = convertToTSV2(aa)
//             //     const formatOpsTsv = convertToTSV2(formatOps)
//             //     const soilOutTsv = convertToTSV2(soilOut)
//             //     const outputOptsTsv = convertToTSV2(outputOpts)
//             //     const newPrtFileTsv = warmUpTsv.concat(aaTsv, formatOpsTsv, soilOutTsv, outputOptsTsv)
//             //     console.log(newPrtFileTsv)
//             //     downloadPrtFile(newPrtFileTsv, "print.prt")
//             // })

//         })
// }

// const convertToTSV2 = (data) => {
//     // Convert dataset to TSV and print
//     const headers = Object.keys(data[0]);
//     const tsv = [
//         '\n' + headers.join('\t'),
//         ...data.map(row => headers.map(fieldName => row[fieldName]).join('\t'))
//     ].join('\r\n');
//     return tsv;
// }

//   function downloadPrtFile(data, fileName) {
//     var myFile = new Blob([data], { type: 'text/plain' });
//     document.getElementById('prtDownload').setAttribute('href', window.URL.createObjectURL(myFile));
//     document.getElementById('prtDownload').setAttribute('download', fileName);
//   }

// export default {
//     timeSim,
//     printPrt
// }