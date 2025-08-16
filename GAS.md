# GAS セットアップ手順
1. https://script.google.com を開き「新しいプロジェクト」
2. 下記コードを貼り付け保存（`notify@example.com` を通知先に変更）
3. 「デプロイ」→「新しいデプロイ」→「種類：ウェブアプリ」
   - 実行するユーザー：自分
   - アクセスできるユーザー：全員
4. 発行されたURLを `script.js` の GAS_URL に貼り付け

```javascript
const TO_ADDRESSES = ['notify@example.com']; // 通知先
const SUBJECT = 'サイトから問い合わせ';

// application/json と x-www-form-urlencoded の両対応
function doPost(e) {
  try {
    const type = (e && e.postData && e.postData.type) || '';
    const raw  = (e && e.postData && e.postData.contents) || '';
    const data = type.indexOf('application/json') >= 0
      ? JSON.parse(raw || '{}')
      : parseFormEncoded(raw);

    // ハニーポット（website/hp）に値があればスキップ
    if (data.website || data.hp) return respond({ ok: true, skipped: true });

    const lines = [];
    push(lines, 'クリニック名', data.company);
    push(lines, 'お名前', data.name);
    push(lines, 'メール', data.email);
    push(lines, '電話', data.phone);
    push(lines, '検討中プラン', data.budget);
    push(lines, 'ご相談内容', data.message);
    push(lines, '送信元ページ', data.page);

    MailApp.sendEmail({
      to: TO_ADDRESSES.join(','),
      subject: SUBJECT,
      replyTo: data.email || '',
      name: 'Webフォーム通知',
      htmlBody: lines.map(escapeHtml).join('<br>')
    });

    return respond({ ok: true });
  } catch (err) {
    return respond({ ok: false, error: String(err) });
  }
}

// Helpers
function parseFormEncoded(body) {
  const out = {};
  (body || '').split('&').forEach(p => {
    const [k, v] = p.split('=');
    out[decodeURIComponent(k || '')] = decodeURIComponent((v || '').replace(/\+/g, ' '));
  });
  return out;
}
function respond(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
function push(arr, k, v) {
  if (v == null || String(v).trim() === '') return;
  arr.push(k + ': ' + String(v).trim());
}
function escapeHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
}
```

## 動作確認手順
1. `GAS.md` の手順でWebアプリURLを発行 → `script.js` の `GAS_URL` を置換  
2. フォームに必要項目を入れて送信  
3. 受信メールを確認（迷惑メールフォルダも）  
4. 失敗時はアラート表示・ボタン状態復帰を確認  
5. ハニーポット検証：隠しinputに意図的に値を入れて送信 → メールが来ないこと