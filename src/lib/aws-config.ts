import AWS from "aws-sdk";

export interface AwsConfig {
  credentials?: Pick<AWS.Credentials, "accessKeyId" | "secretAccessKey">;
  region?: string;
}

/**
 * AWSのconfig initializer
 * サービスによって、AWSアカウントを変更したい時に変更可能にする
 */
export class AwsSdk {
  constructor(input?: AwsConfig) {
    const accessKeyId = input?.credentials?.accessKeyId
      ? input.credentials.accessKeyId
      : process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = input?.credentials?.secretAccessKey
      ? input.credentials.secretAccessKey
      : process.env.AWS_SECRET_ACCESS_KEY;
    const region = input?.region ? input.region : process.env.AWS_REGION;
    new AWS.Config({ credentials: { accessKeyId, secretAccessKey }, region });
  }
}
