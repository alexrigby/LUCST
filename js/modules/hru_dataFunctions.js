import d3 from "d3";

//hru_data.hru//


// Return an object array from cleaned TSV data with D3.tsvParse 
/**
 * 
 * @param {*} data 
 */
export function cleanHru(data) {
    return d3.tsvParse(data
      // Remove the header line produced by SWAT+ Editor
      .substring(data.indexOf('\n') + 1)
      // First, remove all spaces and replace with tabs
      .replace(/  +/gm, '\t')
      // Then remove all leading and trailing tabs
      .replace(/^\t|\t$/gm, '')
    );
  }

  

  //Select HRU's lu_mgt by its id
    //e.g(console.log(getHru(cleanHruData250))
    /**
     * @name getHru
     * @param {*} data // A dataset
     * @param {*} id // An ID
     */
  export function getHru(data, id) {
      const filteredData = data.filter(record => record.id == id);
      return filteredData[0].lu_mgt
  }

    // Update selected HRU lu_mgt
    /**
     * @name updateHru
     * @param {*} data // dataset
     * @param {*} id // id of HRU
     * @param {*} lu_mgt // Selects lu_mgt(can change to any variable in dataset)
     */
  export function updateHru(data, id, lu_mgt) {
    const newData = [...data];  
    newData[id - 1] = {
        ...newData[id - 1],
        lu_mgt
      }
      return newData;
    }



  //exports functions
  export default {
    cleanHru,
    getHru,
    updateHru,
  }