import fs from 'node:fs';
const asyncWrite = (path, content) => {
    return fs.promises.writeFile(path, content);
};
const syncWrite = (path, content) => {
    return fs.writeFileSync(path, content);
};
const checkAndMakeDir = (path) => {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }
};
export default function ({ path = './.gingerstore', async = false }) {
    const config = {
        async: false,
        path,
    };
    const _init = () => {
        fs.rmSync(path, { recursive: true, force: true });
    };
    const _syncWrite = (content) => {
        checkAndMakeDir(path);
        try {
            syncWrite(path + '/index.json', content);
            return { success: true };
        }
        catch (err) {
            throw err;
        }
    };
    const _asyncWrite = (content) => {
        return new Promise(async (res, rej) => {
            try {
                await fs.promises.access(path);
            }
            catch (e) {
                await fs.promises.mkdir(path);
            }
            try {
                await asyncWrite(path + '/index.json', content);
                res({ success: true });
            }
            catch (err) {
                rej(err);
            }
        });
    };
    _init();
    return {
        async,
        read: () => {
        },
        write: (content) => {
            if (async) {
                return _asyncWrite(content);
            }
            else {
                return _syncWrite(content);
            }
        },
    };
}
//# sourceMappingURL=nodeFs.js.map