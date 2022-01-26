//  EXTRACTS NAMES AND DESCRIPTIONS FROM TSV FILES


export function getDescriptions(data) {
    const plants = data.map(record => record.description);
    // console.log(landuses);
    return plants
  }
  
  export function getNames(data) {
    const landuses = data.map(record => record.name);
    // console.log(landuses);
    return landuses
  }


 export function getPlantComNames(data) {
  const plantCom = data.map(record => record.pcom_name);
  const plantTypes = plantCom.map((el, i) => {
    return `<option value=${el}>${el}</option>`;
  });
  return plantTypes
}
  
  export default {
      getDescriptions,
      getNames, 
      getPlantComNames
  }