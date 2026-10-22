import React, { useId } from 'react';

export interface UXILogoProps {
  size?: number;
  glow?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * uxiGL 3D Interwoven Ribbon Monogram Logo (v2.5.0)
 * Exact vector reconstruction of the official uxiGL emblem:
 * - Outer 'U' 3D beveled pillars & curling lower cradle
 * - Intersecting 'X' sculpted S-ribbons (Mint-Teal & Violet/Cyan wave)
 * - Central translucent 'I' capsule with clipped diagonal refraction bands + top diamond dot
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
          ? 'drop-shadow(0 4px 16px rgba(0, 195, 255, 0.34)) drop-shadow(0 2px 22px rgba(139, 92, 246, 0.26))'
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
          {/* 1. Top Diamond Gradient (#FFFFFF -> #C8F7FB) */}
          <linearGradient
            id={`uxi_dia_${uid}`}
            x1="52"
            y1="9"
            x2="69"
            y2="26"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="55%" stopColor="#E3FCFD" />
            <stop offset="100%" stopColor="#C4F4FA" />
          </linearGradient>

          {/* 2A. Mint-Teal S-Ribbon Main Upper Face */}
          <linearGradient
            id={`uxi_mint_top_${uid}`}
            x1="26"
            y1="18"
            x2="83"
            y2="110"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#35EDA4" />
            <stop offset="32%" stopColor="#1AD8C9" />
            <stop offset="68%" stopColor="#11C6DC" />
            <stop offset="100%" stopColor="#22DFAC" />
          </linearGradient>

          {/* 2B. Mint-Teal S-Ribbon Inner/Lower Bevel */}
          <linearGradient
            id={`uxi_mint_bev_${uid}`}
            x1="28"
            y1="30"
            x2="76"
            y2="110"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#10C8D4" />
            <stop offset="50%" stopColor="#0B8EC4" />
            <stop offset="100%" stopColor="#16B5C8" />
          </linearGradient>

          {/* 3A. Right 'U' Pillar Outer-Right Bevel (#C5ADFB -> #855EED -> #5756E4) */}
          <linearGradient
            id={`uxi_ur_out_${uid}`}
            x1="104"
            y1="18"
            x2="76"
            y2="112"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#C5ADFB" />
            <stop offset="42%" stopColor="#AF9AF5" />
            <stop offset="76%" stopColor="#8A63EE" />
            <stop offset="100%" stopColor="#5756E4" />
          </linearGradient>

          {/* 3B. Right 'U' Pillar Inner-Left Bevel (#A490F3 -> #764DEB -> #454BDA) */}
          <linearGradient
            id={`uxi_ur_in_${uid}`}
            x1="96"
            y1="22"
            x2="68"
            y2="110"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#A48DF2" />
            <stop offset="48%" stopColor="#7C4FEA" />
            <stop offset="85%" stopColor="#5E50E3" />
            <stop offset="100%" stopColor="#4349D9" />
          </linearGradient>

          {/* 4A. Top-Right to Bottom-Left 'X' Ribbon — Upper Lavender-Indigo Facet */}
          <linearGradient
            id={`uxi_x_up_${uid}`}
            x1="90"
            y1="18"
            x2="38"
            y2="92"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#B091EE" />
            <stop offset="35%" stopColor="#8E69EB" />
            <stop offset="70%" stopColor="#5A6CE8" />
            <stop offset="100%" stopColor="#3B7BEB" />
          </linearGradient>

          {/* 4B. Top-Right to Bottom-Left 'X' Ribbon — Lower Cyan Wave Facet */}
          <linearGradient
            id={`uxi_x_low_${uid}`}
            x1="98"
            y1="19"
            x2="44"
            y2="94"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#00BAF7" />
            <stop offset="42%" stopColor="#0CB4F3" />
            <stop offset="76%" stopColor="#2E91EC" />
            <stop offset="100%" stopColor="#387EE6" />
          </linearGradient>

