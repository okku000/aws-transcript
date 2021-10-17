"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsS3Api = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const aws_config_1 = require("./aws-config");
class AwsS3Api extends aws_config_1.AwsSdk {
    constructor(input) {
        super(input);
        this.client = new client_s3_1.S3Client({});
    }
    getObject(input) {
        const command = new client_s3_1.GetObjectCommand({
            Bucket: input.bucketName,
            Key: input.key,
        });
        return this.client.send(command);
    }
}
exports.AwsS3Api = AwsS3Api;
//# sourceMappingURL=aws-s3.js.map