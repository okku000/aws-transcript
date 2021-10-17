"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertIsDefined = void 0;
function assertIsDefined(val, errorMessage) {
    errorMessage || (errorMessage = `Expected 'val' to be defined, but received ${val}`);
    if (val === undefined || val === null) {
        throw new Error(errorMessage);
    }
}
exports.assertIsDefined = assertIsDefined;
//# sourceMappingURL=assertion.js.map