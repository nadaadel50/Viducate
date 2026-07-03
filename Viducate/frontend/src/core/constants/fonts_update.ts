export const FONT_SIZE = {
  size9: "text-[9px]",
  size10: "text-[10px]",
  size11: "text-[11px]",
  size12: "text-xs", // 12px
  size13: "text-[13px]",
  size14: "text-sm", // 14px
  size15: "text-[15px]",
  size16: "text-base", // 16px
  size17: "text-[17px]",
  size18: "text-lg", // 18px
  size20: "text-xl", // 20px
  size22: "text-[22px]",
  size24: "text-2xl", // 24px
  size26: "text-[26px]",
  size28: "text-[28px]",
  size30: "text-3xl", // 30px
  size32: "text-[32px]",
  size36: "text-4xl", // 36px
  size40: "text-[40px]",
  size48: "text-5xl", // 48px
  size56: "text-[56px]",
  size64: "text-[64px]",
} as const;

export const FONT_WEIGHT = {
  thin: "font-thin",
  extraLight: "font-extralight",
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extraBold: "font-extrabold",
  black: "font-black",
} as const;

export const LINE_HEIGHT = {
  none: "leading-none",
  tight: "leading-tight",
  snug: "leading-snug",
  normal: "leading-normal",
  relaxed: "leading-relaxed",
  loose: "leading-loose",
} as const;

export const LETTER_SPACING = {
  tighter: "tracking-tighter",
  tight: "tracking-tight",
  normal: "tracking-normal",
  wide: "tracking-wide",
  wider: "tracking-wider",
  widest: "tracking-widest",
} as const;

export const TEXT_UTILS = {
  uppercase: "uppercase",
  lowercase: "lowercase",
  capitalize: "capitalize",

  truncate: "truncate",
  breakWords: "break-words",
  preWrap: "whitespace-pre-wrap",
} as const;
