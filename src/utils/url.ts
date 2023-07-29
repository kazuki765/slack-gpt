import URLParse from "url-parse";

export function getHost(url: string) {
  const parser = new URLParse(url);

  return parser.host;
}

export function isValidUrl(maybeUrl: string) {
  const pattern = new RegExp(
    "^([a-zA-Z]+:\\/\\/)?" + //プロトコルパターン
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + //ドメインパターン
      "((\\d{1,3}\\.){3}\\d{1,3}))" + //IPアドレスパターン
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // ポート番号またはパス
      "(\\?[;&a-z\\d%_.~+=-]*)?" + //クエリストリング
      "(\\#[-a-z\\d_]*)?", //フラグ情報
    "i"
  );
  return pattern.test(maybeUrl);
}
