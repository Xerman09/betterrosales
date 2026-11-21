const fs = require('fs');
const path = require('path');
const opentype = require('opentype.js');

const fontPath = 'C:/Windows/Fonts/GOTHICB.TTF';
const font = opentype.parse(fs.readFileSync(fontPath).buffer);

// Parameters for 'Rosales'
const word = 'Rosales';
const size = 65;
const tracking = -50;
const startX = 192.1;
const baselineY = 117.2;

let x = startX;
const rosalesPaths = [];

for (let i = 0; i < word.length; i++) {
  const ch = word[i];
  const glyph = font.charToGlyph(ch);
  const p = glyph.getPath(x, baselineY, size);
  rosalesPaths.push(p.toPathData(1));
  const kerning = (i < word.length - 1) ? font.getKerningValue(glyph, font.charToGlyph(word[i + 1])) : 0;
  x += (glyph.advanceWidth + kerning + tracking) * (size / font.unitsPerEm);
}

// Better paths
const betterPaths = [
  'M198,56.4V5.9h20.4c4.2,0,7.7,1.3,10.5,3.8,2.8,2.5,4.3,5.7,4.3,9.5s-.6,4.8-1.9,6.7c-1.3,1.9-3,3.3-5.2,4.3v.2c2.6.8,4.7,2.2,6.4,4.3,1.6,2.1,2.5,4.5,2.5,7.3,0,4-1.5,7.4-4.4,10.2-2.9,2.8-6.6,4.1-11,4.1h-21.5ZM207.4,48.6h10.7c2,0,3.8-.7,5.2-2.1,1.4-1.4,2.2-3.1,2.2-5.1s-.7-3.8-2.2-5.1c-1.5-1.3-3.3-2-5.4-2h-13.3v-7h12.3c2.1,0,3.8-.7,5.1-2,1.3-1.3,2-2.9,2-4.7s-.7-3.4-2-4.7c-1.3-1.3-2.9-1.9-4.9-1.9h-9.8v34.7Z',
  'M258.3,57.6c-5.6,0-10.1-1.8-13.5-5.4-3.4-3.6-5.2-8.2-5.2-13.9s1.7-10.1,5.2-13.8c3.4-3.6,7.9-5.5,13.3-5.5s9.5,1.6,12.9,4.8c3.3,3.2,5,7.3,5,12.3v3.9h-31.6v-5.3h22.7c-.1-2.4-1-4.4-2.6-5.9-1.6-1.6-3.7-2.3-6.3-2.3s-5.2,1-6.9,3.1c-1.7,2.1-2.6,4.9-2.6,8.4s1,6.7,3,8.9c2,2.2,4.6,3.3,7.7,3.3s2.7-.2,3.8-.6c1.1-.4,2.1-.9,2.9-1.6.9-.7,1.9-1.8,3-3.3l6,4.1c-1.6,2.4-3.1,4.1-4.7,5.2-1.6,1.1-3.3,2-5.2,2.6-1.9.6-4.2.9-6.9.9Z',
  'M279.7,27.6v-7.3h10.5v7.3h-10.5ZM297,57.6c-3.6,0-6.4-1-8.5-3-2.1-2-3.1-4.9-3.1-8.6V10.3h9.3v34.2c0,1.8.4,3.2,1.1,4.1.8.9,1.9,1.3,3.4,1.3s.9,0,1.4-.1c.5,0,1.4-.4,2.9-.9v7.5c-1.7.5-2.9.8-3.7.9-.8.1-1.7.2-2.8.2ZM290.1,27.6v-7.3h24.4v7.3h-24.4ZM321.1,57.6c-3.6,0-6.4-1-8.5-3-2.1-2-3.1-4.9-3.1-8.6V10.3h9.3v34.2c0,1.8.4,3.2,1.1,4.1.8.9,1.9,1.3,3.4,1.3s.9,0,1.4-.1c.5,0,1.4-.4,2.9-.9v7.5c-1.7.5-2.9.8-3.7.9-.8.1-1.7.2-2.8.2ZM314.6,27.6v-7.3h12.9v7.3h-12.9Z',
  'M350.9,57.6c-5.6,0-10.1-1.8-13.5-5.4-3.4-3.6-5.2-8.2-5.2-13.9s1.7-10.1,5.2-13.8c3.4-3.6,7.9-5.5,13.3-5.5s9.5,1.6,12.9,4.8c3.3,3.2,5,7.3,5,12.3v3.9h-31.6v-5.3h22.7c-.1-2.4-1-4.4-2.6-5.9-1.6-1.6-3.7-2.3-6.3-2.3s-5.2,1-6.9,3.1c-1.7,2.1-2.6,4.9-2.6,8.4s1,6.7,3,8.9c2,2.2,4.6,3.3,7.7,3.3s2.7-.2,3.8-.6c1.1-.4,2.1-.9,2.9-1.6.9-.7,1.9-1.8,3-3.3l6,4.1c-1.6,2.4-3.1,4.1-4.7,5.2-1.6,1.1-3.3,2-5.2,2.6-1.9.6-4.2.9-6.9.9Z',
  'M375,56.4V20.3h8.9v6.8l-1.1-1.2h1.3c.7-2,2-3.6,3.9-4.9,1.9-1.3,4-1.9,6.1-1.9s1.3,0,2,.2c.7.1,1.6.3,2.7.7v8.9c-1.5-.5-2.6-.9-3.5-1-.8-.2-1.6-.2-2.3-.2-2.5,0-4.6.9-6.2,2.8-1.6,1.8-2.5,4.2-2.5,7v19.1h-9.3Z'
];

