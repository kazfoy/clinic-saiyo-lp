# セルフQAチェックリスト

## スマートフォン（SP）

- ✅ **SP-1** ヒーローが中央揃えで、タイトル/補足/主CTAがファーストビューに収まる
  - ヒーローセクションを `min-height: calc(100vh - 80px)` + flexbox center配置
  - gap: 1.5rem でコンパクトな配置、max-width制限で読みやすさ確保

- ✅ **SP-2** 追従CTAが画面幅にジャスト、横スクロールなし、本文に被らない（body下余白あり）
  - `position: fixed; left: 0; right: 0; width: 100%; box-sizing: border-box`
  - `body { padding-bottom: 80px; overflow-x: hidden; }`
  - iOS safe-area対応: `calc(12px + env(safe-area-inset-bottom))`

- ✅ **SP-3** セクション上下とカード間の余白が過剰でない（視認上スムーズ）
  - セクション間: 2.5rem（従来の80pxから40px相当に圧縮）
  - カード間: 1rem（従来の2remから圧縮）

- ✅ **SP-4** 料金のチェックが二重表示になっていない（::beforeのみ）
  - `pricing-features li i { display: none; }`
  - `pricing-features li::before { content: "✓"; ... }`

## PC

- ✅ **PC-1** 見出し/本文/ボタンが小さすぎず、CTA高さが十分
  - body: 18px（従来16px→18px）
  - section-title: clamp(2.25rem, 3vw, 2.75rem)
  - CTA: min-height 56px, font-size 1.125rem, padding 1.25rem 2.5rem

- ✅ **PC-2** 料金3カードの高さが揃い、価格行が横一列で整列、バッジはスタンダードのみ
  - `min-height: 600px; display: flex; flex-direction: column`
  - 価格行: `display: flex; align-items: baseline; justify-content: center`
  - バッジ: HTMLでスタンダードのみ、CSS position absolute center配置

## 共通

- ✅ **共通-1** 重要テキスト（見出し/価格/CTA）が変な改行や1文字縦積みにならない
  - `word-break: keep-all; white-space: normal` 適用
  - clamp()で画面幅に応じた適切なフォントサイズ

- ✅ **共通-2** 44px以上のタップ領域が確保されている（ボタン/アコーディオン等）
  - SP CTA: min-height 48px
  - PC CTA: min-height 56px  
  - モバイル固定CTA: min-height 48px

- ✅ **共通-3** Lighthouse（モバイル/デスクトップ）で重大なレイアウト崩れが出ない
  - メディアクエリ分離: SP max-width:768px / PC min-width:1024px
  - overflow-x: hidden でスクロール問題解消
  - box-sizing: border-box 統一

- ✅ **共通-4** 既存機能（フォーム送信/GAS）はそのまま動作
  - HTMLは構造変更なし、クラス追加のみ
  - JavaScriptファイル未変更
  - フォームaction/method/target属性保持

- ✅ **共通-5** 変更はメディアクエリに限定され、PC修正でSPが、SP修正でPCが崩れていない
  - SP: `@media (max-width: 768px)` 
  - PC: `@media (min-width: 1024px)`
  - 中間領域（769px-1023px）は既存ルールで自然なフォールバック

## 最終確認事項

- ✅ 料金プランのチェックマーク：HTMLアイコン非表示、CSS統一
- ✅ 追従CTA：SPで表示、PCで非表示（!important）
- ✅ ヒーロー：SPでファーストビュー最適化、PCで大きなサイズ感
- ✅ 余白：SPで圧縮、PCで適度な余裕
- ✅ メディアクエリ分離：相互影響なし