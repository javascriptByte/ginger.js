import { debounce } from 'lodash';
import { _Getter, _Remove, _Setter } from '../types/types';
declare function processNestedStructure(data: {
    [key: string]: any;
}): {
    [key: string]: any;
};
declare const _get: _Getter;
declare const _set: _Setter;
declare const _remove: _Remove;
export { processNestedStructure, debounce, _set, _get, _remove };
