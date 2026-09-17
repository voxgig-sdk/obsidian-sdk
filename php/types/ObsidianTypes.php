<?php
declare(strict_types=1);

// Typed models for the Obsidian SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
// params (op.<name>.points[].args.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.
//
// These are documentation-grade value objects (PHP 8 typed properties),
// registered on the composer classmap autoload. The SDK boundary exchanges
// assoc-arrays; these classes name the shapes for tooling and typed callers.

/** Active entity data model. */
class Active
{
    public ?string $content = null;
    public ?bool $createTargetIfMissing = null;
    public array $destination;
    public ?string $ifMatch = null;
    public string $operation;
    public ?bool $rejectIfContentPreexists = null;
    public ?string $scope = null;
    public mixed $target;
    public string $targetType;
    public mixed $value = null;
    public ?int $within = null;
}

/** Request payload for Active#load. */
class ActiveLoadMatch
{
    public ?string $content = null;
    public ?bool $createTargetIfMissing = null;
    public ?array $destination = null;
    public ?string $ifMatch = null;
    public ?string $operation = null;
    public ?bool $rejectIfContentPreexists = null;
    public ?string $scope = null;
    public mixed $target = null;
    public ?string $targetType = null;
    public mixed $value = null;
    public ?int $within = null;
}

/** Request payload for Active#create. */
class ActiveCreateData
{
    public ?string $content = null;
    public ?bool $createTargetIfMissing = null;
    public array $destination;
    public ?string $ifMatch = null;
    public string $operation;
    public ?bool $rejectIfContentPreexists = null;
    public ?string $scope = null;
    public mixed $target;
    public string $targetType;
    public mixed $value = null;
    public ?int $within = null;
}

/** Request payload for Active#update. */
class ActiveUpdateData
{
    public ?string $content = null;
    public ?bool $createTargetIfMissing = null;
    public ?array $destination = null;
    public ?string $ifMatch = null;
    public ?string $operation = null;
    public ?bool $rejectIfContentPreexists = null;
    public ?string $scope = null;
    public mixed $target = null;
    public ?string $targetType = null;
    public mixed $value = null;
    public ?int $within = null;
}

/** Request payload for Active#remove. */
class ActiveRemoveMatch
{
    public ?string $permanent = null;
}

/** Command entity data model. */
class Command
{
    public ?string $id = null;
    public ?string $name = null;
}

/** Request payload for Command#list. */
class CommandListMatch
{
    public ?string $id = null;
    public ?string $name = null;
}

/** Request payload for Command#create. */
class CommandCreateData
{
    public string $id;
    public ?string $name = null;
}

/** Entity1 entity data model. */
class Entity1
{
    public ?string $obsidian = null;
    public ?string $self = null;
}

/** Request payload for Entity1#load. */
class Entity1LoadMatch
{
    public ?string $obsidian = null;
    public ?string $self = null;
}

/** Mcp entity data model. */
class Mcp
{
    public ?string $id = null;
    public string $jsonrpc;
    public string $method;
    public ?array $params = null;
}

/** Request payload for Mcp#load. */
class McpLoadMatch
{
    public string $id;
    public ?string $jsonrpc = null;
    public ?string $method = null;
    public ?array $params = null;
}

/** Request payload for Mcp#create. */
class McpCreateData
{
    public ?string $id = null;
    public string $jsonrpc;
    public string $method;
    public ?array $params = null;
}

/** Open entity data model. */
class Open
{
    public ?string $id = null;
}

/** Request payload for Open#create. */
class OpenCreateData
{
    public string $id;
    public ?bool $new_leaf = null;
}

/** Search entity data model. */
class Search
{
}

/** Request payload for Search#create. */
class SearchCreateData
{
}

/** System entity data model. */
class System
{
}

/** Request payload for System#load. */
class SystemLoadMatch
{
}

/** Tag entity data model. */
class Tag
{
    public ?float $count = null;
    public ?string $name = null;
}

/** Request payload for Tag#list. */
class TagListMatch
{
    public ?float $count = null;
    public ?string $name = null;
}

/** Vault entity data model. */
class Vault
{
    public ?string $content = null;
    public ?bool $createTargetIfMissing = null;
    public array $destination;
    public ?array $files = null;
    public ?string $id = null;
    public ?string $ifMatch = null;
    public string $operation;
    public ?bool $rejectIfContentPreexists = null;
    public ?string $scope = null;
    public mixed $target;
    public string $targetType;
    public mixed $value = null;
    public ?int $within = null;
}

/** Request payload for Vault#load. */
class VaultLoadMatch
{
    public string $id;
}

/** Request payload for Vault#list. */
class VaultListMatch
{
    public ?string $content = null;
    public ?bool $createTargetIfMissing = null;
    public ?array $destination = null;
    public ?array $files = null;
    public ?string $id = null;
    public ?string $ifMatch = null;
    public ?string $operation = null;
    public ?bool $rejectIfContentPreexists = null;
    public ?string $scope = null;
    public mixed $target = null;
    public ?string $targetType = null;
    public mixed $value = null;
    public ?int $within = null;
}

/** Request payload for Vault#create. */
class VaultCreateData
{
    public string $id;
    public ?string $content = null;
    public ?bool $createTargetIfMissing = null;
    public array $destination;
    public ?array $files = null;
    public ?string $ifMatch = null;
    public string $operation;
    public ?bool $rejectIfContentPreexists = null;
    public ?string $scope = null;
    public mixed $target;
    public string $targetType;
    public mixed $value = null;
    public ?int $within = null;
}

/** Request payload for Vault#update. */
class VaultUpdateData
{
    public string $id;
    public ?string $content = null;
    public ?bool $createTargetIfMissing = null;
    public ?array $destination = null;
    public ?array $files = null;
    public ?string $ifMatch = null;
    public ?string $operation = null;
    public ?bool $rejectIfContentPreexists = null;
    public ?string $scope = null;
    public mixed $target = null;
    public ?string $targetType = null;
    public mixed $value = null;
    public ?int $within = null;
}

/** Request payload for Vault#remove. */
class VaultRemoveMatch
{
    public string $id;
    public ?string $permanent = null;
}

