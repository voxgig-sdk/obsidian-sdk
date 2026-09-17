import { ObsidianEntityBase } from '../ObsidianEntityBase';
import type { ObsidianSDK } from '../ObsidianSDK';
import type { Control } from '../types';
import type { Mcp, McpLoadMatch, McpCreateData } from '../ObsidianTypes';
declare class McpEntity extends ObsidianEntityBase<Mcp> {
    constructor(client: ObsidianSDK, entopts: any);
    make(this: McpEntity): McpEntity;
    load(this: any, reqmatch?: McpLoadMatch, ctrl?: Control): Promise<McpEntity>;
    create(this: any, reqdata?: McpCreateData, ctrl?: Control): Promise<McpEntity>;
}
export { McpEntity };
