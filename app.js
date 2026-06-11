const flower      = document.getElementById('flower');
const lilySpinner = document.getElementById('lily-spinner');

// SVG path: ellipse with V-notch at top
function lilyPadPath(w, h) {
  const cx = w / 2, cy = h / 2;
  const rx = w * 0.492, ry = h * 0.488;
  const a  = 6 * Math.PI / 180;
  const nx1 = cx + rx * Math.cos(-Math.PI / 2 + a);
  const ny1 = cy + ry * Math.sin(-Math.PI / 2 + a);
  const nx2 = cx + rx * Math.cos(-Math.PI / 2 - a);
  const ny2 = ny1;
  const f   = n => n.toFixed(1);
  const mMY = ny1 + ry * 0.36;
  const mTY = ny1 + ry * 0.55;
  const mL  = cx - (nx1 - cx) * 0.20;
  const mR  = cx + (nx1 - cx) * 0.20;
  return `M ${f(nx1)},${f(ny1)} A ${f(rx)},${f(ry)} 0 1,1 ${f(nx2)},${f(ny2)} L ${f(mL)},${f(mMY)} ${f(cx)},${f(mTY)} ${f(mR)},${f(mMY)} Z`;
}

function makeLilyPad(w, h, leftOff, yOff, yRotDeg, opacity) {
  const el = document.createElement('div');
  el.style.cssText = `
    position: absolute;
    width: ${w}px;
    height: ${h}px;
    top: ${-h / 2}px;
    left: ${-w / 2 + leftOff}px;
    transform-origin: center center;
    clip-path: path('${lilyPadPath(w, h)}');
    background:
      radial-gradient(ellipse 72% 68% at 50% 50%, transparent 52%, rgba(0, 42, 0, 0.52) 100%),
      radial-gradient(ellipse 70% 66% at 48% 46%, #aaff88 0%, #55bb33 26%, #2a8818 56%, #0e4508 100%);
    transform: translateY(${yOff}px) rotateY(${yRotDeg}deg) rotateX(82deg) translateZ(-4px);
    opacity: ${opacity};
  `;
  return el;
}

lilySpinner.appendChild(makeLilyPad(400, 610, 0, 5, 0, 0.93));

// === PETAL RINGS ===
const RINGS = [
  {
    count: 10, width: 168, height: 250,
    tiltX: 62, angleOffset: 0,
    highlight: '#ee3377', mid: '#aa0055', base: '#550033',
  },
  {
    count: 9,  width: 152, height: 228,
    tiltX: 57, angleOffset: 18,
    highlight: '#ff4488', mid: '#cc1166', base: '#770044',
  },
  {
    count: 8,  width: 136, height: 210,
    tiltX: 51, angleOffset: 0,
    highlight: '#ff6699', mid: '#dd2277', base: '#991155',
  },
  {
    count: 8,  width: 118, height: 196,
    tiltX: 44, angleOffset: 22.5,
    highlight: '#ff88aa', mid: '#ee3388', base: '#bb2266',
  },
  {
    count: 7,  width: 98,  height: 184,
    tiltX: 37, angleOffset: 0,
    highlight: '#ffaacc', mid: '#ff5599', base: '#dd1166',
  },
  {
    count: 7,  width: 78,  height: 175,
    tiltX: 29, angleOffset: 13,
    highlight: '#ffccee', mid: '#ff88bb', base: '#ee4499',
  },
  {
    count: 6,  width: 56,  height: 188,
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
    petal.style.transform = `
      rotateY(${angle}deg)
      rotateX(${ring.tiltX}deg)
      translateZ(${ringIdx * 0.8}px)
    `;
    flower.appendChild(petal);
  }
});

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

// === ORBIT DRAG CONTROL ===
let dragging = false;
let lastX = 0, lastY = 0;
let rotX = -25, rotY = 0;
const tilts = Array.from(document.querySelectorAll('.scene-tilt'));

function getScale() {
  return Math.min(1, Math.min(window.innerWidth / 600, window.innerHeight / 550));
}

function applyTilt() {
  const s = getScale();
  tilts.forEach(el => {
    el.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${s})`;
  });
}

applyTilt();
window.addEventListener('resize', applyTilt);

document.addEventListener('mousedown', e => {
  dragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
  document.body.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', e => {
  if (!dragging) return;
  rotY += (e.clientX - lastX) * 0.35;
  rotX -= (e.clientY - lastY) * 0.35;
  rotX = Math.max(-88, Math.min(5, rotX));
  lastX = e.clientX;
  lastY = e.clientY;
  applyTilt();
});

document.addEventListener('mouseup', () => {
  dragging = false;
  document.body.style.cursor = 'grab';
});

document.addEventListener('mouseleave', () => { dragging = false; });

document.addEventListener('touchstart', e => {
  dragging = true;
  lastX = e.touches[0].clientX;
  lastY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchmove', e => {
  if (!dragging) return;
  rotY += (e.touches[0].clientX - lastX) * 0.35;
  rotX -= (e.touches[0].clientY - lastY) * 0.35;
  rotX = Math.max(-88, Math.min(5, rotX));
  lastX = e.touches[0].clientX;
  lastY = e.touches[0].clientY;
  applyTilt();
}, { passive: true });

document.addEventListener('touchend', () => { dragging = false; });
