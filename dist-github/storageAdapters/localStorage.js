export default function ({ key, localStorageApi }) {
    return {
        async: false,
        read: () => {
        },
        write: (content) => {
            (localStorageApi).setItem(key, content);
        },
    };
}
//# sourceMappingURL=localStorage.js.map