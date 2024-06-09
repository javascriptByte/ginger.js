import { ContentType } from '../types/types';
export default function({key,localStorageApi}:{key:string,localStorageApi:any}){
    return {
        async:false,
        read:()=>{
        },
        write:(content:ContentType)=>{
            (localStorageApi).setItem(key,content);
        },
    }
}