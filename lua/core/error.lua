-- Obsidian SDK error

local ObsidianError = {}
ObsidianError.__index = ObsidianError


function ObsidianError.new(code, msg, ctx)
  local self = setmetatable({}, ObsidianError)
  self.is_sdk_error = true
  self.sdk = "Obsidian"
  self.code = code or ""
  self.msg = msg or ""
  self.ctx = ctx
  self.result = nil
  self.spec = nil
  return self
end


function ObsidianError:error()
  return self.msg
end


function ObsidianError:__tostring()
  return self.msg
end


return ObsidianError
