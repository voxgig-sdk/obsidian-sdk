import { ObsidianEntityBase } from '../ObsidianEntityBase';
import type { ObsidianSDK } from '../ObsidianSDK';
import type { Control } from '../types';
import type { System, SystemLoadMatch } from '../ObsidianTypes';
declare class SystemEntity extends ObsidianEntityBase<System> {
    constructor(client: ObsidianSDK, entopts: any);
    make(this: SystemEntity): SystemEntity;
    load(this: any, reqmatch?: SystemLoadMatch, ctrl?: Control): Promise<SystemEntity>;
}
export { SystemEntity };