// .org paths
const orgPaths = [
  'M364.2,139c-.8,0-1.4-.3-1.9-.8s-.8-1.2-.8-1.9.3-1.4.8-1.9,1.2-.8,1.9-.8,1.4.3,1.9.8.8,1.2.8,1.9-.3,1.4-.8,1.9-1.2.8-1.9.8Z',
  'M378,139.3c-2.5,0-4.6-.8-6.3-2.5-1.6-1.6-2.5-3.7-2.5-6.2s.8-4.6,2.5-6.3,3.7-2.4,6.3-2.4,4.6.8,6.3,2.4c1.7,1.6,2.5,3.7,2.5,6.2s-.8,4.6-2.5,6.2c-1.7,1.6-3.7,2.5-6.3,2.5ZM378,135.7c1.3,0,2.4-.5,3.3-1.4.9-1,1.3-2.2,1.3-3.7s-.4-2.7-1.3-3.7c-.9-.9-2-1.4-3.3-1.4s-2.4.5-3.3,1.4c-.9.9-1.3,2.2-1.3,3.7s.4,2.7,1.3,3.7c.9,1,2,1.4,3.3,1.4Z',
  'M389.7,138.7v-16.3h4v3.1l-.5-.5h.6c.3-.9.9-1.6,1.7-2.2.9-.6,1.8-.9,2.8-.9s.6,0,.9,0c.3,0,.7.2,1.2.3v4c-.7-.2-1.2-.4-1.6-.5-.4,0-.7-.1-1-.1-1.1,0-2.1.4-2.8,1.3-.7.8-1.1,1.9-1.1,3.1v8.6h-4.2Z',
  'M409.7,146.2c-1.1,0-2.1-.1-3.1-.4-.9-.3-1.7-.7-2.5-1.2-.7-.5-1.5-1.5-2.3-2.8l3.3-1.7c.6.9,1,1.5,1.4,1.8.4.3.9.6,1.4.7.5.2,1.1.2,1.6.2,1.5,0,2.6-.4,3.4-1.3.8-.8,1.2-2,1.2-3.5v-1.7h0c-.6.8-1.3,1.4-2.2,1.9-.9.4-1.9.7-3,.7-2.2,0-4-.8-5.4-2.3-1.4-1.5-2.1-3.6-2.1-6.2s.7-4.6,2.2-6.2c1.5-1.6,3.3-2.3,5.5-2.3s2.1.2,3,.7c.9.4,1.7,1.1,2.2,1.9h1l-1,1v-3h4v15.4c0,2.7-.8,4.7-2.3,6.1-1.5,1.4-3.6,2.1-6.3,2.1ZM409.8,135.4c1.3,0,2.3-.5,3.2-1.4.8-.9,1.2-2.1,1.2-3.7s-.4-2.7-1.2-3.6c-.8-.9-1.9-1.4-3.2-1.4s-2.3.5-3.2,1.3c-.8.9-1.3,2.1-1.3,3.6s.4,2.8,1.3,3.7c.8.9,1.9,1.3,3.2,1.3Z'
];

// Original BetterRosales Civic Geometric Mark (centered at cx=82, cy=75.85)
// Minimalist rising sun + 5 geometric rays over two sweeping valley/river ribbons
const CX = 82;
const SUN_CY = 74;
const SUN_R = 23;

