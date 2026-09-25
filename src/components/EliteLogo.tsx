import React from 'react';

interface EliteLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  variant?: 'gold' | 'light' | 'dark';
  showSubtext?: boolean;
}

export const EliteLogo: React.FC<EliteLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'gold',
  showSubtext = false,
}) => {
  // Proportional sizing maps
  const sizeMap = {
    xs: 'w-7 h-9',
    sm: 'w-9 h-11',
    md: 'w-11 h-14',
    lg: 'w-14 h-18',
    xl: 'w-20 h-26',
    custom: '',
  };

  const currentSizeClass = sizeMap[size] || sizeMap.md;
  const idPrefix = React.useId().replace(/:/g, '');

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        viewBox="0 0 800 1000"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${currentSizeClass} shrink-0 drop-shadow-xs transition-transform duration-300 group-hover:scale-105`}
        aria-label="Elite Designer Jewelry Official Logo"
      >
        <defs>
          {/* Authentic Multi-Stop Imperial Gold Metallic Gradient */}
          <linearGradient id={`${idPrefix}-gold`} x1="15%" y1="5%" x2="85%" y2="95%">
            <stop offset="0%" stopColor="#F7E7BA" />
            <stop offset="18%" stopColor="#DEBC6C" />
            <stop offset="38%" stopColor="#FFF3D2" />
            <stop offset="55%" stopColor="#D4AC4C" />
            <stop offset="78%" stopColor="#B58A2F" />
            <stop offset="100%" stopColor="#886116" />
          </linearGradient>

          {/* Deep Antique Gold for Light Ivory Backgrounds */}
          <linearGradient id={`${idPrefix}-darkGold`} x1="15%" y1="5%" x2="85%" y2="95%">
            <stop offset="0%" stopColor="#D8AF44" />
            <stop offset="25%" stopColor="#B88A24" />
            <stop offset="50%" stopColor="#F3D580" />
            <stop offset="75%" stopColor="#966C12" />
            <stop offset="100%" stopColor="#735008" />
          </linearGradient>

          {/* Radiant Shimmer Gold for Dark Emerald & Black Backgrounds */}
          <linearGradient id={`${idPrefix}-lightGold`} x1="15%" y1="5%" x2="85%" y2="95%">
            <stop offset="0%" stopColor="#FFF7DE" />
            <stop offset="22%" stopColor="#E6C87C" />
            <stop offset="45%" stopColor="#FFF9EB" />
            <stop offset="70%" stopColor="#D8B153" />
            <stop offset="100%" stopColor="#A87F20" />
          </linearGradient>
        </defs>

        {(() => {
          const fillGrad =
            variant === 'dark'
              ? `url(#${idPrefix}-darkGold)`
              : variant === 'light'
              ? `url(#${idPrefix}-lightGold)`
              : `url(#${idPrefix}-gold)`;

          return (
            <g id="elite-logo-emblem">
              {/* ==================================================== */}
              {/* 1. ROYAL HERALDIC CROWN (EXACT REPLICA)             */}
              {/* ==================================================== */}
              <g fill={fillGrad}>
                {/* Arched Crown Base Band */}
                <path d="M 315 293 C 355 282 445 282 485 293 L 484 285 C 445 274 355 274 316 285 Z" />

                {/* 5 Crown Band Jewels / Pearls */}
                <ellipse cx="400" cy="281" rx="4.5" ry="3" />
                <ellipse cx="362" cy="283" rx="3.5" ry="2.5" />
                <ellipse cx="438" cy="283" rx="3.5" ry="2.5" />
                <ellipse cx="332" cy="286" rx="2.8" ry="2" />
                <ellipse cx="468" cy="286" rx="2.8" ry="2" />

                {/* Center Fleur-de-lis: Tall Center Spear Petal */}
                <path d="M 400 152 
                         C 405 174 416 195 416 212 
                         C 416 226 410 236 400 240 
                         C 390 236 384 226 384 212 
                         C 384 195 395 174 400 152 Z" />

                {/* Center Fleur-de-lis: Left Curled Petal */}
                <path d="M 397 238 
                         C 384 232 366 226 366 210 
                         C 366 198 376 194 388 204 
                         C 395 210 396 218 397 238 Z" />

                {/* Center Fleur-de-lis: Right Curled Petal */}
                <path d="M 403 238 
                         C 416 232 434 226 434 210 
                         C 434 198 424 194 412 204 
                         C 405 210 404 218 403 238 Z" />

                {/* Center Fleur-de-lis: Horizontal Tie Clasp */}
                <rect x="387" y="238" width="26" height="5" rx="2.5" />

                {/* Mid-Left Scrolling Crest */}
                <path d="M 352 282 
                         C 342 260 332 235 340 216 
                         C 346 204 360 206 360 216 
                         C 360 224 352 229 344 225 
                         C 340 237 348 260 358 281 Z" />

                {/* Mid-Right Scrolling Crest */}
                <path d="M 448 282 
                         C 458 260 468 235 460 216 
                         C 454 204 440 206 440 216 
                         C 440 224 448 229 456 225 
                         C 460 237 452 260 442 281 Z" />

                {/* Far-Left Wingtip Finial */}
                <path d="M 319 285 
                         C 313 266 304 248 302 230 
                         C 312 242 322 258 326 284 Z" />

                {/* Far-Right Wingtip Finial */}
                <path d="M 481 285 
                         C 487 266 496 248 498 230 
                         C 488 242 478 258 474 284 Z" />
              </g>

              {/* ==================================================== */}
              {/* 2. OUTER EQUILATERAL TRIANGLE (PRECISE MITER JOIN)   */}
              {/* ==================================================== */}
              <polygon
                points="400,287 650,720 150,720"
                fill="none"
                stroke={fillGrad}
                strokeWidth="16"
                strokeLinejoin="miter"
                strokeMiterlimit="10"
              />

              {/* ==================================================== */}
              {/* 3. INNER EQUILATERAL TRIANGLE (PRECISE PARALLEL)    */}
              {/* ==================================================== */}
              <polygon
                points="400,347 598,690 202,690"
                fill="none"
                stroke={fillGrad}
                strokeWidth="16"
                strokeLinejoin="miter"
                strokeMiterlimit="10"
              />

              {/* ==================================================== */}
              {/* 4. INNER CIPHER MONOGRAM ("A", "E", "J")            */}
              {/* ==================================================== */}
              <g fill={fillGrad}>
                {/* Apex 'A' Triangular Opening */}
                <polygon points="400,380 416,420 384,420" />

                {/* Horizontal Crossbar of 'A' */}
                <polygon points="378,426 422,426 426,440 374,440" />

                {/* Left Slanted Leg / 'E' Spine */}
                <polygon points="374,440 388,440 258,665 244,665" />

                {/* 'E' Top Horizontal Arm */}
                <polygon points="378,450 422,450 422,464 370,464" />

                {/* 'E' Middle Horizontal Arm */}
                <polygon points="340,530 422,530 422,544 332,544" />

                {/* 'E' Bottom Horizontal Arm */}
                <polygon points="254,660 422,660 422,674 246,674" />

                {/* 'J' Stylized Vertical Column & Bottom Left Hook */}
                <path d="M 436,450 
                         L 452,450 
                         L 452,624 
                         C 452,654 434,674 400,674 
                         L 360,674 
                         L 360,660 
                         L 400,660 
                         C 424,660 436,648 436,624 
                         Z" />
              </g>
            </g>
          );
        })()}
      </svg>

      {/* Optional Brand Typography Lockup */}
      {showSubtext && (
        <div className="flex flex-col text-left">
          <span className="font-serif text-xl sm:text-2xl font-medium tracking-tight text-[#083338] leading-tight">
            Elite Designer Jewelry
          </span>
          <span className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase font-sans text-[#b88e36] font-semibold mt-0.5">
            Fine Diamond Jewelry
          </span>
        </div>
      )}
    </div>
  );
};
