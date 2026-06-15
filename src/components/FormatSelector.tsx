import React from 'react';

export interface FilmFormat {
  id: string;
  name: string;
  ratio: number;
  ratioText: string;
  description: string;
}

export const FILM_FORMATS: FilmFormat[] = [
  {
    id: 'imax70mm',
    name: 'IMAX 70mm',
    ratio: 1.43,
    ratioText: '1.43:1',
    description: 'The ultimate film experience. Shot on 15-perf 70mm film running horizontally through the camera, offering unparalleled resolution and a towering, near-square frame.',
  },
  {
    id: 'imaxDigital',
    name: 'IMAX Digital',
    ratio: 1.90,
    ratioText: '1.90:1',
    description: 'The digital standard for IMAX theaters. Expanded aspect ratio compared to standard widescreen, covering more screen height for immersive theatrical releases.',
  },
  {
    id: 'standard70mm',
    name: '70mm',
    ratio: 2.20,
    ratioText: '2.20:1',
    description: 'Classic widescreen format. Shot vertically on 5-perf 70mm film, providing extreme clarity, rich colors, and a majestic widescreen presentation.',
  },
  {
    id: 'flat35mm',
    name: '35mm',
    ratio: 2.39,
    ratioText: '2.39:1',
    description: 'Shot vertically on 4-perf 35mm film using anamorphic lenses to squeeze a wide image onto the film strip, projecting in the classic 2.39:1 anamorphic widescreen.',
  },
  {
    id: 'dolbyVision',
    name: 'Dolby Vision',
    ratio: 1.85,
    ratioText: '1.85:1 | 2.39:1',
    description: 'Modern high dynamic range theatrical format, utilizing a 1.85:1 flat aspect ratio to deliver stunning contrast, deep blacks, and vibrant colors.',
  },
];

interface FormatSelectorProps {
  activeFormatId: string;
  onFormatChange: (format: FilmFormat) => void;
}

// Graphic showing horizontal film perforations (sprocket holes on top & bottom)
const Imax70mmGraphic: React.FC = () => (
  <svg viewBox="0 0 40 28" className="format-graphic" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="38" height="26" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
    {/* Sprocket holes - top */}
    <rect x="4" y="3" width="2" height="2" rx="0.5" fill="currentColor" opacity="0.6" />
    <rect x="10" y="3" width="2" height="2" rx="0.5" fill="currentColor" opacity="0.6" />
    <rect x="16" y="3" width="2" height="2" rx="0.5" fill="currentColor" opacity="0.6" />
    <rect x="22" y="3" width="2" height="2" rx="0.5" fill="currentColor" opacity="0.6" />
    <rect x="28" y="3" width="2" height="2" rx="0.5" fill="currentColor" opacity="0.6" />
    <rect x="34" y="3" width="2" height="2" rx="0.5" fill="currentColor" opacity="0.6" />
    {/* Sprocket holes - bottom */}
    <rect x="4" y="23" width="2" height="2" rx="0.5" fill="currentColor" opacity="0.6" />
    <rect x="10" y="23" width="2" height="2" rx="0.5" fill="currentColor" opacity="0.6" />
    <rect x="16" y="23" width="2" height="2" rx="0.5" fill="currentColor" opacity="0.6" />
    <rect x="22" y="23" width="2" height="2" rx="0.5" fill="currentColor" opacity="0.6" />
    <rect x="28" y="23" width="2" height="2" rx="0.5" fill="currentColor" opacity="0.6" />
    <rect x="34" y="23" width="2" height="2" rx="0.5" fill="currentColor" opacity="0.6" />
    {/* Exposed image frame (1.43:1 center area) */}
    <rect x="8" y="7" width="24" height="14" rx="1" fill="currentColor" opacity="0.25" />
  </svg>
);

// Graphic showing clean modern box
const ImaxDigitalGraphic: React.FC = () => (
  <svg viewBox="0 0 40 28" className="format-graphic" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="38" height="26" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <rect x="5" y="8.5" width="30" height="11" rx="1" fill="currentColor" opacity="0.3" />
  </svg>
);

