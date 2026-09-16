-- Obsidian SDK exists test

local sdk = require("obsidian_sdk")

describe("ObsidianSDK", function()
  it("should create test SDK", function()
    local testsdk = sdk.test(nil, nil)
    assert.is_not_nil(testsdk)
  end)
end)
