import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md', 
  showSubtitle = false 
}) => {
  // Size mappings
  const sizes = {
    sm: {
      text: 'text-2xl sm:text-3xl',
      circle: 'w-10 h-10',
      spacing: 'gap-1.5',
      strokeWidth: '2.2',
      silhouetteWidth: '1.8',
    },
    md: {
      text: 'text-3xl sm:text-4xl md:text-5xl',
      circle: 'w-12 h-12 sm:w-14 sm:h-14',
      spacing: 'gap-2',
      strokeWidth: '2.5',
      silhouetteWidth: '2',
    },
    lg: {
      text: 'text-4xl sm:text-5xl md:text-6xl',
      circle: 'w-16 h-16 sm:w-20 sm:h-20',
      spacing: 'gap-3',
      strokeWidth: '2.8',
      silhouetteWidth: '2.2',
    },
    xl: {
      text: 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl',
      circle: 'w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32',
      spacing: 'gap-4',
      strokeWidth: '3.2',
      silhouetteWidth: '2.5',
    }
  };

  const currentSize = sizes[size];

  return (
    <div className={`inline-flex flex-col items-center justify-center select-none ${className}`}>
      <div className={`flex items-center justify-center ${currentSize.spacing} text-brand-fuchsia`}>
        {/* 'Aqua' cursive branding */}
        <span 
          className={`${currentSize.text} font-script leading-none tracking-normal translate-y-1`}
          style={{ fontFamily: 'var(--font-script)' }}
        >
          Aqua
        </span>

        {/* The elegant silhouette badge */}
        <div className={`relative shrink-0 flex items-center justify-center`}>
          <svg 
            className={`${currentSize.circle} stroke-current fill-none transition-transform duration-300 group-hover:scale-105`} 
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            {/* Outline Circular Border */}
            <circle 
              cx="50" 
              cy="50" 
              r="41" 
              strokeWidth={currentSize.strokeWidth}
              className="stroke-brand-fuchsia"
            />
            
            {/* Artistic Female Line Art Silhouette */}
            <g className="stroke-brand-fuchsia">
              {/* Back Hair waves & head contour */}
              <path 
                d="M 52,19 C 48,15 47,19 45,21 C 41,26 42,34 45,39 C 49,44 51,46 49,50 C 47,54 44,56 42,59" 
                strokeWidth={currentSize.silhouetteWidth}
                strokeLinecap="round"
              />
              <path 
                d="M 48,18 C 50,14 54,14 54,19 C 54,23 52,26 50,28 C 47,32 46,36 49,39 C 52,43 54,46 52,50 C 50,54 48,56 46,58 C 44,61 43,65 44,68" 
                strokeWidth={currentSize.silhouetteWidth}
                strokeLinecap="round"
              />
              {/* Face silhouette structure */}
              <path 
                d="M 51,26 C 53,24 57,25 58,28 C 59,31 58,35 56,37 C 53,40 50,42 49,44 C 47,48 49,52 51,55 C 53,58 54,61 52,65 C 50,69 46,73 42,76" 
                strokeWidth={currentSize.silhouetteWidth}
                strokeLinecap="round"
              />
              {/* Elegant continuous shoulder & back curve */}
              <path 
                d="M 42,56 C 41,59 40,63 41,66 C 42,69 44,71 45,74" 
                strokeWidth={currentSize.silhouetteWidth}
                strokeLinecap="round"
              />
              <path 
                d="M 45,65 C 43,70 39,78 39,83" 
                strokeWidth={currentSize.silhouetteWidth}
                strokeLinecap="round"
              />
              <path 
                d="M 49,63 C 50,67 52,71 53,75" 
                strokeWidth={currentSize.silhouetteWidth}
                strokeLinecap="round"
              />
            </g>
          </svg>
        </div>

        {/* 'Beauté' cursive branding */}
        <span 
          className={`${currentSize.text} font-script leading-none tracking-normal translate-y-1`}
          style={{ fontFamily: 'var(--font-script)' }}
        >
          Beauté
        </span>
      </div>

      {showSubtitle && (
        <span className="text-[9px] sm:text-[10px] tracking-[0.4em] uppercase text-brand-taupe mt-1 text-center font-medium block">
          Institut de Beauté • Mutzig
        </span>
      )}
    </div>
  );
};

export default Logo;
