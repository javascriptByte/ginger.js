import {  PrefixedStorage} from "../types/types";
const prefixStorage:PrefixedStorage = (instance, prefix) => {
    return { ...instance, prefix: prefix };
}
export default prefixStorage;