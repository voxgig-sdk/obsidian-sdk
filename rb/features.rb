# Obsidian SDK feature factory

require_relative 'feature/base_feature'
require_relative 'feature/debug_feature'
require_relative 'feature/idempotency_feature'
require_relative 'feature/metrics_feature'
require_relative 'feature/paging_feature'
require_relative 'feature/ratelimit_feature'
require_relative 'feature/retry_feature'
require_relative 'feature/test_feature'
require_relative 'feature/timeout_feature'


module ObsidianFeatures
  def self.make_feature(name)
    case name
    when "base"
      ObsidianBaseFeature.new
    when "debug"
      ObsidianDebugFeature.new
    when "idempotency"
      ObsidianIdempotencyFeature.new
    when "metrics"
      ObsidianMetricsFeature.new
    when "paging"
      ObsidianPagingFeature.new
    when "ratelimit"
      ObsidianRatelimitFeature.new
    when "retry"
      ObsidianRetryFeature.new
    when "test"
      ObsidianTestFeature.new
    when "timeout"
      ObsidianTimeoutFeature.new
    else
      ObsidianBaseFeature.new
    end
  end
end
