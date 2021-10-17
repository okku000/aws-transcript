import { AwsTranscribeApi } from "../lib/aws-transcribe-api";
import { AudioTextService } from "../services/audio-text-service";
import { assertIsDefined } from "../utils/assertion";

/**
 * スクリプトにビジネスロジックを持たない
 */
const main = async () => {
  let words = process.argv.slice(2);
  const fileName = words.shift();
  assertIsDefined(fileName, "ファイル名が指定されていません");
  const bucketName = words.shift();
  assertIsDefined(bucketName, "s3バケット名が指定されていません");
  const outputBucketName = words.shift();
  assertIsDefined(
    outputBucketName,
    "アウトプット用のs3バケット名が指定されていません"
  );
  assertIsDefined(words, "検索したい単語を指定してください");

  const client = new AwsTranscribeApi({
    fileName,
    bucketName,
    outputBucketName,
  });
  await client.createOrSkipJob();
  const jobStatus = await client.checkJobStatus();
  if (!jobStatus || jobStatus !== client.AWS_TRANSCRIPT_JOB_STATUS.COMPLETED)
    new Error("しばらく後に再度スクリプトを実行してください");
  const service = await new AudioTextService({ client }).build();
  const results = service.findTargetWords(words);
  if (!results) {
    console.log("検索結果はありません");
    return;
  }
  /**
   * @TODO STDOUTではなく、.txt や　.csv等指定された形にexportする機能
   *
   * */
  console.log(results);
};
main().catch((e) => {
  console.error(e);
});
