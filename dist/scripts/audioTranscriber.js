"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_transcribe_api_1 = require("../lib/aws-transcribe-api");
const audio_text_service_1 = require("../services/audio-text-service");
const assertion_1 = require("../utils/assertion");
const main = async () => {
    let words = process.argv.slice(2);
    const fileName = words.shift();
    assertion_1.assertIsDefined(fileName, "ファイル名が指定されていません");
    const bucketName = words.shift();
    assertion_1.assertIsDefined(bucketName, "s3バケット名が指定されていません");
    const outputBucketName = words.shift();
    assertion_1.assertIsDefined(outputBucketName, "アウトプット用のs3バケット名が指定されていません");
    assertion_1.assertIsDefined(words, "検索したい単語を指定してください");
    const client = new aws_transcribe_api_1.AwsTranscribeApi({
        fileName,
        bucketName,
        outputBucketName,
    });
    await client.createOrSkipJob();
    const jobStatus = await client.checkJobStatus();
    if (!jobStatus || jobStatus !== client.AWS_TRANSCRIPT_JOB_STATUS.COMPLETED)
        new Error("しばらく後に再度スクリプトを実行してください");
    const service = await new audio_text_service_1.AudioTextService({ client }).build();
    const results = service.findTargetWords(words);
    if (!results) {
        console.log("検索結果はありません");
        return;
    }
    console.log(results);
};
main().catch((e) => {
    console.error(e);
});
//# sourceMappingURL=audioTranscriber.js.map