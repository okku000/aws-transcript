##　プロジェクトについて

ABC 株式会社様依頼の　音声認識 API デモアプリケーションの基盤

### 詳細な機能

#### 日本語音声データからテキスト・データへの変換

- Aws Transcribe の使用
  理由は、今後音声を amazon connect 等　コールセンター機能から直接つなぎ LiveTranscription を実現する際、便利なため

#### テキスト・データの加工と出力

- 単語別に、単語が見つかった位置、その単語、その単語および単語の前 後 (5 文字ずつ) を含む文字列
- 複数検出された場合は、検出位置の昇順でソートする。

##　使用技術

- Node.js
- Typescript
- aws-sdk
- jest

## テスト方法

1. 前準備:

- 実行環境に yarn をインストール
- 適切な権限(AwsTranscribe の実行権限・s3 の読み書き権限)を持つ AWS のアカウントが作成済みであること
- s3 バケットが 2 つ作成されていること
  - .wav ファイルが保存されているバケット 2.　 AwsTranscribe の結果が送信されるバケット(acl に AwsTranscribe からの書き込みを許可したもの)
  - s3 バケット 1 に解析対象の.wav ファイルが保存されていること

3. 実行準備:

- `yarn install`
- .env.example を参照に.env ファイルを作成
- `yarn gen-env`を実行し、エラーが出ないことを確認

4. 実行方法:

- `yarn build`
- `node dist/scripts/audioTranscriber.js <ファイル名.wav> <s3バケット1の名前> <s3バケット2の名前> <単語 1> <単語 2> .... `

例:

- `node dist/scripts/audioTranscriber.js public_audio_ja-JP_Broadband-sample.wav ibm-interview output-ibm-interview 音声認識 仕組み`

## その他リンク

ここにその他関連リンクを貼る

## 確認したこと

- [ ] 初回のスクリプトが正常に起動すること
- [ ] 2 回目以降のスクリプトが正常に起動すること
- [ ] 検索単語がヒットしなかった場合、その旨を知らせるログがでること
- [ ] 異常な入力をした際、適切なエラーがでること

## RoadMap

もしあれば、Jira の残りチケット等貼る

- [ ] 適切なエラーハンドリング　(API 用のエラー出力やサービス用のエラー出力)
- [ ] 初回の s3 バケットの作成スクリプト
- [ ] API のユニットテスト
- [ ] git 化等バージョン管理
- [ ] Linter 設定
- [ ] CI/CD

## 先方への共有方法

ここにどのような方法で demo アプリを渡すか記入
