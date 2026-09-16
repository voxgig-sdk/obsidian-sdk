# Obsidian SDK exists test

import pytest
from obsidian_sdk import ObsidianSDK


class TestExists:

    def test_should_create_test_sdk(self):
        testsdk = ObsidianSDK.test(None, None)
        assert testsdk is not None
