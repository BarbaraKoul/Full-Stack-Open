import axios from 'axios';
import type { Diaries } from '../types';

const baseUrl='http://localhost:3000/api';

const getAll= async() => {
    const { data }= await axios.get<Diaries[]>(
        `${ baseUrl }/diaries`
    );
    return data;
};

const createDiary=async (object: Diaries) => {
     return axios
    .post<Diaries>(baseUrl, object)
    .then(response => response.data)
}

export default { getAll, createDiary };