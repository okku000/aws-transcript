"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioTextService = void 0;
const isEmptyObject_1 = require("../utils/isEmptyObject");
class AudioTextService {
    constructor(input) {
        this.FLOW_OFFSET = 5;
        this.client = input.client;
    }
    async build() {
        const text = await this.client.fetchTranscribedVoice();
        this.text = text;
        return this;
    }
    findTargetWords(targets) {
        let informations = {};
        for (let target of targets) {
            let result = this.identifyWordLocationInfo(target);
            if (result.length === 0)
                continue;
            informations[target] = result;
        }
        return isEmptyObject_1.isEmptyObject(informations) ? undefined : informations;
    }
    identifyWordLocationInfo(target) {
        const regexp = new RegExp(target, "g");
        const matches = this.text.matchAll(regexp);
        let locations = [];
        for (const match of matches) {
            if (!match || match.index === undefined)
                continue;
            const [start, end, startWithOffset, endWithOffset] = this.beautifyIndexOfTargetWord({
                maxL: this.text.length,
                start: match.index,
                end: match.index + target.length,
                offset: this.FLOW_OFFSET,
            });
            let location = {
                start,
                end,
                flow: this.text.slice(startWithOffset, endWithOffset),
            };
            locations.push(location);
        }
        return locations;
    }
    beautifyIndexOfTargetWord(input) {
        const { maxL, start, end, offset } = input;
        const startWithOffset = start - offset > 0 ? start - offset : 0;
        const endWithOffset = end + offset <= maxL ? end + offset : maxL;
        return [start, end, startWithOffset, endWithOffset];
    }
}
exports.AudioTextService = AudioTextService;
//# sourceMappingURL=audio-text-service.js.map