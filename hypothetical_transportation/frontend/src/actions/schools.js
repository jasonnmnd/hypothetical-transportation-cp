import axios from "axios";
import { GET_SCHOOLS } from "./types"; 

//GET SCHOOLS
export const getSchools = () => {
    axios.get('/api/school/')
        .then(res => {
            console.log(res.data);
        }).catch(err => console.log(err));
    }