// Graphic showing standard 35mm vertical film with 2.39:1 anamorphic frame inside
const Flat35mmGraphic: React.FC = () => (
  <svg viewBox="0 0 40 28" className="format-graphic" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="38" height="26" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
    {/* Sprocket holes - left */}
    <rect x="3" y="4" width="2" height="2" rx="0.5" fill="currentColor" opacity="0.6" />
    <rect x="3" y="10" width="2" height="2" rx="0.5" fill="currentColor" opacity="0.6" />
    <rect x="3" y="16" width="2" height="2" rx="0.5" fill="currentColor" opacity="0.6" />
    <rect x="3" y="22" width="2" height="2" rx="0.5" fill="currentColor" opacity="0.6" />
    {/* Sprocket holes - right */}
    <rect x="35" y="4" width="2" height="2" rx="0.5" fill="currentColor" opacity="0.6" />
    <rect x="35" y="10" width="2" height="2" rx="0.5" fill="currentColor" opacity="0.6" />
    <rect x="35" y="16" width="2" height="2" rx="0.5" fill="currentColor" opacity="0.6" />
    <rect x="35" y="22" width="2" height="2" rx="0.5" fill="currentColor" opacity="0.6" />
    {/* Exposed anamorphic 2.39:1 image frame inside vertical strip */}
    <rect x="6" y="9.5" width="28" height="9" rx="1" fill="currentColor" opacity="0.25" />
  </svg>
);

// Graphic showing 70mm vertical film (larger area, sprocket holes left & right)
const Standard70mmGraphic: React.FC = () => (
  <svg viewBox="0 0 40 28" className="format-graphic" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="38" height="26" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
    {/* Sprocket holes - left */}
    <rect x="2" y="4" width="2" height="1.5" rx="0.3" fill="currentColor" opacity="0.6" />
    <rect x="2" y="9" width="2" height="1.5" rx="0.3" fill="currentColor" opacity="0.6" />
    <rect x="2" y="14" width="2" height="1.5" rx="0.3" fill="currentColor" opacity="0.6" />
    <rect x="2" y="19" width="2" height="1.5" rx="0.3" fill="currentColor" opacity="0.6" />
    <rect x="2" y="24" width="2" height="1.5" rx="0.3" fill="currentColor" opacity="0.6" />
    {/* Sprocket holes - right */}
    <rect x="36" y="4" width="2" height="1.5" rx="0.3" fill="currentColor" opacity="0.6" />
    <rect x="36" y="9" width="2" height="1.5" rx="0.3" fill="currentColor" opacity="0.6" />
    <rect x="36" y="14" width="2" height="1.5" rx="0.3" fill="currentColor" opacity="0.6" />
    <rect x="36" y="19" width="2" height="1.5" rx="0.3" fill="currentColor" opacity="0.6" />
    <rect x="36" y="24" width="2" height="1.5" rx="0.3" fill="currentColor" opacity="0.6" />
    {/* Exposed image frame (2.20:1 center area) */}
    <rect x="6" y="7.5" width="28" height="13" rx="1" fill="currentColor" opacity="0.25" />
  </svg>
);

// Graphic showing Dolby Vision digital presentation frame (1.85:1 aspect)
const DolbyVisionGraphic: React.FC = () => (
  <svg viewBox="0 0 40 28" className="format-graphic" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="38" height="26" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <rect x="6" y="6.5" width="28" height="15" rx="1" fill="currentColor" opacity="0.3" />
    {/* Dual projector layout indicator or DV hint */}
    <circle cx="10" cy="14" r="1.5" fill="currentColor" opacity="0.4" />
    <circle cx="30" cy="14" r="1.5" fill="currentColor" opacity="0.4" />
  </svg>
);

const renderGraphic = (formatId: string) => {
  switch (formatId) {
    case 'imax70mm':
      return <Imax70mmGraphic />;
    case 'imaxDigital':
      return <ImaxDigitalGraphic />;
    case 'flat35mm':
      return <Flat35mmGraphic />;
    case 'standard70mm':
      return <Standard70mmGraphic />;
    case 'dolbyVision':
      return <DolbyVisionGraphic />;
    default:
      return null;
  }
};

export const FormatSelector: React.FC<FormatSelectorProps> = ({
  activeFormatId,
  onFormatChange,
}) => {
  return (
    <div className="format-selector-container">
      <div className="format-grid">
        {FILM_FORMATS.map((format) => {
          const isActive = format.id === activeFormatId;
          return (
            <button
              key={format.id}
              onClick={() => onFormatChange(format)}
              className={`format-btn ${isActive ? 'active' : ''}`}
              aria-label={`Switch aspect ratio to ${format.name}`}
              id={`btn-${format.id}`}
            >
              <div className="graphic-wrapper">
                {renderGraphic(format.id)}
              </div>
              <div className="format-info">
                <span className="format-name">{format.name}</span>
                <span className="format-ratio">
                  {format.ratioText.includes('|') ? (
                    <>
                      <span className="ratio-highlight">{format.ratioText.split('|')[0]}</span>
                      <span className="ratio-muted">| {format.ratioText.split('|')[1]}</span>
                    </>
                  ) : (
                    format.ratioText
                  )}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
