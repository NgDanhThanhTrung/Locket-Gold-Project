const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Headers giả lập iPhone chính chủ Locket
const LOCKET_HEADERS = {
  'User-Agent': 'Locket/2.15.0 (iPhone; iOS 17.5; Scale/3.00)',
  'X-Locket-Platform': 'iOS',
  'X-Locket-Version': '2.15.0',
  'Content-Type': 'application/json',
  'Accept': '*/*',
  'Connection': 'keep-alive'
};

app.post('/push', async (req, res) => {
  const { idToken, imageUrl, recipientIds, caption } = req.body;

  try {
    const response = await axios({
      method: 'POST',
      url: 'https://api.locketcamera.com/v1/posts',
      headers: {
        ...LOCKET_HEADERS,
        'Authorization': `Bearer ${idToken}`
      },
      data: {
        url: imageUrl,
        caption: caption || "",
        recipientIds: recipientIds || [],
        sentToAll: !recipientIds || recipientIds.length === 0,
        width: 1080,
        height: 1350
      }
    });
    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error("Locket API Error:", error.response?.data || error.message);
    res.status(500).json({ success: false, error: "Locket rejected the request" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
