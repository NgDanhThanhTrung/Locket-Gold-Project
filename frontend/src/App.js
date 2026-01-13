import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import './App.css';

const themes = [
  { id: 'gold', name: 'Gold', filter: 'sepia(0.3) contrast(1.1) brightness(1.1) saturate(1.4)' },
  { id: 'retro', name: 'VCR', filter: 'grayscale(0.1) sepia(0.2) contrast(0.9) blur(0.3px)' },
  { id: 'none', name: 'Gốc', filter: 'none' }
];

function App() {
  const webcamRef = useRef(null);
  const [activeTheme, setActiveTheme] = useState('gold');
  const [isUploading, setIsUploading] = useState(false);

  // LƯU Ý: Thay URL này bằng link Render của bạn sau khi deploy
  const PROXY_URL = "https://your-proxy-service.onrender.com/push";

  const captureAndSend = async () => {
    setIsUploading(true);
    const video = webcamRef.current.video;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");

    // Áp dụng bộ lọc màu Gold khi vẽ ảnh
    ctx.filter = themes.find(t => t.id === activeTheme).filter;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const base64Image = canvas.toDataURL("image/jpeg", 0.8);
    const idToken = localStorage.getItem('locket_token'); // Giả định đã đăng nhập

    try {
      await axios.post(PROXY_URL, {
        idToken: idToken,
        imageUrl: base64Image, // Trong thực tế, bạn nên upload lên Firebase Storage trước rồi gửi URL vào đây
        caption: "Sent from Locket Gold Web",
        recipientIds: [] // Trống để gửi cho tất cả bạn bè
      });
      alert("✨ Đã gửi khoảnh khắc Gold thành công!");
    } catch (err) {
      alert("❌ Lỗi gửi ảnh. Kiểm tra Proxy hoặc Token!");
    }
    setIsUploading(false);
  };

  return (
    <div className="locket-gold">
      <div className="camera-container">
        <Webcam 
          ref={webcamRef} 
          audio={false} 
          screenshotFormat="image/jpeg"
          style={{ filter: themes.find(t => t.id === activeTheme).filter }}
        />
        <div className="gold-overlay"></div>
      </div>

      <div className="ui-layer">
        <div className="theme-picker">
          {themes.map(t => (
            <button 
              key={t.id} 
              className={activeTheme === t.id ? 'active' : ''} 
              onClick={() => setActiveTheme(t.id)}
            >
              {t.name}
            </button>
          ))}
        </div>

        <button 
          className={`shutter-btn ${isUploading ? 'loading' : ''}`} 
          onClick={captureAndSend}
          disabled={isUploading}
        >
          {isUploading ? "" : <div className="inner-circle"></div>}
        </button>
      </div>
    </div>
  );
}

export default App;
