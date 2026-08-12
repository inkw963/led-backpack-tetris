# LED Backpack Tetris（スマホ単体版）

`index.html` は Android Chrome から Web Bluetooth で LED バックパックへ直接接続する、外部依存のない単一 HTML です。PC、Python、常駐サーバーは実行時に使いません。

## 配置と起動

Web Bluetooth はセキュアコンテキスト限定の API です。そのため、LAN 内の `http://` 配信と `file://` で直接開く方法は利用できません。`index.html` を HTTPS で配信できる場所へ置き、HTTPS URL をスマホで開いてください。

配置先の候補は次のとおりです。

- GitHub Pages（公開リポジトリ、または Pages の公開設定を許容できる場合）
- Cloudflare Pages、Netlify、Vercel などの静的サイトホスティング
- HTTPS と正しい証明書を用意した社内・自宅 Web サーバー

手順:

1. `led_backpack/web/index.html` だけを静的ホスティングへ配置する。
2. Android の Chrome で発行された `https://` URL を開く。
3. LED バックパックの電源を入れ、「接続」を押して `YS5257117533` を選ぶ。
4. 通常の一覧で見つからない場合は歯車を開き、「すべてのデバイスを表示」を有効にしてから再度「接続」を押す。
5. `START` を押してゲームを開始する。

Android は Chrome で動作します。iOS の Safari は Web Bluetooth に対応していないため、Web Bluetooth 対応ブラウザの Bluefy が必要です。

## Python 版との使い分け

スマホ単体版は、バッグとスマホだけで遊ぶ用途向けです。BLE の再接続、輝度・盤面設定、ゲーム操作をブラウザ内で完結します。

Python 版は、プロトコル解析、dry-run、UDP 接続、ログ取得、自動テスト、CLI からの詳細な動作確認に向いています。開発・調査では Python 版、持ち歩いて遊ぶ場合はスマホ単体版を使うのが目安です。

## プロトコルテスト

開発環境では次で HTML 内のエンコーダを直接検証できます。エンコーダのコードはテスト側へ複製していません。

```text
node led_backpack/web/test_protocol_js.mjs
```
