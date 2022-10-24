import axios from "axios"

export async function getIp() {
    const url = 'https://checkip.amazonaws.com/';
    const response = await axios(url);
    return response.data.trim();
};