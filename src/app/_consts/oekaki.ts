export const DRAWING_TIME_LIMIT = 2000;
export const DRAWING_COUNT_LIMIT = 5;
export const COLOR_PALETTE: { [colorHex: string]: number } = {
  '255,255,255': 0x00,  // 白
  '0,0,0': 0x01,  // 黒
  '255,0,0': 0x02,  // 赤
  '0,255,0': 0x03,  // 緑
  '0,0,255': 0x04,  // 青
  '255,255,0': 0x05,  // 黄
  '255,110,0': 0x06,  // オレンジ
  '255,0,255': 0x07,  // 紫
};

export const IMAGE_SIZE = 300;

export const IMAGE_MAX_DRAW_COUNT = 10;