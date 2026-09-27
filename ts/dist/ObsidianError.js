"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObsidianError = void 0;
class ObsidianError extends Error {
    isObsidianError = true;
    sdk = 'Obsidian';
    code;
    ctx;
    status = -1;
    // `err.notFound` rather than a magic number at every call site.
    get notFound() { return 404 === this.status; }
    constructor(code, msg, ctx) {
        super(msg);
        this.code = code;
        this.ctx = ctx;
    }
}
exports.ObsidianError = ObsidianError;
//# sourceMappingURL=ObsidianError.js.map