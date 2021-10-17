import util from "util";
/**
 * setTimeOutのpromisified
 */
export const timer = util.promisify(setTimeout);