          {/* 5A. Left 'U' Pillar Outer Face & Bottom Cradle (#645CE5 -> #16C5FD -> #337CE5) */}
          <linearGradient
            id={`uxi_ul_out_${uid}`}
            x1="15"
            y1="18"
            x2="64"
            y2="112"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#645CE5" />
            <stop offset="32%" stopColor="#497EEE" />
            <stop offset="66%" stopColor="#14C4FF" />
            <stop offset="86%" stopColor="#1EA0F2" />
            <stop offset="100%" stopColor="#3C5FDD" />
          </linearGradient>

          {/* 5B. Left 'U' Pillar Inner Bevel & Bottom Hook (#665CEA -> #268BED -> #455BD5) */}
          <linearGradient
            id={`uxi_ul_in_${uid}`}
            x1="24"
            y1="19"
            x2="69"
            y2="100"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#665CEA" />
            <stop offset="36%" stopColor="#4F70EA" />
            <stop offset="68%" stopColor="#1E94EE" />
            <stop offset="88%" stopColor="#3264DB" />
            <stop offset="100%" stopColor="#454BDA" />
          </linearGradient>

          {/* 6A. Central 'I' Capsule Base Vertical Gradient */}
          <linearGradient
            id={`uxi_i_base_${uid}`}
            x1="61.5"
            y1="36"
            x2="61.5"
            y2="103.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#B4F6FE" />
            <stop offset="30%" stopColor="#94E4FC" />
            <stop offset="62%" stopColor="#42B5FC" />
            <stop offset="85%" stopColor="#5FA3FA" />
            <stop offset="100%" stopColor="#7C8FFB" />
          </linearGradient>

          {/* 6B. Central 'I' Capsule Clipped Diagonal Violet Refraction Band */}
          <linearGradient
            id={`uxi_i_band_${uid}`}
            x1="70"
            y1="49"
            x2="53"
            y2="78"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#8D69F2" />
            <stop offset="50%" stopColor="#7584F4" />
            <stop offset="100%" stopColor="#5AA1F6" />
          </linearGradient>

          {/* Clip Path for Central 'I' Capsule */}
          <clipPath id={`uxi_i_clip_${uid}`}>
            <rect x="53.5" y="36" width="16" height="67.5" rx="8" />
          </clipPath>
        </defs>

        {/* =================================================================
            1. TOP-LEFT TO BOTTOM-RIGHT MINT/TEAL S-RIBBON (Back X Wing)
        ================================================================= */}
        {/* Inner/Lower Bevel of Mint Ribbon */}
        <path
          d="M24 22L56 58C71 74 77 88 73 102C70 109 62 113 53 113.5C65 111 72 102 70 89C68 78 60 69 47 56L24 33V22Z"
          fill={`url(#uxi_mint_bev_${uid})`}
        />
        {/* Upper/Main Face of Mint-Teal S-Ribbon */}
        <path
          d="M22 19.5C28 16.5 36 18.5 41 25.5L56 47L77 71C86 82 86 99 74 109.5C68 113.5 60 114.2 54 114C68 111.5 76 100.5 74 87.5C72 77 63 67.5 49 54L25 29.5C22 25.5 20.5 21 22 19.5Z"
          fill={`url(#uxi_mint_top_${uid})`}
        />

        {/* =================================================================
            2. RIGHT 'U' 3D BEVELED PILLAR & LOWER-RIGHT BOWL
        ================================================================= */}
        {/* Right Pillar Inner-Left Bevel */}
        <path
          d="M93 26C93 20.5 96.8 18 101 18L101.5 72C101.5 95 85 112 60 114C56 114.2 53 114 50 113.5C74 111 93 93.5 93 70V26Z"
          fill={`url(#uxi_ur_in_${uid})`}
        />
        {/* Right Pillar Outer-Right Bevel */}
        <path
          d="M101 18C105.2 18 107.5 20.8 107.5 25.5V70C107.5 95.5 89 114 61 114H55C80 112.5 99.5 94 99.5 70V24C99.5 20.2 100 18 101 18Z"
          fill={`url(#uxi_ur_out_${uid})`}
        />

