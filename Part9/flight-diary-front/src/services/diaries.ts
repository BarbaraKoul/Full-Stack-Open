import axios from 'axios';
import type { Diaries } from '../types';

const baseUrl='http://localhost:3000/api';

const getAll= async() => {
    const { data }= await axios.get<Diaries[]>(
        `${ baseUrl }/diaries`
    );
    return data;
};

export default { getAll };