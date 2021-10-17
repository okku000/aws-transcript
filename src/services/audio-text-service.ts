import { AwsTranscribeApi } from "../lib/aws-transcribe-api";
import { isEmptyObject } from "../utils/isEmptyObject";

interface WordLocation {
  start: number;
  end: number;
  flow: string;
}
interface WordInfo {
  [key: string]: WordLocation[];
}

/**
 * テキスト操作のビジネスロジック
 *
 * ロジックを小分けにすることによって
 * ユニットテストを簡単に実装可能にする
 * build() で非同期初期化を実現する
 *
 * @TODO export メソッドの実装。取得した結果を望む形で出力するメソッド e.g. .txt .csv
 */
export class AudioTextService {
  private FLOW_OFFSET = 5;
  private client: AwsTranscribeApi;
  private text: string;

  constructor(input: { client: AwsTranscribeApi }) {
    this.client = input.client;
  }

  /**
   * 非同期処理を含むinitializer
   * @TODO textのundefined処理
   */
  async build() {
    const text = await this.client.fetchTranscribedVoice();
    this.text = text!;
    return this;
  }

  /**
   * targetの単語群が検索先テキストのどの場所にあるかを判定する
   */
  findTargetWords(targets: string[]) {
    let informations: WordInfo = {};
    for (let target of targets) {
      let result = this.identifyWordLocationInfo(target);
      if (result.length === 0) continue;
      informations[target] = result;
    }

    return isEmptyObject(informations) ? undefined : informations;
  }

  /**
   * targetの単語が検索先テキストのどの場所にあるかを判定する
   */
  private identifyWordLocationInfo(target: string) {
    const regexp = new RegExp(target, "g");
    const matches = this.text.matchAll(regexp);
    let locations: WordLocation[] = [];

    for (const match of matches) {
      if (!match || match.index === undefined) continue;
      const [start, end, startWithOffset, endWithOffset] =
        this.beautifyIndexOfTargetWord({
          maxL: this.text.length,
          start: match.index,
          end: match.index + target.length,
          offset: this.FLOW_OFFSET,
        });
      let location: WordLocation = {
        start,
        end,
        flow: this.text.slice(startWithOffset, endWithOffset),
      };
      locations.push(location);
    }
    return locations;
  }

  /**
   * 単語のlocationIndexを0から検索先のテキストの最大Indexの間に収める
   */
  private beautifyIndexOfTargetWord(input: {
    maxL: number;
    start: number;
    end: number;
    offset: number;
  }) {
    const { maxL, start, end, offset } = input;
    const startWithOffset = start - offset > 0 ? start - offset : 0;
    const endWithOffset = end + offset <= maxL ? end + offset : maxL;
    return [start, end, startWithOffset, endWithOffset];
  }
}
