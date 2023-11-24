export const DRAWING_TIME_LIMIT = 2000;
export const DRAWING_COUNT_LIMIT = 5;
export const COLOR_PALETTE: { [colorHex: string]: number } = {
  '255,255,255': 0x00,  // 白
  '0,0,0': 0x01,  // 黒
  '255,0,0': 0x02,  // 赤
  '0,255,0': 0x03,  // 緑
  '0,0,255': 0x04,  // 青
  '255,255,0': 0x05,  // 黄
  '0,255,255': 0x06,  // シアン
  '255,0,255': 0x07,  // 紫
};