// 予約ボタンは11枚目のフォームを開きます。
// Web3Forms経由で通知・確認メールを送り、成功後にthanks/へ移動します。
// 各キーに紐づく通知先と自動返信はWeb3Forms管理画面側で設定します。
// 以下は仮キーです。正式キーが未設定の院では送信を停止します。
window.LP_CONFIG = {
  ctaUrl: "#reservation",
  thanksUrl: "thanks/",
  clinicAccessKeys: {
    // 通知先: reserve@b-lineclinic.jp
    "池袋院": "8f0445f6-c529-4d43-ab9b-e1022d2b838c",
    // 通知先: reserve2@b-lineclinic.jp
    "大阪院": "72700d6b-99c6-49b2-98a9-a80afbd8c738"
  }
};
