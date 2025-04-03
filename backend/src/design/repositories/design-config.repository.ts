// src/design/repositories/design-config.repository.ts
import { Injectable, Inject } from '@nestjs/common';
import { DesignConfig, DESIGN_CONFIGS_PROVIDER } from '../config/design-configs.provider';

@Injectable()
export class DesignConfigRepository {
  constructor(
    @Inject(DESIGN_CONFIGS_PROVIDER)
    private readonly designConfigs: {
      weeklyDesigns: Record<string, DesignConfig>;
      randomOptions: {
        backgroundColors: string[];
        fontFamilies: string[];
        textColors: string[];
      };
    }
  ) {}

  findRandomDesign(): DesignConfig {
    const { randomOptions } = this.designConfigs;
    
    return {
      designId: `random-design-${Math.floor(Math.random() * 1000)}`,
      mode: 'random',
      background: {
        color: this.getRandomItem(randomOptions.backgroundColors),
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
          fontFamily: this.getRandomItem(randomOptions.fontFamilies),
          fontSize: 28,
          color: this.getRandomItem(randomOptions.textColors),
          weight: 'bold',
          alignment: 'center'
        },
        quote: {
          fontFamily: this.getRandomItem(randomOptions.fontFamilies),
          fontSize: 22,
          color: this.getRandomItem(randomOptions.textColors),
          weight: 'normal',
          alignment: 'center'
        },
        author: {
          fontFamily: this.getRandomItem(randomOptions.fontFamilies),
          fontSize: 16,
          color: this.getRandomItem(randomOptions.textColors),
          weight: 'light',
          alignment: 'center'
        }
      }
    };
  }

  findFixedDesignByDay(day: string): DesignConfig {
    const normalizedDay = day.toLowerCase();
    
    // If specific day design exists, return it
    if (this.designConfigs.weeklyDesigns[normalizedDay]) {
      return this.designConfigs.weeklyDesigns[normalizedDay];
    }
    
    // If no specific day design, return random design
    return this.findRandomDesign();
  }

  findAllDesigns(): DesignConfig[] {
    return [
      ...Object.values(this.designConfigs.weeklyDesigns),
      this.findRandomDesign()
    ];
  }

  private getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }
}