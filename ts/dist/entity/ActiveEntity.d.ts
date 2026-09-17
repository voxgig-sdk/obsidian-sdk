import { ObsidianEntityBase } from '../ObsidianEntityBase';
import type { ObsidianSDK } from '../ObsidianSDK';
import type { Control } from '../types';
import type { Active, ActiveLoadMatch, ActiveCreateData, ActiveUpdateData, ActiveRemoveMatch } from '../ObsidianTypes';
declare class ActiveEntity extends ObsidianEntityBase<Active> {
    constructor(client: ObsidianSDK, entopts: any);
    make(this: ActiveEntity): ActiveEntity;
    load(this: any, reqmatch?: ActiveLoadMatch, ctrl?: Control): Promise<ActiveEntity>;
    create(this: any, reqdata?: ActiveCreateData, ctrl?: Control): Promise<ActiveEntity>;
    update(this: any, reqdata?: ActiveUpdateData, ctrl?: Control): Promise<ActiveEntity>;
    remove(this: any, reqmatch?: ActiveRemoveMatch, ctrl?: Control): Promise<ActiveEntity>;
}
export { ActiveEntity };
