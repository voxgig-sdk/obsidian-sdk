# Obsidian SDK utility: make_context

from obsidian_sdk.core.context import ObsidianContext


def make_context_util(ctxmap, basectx):
    return ObsidianContext(ctxmap, basectx)
