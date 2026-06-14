import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Upload,
  Info
} from 'lucide-react';
import { FILM_FORMATS } from './FormatSelector';
import type { FilmFormat } from './FormatSelector';

interface VideoPlayerProps {
  videoSrc: string;
  activeFormat: FilmFormat;
  isCropMode: boolean;
  onVideoUpload: (file: File) => void;
  onFormatChange: (format: FilmFormat) => void;
  onCropModeToggle: (isCrop: boolean) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoSrc,
  activeFormat,
  isCropMode,
  onVideoUpload,
  onFormatChange,
  onCropModeToggle,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  // Auto-hide controls timer
  const controlsTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration || 0);
    const handleVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };
    const handleError = () => {
      setVideoError('Error loading video. Please check the file format or try another file.');
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('volumechange', handleVolumeChange);
    video.addEventListener('error', handleError);

    // Auto play when src changes if it was playing before
    if (isPlaying) {
      video.play().catch(() => setIsPlaying(false));
    }

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('volumechange', handleVolumeChange);
      video.removeEventListener('error', handleError);
    };
  }, [videoSrc, isPlaying]);

  // Clean error when video source changes
  useEffect(() => {
    setVideoError(null);
  }, [videoSrc]);

  // Toggle play/pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch((err) => {
        console.error("Play failed:", err);
      });
    }
  };

  // Restart video
  const restartVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => { });
  };

  // Handle timeline seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const time = parseFloat(e.target.value);
    video.currentTime = time;
    setCurrentTime(time);
  };

  // Handle volume seek
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const val = parseFloat(e.target.value);
    video.volume = val;
    setVolume(val);
    if (val > 0 && isMuted) {
      video.muted = false;
      setIsMuted(false);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error("Fullscreen request failed:", err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  // Track fullscreen changes (e.g. if exited via Escape key)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Handle mouse movement for controls visibility
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) window.clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  // Basic keyboard shortcuts keybinds (Space to play/pause, Left/Right arrows to seek, Up/Down arrows for volume)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keybinds if the user is typing in an input or form control
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      const video = videoRef.current;
      if (!video) return;

      switch (e.key) {
        case ' ': // Space bar: play/pause
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft': // Left Arrow: Rewind 5 seconds
          e.preventDefault();
          video.currentTime = Math.max(0, video.currentTime - 5);
          setCurrentTime(video.currentTime);
          break;
        case 'ArrowRight': // Right Arrow: Fast forward 5 seconds
          e.preventDefault();
          video.currentTime = Math.min(video.duration || 0, video.currentTime + 5);
          setCurrentTime(video.currentTime);
          break;
        case 'ArrowUp': // Up Arrow: Increase volume
          e.preventDefault();
          video.muted = false;
          setIsMuted(false);
          const newVolUp = Math.min(1, video.volume + 0.05);
          video.volume = newVolUp;
          setVolume(newVolUp);
          break;
        case 'ArrowDown': // Down Arrow: Decrease volume
          e.preventDefault();
          const newVolDown = Math.max(0, video.volume - 0.05);
          video.volume = newVolDown;
          setVolume(newVolDown);
          if (newVolDown === 0) {
            video.muted = true;
            setIsMuted(true);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying, isMuted, volume]);

  // Format time (e.g. 01:23)
  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        onVideoUpload(file);
      } else {
        setVideoError('Invalid file type. Please drop a video file.');
      }
    }
  };

  // File input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onVideoUpload(e.target.files[0]);
    }
  };

  // Calculate top/bottom black bars height.
  // The container runs at a fixed 1.43:1 aspect ratio.
  // The height of the black bars on top and bottom is ((1 - 1.43 / ratio) / 2) * 100%
  const maskHeightPercent = ((1 - 1.43 / activeFormat.ratio) / 2) * 100;

  return (
    <div
      ref={containerRef}
      className={`video-player-container ${isDragging ? 'dragging' : ''} ${isFullscreen ? 'fullscreen' : ''} ${isFullscreen && !showControls && isPlaying ? 'hide-cursor' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Floating/hover format selector overlay at the top (useful in fullscreen) */}
      {isFullscreen && (
        <div className={`player-top-overlay ${showControls || !isPlaying ? 'visible' : 'hidden'}`}>
          <div className="mini-format-selector">
            {FILM_FORMATS.map((f) => (
              <button
                key={f.id}
                className={`mini-format-btn ${f.id === activeFormat.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onFormatChange(f);
                }}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dark overlay for dragging files */}
      {isDragging && (
        <div className="drag-overlay">
          <div className="drag-content">
            <Upload size={48} className="drag-icon pulse" />
            <h3>Drop Video File Here</h3>
            <p>Supports MP4, WebM, MOV, and more</p>
          </div>
        </div>
      )}

      {/* Video element and absolute aspect-ratio wrapper */}
      <div className="video-viewport" onClick={togglePlay}>
        <div className="video-content-wrapper">
          <video
            ref={videoRef}
            src={videoSrc || undefined}
            playsInline
            crossOrigin="anonymous"
            loop
            className={`main-video ${isCropMode ? 'crop-cover' : 'fit-contain'}`}
          />
        </div>

        {/* Dynamic Aspect Ratio Black Bars */}
        <div
          className="mask-bar mask-top"
          style={{ height: `${maskHeightPercent}%` }}
        />
        <div
          className="mask-bar mask-bottom"
          style={{ height: `${maskHeightPercent}%` }}
        />

        {/* Sliding Aspect Ratio Tag Label */}
        <div
          className="format-tag"
          style={{
            bottom: `calc(${maskHeightPercent}% + ${activeFormat.id === 'imax70mm' ? 80 : 24}px)`,
            opacity: showControls || !isPlaying ? 1 : 0,
            pointerEvents: showControls || !isPlaying ? 'auto' : 'none'
          }}
        >
          <span className="ratio-tag-pill">{activeFormat.ratioText}</span>
          <span className="ratio-tag-name">{activeFormat.name}</span>
        </div>

        {/* Screen center play/pause indicator when paused */}
        {!isPlaying && !isDragging && (
          <button className="center-play-btn" onClick={(e) => { e.stopPropagation(); togglePlay(); }} aria-label="Play video">
            <Play fill="currentColor" size={24} />
          </button>
        )}

        {/* Error overlay */}
        {videoError && (
          <div className="error-overlay" onClick={(e) => e.stopPropagation()}>
            <Info size={36} className="error-icon" />
            <p>{videoError}</p>
            <label className="upload-btn-secondary">
              Upload Video
              <input type="file" accept="video/*" onChange={handleFileChange} style={{ display: 'none' }} />
            </label>
          </div>
        )}
      </div>

      {/* Media control overlays */}
      <div className={`player-controls-wrapper ${showControls || !isPlaying ? 'visible' : 'hidden'}`}>
        {/* Scrub bar / Timeline */}
        <div className="scrub-container">
          <input
            type="range"
            min={0}
            max={duration}
            step={0.01}
            value={currentTime}
            onChange={handleSeek}
            className="scrub-bar"
            style={{
              background: `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${(currentTime / duration) * 100 || 0}%, rgba(255, 255, 255, 0.2) ${(currentTime / duration) * 100 || 0}%, rgba(255, 255, 255, 0.2) 100%)`
            }}
          />
        </div>

        {/* Action controls */}
        <div className="controls-bar">
          <div className="controls-left">
            <button className="icon-btn" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
            </button>
            <button className="icon-btn" onClick={restartVideo} aria-label="Restart">
              <RotateCcw size={18} />
            </button>

            <div className="volume-wrapper">
              <button className="icon-btn" onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"}>
                {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="volume-slider"
                style={{
                  background: `linear-gradient(to right, #fff 0%, #fff ${(isMuted ? 0 : volume) * 100}%, rgba(255, 255, 255, 0.2) ${(isMuted ? 0 : volume) * 100}%, rgba(255, 255, 255, 0.2) 100%)`
                }}
              />
            </div>

            <span className="time-display">
              {formatTime(currentTime)} <span className="time-divider">/</span> {formatTime(duration)}
            </span>

            {isFullscreen && (
              <button
                className="fullscreen-toggle-btn"
                onClick={() => onCropModeToggle(!isCropMode)}
                title={isCropMode ? "Switch to Masked Fit" : "Switch to Cinematic Crop"}
              >
                {isCropMode ? "Cinematic Crop" : "Masked Fit"}
              </button>
            )}
          </div>

          <div className="controls-right">
            <label className="upload-control-label" title="Upload local video">
              <Upload size={14} />
              <span>Upload</span>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden-file-input"
              />
            </label>
            <button className="icon-btn" onClick={toggleFullscreen} aria-label="Toggle Fullscreen">
              {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
