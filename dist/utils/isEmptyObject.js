"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmptyObject = void 0;
const isEmptyObject = (obj) => {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
};
exports.isEmptyObject = isEmptyObject;
//# sourceMappingURL=isEmptyObject.js.map