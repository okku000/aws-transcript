"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsSdk = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
class AwsSdk {
    constructor(input) {
        var _a, _b;
        const accessKeyId = ((_a = input === null || input === void 0 ? void 0 : input.credentials) === null || _a === void 0 ? void 0 : _a.accessKeyId)
            ? input.credentials.accessKeyId
            : process.env.AWS_ACCESS_KEY_ID;
        const secretAccessKey = ((_b = input === null || input === void 0 ? void 0 : input.credentials) === null || _b === void 0 ? void 0 : _b.secretAccessKey)
            ? input.credentials.secretAccessKey
            : process.env.AWS_SECRET_ACCESS_KEY;
        const region = (input === null || input === void 0 ? void 0 : input.region) ? input.region : process.env.AWS_REGION;
        new aws_sdk_1.default.Config({ credentials: { accessKeyId, secretAccessKey }, region });
    }
}
exports.AwsSdk = AwsSdk;
//# sourceMappingURL=aws-config.js.map