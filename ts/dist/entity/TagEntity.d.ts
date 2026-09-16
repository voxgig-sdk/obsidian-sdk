import { ObsidianEntityBase } from '../ObsidianEntityBase';
import type { ObsidianSDK } from '../ObsidianSDK';
import type { Control } from '../types';
import type { Tag, TagListMatch } from '../ObsidianTypes';
declare class TagEntity extends ObsidianEntityBase<Tag> {
    constructor(client: ObsidianSDK, entopts: any);
    make(this: TagEntity): TagEntity;
    list(this: any, reqmatch?: TagListMatch, ctrl?: Control): Promise<TagEntity[]>;
}
export { TagEntity };
