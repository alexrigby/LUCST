export const HOST = "localhost";
const serverPort = "8000";

export const getHRUData = `http://${HOST}:${serverPort}/getHRUData`;
export const getScenarios = `http://${HOST}:${serverPort}/getscenarios`;
export const getLanduseData = `http://${HOST}:${serverPort}/getlandusedata`;
export const getPlantData = `http://${HOST}:${serverPort}/getplantdata`;
export const getDefaultChannelData = `http://${HOST}:${serverPort}/getdefaultchanneldata`;
export const getTsvFileOptions = `http://${HOST}:${serverPort}/gettsvfileoptions`;



export default {
  getHRUData,
  getScenarios,
  getLanduseData,
  HOST,
  getPlantData,
  getDefaultChannelData,
  getTsvFileOptions
};
