export interface Tag {
    count?: number;
    name?: string;
}
export interface TagListMatch {
    count?: number;
    name?: string;
}
export interface Vault {
    content?: string;
    createTargetIfMissing?: boolean;
    destination: Record<string, any>;
    files?: any[];
    id?: string;
    ifMatch?: string;
    operation: string;
    rejectIfContentPreexists?: boolean;
    scope?: string;
    target: any;
    targetType: string;
    value?: any;
    within?: number;
}
export interface VaultLoadMatch {
    id: string;
}
export interface VaultListMatch {
    content?: string;
    createTargetIfMissing?: boolean;
    destination?: Record<string, any>;
    files?: any[];
    id?: string;
    ifMatch?: string;
    operation?: string;
    rejectIfContentPreexists?: boolean;
    scope?: string;
    target?: any;
    targetType?: string;
    value?: any;
    within?: number;
}
export interface VaultCreateData {
    id: string;
    content?: string;
    createTargetIfMissing?: boolean;
    destination: Record<string, any>;
    files?: any[];
    ifMatch?: string;
    operation: string;
    rejectIfContentPreexists?: boolean;
    scope?: string;
    target: any;
    targetType: string;
    value?: any;
    within?: number;
}
export interface VaultUpdateData {
    id: string;
    content?: string;
    createTargetIfMissing?: boolean;
    destination?: Record<string, any>;
    files?: any[];
    ifMatch?: string;
    operation?: string;
    rejectIfContentPreexists?: boolean;
    scope?: string;
    target?: any;
    targetType?: string;
    value?: any;
    within?: number;
}
export interface VaultRemoveMatch {
    id: string;
    permanent?: string;
}
