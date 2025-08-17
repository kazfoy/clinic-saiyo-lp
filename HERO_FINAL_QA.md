# スマホヒーロー仕上げ確認チェックリスト

## ✅ 実装確認

### 1. タイトルの厳密センター
- ✅ `display: block` + `margin: 0 auto` で完全な中央寄せ
- ✅ `max-width: 22ch` で適切な文字幅制限
- ✅ `text-align: center` で見出し自身も中央配置
- ✅ `word-break: keep-all` + `letter-spacing: normal` で自然な改行

### 2. CTA下の余白圧縮
- ✅ `.hero { padding-bottom: 16px; }` - ヒーロー下余白を大幅圧縮
- ✅ `.hero-cta { margin-bottom: 0; gap: 8px; }` - CTA間隔とボトム余白圧縮
- ✅ `section.hero + section { padding-top: 20px; }` - 次セクション上余白も調整
- ✅ `body { padding-bottom: 48px; }` - 固定CTA下余白の最適化

## 📋 変更内容

### CSS追記（スマホ専用）
```css
@media (max-width:768px){
  /* タイトル厳密センター */
  .hero-title {
    display: block;
    text-align: center; 
    max-width: 22ch;
    margin: 0 auto 8px;
    word-break: keep-all;
    letter-spacing: normal;
    white-space: normal;
  }
  
  /* 余白圧縮 */
  .hero { padding-bottom: 16px; }
  .hero-cta { margin-bottom: 0; gap: 8px; }
  section.hero + section { padding-top: 20px; }
  body { padding-bottom: calc(48px + env(safe-area-inset-bottom)); }
}
```

## 🎯 期待される結果

### Before → After
- **タイトル**: 親のtext-alignのみ → `display:block` + `margin:auto` で厳密センター
- **ヒーロー下余白**: 24px → 16px（圧縮）
- **CTA間隔**: 12px → 8px（圧縮）
- **次セクション上**: 32px → 20px（調整）
- **固定CTA下余白**: 56px → 48px（最適化）

### 視覚的改善
1. **タイトル**: 左右完全対称の中央配置
2. **余白**: 間延び感の解消、タイトなレイアウト
3. **つなぎ**: ヒーロー→次セクションのスムーズな流れ
4. **下部**: 固定CTAとの適切な距離感

## 📱 確認対象画面サイズ
- 360px（小型スマホ）
- 390px（iPhone 12 mini等）
- 414px（iPhone Pro等）
- 768px（タブレット縦）

## 💻 PC影響確認
- 1024px以上では変更なし
- 既存レイアウト完全保持

すべての調整がスマホ専用メディアクエリ内で完結し、PCレイアウトに影響を与えない実装完了。