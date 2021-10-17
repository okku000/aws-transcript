"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.timer = void 0;
const util_1 = __importDefault(require("util"));
exports.timer = util_1.default.promisify(setTimeout);
//# sourceMappingURL=timer.js.map