// src/design/config/design-configs.provider.ts
import { Provider } from '@nestjs/common';

export interface DesignConfig {
  designId: string;
  mode: 'fixed' | 'random';
  background: {
    color: string;
    type: 'solid' | 'gradient';
  };
  layout: {
    type: 'centered' | 'left-aligned' | 'right-aligned';
    margins: {
      top: number;
      bottom: number;
      left: number;
      right: number;
    };
  };
  typography: {
    title: {
      fontFamily: string;
      fontSize: number;
      color: string;
      weight: string;
      alignment: 'center';
    };
    quote: {
      fontFamily: string;
      fontSize: number;
      color: string;
      weight: string;
      alignment: 'center';
    };
    author: {
      fontFamily: string;
      fontSize: number;
      color: string;
      weight: string;
      alignment: 'center';
    };
  };
}

const WEEKLY_DESIGNS: Record<string, DesignConfig> = {
  'monday': {
    designId: 'fixed-monday-design',
    mode: 'fixed',
    background: {
      color: '#E8F4F8',
      type: 'solid'
    },
    layout: {
      type: 'centered',
      margins: {
        top: 60,
        bottom: 60,
        left: 60,
        right: 60
      }
    },
    typography: {
      title: {
        fontFamily: 'Montserrat',
        fontSize: 28,
        color: '#000000',
        weight: 'bold',
        alignment: 'center'
      },
      quote: {
        fontFamily: 'Georgia',
        fontSize: 22,
        color: '#2C3E50',
        weight: 'normal',
        alignment: 'center'
      },
      author: {
        fontFamily: 'Courier New',
        fontSize: 16,
        color: '#34495E',
        weight: 'light',
        alignment: 'center'
      }
    }
  },
  'tuesday': {
    designId: 'fixed-tuesday-design',
    mode: 'fixed',
    background: {
      color: '#F0E6FF',
      type: 'solid'
    },
    layout: {
      type: 'centered',
      margins: {
        top: 60,
        bottom: 60,
        left: 60,
        right: 60
      }
    },
    typography: {
      title: {
        fontFamily: 'Playfair Display',
        fontSize: 28,
        color: '#2C3E50',
        weight: 'bold',
        alignment: 'center'
      },
      quote: {
        fontFamily: 'Palatino Linotype',
        fontSize: 22,
        color: '#4A4A4A',
        weight: 'normal',
        alignment: 'center'
      },
      author: {
        fontFamily: 'Lato',
        fontSize: 16,
        color: '#3D3D3D',
        weight: 'light',
        alignment: 'center'
      }
    }
  },
  'wednesday': {
    designId: 'fixed-wednesday-design',
    mode: 'fixed',
    background: {
      color: '#E6F2E6',
      type: 'solid'
    },
    layout: {
      type: 'centered',
      margins: {
        top: 60,
        bottom: 60,
        left: 60,
        right: 60
      }
    },
    typography: {
      title: {
        fontFamily: 'Merriweather',
        fontSize: 28,
        color: '#1A1A1A',
        weight: 'bold',
        alignment: 'center'
      },
      quote: {
        fontFamily: 'Arial',
        fontSize: 22,
        color: '#2D3436',
        weight: 'normal',
        alignment: 'center'
      },
      author: {
        fontFamily: 'Open Sans',
        fontSize: 16,
        color: '#34495E',
        weight: 'light',
        alignment: 'center'
      }
    }
  },
  'thursday': {
    designId: 'fixed-thursday-design',
    mode: 'fixed',
    background: {
      color: '#FFF0E6',
      type: 'solid'
    },
    layout: {
      type: 'centered',
      margins: {
        top: 60,
        bottom: 60,
        left: 60,
        right: 60
      }
    },
    typography: {
      title: {
        fontFamily: 'Roboto Slab',
        fontSize: 28,
        color: '#2C3E50',
        weight: 'bold',
        alignment: 'center'
      },
      quote: {
        fontFamily: 'Verdana',
        fontSize: 22,
        color: '#4A4A4A',
        weight: 'normal',
        alignment: 'center'
      },
      author: {
        fontFamily: 'Source Sans Pro',
        fontSize: 16,
        color: '#3D3D3D',
        weight: 'light',
        alignment: 'center'
      }
    }
  },
  'friday': {
    designId: 'fixed-friday-design',
    mode: 'fixed',
    background: {
      color: '#F4E1D2',
      type: 'solid'
    },
    layout: {
      type: 'centered',
      margins: {
        top: 60,
        bottom: 60,
        left: 60,
        right: 60
      }
    },
    typography: {
      title: {
        fontFamily: 'Libre Baskerville',
        fontSize: 28,
        color: '#1A1A1A',
        weight: 'bold',
        alignment: 'center'
      },
      quote: {
        fontFamily: 'Georgia',
        fontSize: 22,
        color: '#2D3436',
        weight: 'normal',
        alignment: 'center'
      },
      author: {
        fontFamily: 'Nunito',
        fontSize: 16,
        color: '#34495E',
        weight: 'light',
        alignment: 'center'
      }
    }
  },
  'saturday': {
    designId: 'fixed-saturday-design',
    mode: 'fixed',
    background: {
      color: '#E8F4F8',
      type: 'solid'
    },
    layout: {
      type: 'centered',
      margins: {
        top: 60,
        bottom: 60,
        left: 60,
        right: 60
      }
    },
    typography: {
      title: {
        fontFamily: 'Raleway',
        fontSize: 28,
        color: '#2C3E50',
        weight: 'bold',
        alignment: 'center'
      },
      quote: {
        fontFamily: 'Verdana',
        fontSize: 22,
        color: '#4A4A4A',
        weight: 'normal',
        alignment: 'center'
      },
      author: {
        fontFamily: 'Trebuchet MS',
        fontSize: 16,
        color: '#3D3D3D',
        weight: 'light',
        alignment: 'center'
      }
    }
  },
  'sunday': {
    designId: 'fixed-sunday-design',
    mode: 'fixed',
    background: {
      color: '#F0E6FF',
      type: 'solid'
    },
    layout: {
      type: 'centered',
      margins: {
        top: 60,
        bottom: 60,
        left: 60,
        right: 60
      }
    },
    typography: {
      title: {
        fontFamily: 'Poppins',
        fontSize: 28,
        color: '#1A1A1A',
        weight: 'bold',
        alignment: 'center'
      },
      quote: {
        fontFamily: 'Palatino Linotype',
        fontSize: 22,
        color: '#2D3436',
        weight: 'normal',
        alignment: 'center'
      },
      author: {
        fontFamily: 'Georgia',
        fontSize: 16,
        color: '#34495E',
        weight: 'light',
        alignment: 'center'
      }
    }
  }
};

const RANDOM_DESIGN_OPTIONS = {
  backgroundColors: [
    '#F5F5F5', '#E8F4F8', '#F0E6FF', 
    '#E6F2E6', '#FFF0E6', '#F4E1D2'
  ],
  fontFamilies: [
    'Montserrat', 'Playfair Display', 'Lato', 'Merriweather',
    'Roboto Slab', 'Open Sans', 'Libre Baskerville', 'Raleway',
    'Poppins', 'Nunito', 'Source Sans Pro'
  ],
  textColors: [
    '#2C3E50', '#34495E', '#4A4A4A', 
    '#1A1A1A', '#3D3D3D', '#2D3436'
  ]
};

export const DESIGN_CONFIGS_PROVIDER = 'DESIGN_CONFIGS';

export const DesignConfigsProvider: Provider = {
  provide: DESIGN_CONFIGS_PROVIDER,
  useValue: {
    weeklyDesigns: WEEKLY_DESIGNS,
    randomOptions: RANDOM_DESIGN_OPTIONS
  }
};