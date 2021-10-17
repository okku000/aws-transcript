"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamToString = void 0;
async function streamToString(stream) {
    return await new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    });
}
exports.streamToString = streamToString;
//# sourceMappingURL=streamToString.js.map