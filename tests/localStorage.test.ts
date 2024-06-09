import { describe, expect, test } from '@jest/globals';
import { LocalStorage } from "node-localstorage";
import { ginger,storageAdapters,prefixStorage } from '../src';
const {localStorage}=storageAdapters;
describe('test ginger fs', () => {
    const localStorageApi = new LocalStorage('./scratch')
    const instance = ginger({storageAdapter:localStorage({key:'abc',localStorageApi})});
    const timestamp = Date.now()
    const prefixedStorage = prefixStorage(instance, 'pre');
    prefixedStorage.set('a', 10, { $created: timestamp });
    test('test local storage', () => {
        expect(instance.getSnapshot()).toStrictEqual(localStorageApi.getItem('abc'));
    });
});

