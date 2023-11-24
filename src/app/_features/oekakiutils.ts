import { COLOR_PALETTE } from '@/app/_consts/oekaki';
import { deflate, inflate } from 'pako';

/**
 * rgb値をグレースケールに変換する
 * @param r
 * @param g
 * @param b
 */
const toGrayScale = (r: number, g: number, b: number): number => {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/**
 * 色のズレを補正し、バイナリ値に変換する
 * @param _r
 * @param _g
 * @param _b
 */
const getColorCode = (_r: number, _g: number, _b: number, _a: number): number => {
  if (_a !== 255) {
    return 0x00;
  }

  const r = 255 - _r > 80 ? 0 : 255;
  const g = 255 - _g > 80 ? 0 : 255;
  const b = 255 - _b > 80 ? 0 : 255;
  return COLOR_PALETTE[`${r},${g},${b}`] ?? 0xff;
};

/**
 * 画像を右に90度回転させる
 * @param data
 */
const rotateImageRight = (data: Uint8Array): Uint8Array => {
  const newData = new Uint8Array(data.length);

  for (let y = 0; y < 512; y++) {
    for (let x = 0; x < 512; x++) {
      // 元のピクセル座標
      const originalIndex = (y * 512 + x) * 4;

      // 回転後のピクセル座標
      const rotatedX = 512 - y - 1;
      const rotatedY = x;
      const newIndex = (rotatedY * 512 + rotatedX) * 4;

      // ピクセルのコピー
      newData[newIndex] = data[originalIndex];
      newData[newIndex + 1] = data[originalIndex + 1];
      newData[newIndex + 2] = data[originalIndex + 2];
      newData[newIndex + 3] = data[originalIndex + 3];
    }
  }

  return newData;
};

/**
 * 圧縮に最適な画像の向きを判別する
 * @param base
 * @param rotated
 * @return そのまま：0xfe, 右に90度回転：0xff
 */
const detectOptimizedOrientation = (base: Uint8Array, rotated: Uint8Array): number => {
  const calculateDifferentialValue = (data: Uint8Array) => {
    const THRESHOLD = 128;
    let differentialValue = 0;
    let previousValue = -1;

    for (let i = 0; i < data.length; i += 4) {
      let y = toGrayScale(data[i], data[i + 1], data[i + 2]) > THRESHOLD ? 255 : 0;
      if (previousValue !== y) {
        differentialValue++;
      }
      previousValue = y;
    }

    return differentialValue;
  };

  const baseValue = calculateDifferentialValue(base);
  const rotatedValue = calculateDifferentialValue(rotated);
  return baseValue < rotatedValue ? 0xfe : 0xff;
};

/**
 * 画像を圧縮してエンコードする
 * @param _data
 */
export const encodeImage = (_data: Uint8Array): Uint8Array => {
  const rotatedRightImage = rotateImageRight(_data);
  const orientation = detectOptimizedOrientation(_data, rotatedRightImage);
  let data = orientation === 0xfe ? _data : rotatedRightImage;

  const result: number[] = [orientation];

  let parsed: [number, number][] = [];
  let previousColor = getColorCode(data[0], data[1], data[2], data[3]);
  let continuousCount = 1;

  /**
   * 結果となるバイト配列にパースした画像データを書き込む
   */
  const writeBuffer = () => {
    const colorBits = parsed
      .map(([colorCode, _]) => Array.from(colorCode.toString(2).padStart(3, '0')))
      .flat(1);
    const mergedHexes = [
      parseInt(colorBits.slice(0, 8).join(''), 2),
      parseInt(colorBits.slice(8, 16).join(''), 2),
      parseInt(colorBits.slice(16, 24).join(''), 2),
    ];
    const lengths = parsed
      .map(([colorCode, length]) => {
        if (colorCode === 0x00) {
          const view = new DataView(new ArrayBuffer(4));
          view.setUint32(0, length, false);
          return Array.from(new Uint8Array(view.buffer).slice(1));
        } else {
          const view = new DataView(new ArrayBuffer(1));
          view.setUint8(0, length);
          return Array.from(new Uint8Array(view.buffer));
        }
      })
      .flat(1);

    result.push(...[...mergedHexes, ...lengths]);
    parsed = [];
  };

  for (let i = 4; i < data.length; i += 4) {
    const colorCode = getColorCode(data[i], data[i + 1], data[i + 2], data[i + 3]);
    if (previousColor !== colorCode || (colorCode !== 0x00 && continuousCount === 0xff)) {
      parsed.push([previousColor, continuousCount]);

      if (parsed.length === 8) {
        writeBuffer();
      }

      previousColor = colorCode;
      continuousCount = 1;
    } else {
      continuousCount++;
    }
  }
  parsed.push([previousColor, continuousCount]);

  const length = parsed.length;
  for (let i = 0; i < 8 - length; i++) {
    parsed.push([0x00, 0]);
  }

  writeBuffer();

  return deflate(new Uint8Array(result));
};

/**
 * 圧縮された画像をデコードする
 * @param gc
 * @param array
 */
export const decodeImage = (gc: CanvasRenderingContext2D, array: Uint8Array): ImageData => {
  const inflated = inflate(array);
  const data = Array.from(inflated.slice(1));
  const imageData = gc.createImageData(gc.getImageData(0, 0, 512, 512));
  const img = imageData.data;

  const colorCodeMap: number[][] = new Array(Object.keys(COLOR_PALETTE).length).fill([]);
  Object.entries(COLOR_PALETTE)
    .forEach(([key, value]) => colorCodeMap[value] = key.split(',')
      .map((c) => parseInt(c)));

  let index = 0;
  for (let i = 0; i < data.length;) {
    const bits = data.slice(i, i + 3)
      .map((code) => Array.from(code.toString(2).padStart(8, '0')))
      .flat(1);
    i += 3;

    const colorCodes: number[] = [];
    for (let j = 0; j < bits.length; j += 3) {
      colorCodes.push(parseInt(bits.slice(j, j + 3).join(''), 2));
    }

    for (let j = 0; j < colorCodes.length; j++) {
      const colorCode = colorCodeMap[colorCodes[j]];
      const length = colorCodes[j] === 0x00
        ? new DataView(new Uint8Array([0, ...data.slice(i, i + 3)]).buffer).getUint32(0)
        : new DataView(new Uint8Array([data[i]]).buffer).getUint8(0);

      for (let k = 0; k < length; k++) {
        img[index] = colorCode[0];
        img[index + 1] = colorCode[1];
        img[index + 2] = colorCode[2];
        img[index + 3] = 255;
        index += 4;
      }

      colorCodes[j] === 0x00 ? i += 3 : i += 1;
    }
  }

  if (inflated[0] === 0xff) {
    // should be refactored
    const rotated = rotateImageRight(rotateImageRight(rotateImageRight(new Uint8Array(img))));
    for (let i = 0; i < rotated.length; i += 4) {
      img[i] = rotated[i];
      img[i + 1] = rotated[i + 1];
      img[i + 2] = rotated[i + 2];
      img[i + 3] = rotated[i + 3];
    }
  }

  return imageData;
};