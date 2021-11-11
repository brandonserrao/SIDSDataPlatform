import axios from 'axios'
const API_URL = 'https://raw.githubusercontent.com/Ben-Keller/smallislands/main/data/exports';

export default {
  loadAllKeyData,
  loadMetaData

}


async function loadAllKeyData () {
    const resp = await axios.get(`${API_URL}/allKeyData.json`)
    return resp.data
}
async function loadMetaData () {
  const resp = await axios.get(`${API_URL}/keyMetadata.json`)
  return resp.data
}
