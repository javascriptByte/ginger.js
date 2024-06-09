import { debounce, processNestedStructure,_get,_set,_remove } from './utils';
import { GingerArguments, GingerInstance, Store, _Setter, _Getter } from '../types/types';

interface Subscriptions {
    [key: string] : Array<(arg:any)=>any>;
}
const ginger = function ({
    prefix = 'default',
    storageAdapter
}: GingerArguments): GingerInstance {
    const store: Store = {},subscriptions: Subscriptions = {};
    let isUpdatePending=false;

    const _getWithoutMeta = (store: Store) => {
        return processNestedStructure(store)
    }
    
    const asyncAdapters = debounce(async () => {
        if (storageAdapter?.write) {
            await storageAdapter.write( getSnapshot());
            triggerSubscriptions('update:store');
            isUpdatePending=false;
        }
    },2000);
    const syncAdapters = async () => {
        if (storageAdapter?.write) {
            storageAdapter.write( getSnapshot());
            triggerSubscriptions('update:store');
            isUpdatePending=false;
        }
    }

    const triggerSubscriptions = (event: string) => {
        (subscriptions[event] || []).forEach((fn: any) => {
            fn()
        });
    }
    const getSnapshot = () => {
        return JSON.stringify(store)
    }
    const _getAllWithMeta = () => {
        return store;
    }
    return {
        prefix,
        subscribe: (event: string, handler: any) => {
            if (!subscriptions[event]) {
                subscriptions[event] = []
            }
            subscriptions[event] = [...subscriptions[event], handler];
            if(!isUpdatePending){ //If there is no update, it should trigger once for the sake of last update like for settled promises 
                handler(); 
            }
        },
        unSubscribe: (event: string, handler: any) => {
            if (!subscriptions[event]) { return };
            subscriptions[event] = subscriptions[event].filter((fn: any) => handler !== fn)
        },
        set: function (key, value, meta) {
            key = this.prefix + ':' + key;
            const k = key.split(':');
           _set(k, value, store, { $created: Date.now(), ...meta })
            if (storageAdapter) {
                isUpdatePending=true;
                if (storageAdapter.async) {
                    asyncAdapters()
                } else {
                    syncAdapters()
                }
            }

        },
        get: function (key) {
            key = this.prefix + ':' + key;
            return _get(key.split(':'),store)
        },
        remove:function(key){
            return _getWithoutMeta(_remove((this.prefix + ':' +key).split(':'),store))
        },
        getAllWithMeta: function () {
            return store;
        },
        getAll: function () {
            if (this.prefix) {
                return _getWithoutMeta(store[this.prefix])
            } else {
                return _getWithoutMeta(store)
            }
        },
        clear: function () {
            delete store[this.prefix]
        },
        getSnapshot: function () {
            return getSnapshot()
        }
    }
}


export { ginger }
