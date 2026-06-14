import { useState, useEffect } from 'react';
import { Film, RotateCcw } from 'lucide-react';
import { FILM_FORMATS, FormatSelector } from './components/FormatSelector';
import type { FilmFormat } from './components/FormatSelector';
import { VideoPlayer } from './components/VideoPlayer';

function App() {
  const [activeFormat, setActiveFormat] = useState<FilmFormat>(FILM_FORMATS[0]);
  const [videoSrc, setVideoSrc] = useState<string>('/demo.mp4');
  const [isCropMode, setIsCropMode] = useState<boolean>(false);

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
        <div className="footer-status">
          <span>No servers involved • All processing runs 100% locally in your browser</span>
        </div>
        <a
          href="https://github.com/w-nityammm/film_formats"
          target="_blank"
          rel="noopener noreferrer"
          className="github-link"
          title="View source code on GitHub"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="github-icon"
          >
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22v3.293c0 .319.2.694.8.576C20.565 21.795 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
      </footer>
    </div>
  );
}

export default App;
