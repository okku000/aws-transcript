"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsTranscribeApi = void 0;
const client_transcribe_1 = require("@aws-sdk/client-transcribe");
const streamToString_1 = require("../utils/streamToString");
const timer_1 = require("../utils/timer");
const aws_config_1 = require("./aws-config");
const aws_s3_1 = require("./aws-s3");
class AwsTranscribeApi extends aws_config_1.AwsSdk {
    constructor(input) {
        super(input.config);
        this.AWS_TRANSCRIPT_JOB_STATUS = client_transcribe_1.TranscriptionJobStatus;
        this.client = new client_transcribe_1.TranscribeClient({});
        this.fileName = input.fileName;
        this.bucketName = input.bucketName;
        this.outputBucketName = input.outputBucketName;
        this.bucket = new aws_s3_1.AwsS3Api();
    }
    async createOrSkipJob() {
        if (await this.isJobDefined())
            return false;
        const params = {
            TranscriptionJobName: this.fileName,
            LanguageCode: "ja-JP",
            MediaFormat: "wav",
            OutputBucketName: this.outputBucketName,
            Media: {
                MediaFileUri: `s3://${this.bucketName}/${this.fileName}`,
            },
        };
        await this.client.send(new client_transcribe_1.StartTranscriptionJobCommand(params));
        await timer_1.timer(30000);
        return true;
    }
    async fetchTranscribedVoice() {
        const status = await this.checkJobStatus();
        if (status !== client_transcribe_1.TranscriptionJobStatus.COMPLETED)
            return;
        const response = await this.bucket.getObject({
            bucketName: this.outputBucketName,
            key: this.fileName + ".json",
        });
        const bodyContents = JSON.parse(await streamToString_1.streamToString(response.Body));
        return bodyContents["results"]["transcripts"][0]["transcript"];
    }
    async checkJobStatus() {
        var _a;
        if (!this.isJobDefined())
            return;
        const tryFetch = await this.client.send(new client_transcribe_1.GetTranscriptionJobCommand({
            TranscriptionJobName: this.fileName,
        }));
        return (_a = tryFetch.TranscriptionJob) === null || _a === void 0 ? void 0 : _a.TranscriptionJobStatus;
    }
    async isJobDefined() {
        const params = {
            JobNameContains: this.fileName,
        };
        const response = await this.client.send(new client_transcribe_1.ListTranscriptionJobsCommand(params));
        if (response.TranscriptionJobSummaries === undefined ||
            response.TranscriptionJobSummaries.length === 0) {
            return false;
        }
        return true;
    }
}
exports.AwsTranscribeApi = AwsTranscribeApi;
//# sourceMappingURL=aws-transcribe-api.js.map