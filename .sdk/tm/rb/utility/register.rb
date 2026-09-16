# Obsidian SDK utility registration
require_relative '../core/utility_type'
require_relative 'clean'
require_relative 'done'
require_relative 'make_error'
require_relative 'feature_add'
require_relative 'feature_hook'
require_relative 'feature_init'
require_relative 'fetcher'
require_relative 'make_fetch_def'
require_relative 'make_context'
require_relative 'make_options'
require_relative 'make_request'
require_relative 'make_response'
require_relative 'make_result'
require_relative 'make_point'
require_relative 'make_spec'
require_relative 'make_url'
require_relative 'param'
require_relative 'prepare_auth'
require_relative 'prepare_body'
require_relative 'prepare_headers'
require_relative 'prepare_method'
require_relative 'prepare_params'
require_relative 'prepare_path'
require_relative 'prepare_query'
require_relative 'graphql'
require_relative 'result_basic'
require_relative 'result_body'
require_relative 'result_headers'
require_relative 'transform_request'
require_relative 'transform_response'

ObsidianUtility.registrar = ->(u) {
  u.clean = ObsidianUtilities::Clean
  u.done = ObsidianUtilities::Done
  u.make_error = ObsidianUtilities::MakeError
  u.feature_add = ObsidianUtilities::FeatureAdd
  u.feature_hook = ObsidianUtilities::FeatureHook
  u.feature_init = ObsidianUtilities::FeatureInit
  u.fetcher = ObsidianUtilities::Fetcher
  u.make_fetch_def = ObsidianUtilities::MakeFetchDef
  u.make_context = ObsidianUtilities::MakeContext
  u.make_options = ObsidianUtilities::MakeOptions
  u.make_request = ObsidianUtilities::MakeRequest
  u.make_response = ObsidianUtilities::MakeResponse
  u.make_result = ObsidianUtilities::MakeResult
  u.make_point = ObsidianUtilities::MakePoint
  u.make_spec = ObsidianUtilities::MakeSpec
  u.make_url = ObsidianUtilities::MakeUrl
  u.param = ObsidianUtilities::Param
  u.prepare_auth = ObsidianUtilities::PrepareAuth
  u.prepare_body = ObsidianUtilities::PrepareBody
  u.prepare_headers = ObsidianUtilities::PrepareHeaders
  u.prepare_method = ObsidianUtilities::PrepareMethod
  u.prepare_params = ObsidianUtilities::PrepareParams
  u.prepare_path = ObsidianUtilities::PreparePath
  u.prepare_query = ObsidianUtilities::PrepareQuery
  u.graphql_body = ObsidianUtilities::GraphqlBody
  u.graphql_errors = ObsidianUtilities::GraphqlErrors
  u.result_basic = ObsidianUtilities::ResultBasic
  u.result_body = ObsidianUtilities::ResultBody
  u.result_headers = ObsidianUtilities::ResultHeaders
  u.transform_request = ObsidianUtilities::TransformRequest
  u.transform_response = ObsidianUtilities::TransformResponse
}
