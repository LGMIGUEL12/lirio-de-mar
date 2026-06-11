const flower = document.getElementById('flower');

// CORRECTO: base de cada pétalo en el centro (origin).
// rotateY(angle) + rotateX(spread) abre pétalo hacia afuera Y arriba.
// spread grande (62°) = pétalo casi horizontal (externo).
// spread pequeño (18°) = pétalo casi vertical (bud interior).
// Alturas calculadas para extensión radial deseada: H = targetRadius / sin(spread)
const RINGS = [
  // Anillo exterior — casi plano, abre amplio
  {
    count: 10, width: 168, height: 250,
    tiltX: 62, angleOffset: 0,
    highlight: '#ee3377', mid: '#aa0055', base: '#550033',
  },
  {
    count: 9, width: 152, height: 228,
    tiltX: 57, angleOffset: 18,
    highlight: '#ff4488', mid: '#cc1166', base: '#770044',
  },
  {
    count: 8, width: 136, height: 210,
    tiltX: 51, angleOffset: 0,
    highlight: '#ff6699', mid: '#dd2277', base: '#991155',
  },
  {
    count: 8, width: 118, height: 196,
    tiltX: 44, angleOffset: 22.5,
    highlight: '#ff88aa', mid: '#ee3388', base: '#bb2266',
  },
  {
    count: 7, width: 98, height: 184,
    tiltX: 37, angleOffset: 0,
    highlight: '#ffaacc', mid: '#ff5599', base: '#dd1166',
  },
  {
    count: 7, width: 78, height: 175,
    tiltX: 29, angleOffset: 13,
    highlight: '#ffccee', mid: '#ff88bb', base: '#ee4499',
  },
  // Bud interior — casi vertical, muy claro
  {
    count: 6, width: 56, height: 188,
    tiltX: 18, angleOffset: 0,
    highlight: '#fff5f8', mid: '#ffddee', base: '#ffaacc',
  },
];

function rand(range) {
  return (Math.random() - 0.5) * range;
}

RINGS.forEach((ring, ringIdx) => {
  for (let i = 0; i < ring.count; i++) {
    const angle = (360 / ring.count) * i + ring.angleOffset;
    const w     = ring.width  + rand(8);
    const h     = ring.height + rand(10);

    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.style.width      = `${w}px`;
    petal.style.height     = `${h}px`;
    petal.style.top        = `${-h}px`;
    petal.style.left       = `${-w / 2}px`;
    petal.style.background = `
      radial-gradient(
        ellipse 65% 58% at 50% 40%,
        ${ring.highlight} 0%,
        ${ring.mid}       48%,
        ${ring.base}      100%
      )
    `;
    // Base en origen, tip se abre radialmente hacia afuera y arriba
    petal.style.transform = `
      rotateY(${angle}deg)
      rotateX(${ring.tiltX}deg)
      translateZ(${ringIdx * 0.8}px)
    `;

    flower.appendChild(petal);
  }
});

// Centro
const center = document.createElement('div');
center.id = 'center';
center.style.cssText = `
  position: absolute;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  top: -18px;
  left: -18px;
  background: radial-gradient(circle at 38% 34%, #ffffff 0%, #ffeeF5 55%, #ffbbdd 100%);
  box-shadow: 0 0 22px rgba(255,220,240,1), 0 0 55px rgba(255,120,200,0.55);
`;
flower.appendChild(center);
