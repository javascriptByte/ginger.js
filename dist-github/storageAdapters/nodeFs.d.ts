import { ContentType, NodeProps } from '../types/types';
export default function ({ path, async }: NodeProps): {
    async: boolean;
    read: () => void;
    write: (content: ContentType) => {
        success: boolean;
    } | Promise<unknown>;
};
