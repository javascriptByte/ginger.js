import { describe, expect, test } from '@jest/globals';
import { ginger,prefixStorage,storageAdapters } from '../src';
import fs2 from 'node:fs';
const {nodeFs}=storageAdapters;
describe('test ginger fs async', () => {
    const instance = ginger({storageAdapter:nodeFs({async:true})});
    const timestamp = Date.now()
    const prefixedStorage = prefixStorage(instance, 'pre');
    prefixedStorage.set('a', 10, { $created: timestamp });
    test('test node fs storage', async() => {
        await instance.set('num:a:b:x', 20, { $created: timestamp });
        await new Promise((resolve)=>{
            const fn=()=>{
                resolve(null);
                instance.unSubscribe('update:store',fn)
            }
            instance.subscribe('update:store',fn)

        })

        const content = fs2.readFileSync('./.gingerstore/index.json',{ encoding: 'utf8', flag: 'r' });
        expect(instance.getSnapshot()).toStrictEqual(content);
    });
   
});

