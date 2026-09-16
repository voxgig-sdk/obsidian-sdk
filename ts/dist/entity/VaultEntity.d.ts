import { ObsidianEntityBase } from '../ObsidianEntityBase';
import type { ObsidianSDK } from '../ObsidianSDK';
import type { Control } from '../types';
import type { Vault, VaultLoadMatch, VaultListMatch, VaultCreateData, VaultUpdateData, VaultRemoveMatch } from '../ObsidianTypes';
declare class VaultEntity extends ObsidianEntityBase<Vault> {
    constructor(client: ObsidianSDK, entopts: any);
    make(this: VaultEntity): VaultEntity;
    load(this: any, reqmatch?: VaultLoadMatch, ctrl?: Control): Promise<VaultEntity>;
    list(this: any, reqmatch?: VaultListMatch, ctrl?: Control): Promise<VaultEntity[]>;
    create(this: any, reqdata?: VaultCreateData, ctrl?: Control): Promise<VaultEntity>;
    update(this: any, reqdata?: VaultUpdateData, ctrl?: Control): Promise<VaultEntity>;
    remove(this: any, reqmatch?: VaultRemoveMatch, ctrl?: Control): Promise<VaultEntity>;
}
export { VaultEntity };
