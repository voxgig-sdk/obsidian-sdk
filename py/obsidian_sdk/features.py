# Obsidian SDK feature factory

from obsidian_sdk.feature.base_feature import ObsidianBaseFeature
from obsidian_sdk.feature.debug_feature import ObsidianDebugFeature
from obsidian_sdk.feature.idempotency_feature import ObsidianIdempotencyFeature
from obsidian_sdk.feature.metrics_feature import ObsidianMetricsFeature
from obsidian_sdk.feature.paging_feature import ObsidianPagingFeature
from obsidian_sdk.feature.ratelimit_feature import ObsidianRatelimitFeature
from obsidian_sdk.feature.retry_feature import ObsidianRetryFeature
from obsidian_sdk.feature.test_feature import ObsidianTestFeature
from obsidian_sdk.feature.timeout_feature import ObsidianTimeoutFeature


_FEATURES = {
    "base": lambda: ObsidianBaseFeature(),
    "debug": lambda: ObsidianDebugFeature(),
    "idempotency": lambda: ObsidianIdempotencyFeature(),
    "metrics": lambda: ObsidianMetricsFeature(),
    "paging": lambda: ObsidianPagingFeature(),
    "ratelimit": lambda: ObsidianRatelimitFeature(),
    "retry": lambda: ObsidianRetryFeature(),
    "test": lambda: ObsidianTestFeature(),
    "timeout": lambda: ObsidianTimeoutFeature(),
}


def _make_feature(name):
    factory = _FEATURES.get(name)
    if factory is not None:
        return factory()
    return _FEATURES["base"]()


# True when this SDK was generated with the named feature class - the
# constructor's tolerance for extend-carried features reads this (an
# active name with no generated class must not become a BaseFeature
# stray when an extend instance carries it).
def _has_feature(name):
    return name in _FEATURES
