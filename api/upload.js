const fetch = require('node-fetch');
const FormData = require('form-data');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { image, meta } = req.body;
    if (!image) return res.status(400).json({ error: 'No image received' });

    const form = new FormData();
    form.append('chat_id', process.env.TELEGRAM_CHAT_ID);
    const base64 = image.replace(/^data:image\/\w+;base64,/, '');
    form.append('photo', Buffer.from(base64, 'base64'), 'capture.jpg');
    form.append('caption', JSON.stringify(meta, null, 2));

    const tg = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendPhoto`, { method: 'POST', body: form });
    return res.json(await tg.json());
  } catch (e) { return res.status(500).json({ error: e.message }); }
};
