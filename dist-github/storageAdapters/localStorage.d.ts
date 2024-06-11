import { ContentType } from '../types/types';
export default function ({ key, localStorageApi }: {
    key: string;
    localStorageApi: any;
}): {
    async: boolean;
    read: () => void;
    write: (content: ContentType) => void;
};
