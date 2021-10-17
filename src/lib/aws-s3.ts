import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { AwsConfig, AwsSdk } from "./aws-config";

/**
 * AwsS3のsdk
 * APIをimportするのはlib内だけにとどめることによって、APIのversion変更や、別のAPIを使用するとなった時に影響範囲が小さくて済むようにした
 * この先、DBを使用する必要が出てきた場合、nodejs では　entity, factory を用いるORMapperが多いので、DDDに習って記述できる
 * @TODO putObjectメソッドの実装。スクリプトをAWSコンソールでの初期操作なしで実行可能とする
 * */
export class AwsS3Api extends AwsSdk {
  private client: S3Client;

  constructor(input?: AwsConfig) {
    super(input);
    this.client = new S3Client({});
  }

  /**
   * バケット名とobject_key名を指定してS3Object全体を取得する
   * @TODO バケットが見つからないときのエラー処理
   *  */
  getObject(input: { bucketName: string; key: string }) {
    const command = new GetObjectCommand({
      Bucket: input.bucketName,
      Key: input.key,
    });
    return this.client.send(command);
  }
}
