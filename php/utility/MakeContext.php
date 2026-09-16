<?php
declare(strict_types=1);

// Obsidian SDK utility: make_context

require_once __DIR__ . '/../core/Context.php';

class ObsidianMakeContext
{
    public static function call(array $ctxmap, ?ObsidianContext $basectx): ObsidianContext
    {
        return new ObsidianContext($ctxmap, $basectx);
    }
}