function buildSunRays(cx, cy, innerR, outerR) {
  const angles = [-150, -120, -90, -60, -30];
  const halfWidthDeg = 6.5;
  return angles.map(deg => {
    const a1 = ((deg - halfWidthDeg) * Math.PI) / 180;
    const a2 = ((deg + halfWidthDeg) * Math.PI) / 180;
    const aMid = (deg * Math.PI) / 180;
    const x1 = (cx + innerR * Math.cos(a1)).toFixed(1);
    const y1 = (cy + innerR * Math.sin(a1)).toFixed(1);
    const x2 = (cx + outerR * Math.cos(aMid)).toFixed(1);
    const y2 = (cy + outerR * Math.sin(aMid)).toFixed(1);
    const x3 = (cx + innerR * Math.cos(a2)).toFixed(1);
    const y3 = (cy + innerR * Math.sin(a2)).toFixed(1);
    return `M${x1},${y1} L${x2},${y2} L${x3},${y3} Z`;
  });
}

const sunRays = buildSunRays(CX, SUN_CY, 30, 56);
// Rising sun dome (semi-circle above the upper wave)
const sunDome = `M${CX - SUN_R},${SUN_CY} A${SUN_R},${SUN_R} 0 0,1 ${CX + SUN_R},${SUN_CY} C${CX + 12},${SUN_CY - 4} ${CX - 12},${SUN_CY - 4} ${CX - SUN_R},${SUN_CY} Z`;

// Sweeping geometric valley / river ribbons (distinct from any municipal seal)
const upperRibbon = 'M16,89 C36,70 64,70 86,81 C106,91 128,89 148,76 C140,95 118,107 92,102 C68,97 44,86 16,89 Z';
const lowerRibbon = 'M22,108 C46,96 72,104 94,112 C114,119 132,113 144,100 C134,126 110,140 82,140 C54,140 32,127 22,108 Z';

function buildSvg(isWhite) {
  if (isWhite) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 421.6 151.7">
  <!-- BetterRosales.org Vector Logo (White Variant) -->
  <g fill="#fff">
    <g>
      ${betterPaths.map(d => `<path d="${d}"/>`).join('\n      ')}
      ${rosalesPaths.map(d => `<path d="${d}"/>`).join('\n      ')}
    </g>
    <g>
      ${orgPaths.map(d => `<path d="${d}"/>`).join('\n      ')}
    </g>
  </g>
  <g id="better-rosales-emblem-white" fill="#fff">
    ${sunRays.map(d => `<path fill-opacity="0.9" d="${d}"/>`).join('\n    ')}
    <path fill-opacity="0.9" d="${sunDome}"/>
    <path d="${upperRibbon}"/>
    <path fill-opacity="0.82" d="${lowerRibbon}"/>
  </g>
</svg>
`;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 421.6 151.7">
  <!-- BetterRosales.org Vector Logo (Standard Variant) -->
  <g fill="#000">
    <g>
      ${betterPaths.map(d => `<path d="${d}"/>`).join('\n      ')}
      ${rosalesPaths.map(d => `<path d="${d}"/>`).join('\n      ')}
    </g>
    <g>
      ${orgPaths.map(d => `<path d="${d}"/>`).join('\n      ')}
    </g>
  </g>
  <g id="better-rosales-emblem">
    <g fill="#f2c91d">
      ${sunRays.map(d => `<path d="${d}"/>`).join('\n      ')}
      <path d="${sunDome}"/>
    </g>
    <path fill="#0032a0" d="${upperRibbon}"/>
    <path fill="#0032a0" fill-opacity="0.88" d="${lowerRibbon}"/>
  </g>
</svg>
`;
}

const colorSvg = buildSvg(false);
const whiteSvg = buildSvg(true);

const targetFiles = [
  // Primary web assets
  'assets/images/logo/better-solano-logo.svg',
  'assets/images/logo/better-solano-logo-white.svg',
  'assets/images/logo/better-rosales-logo.svg',
  'assets/images/logo/better-rosales-logo-white.svg',
  // React app assets
  'react-app/public/assets/images/logo/better-solano-logo.svg',
  'react-app/public/assets/images/logo/better-solano-logo-white.svg',
  'react-app/public/assets/images/logo/better-rosales-logo.svg',
  'react-app/public/assets/images/logo/better-rosales-logo-white.svg'
];

targetFiles.forEach(file => {
  const fullPath = path.resolve(__dirname, '..', file);
  if (fs.existsSync(path.dirname(fullPath))) {
    const content = file.includes('-white') ? whiteSvg : colorSvg;
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Updated:', file);
  }
});

console.log('Logo generation complete!');
