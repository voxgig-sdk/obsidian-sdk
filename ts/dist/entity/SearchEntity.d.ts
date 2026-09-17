import { ObsidianEntityBase } from '../ObsidianEntityBase';
import type { ObsidianSDK } from '../ObsidianSDK';
import type { Control } from '../types';
import type { Search, SearchCreateData } from '../ObsidianTypes';
declare class SearchEntity extends ObsidianEntityBase<Search> {
    constructor(client: ObsidianSDK, entopts: any);
    make(this: SearchEntity): SearchEntity;
    create(this: any, reqdata?: SearchCreateData, ctrl?: Control): Promise<SearchEntity>;
}
export { SearchEntity };
