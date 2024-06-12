
import {debounce} from 'lodash';
import { _Getter,_Remove,_Setter } from '../types/types';
function processNestedStructure(data:{[key: string] : any}) {
    if (typeof data === 'object' && data !== null) {
        if ('$value' in data) {
            return processNestedStructure(data['$value']);
        } else {
            let result:{[key: string] : any} = {};
            for (let key in data) {
                if (key !== '$created') { //data.hasOwnProperty(key) && 
                    result[key] = processNestedStructure(data[key]);
                }
            }
            return result;
        }
    } else {
        return data;
    }
}


const _get:_Getter = (keyArray, localStore = {}) => {
    if (!localStore || keyArray.length === 0) return undefined;

    const key = keyArray[0]; // Get the current key to process
    if (keyArray.length > 1) {
        // If more keys exist, continue traversing
        if (localStore[key] && localStore[key].$value) {
            return _get(keyArray.slice(1), localStore[key].$value);
        } else {
            return undefined; // Path does not exist further down
        }
    } else {
        // Base case: last key in the array
        if (localStore[key]) {
            return processNestedStructure(localStore[key]); // Process the final node
        } else {
            return undefined; // Key does not exist
        }
    }
};



    
const _set:_Setter = (keyArray, value, localStore={}, metadata = {}) => {
    // Base case: If there is only one key left, set the value directly.
    if (keyArray.length === 1) {
        const key = keyArray[0];
        localStore[key] = {
            $value: value,
            $created: metadata.$created
        };
    } else {
        // Recursive case: Traverse the key array and create nested objects if necessary.
        const key = keyArray[0];
        if (!localStore[key]) {  // Check if the key does not exist or has no $value.
            localStore[key] = {
                $created: metadata.$created,
                $value: {}
            };
        }
        
        // Recur with the rest of the key array and the next level of the store.
        _set(keyArray.slice(1), value, localStore[key].$value, metadata);
    }
    // return localStore;
};

const _remove:_Remove = (keyArray, localStore = {}) => {
    if (!localStore || keyArray.length === 0) return undefined;

    const key = keyArray[0]; // Get the current key to process
    if (keyArray.length > 1) {
        // If more keys exist, continue traversing
        if (localStore[key] && localStore[key].$value) {
            return _remove(keyArray.slice(1), localStore[key].$value);
        } else {
           throw ('Invalid path'); // Path does not exist further down
        }
    } else {
        // Base case: last key in the array
        if (localStore[key]) {
          const el=localStore[key];
          delete localStore[key];
          return el;
           // return processNestedStructure(localStore[key]); // Process the final node
        } else {
            throw ('No key'); // Key does not exist
        }
    }
};


export  {
    processNestedStructure,
    debounce,
    _set,
    _get,
    _remove
} ;