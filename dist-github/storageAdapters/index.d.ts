import nodeFs from './nodeFs';
import localStorage from './localStorage';
declare const storageAdapters: {
    nodeFs: typeof nodeFs;
    localStorage: typeof localStorage;
};
export default storageAdapters;
