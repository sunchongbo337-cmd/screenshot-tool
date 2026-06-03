export type TextFontEntry = {
  label: string;
  /** CSS font-family value (primary face name). */
  value: string;
  /** Pinyin / Latin initial for grouping (A–Z). */
  letter: string;
  /** Show in the pinned「常用」group at top. */
  common?: boolean;
};

/** WPS / Windows 免费常用字体（含 WPS 内置方正、汉仪及系统字体）。 */
const TEXT_FONT_ENTRIES: TextFontEntry[] = [
  // —— 常用 ——
  { label: '微软雅黑', value: 'Microsoft YaHei', letter: 'W', common: true },
  { label: '宋体', value: 'SimSun', letter: 'S', common: true },
  { label: '黑体', value: 'SimHei', letter: 'H', common: true },
  { label: '楷体', value: 'KaiTi', letter: 'K', common: true },
  { label: '仿宋', value: 'FangSong', letter: 'F', common: true },
  { label: '等线', value: 'DengXian', letter: 'D', common: true },
  { label: 'Arial', value: 'Arial', letter: 'A', common: true },
  { label: 'Times New Roman', value: 'Times New Roman', letter: 'T', common: true },

  // —— 方正（WPS 内置） ——
  { label: '方正仿宋_GBK', value: 'FZFangSong-Z02', letter: 'F' },
  { label: '方正黑体_GBK', value: 'FZHei-B01', letter: 'F' },
  { label: '方正楷体_GBK', value: 'FZKai-Z03', letter: 'F' },
  { label: '方正隶书_GBK', value: 'FZLiShu-S01', letter: 'F' },
  { label: '方正书宋_GBK', value: 'FZShuSong-Z01', letter: 'F' },
  { label: '方正魏碑_GBK', value: 'FZWeiBei-S03', letter: 'F' },
  { label: '方正细黑一_GBK', value: 'FZXiHeiI-Z08', letter: 'F' },
  { label: '方正小标宋_GBK', value: 'FZXiaoBiaoSong-B05', letter: 'F' },
  { label: '方正小标宋简体', value: 'FZXiaoBiaoSong-B05S', letter: 'F' },
  { label: '方正行楷_GBK', value: 'FZXingKai-S04', letter: 'F' },
  { label: '方正超粗黑_GBK', value: 'FZChaoCuHei-M10', letter: 'F' },
  { label: '方正姚体_GBK', value: 'FZYaoTi-M06', letter: 'F' },

  // —— 汉仪（WPS 内置） ——
  { label: '汉仪仿宋简', value: 'HYFangSongJ', letter: 'H' },
  { label: '汉仪行楷简', value: 'HYXingKaiJ', letter: 'H' },
  { label: '汉仪中宋简', value: 'HYZhongSongJ', letter: 'H' },
  { label: '汉仪中等线简', value: 'HYZhongDengXianJ', letter: 'H' },

  // —— 华文中文字体 ——
  { label: '华文仿宋', value: 'STFangsong', letter: 'H' },
  { label: '华文琥珀', value: 'STHupo', letter: 'H' },
  { label: '华文楷体', value: 'STKaiti', letter: 'H' },
  { label: '华文隶书', value: 'STLiti', letter: 'H' },
  { label: '华文宋体', value: 'STSong', letter: 'H' },
  { label: '华文细黑', value: 'STXihei', letter: 'H' },
  { label: '华文新魏', value: 'STXinwei', letter: 'H' },
  { label: '华文行楷', value: 'STXingkai', letter: 'H' },
  { label: '华文彩云', value: 'STCaiyun', letter: 'H' },

  // —— 其他中文 ——
  { label: '幼圆', value: 'YouYuan', letter: 'Y' },
  { label: '隶书', value: 'LiSu', letter: 'L' },
  { label: '新宋体', value: 'NSimSun', letter: 'X' },
  { label: '微软正黑体', value: 'Microsoft JhengHei', letter: 'W' },
  { label: '苹方', value: 'PingFang SC', letter: 'P' },
  { label: '思源黑体', value: 'Source Han Sans SC', letter: 'S' },
  { label: '思源宋体', value: 'Source Han Serif SC', letter: 'S' },
  { label: 'HarmonyOS Sans', value: 'HarmonyOS Sans SC', letter: 'H' },

  // —— 西文（按首字母） ——
  { label: 'Arial Black', value: 'Arial Black', letter: 'A' },
  { label: 'Calibri', value: 'Calibri', letter: 'C' },
  { label: 'Cambria', value: 'Cambria', letter: 'C' },
  { label: 'Candara', value: 'Candara', letter: 'C' },
  { label: 'Comic Sans MS', value: 'Comic Sans MS', letter: 'C' },
  { label: 'Consolas', value: 'Consolas', letter: 'C' },
  { label: 'Courier New', value: 'Courier New', letter: 'C' },
  { label: 'Georgia', value: 'Georgia', letter: 'G' },
  { label: 'Impact', value: 'Impact', letter: 'I' },
  { label: 'Lucida Console', value: 'Lucida Console', letter: 'L' },
  { label: 'Lucida Sans Unicode', value: 'Lucida Sans Unicode', letter: 'L' },
  { label: 'Microsoft Sans Serif', value: 'Microsoft Sans Serif', letter: 'M' },
  { label: 'Palatino Linotype', value: 'Palatino Linotype', letter: 'P' },
  { label: 'Segoe UI', value: 'Segoe UI', letter: 'S' },
  { label: 'Tahoma', value: 'Tahoma', letter: 'T' },
  { label: 'Trebuchet MS', value: 'Trebuchet MS', letter: 'T' },
  { label: 'Verdana', value: 'Verdana', letter: 'V' },
  { label: 'DejaVu Sans', value: 'DejaVu Sans', letter: 'D' },
  { label: 'DejaVu Serif', value: 'DejaVu Serif', letter: 'D' }
];

export type TextFontSelectGroup = { letter: string; fonts: TextFontEntry[] };

export function getTextFontCommon(): TextFontEntry[] {
  return TEXT_FONT_ENTRIES.filter((f) => f.common);
}

export function getTextFontSelectGroups(): { common: TextFontEntry[]; groups: TextFontSelectGroup[] } {
  const common = getTextFontCommon();
  const commonValues = new Set(common.map((f) => f.value));
  const rest = TEXT_FONT_ENTRIES.filter((f) => !commonValues.has(f.value));
  rest.sort((a, b) => a.letter.localeCompare(b.letter, 'en') || a.label.localeCompare(b.label, 'zh-CN'));
  const byLetter = new Map<string, TextFontEntry[]>();
  for (const f of rest) {
    const list = byLetter.get(f.letter) ?? [];
    list.push(f);
    byLetter.set(f.letter, list);
  }
  const groups = [...byLetter.entries()]
    .sort(([a], [b]) => a.localeCompare(b, 'en'))
    .map(([letter, fonts]) => ({ letter, fonts }));
  return { common, groups };
}

/** Flat list: common first, then others A–Z. */
export function getTextFontsFlat(): TextFontEntry[] {
  const { common, groups } = getTextFontSelectGroups();
  return [...common, ...groups.flatMap((g) => g.fonts)];
}
