import { ObsidianEntityBase } from '../ObsidianEntityBase';
import type { ObsidianSDK } from '../ObsidianSDK';
import type { Control } from '../types';
import type { Open, OpenCreateData } from '../ObsidianTypes';
declare class OpenEntity extends ObsidianEntityBase<Open> {
    constructor(client: ObsidianSDK, entopts: any);
    make(this: OpenEntity): OpenEntity;
    create(this: any, reqdata?: OpenCreateData, ctrl?: Control): Promise<OpenEntity>;
}
export { OpenEntity };
