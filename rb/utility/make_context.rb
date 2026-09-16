# Obsidian SDK utility: make_context
require_relative '../core/context'
module ObsidianUtilities
  MakeContext = ->(ctxmap, basectx) {
    ObsidianContext.new(ctxmap, basectx)
  }
end
