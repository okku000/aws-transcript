/**
 * null undefined の　purify
 * このメソッドによってnull undefined の助長な判定を1行で処理する
 * 参照: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html
 */
export function assertIsDefined<T>(
  val: T,
  errorMessage?: string
): asserts val is NonNullable<T> {
  errorMessage ||= `Expected 'val' to be defined, but received ${val}`;
  if (val === undefined || val === null) {
    throw new Error(errorMessage);
  }
}
