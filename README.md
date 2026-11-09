# B-LINE グラマラスラインLP

画像10枚と、11枚目の予約フォームで構成した横スライドLPです。HTML / CSS / JavaScriptのみで動作し、ビルドは不要です。

## フォーム送信

「送信する」で既存の入力チェック後、Web3FormsへFormDataをfetch送信します。成功時は同じ階層の `thanks/` へ移動します。送信中はボタンを無効化して二重送信を防ぎ、失敗時は入力を保持して電話番号と再試行可能なボタンを表示します。

正式キー・自動返信の設定後、送信するとWeb3Forms経由でクリニックに通知メール、お客様に確認メールが届き、thanks/ へ移動します。自動返信はWeb3Forms管理画面側で設定します。

院別の送り分けは `config.js` の `clinicAccessKeys` で設定します。池袋院は `reserve@b-lineclinic.jp` に登録したキー、大阪院は `reserve2@b-lineclinic.jp` に登録したキーを指定してください。現在はそれぞれ `BLINE_IKEBUKURO_ACCESS_KEY` / `BLINE_OSAKA_ACCESS_KEY` の仮値です。正式キー未設定・未登録の院は送信を停止します。送信前に選択院のキーでFormDataの `access_key` を上書きし、共通キーへのフォールバックは行いません。HTMLのhidden初期値は空です。通知先アドレス自体はWeb3Forms管理画面で設定し、各フォームの自動返信も有効にしてください。正式キー設定・再公開後の実送信・受信確認は担当者が行ってください。

`config.js` の `thanksUrl: "thanks/"` は相対パスです。先頭にスラッシュを付けず、`thanks/index.html` をLPと一緒に配置してください。

メール欄のnameは `email`、同意欄のvalueは「同意する」です。他の既存name・項目・入力チェックは維持しています。認知経路 `knew` の複数選択は「、」でまとめて送信します。`botcheck` は空の非表示フィールドです。

## GTM

`index.html` と `thanks/index.html` のheadとbodyに `GTM-TLJDFM68` を設置しています。コンテナ内のタグ・トリガー・CV計測設定および公開はGTM管理画面側で行ってください。実送信・メール受信テストは実施していません。

## 確認と公開

表示だけなら解凍後に `index.html` をブラウザで開けます。送信・メール受信・サンクスページ遷移は公開URL上で確認してください。ローカル表示は `python -m http.server 8000 --bind 127.0.0.1` で確認できます。

公開対象は `index.html`、`style.css`、`script.js`、`config.js`、`assets/`、`thanks/` です。SUZUの公開先・キー・GTM・サンクスページは使用しません。Sites用の配置は `sites/bline-glamorous-line/` にあります。

2026年11月7日：「お問い合わせ項目」（ご予約／お問い合わせのみ）を削除しました。予約フォームとして、ご予約院と第1・第2希望日時は必須のままです。
