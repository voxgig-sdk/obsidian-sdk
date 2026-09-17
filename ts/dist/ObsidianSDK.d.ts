import { ActiveEntity } from './entity/ActiveEntity';
import { CommandEntity } from './entity/CommandEntity';
import { Entity1Entity } from './entity/Entity1Entity';
import { McpEntity } from './entity/McpEntity';
import { OpenEntity } from './entity/OpenEntity';
import { SearchEntity } from './entity/SearchEntity';
import { SystemEntity } from './entity/SystemEntity';
import { TagEntity } from './entity/TagEntity';
import { VaultEntity } from './entity/VaultEntity';
export type * from './ObsidianTypes';
import { inspect } from 'node:util';
import type { Context, Feature } from './types';
import { config } from './Config';
import { ObsidianEntityBase } from './ObsidianEntityBase';
import { Utility } from './utility/Utility';
import { BaseFeature } from './feature/base/BaseFeature';
declare const stdutil: Utility;
declare class ObsidianSDK {
    _mode: string;
    _options: any;
    _utility: Utility;
    _features: Feature[];
    _rootctx: Context;
    constructor(options?: any);
    options(): any;
    utility(): any;
    prepare(fetchargs?: any): Promise<any>;
    direct(fetchargs?: any): Promise<Error | {
        ok: boolean;
        status: number;
        headers: any;
        data: any;
        err?: undefined;
    } | {
        ok: boolean;
        err: any;
        status?: undefined;
        headers?: undefined;
        data?: undefined;
    }>;
    _rawRequest(fetchargs?: any): Promise<Error | {
        ok: boolean;
        status: number;
        headers: any;
        data: any;
        err?: undefined;
    } | {
        ok: boolean;
        err: any;
        status?: undefined;
        headers?: undefined;
        data?: undefined;
    }>;
    graphql(query: string, variables?: any, ctrl?: any): Promise<any>;
    Active(entopts?: Record<string, any>): ActiveEntity;
    Command(entopts?: Record<string, any>): CommandEntity;
    Entity1(entopts?: Record<string, any>): Entity1Entity;
    Mcp(entopts?: Record<string, any>): McpEntity;
    Open(entopts?: Record<string, any>): OpenEntity;
    Search(entopts?: Record<string, any>): SearchEntity;
    System(entopts?: Record<string, any>): SystemEntity;
    Tag(entopts?: Record<string, any>): TagEntity;
    Vault(entopts?: Record<string, any>): VaultEntity;
    static test(testoptsarg?: any, sdkoptsarg?: any): ObsidianSDK;
    tester(testopts?: any, sdkopts?: any): ObsidianSDK;
    toJSON(): {
        name: string;
    };
    toString(): string;
    [inspect.custom](): string;
}
declare const SDK: typeof ObsidianSDK;
export { stdutil, config, BaseFeature, ObsidianEntityBase, ObsidianSDK, SDK, };
