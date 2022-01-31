import axios from 'axios';
import * as d3 from 'd3';


const API_URL = 'https://raw.githubusercontent.com/Ben-Keller/smallislands/main/data';
const NEW_API_URl = 'https://raw.githubusercontent.com/SIDS-Dashboard/SIDSDataPlatform/main'
const NEW_API_URl_2 = 'https://raw.githubusercontent.com/SIDS-Dashboard/api/main/data'
export default {
  loadAllKeyData,
  loadMetaData,
  loadFundingCategories,
  loadSIDSData,
  loadIndicatorsCategories,
  loadIndicatorsMeta,
  loadProfileData,
  loadSidsSVG,
  loadMapLocations,

  loadCountryProfile,
  loadProfileIndicarotsMetadata,


  loadDatasetsList

}


async function loadCountryProfile(isoCode) {
  const resp = await axios.get(`${NEW_API_URl_2}/profiles/${isoCode}.json`)
  return resp.data;
}
async function loadProfileIndicarotsMetadata() {
  const resp = await axios.get(`${NEW_API_URl_2}/profiles/countryProfileMetadata.json`)
  return resp.data;
}









async function loadAllKeyData () {
  const resp = await axios.get(`${API_URL}/exports/allKeyData.json`)
  return resp.data
}

async function loadDatasetsList() {
  const resp = await axios.get(`${NEW_API_URl_2}/datasetMeta.json`)
  return resp.data;
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
  const resp = await axios.get(`${NEW_API_URl}/data/exports/sids_db.csv`)
  return d3.csvParse(resp.data)
}
async function loadIndicatorsCategories () {
  const resp = await axios.get(`/SIDSDataPlatform/static/indicatorCategories.json`)
  return resp.data
}
async function loadIndicatorsMeta () {
  const resp = await axios.get(`/SIDSDataPlatform/static/indicatorMeta.json`)
  return resp.data
}
async function loadProfileData () {
  const resp = await axios.get(`${NEW_API_URl}/data/profileData.json`)
  return resp.data
}
async function loadSidsSVG () {
  const resp = await d3.xml(`${NEW_API_URl}/maps/sidsSVG8.svg`)
  return resp
}
async function loadMapLocations () {
  const resp = await axios.get(`${NEW_API_URl}/data/exports/mapLocations.json`)
  return resp.data
}
