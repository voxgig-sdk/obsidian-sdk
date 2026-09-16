# Obsidian SDK exists test

require "minitest/autorun"
require_relative "../Obsidian_sdk"

class ExistsTest < Minitest::Test
  def test_create_test_sdk
    testsdk = ObsidianSDK.test(nil, nil)
    assert !testsdk.nil?
  end
end
