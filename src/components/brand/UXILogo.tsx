import React, { useId } from 'react';

export interface UXILogoProps {
  size?: number;
  glow?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * UXI Original 3D Spatial Liquid Glass & Tonal Prism Emblem (v2.5.0)
 * Represents the fusion of UX (User Experience) × UI (User Interface) with
 * Apple HIG Liquid Glass specular refraction and Google Material 3 tonal layers.
 */
export const UXILogo: React.FC<UXILogoProps> = ({
  size = 32,
  glow = false,
  className = '',
  style,
}) => {
  const uid = useId().replace(/:/g, '');

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: size,
        height: size,
        flexShrink: 0,
        userSelect: 'none',
        filter: glow
          ? 'drop-shadow(0 0 18px rgba(56, 189, 248, 0.48)) drop-shadow(0 0 36px rgba(139, 92, 246, 0.32))'
          : undefined,
        transition: 'transform 0.25s ease, filter 0.25s ease',
        ...style,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <defs>
          <clipPath id={`uxi_clip_${uid}`}>
            <rect x="8" y="8" width="104" height="104" rx="28" />
          </clipPath>

          {/* Back Deep Cosmic Sapphire-Violet Base */}
          <linearGradient
            id={`uxi_base_${uid}`}
            x1="10"
            y1="10"
            x2="110"
            y2="110"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#0B1528" />
            <stop offset="52%" stopColor="#131C38" />
            <stop offset="100%" stopColor="#1E1035" />
          </linearGradient>

          {/* Left U-Wing Liquid Cyan -> Sapphire Ribbon */}
          <linearGradient
            id={`uxi_wing_l_${uid}`}
            x1="22"
            y1="24"
            x2="78"
            y2="98"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#2FF58E" />
            <stop offset="45%" stopColor="#00C8FF" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>

          {/* Right X/I Ascending Violet -> Indigo -> Sky Prism */}
          <linearGradient
            id={`uxi_wing_r_${uid}`}
            x1="98"
            y1="20"
            x2="42"
            y2="96"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#C084FC" />
            <stop offset="48%" stopColor="#818CF8" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>

          {/* Center Glass Refraction Core */}
          <linearGradient
            id={`uxi_glass_${uid}`}
            x1="36"
            y1="28"
            x2="86"
            y2="92"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.92" />
            <stop offset="45%" stopColor="#BAE6FD" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#C4B5FD" stopOpacity="0.2" />
          </linearGradient>

          {/* Top Specular Rim */}
          <linearGradient
            id={`uxi_rim_${uid}`}
            x1="12"
            y1="10"
            x2="108"
            y2="110"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#7DD3FC" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#A78bfa" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#2FF58E" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        <g clipPath={`url(#uxi_clip_${uid})`}>
          {/* Squircle Glass Shell */}
          <rect
            x="8"
            y="8"
            width="104"
            height="104"
            rx="28"
            fill={`url(#uxi_base_${uid})`}
          />

          {/* Ambient Internal Aurora Orbs */}
          <circle cx="30" cy="28" r="34" fill="#00C8FF" fillOpacity="0.22" />
          <circle cx="90" cy="88" r="38" fill="#8B5CF6" fillOpacity="0.26" />

          {/* Left Sculpted U-Curve Ribbon */}
          <path
            d="M28 30C28 25.5817 31.5817 22 36 22H44C48.4183 22 52 25.5817 52 30V62C52 71.9411 60.0589 80 70 80H74C78.4183 80 82 83.5817 82 88V90C82 94.4183 78.4183 98 74 98H64C44.1177 98 28 81.8823 28 62V30Z"
            fill={`url(#uxi_wing_l_${uid})`}
          />

          {/* Right Ascending X-I Pillar & Crossover */}
          <path
            d="M68 30C68 25.5817 71.5817 22 76 22H84C88.4183 22 92 25.5817 92 30V66C92 83.6731 77.6731 98 60 98H54C49.5817 98 46 94.4183 46 90C46 85.5817 49.5817 82 54 82H58C63.5228 82 68 77.5228 68 72V30Z"
            fill={`url(#uxi_wing_r_${uid})`}
          />

          {/* Floating Liquid Glass 'I' Spark Dot & Intersection Facet */}
          <rect
            x="68"
            y="22"
            width="24"
            height="20"
            rx="8"
            fill={`url(#uxi_glass_${uid})`}
          />
          <circle
            cx="60"
            cy="58"
            r="10"
            fill={`url(#uxi_glass_${uid})`}
          />
        </g>

        {/* Outer Specular Squircle Border */}
        <rect
          x="8.75"
          y="8.75"
          width="102.5"
          height="102.5"
          rx="27.25"
          stroke={`url(#uxi_rim_${uid})`}
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
};
