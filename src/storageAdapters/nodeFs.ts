import fs from 'node:fs';
import { ContentType,NodeProps } from '../types/types';

const asyncWrite=(path:string,content:ContentType)=>{
    return fs.promises.writeFile(path, content);
}
const syncWrite=(path:string,content:ContentType)=>{
    return fs.writeFileSync(path, content);
}
const checkAndMakeDir=(path:string)=>{
    if (!fs.existsSync(path)){
        fs.mkdirSync(path, { recursive: true });
    }
}

export default function({path='./.gingerstore',async=false}:NodeProps){
    const config={
        async:false,
        path,
    }
    const _init=()=>{
        fs.rmSync(path, { recursive: true, force: true });
    }
   const _syncWrite=(content:ContentType)=>{
        checkAndMakeDir(path)
        try {
            syncWrite(path + '/index.json',content)
            return {success:true}
          } catch (err) {
            throw err;
          }
    }
    const _asyncWrite=(content:ContentType)=>{
        return new Promise(async (res,rej)=>{
            try{
                await fs.promises.access(path);
            }catch(e){
                await fs.promises.mkdir(path)
            }
            try {
                await asyncWrite(path + '/index.json',content)
                res({success:true})
              } catch (err) {
                rej(err)
              }
        })
       
    }
    _init()
    return {
        async,
        read:()=>{
        },
        write:(content:ContentType)=>{
            if(async){
                return _asyncWrite(content)
            }else{
                return _syncWrite(content)
            }
        },
    }
}

