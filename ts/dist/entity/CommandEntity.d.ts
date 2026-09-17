import { ObsidianEntityBase } from '../ObsidianEntityBase';
import type { ObsidianSDK } from '../ObsidianSDK';
import type { Control } from '../types';
import type { Command, CommandListMatch, CommandCreateData } from '../ObsidianTypes';
declare class CommandEntity extends ObsidianEntityBase<Command> {
    constructor(client: ObsidianSDK, entopts: any);
    make(this: CommandEntity): CommandEntity;
    list(this: any, reqmatch?: CommandListMatch, ctrl?: Control): Promise<CommandEntity[]>;
    create(this: any, reqdata?: CommandCreateData, ctrl?: Control): Promise<CommandEntity>;
}
export { CommandEntity };
