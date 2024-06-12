import { describe, expect, test } from '@jest/globals';

import { ginger,prefixStorage,storageAdapters } from '../src';
import fs2 from 'node:fs';
const {nodeFs}=storageAdapters
describe('test ginger fs', () => {
    const instance = ginger({storageAdapter:nodeFs({})}), timestamp = Date.now(),prefixedStorage = prefixStorage(instance, 'pre');
    prefixedStorage.set('a', 10, { $created: timestamp });
    test('test node fs storage', () => {
        const content = fs2.readFileSync('./.gingerstore/index.json',{ encoding: 'utf8', flag: 'r' });
        expect(instance.getSnapshot()).toStrictEqual(content);
    });
   
});