        {/* =================================================================
            3. TOP-RIGHT TO BOTTOM-LEFT 'X' DUAL-FACETED RIBBON
        ================================================================= */}
        {/* Upper-Left Violet-Indigo Facet */}
        <path
          d="M36 89L76 26C80.5 19.2 87.5 17.2 93.5 18.8C96 19.5 98 21 98 21C92.5 22 87.5 26.5 82.5 34.5L45 92C41 92 38 90.8 36 89Z"
          fill={`url(#uxi_x_up_${uid})`}
        />
        {/* Lower-Right Electric Cyan Sculpted Leaf-Wave Facet */}
        <path
          d="M44 93.5L81.5 35C86.5 27 92.5 20.5 99.5 18.3C101.5 17.7 102.8 19 102.2 21.8C101.2 26.8 101.5 31.8 98.8 36.8C96.5 41 91.5 46 86 53.5L54 96C50 96 46.5 95 44 93.5Z"
          fill={`url(#uxi_x_low_${uid})`}
        />

        {/* =================================================================
            4. LEFT 'U' 3D BEVELED PILLAR & BOTTOM-LEFT CURLING CRADLE
        ================================================================= */}
        {/* Left 'U' Inner Bevel & Hook Wrapping Around Bottom of 'I' Capsule */}
        <path
          d="M16 18C23 19.2 28 24.8 28 32.5V69C28 84 39 94.5 53 94.5C61 94.5 66.5 89.5 66.5 82.5C66.5 77.5 63.5 73 59 69.5L65 62C71.5 67.5 74.5 75.5 74.5 84.5C74.5 96.5 64.5 105.5 50 105.5C32 105.5 20.5 90.5 20.5 69V24C20.5 20.2 18.8 18.4 16 18Z"
          fill={`url(#uxi_ul_in_${uid})`}
        />
        {/* Left 'U' Outer Pillar & Lower-Left Bowl */}
        <path
          d="M12.5 23.5C12.5 19.5 14.2 17.8 16.5 18C19.5 19.5 21 23 21 27.5V69C21 89.5 33 104 51 104C62.5 104 71 97.5 73.5 87.5C74.5 100.5 64 114 47.5 114C26.5 114 12.5 96.5 12.5 71V23.5Z"
          fill={`url(#uxi_ul_out_${uid})`}
        />

        {/* =================================================================
            5. CENTRAL VERTICAL 'I' CAPSULE WITH INTERWOVEN X REFRACTION
        ================================================================= */}
        <g clipPath={`url(#uxi_i_clip_${uid})`}>
          {/* Base Vertical 'I' Pill (Ice Cyan -> Sky Blue -> Periwinkle) */}
          <rect
            x="53.5"
            y="36"
            width="16"
            height="67.5"
            rx="8"
            fill={`url(#uxi_i_base_${uid})`}
          />
          {/* Diagonal Violet-Periwinkle Band Where Upper 'X' Facet Crosses 'I' */}
          <path
            d="M51 67L72 47V61L51 81V67Z"
            fill={`url(#uxi_i_band_${uid})`}
          />
          {/* Diagonal Sky-Cyan Band Where Lower 'X' Facet Crosses 'I' */}
          <path
            d="M51 81L72 61V71L51 91V81Z"
            fill="#48BCFA"
            fillOpacity="0.65"
          />
        </g>

        {/* =================================================================
            6. TOP FLOATING ROUNDED DIAMOND ('I' DOT)
        ================================================================= */}
        <rect
          x="51.5"
          y="8"
          width="18"
          height="18"
          rx="4.8"
          transform="rotate(45 60.5 17)"
          fill={`url(#uxi_dia_${uid})`}
        />
      </svg>
    </div>
  );
};
