// 予約ボタンは11枚目のフォームを開きます。
// Web3Forms経由で通知・確認メールを送り、成功後にthanks/へ移動します。
// 各キーに紐づく通知先と自動返信はWeb3Forms管理画面側で設定します。
// 以下は仮キーです。正式キーが未設定の院では送信を停止します。
window.LP_CONFIG = {
  ctaUrl: "#reservation",
  thanksUrl: "thanks/",
  clinicAccessKeys: {
    // 通知先: marketing_beauty@grill.co.jp（Gmailで院ごとに転送）
    "池袋院": "c3a7c05e-84d3-4fa3-b8ed-d8277f1ff309",
    // 通知先: marketing_beauty@grill.co.jp（Gmailで院ごとに転送）
    "大阪院": "c3a7c05e-84d3-4fa3-b8ed-d8277f1ff309"
  }
};
