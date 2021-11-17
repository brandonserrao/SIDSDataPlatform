import axios from 'axios';
import * as d3 from 'd3';


const API_URL = 'https://raw.githubusercontent.com/Ben-Keller/smallislands/main/data';

export default {
  loadAllKeyData,
  loadMetaData,
  loadFundingCategories,
  loadSIDSData
}


async function loadAllKeyData () {
    const resp = await axios.get(`${API_URL}/exports/allKeyData.json`)
    return resp.data
}
async function loadMetaData () {
  const resp = await axios.get(`${API_URL}/exports/keyMetadata.json`)
  return resp.data
}
async function loadFundingCategories () {
    const resp = await axios.get(`${API_URL}/exports/fundingCategories.json`);
    const result = [];
    for (let category in resp.data) {
      result.push(Object.assign({},resp.data[category],{name:category}));
    }
    return result
}
async function loadSIDSData () {
  const resp = await axios.get(`${API_URL}/sids_db.csv`)
  return d3.csvParse(resp.data)

}
