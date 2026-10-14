# Obsidian SDK utility: prepare_body
require_relative 'media'
module ObsidianUtilities
  PrepareBody = ->(ctx) {
    return nil unless ctx.op.input == "data"
    return ObsidianUtilities.raw_body(ctx.reqdata) if ObsidianUtilities.raw_request?(ctx.point)
    ctx.utility.transform_request.call(ctx)
  }
end
