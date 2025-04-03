// src/image/config/image-config.ts
export const IMAGE_CONFIG = {
  WIDTH: 1080,  // Instagram square post size
  HEIGHT: 1080,
  MARGINS: {
    HORIZONTAL: 100,
    VERTICAL: 100
  },
  TEXT: {
    TITLE: {
      DEFAULT_FONT_SIZE: 72,
      DEFAULT_FAMILY: 'Arial',
      DEFAULT_COLOR: '#000000',
      DEFAULT_WEIGHT: 'bold'
    },
    QUOTE: {
      DEFAULT_FONT_SIZE: 54,
      DEFAULT_FAMILY: 'Arial',
      DEFAULT_COLOR: '#000000',
      DEFAULT_WEIGHT: 'normal'
    },
    AUTHOR: {
      DEFAULT_FONT_SIZE: 36,
      DEFAULT_FAMILY: 'Arial',
      DEFAULT_COLOR: '#555555',
      DEFAULT_WEIGHT: 'italic'
    }
  },
  SPACING: {
    TITLE_TO_QUOTE: 70,
    QUOTE_LINE_HEIGHT: 60,
    QUOTE_TO_AUTHOR: 50,
    ADDITIONAL: 100
  }
};