import {
  GetTranscriptionJobCommand,
  ListTranscriptionJobsCommand,
  ListTranscriptionJobsCommandInput,
  StartTranscriptionJobCommand,
  StartTranscriptionJobCommandInput,
  TranscribeClient,
  TranscriptionJobStatus,
} from "@aws-sdk/client-transcribe";
import { Readable } from "stream";
import { streamToString } from "../utils/streamToString";
import { timer } from "../utils/timer";
import { AwsConfig, AwsSdk } from "./aws-config";
import { AwsS3Api } from "./aws-s3";

interface TranscriptedVoice {
  results: { transcripts: { transcript: string }[] };
}

/**
 * For best results:
 * Use a lossless format. You can choose either FLAC, or WAV with PCM 16-bit encoding.
 * Use a sample rate of 8000 Hz for telephone audio.
 * fileName は　In FLAC, MP3, MP4, Ogg, WebM, AMR, or WAV file format including extensions. Less than 4 hours in length and less than 2 GB in size (500 MB for call analytics jobs)
 *
 * APIをimportするのはlib内だけにとどめることによって、APIのversion変更や、別のAPIを使用するとなった時に影響範囲が小さくて済むようにした。
 *
 * @TODO API通信が存在するメソッドについてAPIが想定した値を返すかどうかを見る
 */
export class AwsTranscribeApi extends AwsSdk {
  AWS_TRANSCRIPT_JOB_STATUS = TranscriptionJobStatus;
  private client: TranscribeClient;
  private outputBucketName: string;
  private bucketName: string;
  private fileName: string;
  private bucket: AwsS3Api;

  constructor(input: {
    fileName: string;
    bucketName: string;
    outputBucketName: string;
    transcribeRegion?: string;
    config?: AwsConfig;
  }) {
    super(input.config);
    this.client = new TranscribeClient({});
    this.fileName = input.fileName;
    this.bucketName = input.bucketName;
    this.outputBucketName = input.outputBucketName;
    this.bucket = new AwsS3Api();
  }

  /**
   * jobがすでにある場合はスキップない場合は新規作成する。
   * @TODO jobが反映されるまで30秒決め打ちで待っているが、long polling 的なことを実装して、確実に返ってくるのを保証する
   * @TODO LanguageCode, MediaFormat の汎用性
   */
  async createOrSkipJob() {
    if (await this.isJobDefined()) return false;

    const params: StartTranscriptionJobCommandInput = {
      TranscriptionJobName: this.fileName,
      LanguageCode: "ja-JP",
      MediaFormat: "wav",
      OutputBucketName: this.outputBucketName,
      Media: {
        MediaFileUri: `s3://${this.bucketName}/${this.fileName}`,
      },
    };

    await this.client.send(new StartTranscriptionJobCommand(params));
    // jobを新規作成する場合、反映されるまで20秒前後かかるので、一旦30秒待つ
    await timer(30000);
    return true;
  }

  /**
   * AWS transcribeは作成したoutputファイルをs3に送信する。
   * s3からデータ全体を取得後、結果のテキストだけを取得する。
   */
  async fetchTranscribedVoice() {
    const status = await this.checkJobStatus();
    if (status !== TranscriptionJobStatus.COMPLETED) return;

    const response = await this.bucket.getObject({
      bucketName: this.outputBucketName!,
      key: this.fileName + ".json",
    });
    const bodyContents = JSON.parse(
      await streamToString(response.Body as Readable)
    ) as TranscriptedVoice;

    return bodyContents["results"]["transcripts"][0]["transcript"];
  }

  /**
   * transcribeが完了しているかどうかチェックする
   */
  async checkJobStatus() {
    if (!this.isJobDefined()) return;

    const tryFetch = await this.client.send(
      new GetTranscriptionJobCommand({
        TranscriptionJobName: this.fileName,
      })
    );

    return tryFetch.TranscriptionJob
      ?.TranscriptionJobStatus as TranscriptionJobStatus;
  }

  /**
   * すでにtranscribeされているファイルどうかチェックする
   */
  private async isJobDefined() {
    const params: ListTranscriptionJobsCommandInput = {
      JobNameContains: this.fileName,
    };
    const response = await this.client.send(
      new ListTranscriptionJobsCommand(params)
    );
    if (
      response.TranscriptionJobSummaries === undefined ||
      response.TranscriptionJobSummaries.length === 0
    ) {
      return false;
    }
    return true;
  }
}
