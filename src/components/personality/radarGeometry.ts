// คณิตของกราฟ radar 5 แฉก ใช้ร่วมกันทั้งเวอร์ชัน 3D และ 2D

/** ขนาดแฉกปกติ (ไม่มีตัวเลข stat จึงเท่ากันทุกแฉก) และตอนชี้ */
export const RADAR_REST = 0.8;
export const RADAR_HOVER = 1;
/** วงตาราง (สัดส่วนของรัศมี) */
export const RADAR_RINGS = [1 / 3, 2 / 3, 1];

/** ทิศของแฉกที่ i: เริ่มชี้ขึ้นบน แล้ววนตามเข็มนาฬิกา (คืนค่า x ขวา, y ขึ้น) */
export const radarAxis = (i: number, count: number): [number, number] => {
  const angle = Math.PI / 2 - (i * 2 * Math.PI) / count;
  return [Math.cos(angle), Math.sin(angle)];
};

/** จุดยอดของรูปหลายเหลี่ยม: scales[i] คือความยาวแฉก i (สัดส่วนของ radius) */
export const radarPoints = (scales: number[], radius: number): [number, number][] =>
  scales.map((s, i) => {
    const [x, y] = radarAxis(i, scales.length);
    return [x * s * radius, y * s * radius];
  });
