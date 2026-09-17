package core

var UtilityRegistrar func(u *Utility)

var NewBaseFeatureFunc func() Feature

var NewDebugFeatureFunc func() Feature

var NewIdempotencyFeatureFunc func() Feature

var NewMetricsFeatureFunc func() Feature

var NewPagingFeatureFunc func() Feature

var NewRatelimitFeatureFunc func() Feature

var NewRetryFeatureFunc func() Feature

var NewTestFeatureFunc func() Feature

var NewTimeoutFeatureFunc func() Feature

var NewActiveEntityFunc func(client *ObsidianSDK, entopts map[string]any) ObsidianEntity

var NewCommandEntityFunc func(client *ObsidianSDK, entopts map[string]any) ObsidianEntity

var NewEntity1EntityFunc func(client *ObsidianSDK, entopts map[string]any) ObsidianEntity

var NewMcpEntityFunc func(client *ObsidianSDK, entopts map[string]any) ObsidianEntity

var NewOpenEntityFunc func(client *ObsidianSDK, entopts map[string]any) ObsidianEntity

var NewSearchEntityFunc func(client *ObsidianSDK, entopts map[string]any) ObsidianEntity

var NewSystemEntityFunc func(client *ObsidianSDK, entopts map[string]any) ObsidianEntity

var NewTagEntityFunc func(client *ObsidianSDK, entopts map[string]any) ObsidianEntity

var NewVaultEntityFunc func(client *ObsidianSDK, entopts map[string]any) ObsidianEntity

