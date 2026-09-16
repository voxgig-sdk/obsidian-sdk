<?php
declare(strict_types=1);

// Obsidian SDK exists test

require_once __DIR__ . '/../obsidian_sdk.php';

use PHPUnit\Framework\TestCase;

class ExistsTest extends TestCase
{
    public function test_create_test_sdk(): void
    {
        $testsdk = ObsidianSDK::test(null, null);
        $this->assertNotNull($testsdk);
    }
}
