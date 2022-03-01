export const HOST = "localhost";

export const getHRUData = `http://${HOST}:8000/getHRUData`;
export const getScenarios = `http://${HOST}:8000/getscenarios`;
export const getLanduseData = `http://${HOST}:8000/getlandusedata`;
export const getPlantData = `http://${HOST}:8000/getplantdata`;

export default {
  getHRUData,
  getScenarios,
  getLanduseData,
  HOST,
  getPlantData,
};
