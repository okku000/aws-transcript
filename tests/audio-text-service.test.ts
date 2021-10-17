/**
 * APIは常に想定したレスポンスが返ってくるものとするので、テストはない
 */
import { AudioTextService } from "../src/services/audio-text-service";
import { AwsTranscribeApi } from "../src/lib/aws-transcribe-api";

jest.mock("../src/lib/aws-transcribe-api");
const mock = AwsTranscribeApi as jest.Mocked<typeof AwsTranscribeApi>;

describe("audi-text-service", () => {
  const api = new mock({
    fileName: "",
    bucketName: "",
    outputBucketName: "",
  });
  const service = new AudioTextService({ client: api });
  service["FLOW_OFFSET"] = 5;
  const defaultText =
    "ああああああてすといいいいいいいいいいてすとうううううううううtestえええええええ";
  const notExistTarget = "abc";
  const existTargets = ["てすと", "test"];

  beforeEach(async () => {
    jest.spyOn(api, "fetchTranscribedVoice").mockResolvedValue(defaultText);
    await service.build();
  });

  describe("#build()", () => {
    it("this.textにAwsTranscribeApiから得た値がはいること", async () => {
      expect(service["text"]).toEqual(defaultText);
    });
  });

  describe("#findTargetWords(targets: string[])", () => {
    it("ターゲット存在する時", async () => {
      const results = service.findTargetWords(existTargets);
      expect(results?.test).toBeTruthy();
      expect(results?.てすと).toBeTruthy();
    });
    it("ターゲットが検索対象に存在しなかった時", async () => {
      const results = service.findTargetWords([notExistTarget]);
      expect(results).toBeUndefined();
    });
  });

  describe("#fetchTranscribedVoice(target: string)", () => {
    it("ターゲットがない時", async () => {
      const results = service["identifyWordLocationInfo"](notExistTarget);
      expect(results).toEqual([]);
    });
    it("ターゲットが複数ある場合", async () => {
      const results = service["identifyWordLocationInfo"](existTargets[0]);
      expect(results.length).toEqual(2);
      expect(results[0].flow).toEqual(
        defaultText.slice(
          results[0].start - service["FLOW_OFFSET"],
          results[0].end + service["FLOW_OFFSET"]
        )
      );
      expect(results[1].flow).toEqual(
        defaultText.slice(
          results[1].start - service["FLOW_OFFSET"],
          results[1].end + service["FLOW_OFFSET"]
        )
      );
    });
  });
  describe("#beautifyIndexOfTargetWord", () => {
    let beautifyIndexOfTargetWord: any;
    const maxL = 20;
    const offset = service["FLOW_OFFSET"];

    beforeEach(() => {
      beautifyIndexOfTargetWord = service["beautifyIndexOfTargetWord"];
    });

    describe("startIndexがFLOW_OFFSETより小さい場所にある時", () => {
      it("", () => {
        const start = 0;
        const end = 13;
        const response = beautifyIndexOfTargetWord({
          start,
          end,
          maxL,
          offset,
        });
        expect(response).toEqual([start, end, 0, end + offset]);
      });
    });
    describe("end+FLOW_OFFSETが検索対象より大きい場所にある時", () => {
      const start = 10;
      const end = 18;
      it("", () => {
        const response = beautifyIndexOfTargetWord({
          start,
          end,
          maxL,
          offset,
        });
        expect(response).toEqual([start, end, start - offset, maxL]);
      });
    });
  });
});
