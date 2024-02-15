import axios from "axios";

const BaseUrl= 'http://localhost:5000';

export const filterdProductUsingParameters=async(payload)=>{
    try {
        if(payload){
       const data = axios.get(`getBrand?brand=${payload}`)
        return data
        }
    } catch (error) {
        console.log(error)
    }
}