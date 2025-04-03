import * as fs from 'fs';
import * as path from 'path';
import { registerFont } from 'canvas';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

@Injectable()
export class FontLoader implements OnModuleInit {
  private readonly logger = new Logger(FontLoader.name);
  
  onModuleInit() {
    this.loadFonts();
  }
  
  loadFonts() {
    try {
      const fontDir = path.join(process.cwd(), 'src/assets/fonts');
      
      // Check if directory exists
      if (!fs.existsSync(fontDir)) {
        this.logger.warn(`Font directory not found: ${fontDir}`);
        fs.mkdirSync(fontDir, { recursive: true });
        this.logger.log(`Created font directory: ${fontDir}`);
        return;
      }
      
      // Register standard fonts that are likely to be available
      this.registerStandardFonts();
      
      // Register custom fonts from directory
      const fontFiles = fs.readdirSync(fontDir)
        .filter(file => file.endsWith('.ttf') || file.endsWith('.otf'));
      
      if (fontFiles.length === 0) {
        this.logger.warn('No font files found in directory. Using system fonts.');
        return;
      }
      
      fontFiles.forEach(file => {
        const fontPath = path.join(fontDir, file);
        const fontFamily = path.basename(file, path.extname(file));
        
        registerFont(fontPath, { family: fontFamily });
        this.logger.log(`Registered font: ${fontFamily}`);
      });
      
      this.logger.log(`Successfully loaded ${fontFiles.length} fonts`);
    } catch (error) {
      this.logger.error(`Failed to load fonts: ${error.message}`);
    }
  }
  
  private registerStandardFonts() {
    // List of modern web fonts to use
    const fontMappings = [
      { family: 'Arial', weight: 'normal' },
      { family: 'Arial', weight: 'bold' },
      { family: 'Georgia', weight: 'normal' },
      { family: 'Georgia', weight: 'bold' },
      { family: 'Verdana', weight: 'normal' },
      { family: 'Verdana', weight: 'bold' },
      { family: 'Trebuchet MS', weight: 'normal' },
      { family: 'Trebuchet MS', weight: 'bold' },
      { family: 'Courier New', weight: 'normal' },
      { family: 'Courier New', weight: 'bold' },
      { family: 'Palatino Linotype', weight: 'normal' },
      { family: 'Palatino Linotype', weight: 'bold' },
      
      // System font fallbacks for the modern fonts
      { family: 'Montserrat', fallback: 'Arial', weight: 'normal' },
      { family: 'Montserrat', fallback: 'Arial', weight: 'bold' },
      { family: 'Playfair Display', fallback: 'Georgia', weight: 'normal' },
      { family: 'Playfair Display', fallback: 'Georgia', weight: 'bold' },
      { family: 'Lato', fallback: 'Arial', weight: 'normal' },
      { family: 'Lato', fallback: 'Arial', weight: 'bold' },
      { family: 'Merriweather', fallback: 'Georgia', weight: 'normal' },
      { family: 'Merriweather', fallback: 'Georgia', weight: 'bold' },
      { family: 'Roboto Slab', fallback: 'Georgia', weight: 'normal' },
      { family: 'Roboto Slab', fallback: 'Georgia', weight: 'bold' },
      { family: 'Open Sans', fallback: 'Arial', weight: 'normal' },
      { family: 'Open Sans', fallback: 'Arial', weight: 'bold' },
      { family: 'Libre Baskerville', fallback: 'Georgia', weight: 'normal' },
      { family: 'Libre Baskerville', fallback: 'Georgia', weight: 'bold' },
      { family: 'Raleway', fallback: 'Arial', weight: 'normal' },
      { family: 'Raleway', fallback: 'Arial', weight: 'bold' },
      { family: 'Poppins', fallback: 'Arial', weight: 'normal' },
      { family: 'Poppins', fallback: 'Arial', weight: 'bold' },
      { family: 'Nunito', fallback: 'Arial', weight: 'normal' },
      { family: 'Nunito', fallback: 'Arial', weight: 'bold' },
      { family: 'Source Sans Pro', fallback: 'Arial', weight: 'normal' },
      { family: 'Source Sans Pro', fallback: 'Arial', weight: 'bold' }
    ];
    
    // Register system fallbacks for modern fonts
    fontMappings.forEach(font => {
      if (font.fallback) {
        try {
          registerFont(font.fallback, { family: font.family, weight: font.weight });
          this.logger.log(`Registered fallback font: ${font.family} → ${font.fallback} (${font.weight})`);
        } catch (error) {
          this.logger.warn(`Failed to register fallback font ${font.family}: ${error.message}`);
        }
      }
    });
  }
}