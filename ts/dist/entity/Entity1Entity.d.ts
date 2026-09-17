import { ObsidianEntityBase } from '../ObsidianEntityBase';
import type { ObsidianSDK } from '../ObsidianSDK';
import type { Control } from '../types';
import type { Entity1, Entity1LoadMatch } from '../ObsidianTypes';
declare class Entity1Entity extends ObsidianEntityBase<Entity1> {
    constructor(client: ObsidianSDK, entopts: any);
    make(this: Entity1Entity): Entity1Entity;
    load(this: any, reqmatch?: Entity1LoadMatch, ctrl?: Control): Promise<Entity1Entity>;
}
export { Entity1Entity };
