import { useState, useEffect } from 'react';
import { Film, RotateCcw } from 'lucide-react';
import { FILM_FORMATS, FormatSelector } from './components/FormatSelector';
import type { FilmFormat } from './components/FormatSelector';
import { VideoPlayer } from './components/VideoPlayer';

function App() {
  const [activeFormat, setActiveFormat] = useState<FilmFormat>(FILM_FORMATS[0]);
  const [videoSrc, setVideoSrc] = useState<string>('/demo.mp4');
  const [isCropMode, setIsCropMode] = useState<boolean>(true);

  // Clean up object URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (videoSrc && videoSrc.startsWith('blob:')) {
        URL.revokeObjectURL(videoSrc);
      }
    };
  }, [videoSrc]);

  const handleVideoUpload = (file: File) => {
    if (videoSrc && videoSrc.startsWith('blob:')) {
      URL.revokeObjectURL(videoSrc);
    }
    const objectUrl = URL.createObjectURL(file);
    setVideoSrc(objectUrl);
  };

  return (
    <div className="app-container">
      {/* Header / Hero Section */}
      <header className="hero-section">
        <h1 className="title-main">
          Explore <span className="title-accent">Film Formats</span>
        </h1>
        <p className="description-text">
          Experience the visual impact of different cinematic aspect ratios. Drag and drop any local video file directly into the player to watch your own footage, right in your own browser. No servers involved.
        </p>
      </header>

      {/* Options & Configuration Bar */}
      <div className="options-bar">
        {/* Cinematic Crop vs Fitted Mask Toggle */}
        <div className="toggle-group-wrapper">
          <div className="toggle-group">
            <button
              className={`toggle-btn ${isCropMode ? 'active' : ''}`}
              onClick={() => setIsCropMode(true)}
              title="Scales the video to cover the format viewport, simulating the camera sensor cropping."
            >
              Cinematic Crop
            </button>
            <button
              className={`toggle-btn ${!isCropMode ? 'active' : ''}`}
              onClick={() => setIsCropMode(false)}
              title="Fits the full video frame, overlaying letterbox or pillarbox bars to mask it."
            >
              Masked Fit
            </button>
          </div>
        </div>

        {videoSrc !== '/demo.mp4' && (
          <button
            className="reset-demo-btn"
            onClick={() => setVideoSrc('/demo.mp4')}
            title="Restore default demo video"
          >
            <RotateCcw size={14} />
            <span>Restore Demo Video</span>
          </button>
        )}
      </div>

      {/* Main Layout containing side-by-side format selector and video player */}
      <div className="main-layout">
        <FormatSelector
          activeFormatId={activeFormat.id}
          onFormatChange={(format) => setActiveFormat(format)}
        />
        <VideoPlayer
          videoSrc={videoSrc}
          activeFormat={activeFormat}
          isCropMode={isCropMode}
          onVideoUpload={handleVideoUpload}
          onFormatChange={(format) => setActiveFormat(format)}
          onCropModeToggle={setIsCropMode}
        />
        <div className="layout-right-spacer" />
      </div>

      {/* Dynamic Information Description Block */}
      <section className="info-block">
        <h2 className="info-title">
          <Film size={20} style={{ color: 'var(--color-accent)' }} />
          {activeFormat.name}
        </h2>
        <p className="info-desc">
          {activeFormat.description}
        </p>
      </section>

      {/* App Footer */}
      <footer className="app-footer">
        <span>No servers involved • All processing runs 100% locally in your browser</span>
      </footer>
    </div>
  );
}

export default App;
