<?php
declare(strict_types=1);

// Obsidian SDK base feature

class ObsidianBaseFeature
{
    public string $version;
    public string $name;
    public bool $active;

    // Positions this feature when added via the client `extend` option:
    // "__before__" / "__after__" / "__replace__" name an already-added
    // feature (mirrors the ts feature `_options`). Declared so setting it
    // on an extension instance avoids the dynamic-property deprecation.
    public ?array $_options = null;

    public function __construct()
    {
        $this->version = '0.0.1';
        $this->name = 'base';
        $this->active = true;
    }

    public function get_version(): string { return $this->version; }
    public function get_name(): string { return $this->name; }
    public function get_active(): bool { return $this->active; }

    public function init(ObsidianContext $ctx, array $options): void {}
    public function PostConstruct(ObsidianContext $ctx): void {}
    public function PostConstructEntity(ObsidianContext $ctx): void {}
    public function SetData(ObsidianContext $ctx): void {}
    public function GetData(ObsidianContext $ctx): void {}
    public function GetMatch(ObsidianContext $ctx): void {}
    public function SetMatch(ObsidianContext $ctx): void {}
    public function PrePoint(ObsidianContext $ctx): void {}
    public function PreSpec(ObsidianContext $ctx): void {}
    public function PreRequest(ObsidianContext $ctx): void {}
    public function PreResponse(ObsidianContext $ctx): void {}
    public function PreResult(ObsidianContext $ctx): void {}
    public function PreDone(ObsidianContext $ctx): void {}
    public function PreUnexpected(ObsidianContext $ctx): void {}
}
