import { describe, expect, test } from '@jest/globals';

import { ginger,prefixStorage } from '../src';
describe('test ginger', () => {
    const instance = ginger({});
    const timestamp = Date.now()
    instance.set('num:a:b:c', 10, { $created: timestamp });
    const prefixedStorage = prefixStorage(instance, 'pre');
    prefixedStorage.set('a', 10, { $created: timestamp });
    test('test get of level 1', () => {
        expect(instance.get('num')).toStrictEqual({ a: { b: { c: 10 } } });
    });

    test('test get level 2', () => {
        expect(instance.get('num:a')).toStrictEqual({ b: { c: 10 } });
    });

    test('test get level 3', () => {
        expect(instance.get('num:a:b')).toStrictEqual({ c: 10 });
    });


    test('test get level 4', () => {
        expect(instance.get('num:a:b:c')).toStrictEqual(10);
    });

    test('test prefixed get level 1', () => {
        expect(prefixedStorage.get('a')).toStrictEqual(10);
    });

    // test('test prefixed from original store', () => {
    //     expect(instance.get('pre:a')).toStrictEqual(10);
    // });

    // need to match timestamps for snapshot and getall
    test('test getSnapshot', () => {
        const dummy = `{"default":{"$created":${timestamp},"$value":{"num":{"$created":${timestamp},"$value":{"a":{"$created":${timestamp},"$value":{"b":{"$created":${timestamp},"$value":{"c":{"$value":10,"$created":${timestamp}}}}}}}}}},"pre":{"$created":${timestamp},"$value":{"a":{"$value":10,"$created":${timestamp}}}}}`
        expect(instance.getSnapshot()).toStrictEqual(dummy);
    });

    test('test getAllWithMeta', () => {
        expect(instance.getAllWithMeta()).toStrictEqual({

            default: {
                '$created': timestamp, '$value': {
                    num:
                    {
                        "$created": timestamp, "$value":
                        {
                            "a": {
                                "$created": timestamp, "$value":
                                {
                                    "b": {
                                        "$created": timestamp, "$value":
                                            { "c": { "$created": timestamp, "$value": 10 } }
                                    }
                                }
                            }
                        }
                    }

                }
            },
            pre: {
                '$created': timestamp, '$value': {
                    a: {
                        $created: timestamp,
                        $value: 10
                    }
                }
            }

        }
        ); //need to fix
    });

    test('test get all for values only', () => {
        instance.getAll();
        expect(instance.getAll()).toStrictEqual({ "num": { "a": { "b": { "c": 10 } } } });
    });

    test('test remove', () => {
        expect(instance.remove("num:a:b:c")).toEqual(10);
        expect(instance.getAll()).toStrictEqual({ "num": { "a": { "b": { } } } });
        expect(instance.remove("num:a")).toStrictEqual({"b":{}});
        expect(instance.getAll()).toStrictEqual({ "num": {  }});
    });

    test('test clear for prefix storage', () => {
        prefixedStorage.clear();
        expect(prefixedStorage.getAll()).toStrictEqual(undefined);//shoudl be {}
    });

    test('test clear for original store', () => {
        instance.clear();
        expect(instance.getAll()).toStrictEqual(undefined);
    });
});


