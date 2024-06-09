export interface GingerInstance{
    prefix:string;
    set:(key:string, value:any,meta?:any)=>any;
    get:(key:string)=>any;
    getAll:()=>any;
    getAllWithMeta:()=>any;
    clear:()=>any;
    getSnapshot:()=>string;
    subscribe:any;
    unSubscribe:any;
    remove:(key:string)=>any

}
export type GingerArguments = any;
export type Ginger = (a:GingerArguments)=>GingerInstance;

export type _Setter=(keyArray:string[],value:any,localStore:any,opts:any)=>any;
export type _Getter=(keyArray:string[],localStore?:any )=>any | undefined;
export type _Remove=(keyArray:string[],localStore?:any )=>any | undefined;

export interface Store{
    [key: string] : any
}

export interface NodeProps{
    path?:string;
    async?:boolean;
}
export type ContentType= string;

export type PrefixedStorage = (instance:any,prefix:string) => GingerInstance;
