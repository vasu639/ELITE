import React from 'react';
import { Product } from '../types';

interface JewelryVisualProps {
  product: Product;
  aspectRatio?: 'square' | 'wide' | 'portrait';
  angleIndex?: number;
  className?: string;
  showZoom?: boolean;
}

export const JewelryVisual: React.FC<JewelryVisualProps> = ({
  product,
  aspectRatio = 'square',
  angleIndex = 0,
  className = '',
}) => {
  const ratioClasses = {
    square: 'aspect-square',
    wide: 'aspect-[16/10]',
    portrait: 'aspect-[3/4]',
  }[aspectRatio];

  const getGradientTheme = () => {
    switch (product.category) {
      case 'mangalsutras':
        return 'from-[#042326] via-[#083338] to-[#02181a]';
      case 'rings':
        return product.metal.includes('Rose') 
          ? 'from-[#06262a] via-[#0a383d] to-[#03191c]' 
          : 'from-[#05282c] via-[#0a3e44] to-[#031d20]';
      case 'pendant-sets':
        return 'from-[#042529] via-[#09373d] to-[#021618]';
      case 'necklaces':
        return 'from-[#052b30] via-[#0c444b] to-[#031b1e]';
      case 'earrings':
        return 'from-[#042327] via-[#0a3a40] to-[#021719]';
      case 'bracelets':
        return 'from-[#05272a] via-[#0a383d] to-[#03191c]';
      default:
        return 'from-[#042326] via-[#083338] to-[#02181a]';
    }
  };

  const isGold = product.metal.includes('Yellow');
  const isRose = product.metal.includes('Rose');
  const isPlatinum = product.metal.includes('Platinum') || product.metal.includes('White');

  const metalStroke = isRose 
    ? 'url(#roseGoldGrad)' 
    : isGold 
    ? 'url(#yellowGoldGrad)' 
    : 'url(#platinumGrad)';

  const metalFill = isRose 
    ? 'url(#roseGoldSurface)' 
    : isGold 
    ? 'url(#yellowGoldSurface)' 
    : 'url(#platinumSurface)';

  if (product.imageUrl) {
    return (
      <div 
        className={`relative overflow-hidden flex items-center justify-center bg-[#042326] ${ratioClasses} ${className} group`}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
        <div className="absolute top-3 left-3 text-[10px] tracking-widest uppercase font-mono text-[#d4af37] bg-[#042326]/80 backdrop-blur-xs px-2 py-0.5 border border-[#d4af37]/30 flex items-center gap-1.5 select-none pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] inline-block animate-pulse" />
          <span>{product.certification.lab} CERTIFIED · {product.hallmarkRecord.split(' ')[0]} {product.hallmarkRecord.split(' ')[2] || '750'}</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative overflow-hidden flex items-center justify-center bg-gradient-to-b ${getGradientTheme()} ${ratioClasses} ${className} group`}
    >
      {/* Subtle velvet texture / soft atmospheric glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(212,175,55,0.08),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

      {/* Hallmark & Certification Micro watermark */}
      <div className="absolute top-3 left-3 text-[10px] tracking-widest uppercase font-mono text-amber-200/50 flex items-center gap-1.5 select-none pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400/60 inline-block" />
        <span>{product.certification.lab} CERTIFIED · {product.hallmarkRecord.split(' ')[0]} {product.hallmarkRecord.split(' ')[2] || '750'}</span>
      </div>

      {/* SVG Fine Jewelry Illustration Engine */}
      <div className="relative z-10 w-[78%] h-[78%] flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-105">
        <svg 
          viewBox="0 0 300 300" 
          className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
          aria-hidden="true"
        >
          <defs>
            {/* 18K Yellow Gold Gradients */}
            <linearGradient id="yellowGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2B2" />
              <stop offset="35%" stopColor="#DFB76C" />
              <stop offset="70%" stopColor="#9E762B" />
              <stop offset="100%" stopColor="#E2C17D" />
            </linearGradient>
            <linearGradient id="yellowGoldSurface" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#DFB76C" />
              <stop offset="100%" stopColor="#8A631E" />
            </linearGradient>

            {/* 18K Rose Gold Gradients */}
            <linearGradient id="roseGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE0D6" />
              <stop offset="35%" stopColor="#E09F93" />
              <stop offset="70%" stopColor="#A85F55" />
              <stop offset="100%" stopColor="#F5BDB5" />
            </linearGradient>
            <linearGradient id="roseGoldSurface" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E09F93" />
              <stop offset="100%" stopColor="#9C5248" />
            </linearGradient>

            {/* Platinum / White Gold Gradients */}
            <linearGradient id="platinumGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#D5DBE1" />
              <stop offset="75%" stopColor="#7B8794" />
              <stop offset="100%" stopColor="#E4E7EB" />
            </linearGradient>
            <linearGradient id="platinumSurface" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D5DBE1" />
              <stop offset="100%" stopColor="#616E7C" />
            </linearGradient>

            {/* Diamond Facet Shimmer */}
            <radialGradient id="diamondShimmer" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="45%" stopColor="#E2F1FF" stopOpacity="0.9" />
              <stop offset="80%" stopColor="#ADCDE9" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#6C8AA6" stopOpacity="0.7" />
            </radialGradient>

            {/* Colombian Emerald Deep Lustre */}
            <radialGradient id="emeraldLustre" cx="35%" cy="30%" r="75%">
              <stop offset="0%" stopColor="#5EFFA8" />
              <stop offset="40%" stopColor="#0EA45C" />
              <stop offset="85%" stopColor="#04562E" />
              <stop offset="100%" stopColor="#022915" />
            </radialGradient>

            {/* Burmese Ruby Gradient */}
            <radialGradient id="rubyLustre" cx="35%" cy="30%" r="75%">
              <stop offset="0%" stopColor="#FF7B97" />
              <stop offset="40%" stopColor="#B30938" />
              <stop offset="85%" stopColor="#6E001D" />
              <stop offset="100%" stopColor="#36000C" />
            </radialGradient>

            {/* Kashmir Sapphire Gradient */}
            <radialGradient id="sapphireLustre" cx="35%" cy="30%" r="75%">
              <stop offset="0%" stopColor="#7EBCFF" />
              <stop offset="40%" stopColor="#1E4CB0" />
              <stop offset="85%" stopColor="#0E235C" />
              <stop offset="100%" stopColor="#050E28" />
            </radialGradient>
          </defs>

          {/* Conditional Category Renderings */}
          {product.category === 'rings' && (
            <g transform="translate(150, 160)">
              {/* Ring Band */}
              <ellipse 
                cx="0" 
                cy="30" 
                rx="68" 
                ry="36" 
                fill="none" 
                stroke={metalStroke} 
                strokeWidth="11" 
              />
              <ellipse 
                cx="0" 
                cy="30" 
                rx="62" 
                ry="30" 
                fill="none" 
                stroke="#1B1017" 
                strokeWidth="3" 
                opacity="0.8"
              />

              {/* Head / Basket Setting */}
              <path 
                d="M -22 10 L -14 -32 L 14 -32 L 22 10 Z" 
                fill={metalFill} 
                stroke={metalStroke} 
                strokeWidth="2.5" 
              />

              {/* Center Stone */}
              {product.handle.includes('emerald') ? (
                // Octagonal Step-cut Emerald
                <g transform="translate(0, -42)">
                  <polygon 
                    points="-26,-18 26,-18 36,0 26,18 -26,18 -36,0" 
                    fill="url(#emeraldLustre)" 
                    stroke="#8BFFA8" 
                    strokeWidth="1.5" 
                  />
                  <polygon 
                    points="-18,-11 18,-11 25,0 18,11 -18,11 -25,0" 
                    fill="none" 
                    stroke="#FFFFFF" 
                    strokeWidth="0.75" 
                    opacity="0.6" 
                  />
                  {/* Halo Diamonds */}
                  {[-34, -22, -10, 0, 10, 22, 34].map((x, i) => (
                    <circle key={`h-t-${i}`} cx={x} cy="-26" r="3.2" fill="url(#diamondShimmer)" stroke="#fff" strokeWidth="0.5" />
                  ))}
                  {[-34, -22, -10, 0, 10, 22, 34].map((x, i) => (
                    <circle key={`h-b-${i}`} cx={x} cy="26" r="3.2" fill="url(#diamondShimmer)" stroke="#fff" strokeWidth="0.5" />
                  ))}
                </g>
              ) : product.handle.includes('pear') ? (
                // Pear Cut Solitaire
                <g transform="translate(0, -46)">
                  <path 
                    d="M 0 -44 C 32 -10 30 26 0 32 C -30 26 -32 -10 0 -44 Z" 
                    fill="url(#diamondShimmer)" 
                    stroke="#FFFFFF" 
                    strokeWidth="1.5" 
                  />
                  {/* Facet Star Lines */}
                  <line x1="0" y1="-44" x2="0" y2="30" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.6" />
                  <line x1="-22" y1="8" x2="22" y2="8" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.6" />
                  <line x1="-16" y1="-12" x2="16" y2="-12" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.6" />
                  {/* Micro Prongs */}
                  <circle cx="0" cy="-42" r="3" fill={metalFill} />
                  <circle cx="-25" cy="2" r="3" fill={metalFill} />
                  <circle cx="25" cy="2" r="3" fill={metalFill} />
                  <circle cx="-16" cy="26" r="3" fill={metalFill} />
                  <circle cx="16" cy="26" r="3" fill={metalFill} />
                </g>
              ) : (
                // Marquise & Baguettes
                <g transform="translate(0, -46)">
                  <path 
                    d="M 0 -42 Q 28 0 0 42 Q -28 0 0 -42 Z" 
                    fill="url(#diamondShimmer)" 
                    stroke="#FFFFFF" 
                    strokeWidth="1.5" 
                  />
                  <line x1="0" y1="-42" x2="0" y2="42" stroke="#FFFFFF" strokeWidth="1" opacity="0.7" />
                  <line x1="-18" y1="0" x2="18" y2="0" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.6" />
                  {/* Side Baguettes */}
                  <rect x="-38" y="-12" width="10" height="24" rx="1" fill="url(#diamondShimmer)" stroke="#fff" strokeWidth="0.5" />
                  <rect x="28" y="-12" width="10" height="24" rx="1" fill="url(#diamondShimmer)" stroke="#fff" strokeWidth="0.5" />
                </g>
              )}
            </g>
          )}

          {product.category === 'mangalsutras' && (
            <g transform="translate(150, 140)">
              {/* Twin Arching Strands */}
              <path 
                d="M -130 -80 Q -70 80 0 65 Q 70 80 130 -80" 
                fill="none" 
                stroke={metalStroke} 
                strokeWidth="2.5" 
              />
              {product.mangalsutraStrandCount !== 'Single Strand' && (
                <path 
                  d="M -125 -74 Q -65 74 0 57 Q 65 74 125 -74" 
                  fill="none" 
                  stroke={metalStroke} 
                  strokeWidth="2" 
                />
              )}

              {/* Auspicious Black Beads Stations */}
              {[-110, -90, -70, -50, -32, 32, 50, 70, 90, 110].map((offset, idx) => {
                const yPos = -60 + Math.pow(Math.abs(offset) / 14, 2) * 1.5;
                return (
                  <g key={`bead-${idx}`} transform={`translate(${offset * 0.9}, ${yPos - 10})`}>
                    <circle cx="-3" cy="0" r="3.2" fill="#151216" stroke="#432032" strokeWidth="0.8" />
                    <circle cx="3" cy="0" r="3.2" fill="#151216" stroke="#432032" strokeWidth="0.8" />
                    <circle cx="0" cy="0" r="2.2" fill={metalFill} />
                  </g>
                );
              })}

              {/* Mangalsutra Center Pendant */}
              {product.mangalsutraPendantStyle === 'Solitaire' ? (
                <g transform="translate(0, 68)">
                  <circle cx="0" cy="0" r="16" fill={metalFill} stroke={metalStroke} strokeWidth="2" />
                  <circle cx="0" cy="0" r="10" fill="url(#diamondShimmer)" stroke="#FFFFFF" strokeWidth="1" />
                  {/* Subtle sparkle */}
                  <polygon points="0,-13 2,-2 13,0 2,2 0,13 -2,2 -13,0 -2,-2" fill="#FFFFFF" opacity="0.6" />
                </g>
              ) : product.mangalsutraPendantStyle === 'Geometric' ? (
                <g transform="translate(0, 64)">
                  <path d="M -34 0 L 0 24 L 34 0 L 26 -8 L 0 12 L -26 -8 Z" fill={metalFill} stroke={metalStroke} strokeWidth="1.5" />
                  {/* Pave diamonds on chevron */}
                  {[-24, -16, -8, 0, 8, 16, 24].map((px, i) => (
                    <circle key={`chev-${i}`} cx={px} cy={Math.abs(px) * -0.3 + 8} r="2.8" fill="url(#diamondShimmer)" stroke="#fff" strokeWidth="0.5" />
                  ))}
                </g>
              ) : (
                // Traditional Kundan Floral Center
                <g transform="translate(0, 66)">
                  <circle cx="0" cy="0" r="18" fill="url(#yellowGoldSurface)" stroke={metalStroke} strokeWidth="2" />
                  <circle cx="0" cy="0" r="9" fill="url(#rubyLustre)" stroke="#fff" strokeWidth="0.8" />
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, k) => (
                    <circle 
                      key={`petal-${k}`} 
                      cx={Math.cos(angle * Math.PI / 180) * 19} 
                      cy={Math.sin(angle * Math.PI / 180) * 19} 
                      r="4.5" 
                      fill="url(#diamondShimmer)" 
                      stroke="#FFFFFF" 
                      strokeWidth="0.75" 
                    />
                  ))}
                  {/* Seed pearl fringe */}
                  {[-12, -4, 4, 12].map((drp, pIdx) => (
                    <g key={`pearl-fringe-${pIdx}`} transform={`translate(${drp}, 28)`}>
                      <line x1="0" y1="0" x2="0" y2="8" stroke={metalStroke} strokeWidth="1" />
                      <circle cx="0" cy="11" r="3.5" fill="#FAF5ED" stroke="#E2DACF" strokeWidth="0.5" />
                    </g>
                  ))}
                </g>
              )}
            </g>
          )}

          {product.category === 'pendant-sets' && (
            <g transform="translate(150, 145)">
              {/* Upper Subtle Fine Chain for Pendant */}
              <path d="M -75 -90 Q 0 10 75 -90" fill="none" stroke={metalStroke} strokeWidth="1.5" strokeDasharray="3 2" />
              
              {/* Central Main Pendant */}
              <g transform="translate(0, -6)">
                {/* Bail */}
                <path d="M -4 -26 L 4 -26 L 6 -12 L -6 -12 Z" fill={metalFill} stroke={metalStroke} strokeWidth="1" />
                {/* Teardrop Halo */}
                <path 
                  d="M 0 -12 C 26 4 24 34 0 46 C -24 34 -26 4 0 -12 Z" 
                  fill={product.handle.includes('ruby') ? 'url(#rubyLustre)' : 'url(#diamondShimmer)'} 
                  stroke={metalStroke} 
                  strokeWidth="2" 
                />
                <circle cx="0" cy="18" r="7" fill={product.handle.includes('ruby') ? '#FF94AB' : '#FFFFFF'} opacity="0.8" />
              </g>

              {/* Left Matching Earring */}
              <g transform="translate(-76, 32)">
                <circle cx="0" cy="-28" r="4.5" fill={metalFill} stroke={metalStroke} strokeWidth="1" />
                <path 
                  d="M 0 -18 C 16 -6 15 16 0 24 C -15 16 -16 -6 0 -18 Z" 
                  fill={product.handle.includes('ruby') ? 'url(#rubyLustre)' : 'url(#diamondShimmer)'} 
                  stroke={metalStroke} 
                  strokeWidth="1.5" 
                />
              </g>

              {/* Right Matching Earring */}
              <g transform="translate(76, 32)">
                <circle cx="0" cy="-28" r="4.5" fill={metalFill} stroke={metalStroke} strokeWidth="1" />
                <path 
                  d="M 0 -18 C 16 -6 15 16 0 24 C -15 16 -16 -6 0 -18 Z" 
                  fill={product.handle.includes('ruby') ? 'url(#rubyLustre)' : 'url(#diamondShimmer)'} 
                  stroke={metalStroke} 
                  strokeWidth="1.5" 
                />
              </g>

              {/* Set Inclusion Callout Banner */}
              <text x="0" y="92" textAnchor="middle" fill="#E2DACF" fontSize="11" letterSpacing="2" fontFamily="sans-serif">
                3-PIECE COORDINATED SUITE
              </text>
            </g>
          )}

          {product.category === 'earrings' && (
            <g transform="translate(150, 140)">
              {product.earringStyle === 'Stud' ? (
                // Stud Pair
                <g>
                  {/* Left Stud */}
                  <g transform="translate(-50, 0)">
                    <circle cx="0" cy="0" r="26" fill={metalFill} stroke={metalStroke} strokeWidth="2" />
                    <circle cx="0" cy="0" r="18" fill="url(#diamondShimmer)" stroke="#FFFFFF" strokeWidth="1.5" />
                    {/* 4 Prongs */}
                    <circle cx="-16" cy="-16" r="3.5" fill={metalFill} />
                    <circle cx="16" cy="-16" r="3.5" fill={metalFill} />
                    <circle cx="-16" cy="16" r="3.5" fill={metalFill} />
                    <circle cx="16" cy="16" r="3.5" fill={metalFill} />
                    {/* Star spark */}
                    <polygon points="0,-14 2,-2 14,0 2,2 0,14 -2,2 -14,0 -2,-2" fill="#FFFFFF" opacity="0.8" />
                  </g>
                  {/* Right Stud */}
                  <g transform="translate(50, 0)">
                    <circle cx="0" cy="0" r="26" fill={metalFill} stroke={metalStroke} strokeWidth="2" />
                    <circle cx="0" cy="0" r="18" fill="url(#diamondShimmer)" stroke="#FFFFFF" strokeWidth="1.5" />
                    {/* 4 Prongs */}
                    <circle cx="-16" cy="-16" r="3.5" fill={metalFill} />
                    <circle cx="16" cy="-16" r="3.5" fill={metalFill} />
                    <circle cx="-16" cy="16" r="3.5" fill={metalFill} />
                    <circle cx="16" cy="16" r="3.5" fill={metalFill} />
                    <polygon points="0,-14 2,-2 14,0 2,2 0,14 -2,2 -14,0 -2,-2" fill="#FFFFFF" opacity="0.8" />
                  </g>
                </g>
              ) : (
                // Chandelier / Polki Grand Earring Pair
                <g>
                  {[-50, 50].map((xOffset, eIdx) => (
                    <g key={`chan-${eIdx}`} transform={`translate(${xOffset}, -30)`}>
                      {/* Top Stud disk */}
                      <circle cx="0" cy="0" r="14" fill={metalFill} stroke={metalStroke} strokeWidth="1.5" />
                      <circle cx="0" cy="0" r="8" fill="url(#diamondShimmer)" />
                      {/* Crescent Tier */}
                      <path d="M -24 36 C -12 24 12 24 24 36 C 18 52 -18 52 -24 36 Z" fill={metalFill} stroke={metalStroke} strokeWidth="1.5" />
                      {/* Suspended Pearl drops */}
                      {[-16, 0, 16].map((pDrop, pI) => (
                        <g key={`dr-${pI}`} transform={`translate(${pDrop}, 54)`}>
                          <line x1="0" y1="0" x2="0" y2="16" stroke={metalStroke} strokeWidth="1" />
                          <circle cx="0" cy="22" r="5" fill="#FAF5ED" stroke="#E2DACF" strokeWidth="0.8" />
                          <circle cx="0" cy="16" r="3.5" fill="url(#emeraldLustre)" />
                        </g>
                      ))}
                    </g>
                  ))}
                </g>
              )}
            </g>
          )}

          {product.category === 'pendants' && (
            <g transform="translate(150, 140)">
              {/* Chain */}
              <path d="M -80 -80 Q 0 40 80 -80" fill="none" stroke={metalStroke} strokeWidth="2" strokeDasharray="3 2" />
              {/* Bail */}
              <path d="M -5 20 L 5 20 L 7 36 L -7 36 Z" fill={metalFill} stroke={metalStroke} strokeWidth="1.2" />
              {product.handle.includes('sapphire') ? (
                // Sapphire Pear Halo
                <g transform="translate(0, 48)">
                  <path d="M 0 0 C 34 22 30 68 0 84 C -30 68 -34 22 0 0 Z" fill="url(#sapphireLustre)" stroke="#FFFFFF" strokeWidth="1.5" />
                  <circle cx="0" cy="52" r="8" fill="#7EBCFF" opacity="0.5" />
                  {/* Halo stones */}
                  {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
                    <circle 
                      key={`s-halo-${i}`} 
                      cx={Math.cos(deg * Math.PI / 180) * 26} 
                      cy={Math.sin(deg * Math.PI / 180) * 32 + 46} 
                      r="3.2" 
                      fill="url(#diamondShimmer)" 
                      stroke="#fff" 
                      strokeWidth="0.5" 
                    />
                  ))}
                </g>
              ) : (
                // Solaris Sunburst
                <g transform="translate(0, 52)">
                  {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map((angle, rayIdx) => (
                    <line 
                      key={`ray-${rayIdx}`}
                      x1={Math.cos(angle * Math.PI / 180) * 16}
                      y1={Math.sin(angle * Math.PI / 180) * 16}
                      x2={Math.cos(angle * Math.PI / 180) * 40}
                      y2={Math.sin(angle * Math.PI / 180) * 40}
                      stroke={metalStroke}
                      strokeWidth="2.5"
                    />
                  ))}
                  <circle cx="0" cy="0" r="16" fill={metalFill} stroke={metalStroke} strokeWidth="2" />
                  <circle cx="0" cy="0" r="10" fill="url(#diamondShimmer)" stroke="#FFFFFF" strokeWidth="1" />
                </g>
              )}
            </g>
          )}

          {product.category === 'necklaces' && (
            <g transform="translate(150, 135)">
              {product.handle.includes('tennis') ? (
                // Tennis Diamond Graduated Strands
                <g>
                  <path d="M -110 -60 Q 0 100 110 -60" fill="none" stroke={metalStroke} strokeWidth="3" />
                  {/* Graduated diamonds */}
                  {Array.from({ length: 27 }).map((_, dIdx) => {
                    const t = dIdx / 26; // 0 to 1
                    const x = -105 + t * 210;
                    const y = -50 + Math.sin(t * Math.PI) * 120;
                    // graduated radius (larger in center)
                    const rad = 2.4 + Math.sin(t * Math.PI) * 3.6;
                    return (
                      <circle 
                        key={`t-dia-${dIdx}`} 
                        cx={x} 
                        cy={y} 
                        r={rad} 
                        fill="url(#diamondShimmer)" 
                        stroke="#fff" 
                        strokeWidth="0.6" 
                      />
                    );
                  })}
                </g>
              ) : (
                // Hasli Royal Polki Choker
                <g>
                  {/* Rigid Sculpted Collar */}
                  <path 
                    d="M -115 -50 C -70 85 70 85 115 -50 C 95 65 -95 65 -115 -50 Z" 
                    fill="url(#yellowGoldSurface)" 
                    stroke={metalStroke} 
                    strokeWidth="3" 
                  />
                  {/* Center Polki Emerald Drop */}
                  <g transform="translate(0, 78)">
                    <polygon points="0,-8 18,12 0,32 -18,12" fill="url(#emeraldLustre)" stroke="#9E762B" strokeWidth="2" />
                    <circle cx="0" cy="42" r="5" fill="#FAF5ED" stroke="#E2DACF" strokeWidth="1" />
                  </g>
                </g>
              )}
            </g>
          )}

          {product.category === 'bracelets' && (
            <g transform="translate(150, 150)">
              {product.braceletType === 'Cuff' ? (
                // Open Architectural Cuff
                <g>
                  <ellipse cx="0" cy="10" rx="90" ry="52" fill="none" stroke={metalStroke} strokeWidth="14" strokeDasharray="380 90" strokeDashoffset="45" />
                  {/* Pear Finials */}
                  <g transform="translate(-40, 52) rotate(-35)">
                    <path d="M 0 -14 C 10 -4 10 10 0 14 C -10 10 -10 -4 0 -14 Z" fill="url(#diamondShimmer)" stroke="#FFFFFF" strokeWidth="1.5" />
                  </g>
                  <g transform="translate(40, 52) rotate(35)">
                    <path d="M 0 -14 C 10 -4 10 10 0 14 C -10 10 -10 -4 0 -14 Z" fill="url(#diamondShimmer)" stroke="#FFFFFF" strokeWidth="1.5" />
                  </g>
                </g>
              ) : (
                // Diamond Tennis Bracelet
                <g>
                  <ellipse cx="0" cy="10" rx="88" ry="46" fill="none" stroke={metalStroke} strokeWidth="7" />
                  {Array.from({ length: 24 }).map((_, bIdx) => {
                    const angle = (bIdx / 24) * 2 * Math.PI;
                    const bx = Math.cos(angle) * 88;
                    const by = Math.sin(angle) * 46 + 10;
                    return (
                      <circle key={`brc-dia-${bIdx}`} cx={bx} cy={by} r="3.2" fill="url(#diamondShimmer)" stroke="#fff" strokeWidth="0.5" />
                    );
                  })}
                  {/* Safety Clasp */}
                  <rect x="-8" y="-40" width="16" height="8" rx="2" fill={metalFill} stroke={metalStroke} strokeWidth="1" />
                </g>
              )}
            </g>
          )}
        </svg>
      </div>

      {/* Sales Mode & Availability pill-free typography tag in bottom right */}
      <div className="absolute bottom-3 right-3 z-20 text-[11px] font-medium tracking-wider uppercase text-amber-100/80 bg-black/40 backdrop-blur-md px-2.5 py-1 border border-white/10 rounded">
        {product.salesMode === 'ready-to-buy' && 'Ready to Buy · In Stock'}
        {product.salesMode === 'made-to-order' && `Made to Order · ${product.leadTimeDays}d`}
        {product.salesMode === 'price-on-request' && 'Price on Request'}
      </div>
    </div>
  );
};
