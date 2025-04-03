// src/image/services/image.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { createCanvas } from 'canvas';
import { ImageGenerationOptions } from '../interfaces/image-generation.interface';
import { IMAGE_CONFIG } from '../config/image-config';
import { TextUtilsService } from './text-utils.service';
import { ImageStorage } from '../utils/image-storage';

@Injectable()
export class ImageService {
  private readonly logger = new Logger(ImageService.name);
  
  constructor(private textUtilsService: TextUtilsService) {}
  
  async generateQuoteImage(
    options: ImageGenerationOptions
  ): Promise<string> {
    try {
      const { quote, author, title, design } = options;
      
      // Create canvas with Instagram square post size
      const canvas = createCanvas(IMAGE_CONFIG.WIDTH, IMAGE_CONFIG.HEIGHT);
      const ctx = canvas.getContext('2d');
      
      // Apply background
      ctx.fillStyle = design.background.color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Get title font properties
      const titleFont = design.typography.title || {
        fontFamily: IMAGE_CONFIG.TEXT.TITLE.DEFAULT_FAMILY,
        fontSize: IMAGE_CONFIG.TEXT.TITLE.DEFAULT_FONT_SIZE,
        color: IMAGE_CONFIG.TEXT.TITLE.DEFAULT_COLOR,
        weight: IMAGE_CONFIG.TEXT.TITLE.DEFAULT_WEIGHT,
        alignment: 'center'
      };
      
      // Set title text style
      ctx.font = `${titleFont.weight} ${titleFont.fontSize}px ${titleFont.fontFamily}`;
      ctx.fillStyle = titleFont.color;
      const titleText = title || 'Thought of the Day';
      const titleWidth = ctx.measureText(titleText).width;
      
      // Get quote font properties
      const quoteFont = design.typography.quote || {
        fontFamily: IMAGE_CONFIG.TEXT.QUOTE.DEFAULT_FAMILY,
        fontSize: IMAGE_CONFIG.TEXT.QUOTE.DEFAULT_FONT_SIZE,
        color: IMAGE_CONFIG.TEXT.QUOTE.DEFAULT_COLOR,
        weight: IMAGE_CONFIG.TEXT.QUOTE.DEFAULT_WEIGHT,
        alignment: 'center'
      };
      
      // Set quote text style
      ctx.font = `${quoteFont.weight} ${quoteFont.fontSize}px ${quoteFont.fontFamily}`;
      
      // Calculate max width for text based on layout margins
      const maxTextWidth = canvas.width - (design.layout.margins.left + design.layout.margins.right);
      
      // Wrap text
      const wrappedQuote = this.textUtilsService.wrapText(
        ctx, 
        quote, 
        maxTextWidth, 
        quoteFont.fontSize
      );
      
      // Calculate total height of text elements
      const titleHeight = titleFont.fontSize;
      const quoteLineHeight = IMAGE_CONFIG.SPACING.QUOTE_LINE_HEIGHT;
      const authorHeight = IMAGE_CONFIG.TEXT.AUTHOR.DEFAULT_FONT_SIZE;
      const titleToQuoteGap = IMAGE_CONFIG.SPACING.TITLE_TO_QUOTE;
      const quoteToAuthorGap = IMAGE_CONFIG.SPACING.QUOTE_TO_AUTHOR;
      
      const totalTextHeight = titleHeight + 
                              titleToQuoteGap +
                              (wrappedQuote.length * quoteLineHeight) + 
                              quoteToAuthorGap +
                              authorHeight + 
                              IMAGE_CONFIG.SPACING.ADDITIONAL;
      
      // Calculate starting Y position based on layout
      let startY = design.layout.margins.top;
      
      if (design.layout.type === 'centered') {
        startY = (canvas.height - totalTextHeight) / 2;
      }
      
      // Render title
      if (design.layout.type === 'centered') {
        ctx.textAlign = 'center';
        ctx.fillText(titleText, canvas.width / 2, startY);
      } else if (design.layout.type === 'left-aligned') {
        ctx.textAlign = 'left';
        ctx.fillText(titleText, design.layout.margins.left, startY);
      } else if (design.layout.type === 'right-aligned') {
        ctx.textAlign = 'right';
        ctx.fillText(titleText, canvas.width - design.layout.margins.right, startY);
      }
      
      // Get author font properties
      const authorFont = design.typography.author || {
        fontFamily: IMAGE_CONFIG.TEXT.AUTHOR.DEFAULT_FAMILY,
        fontSize: IMAGE_CONFIG.TEXT.AUTHOR.DEFAULT_FONT_SIZE,
        color: IMAGE_CONFIG.TEXT.AUTHOR.DEFAULT_COLOR,
        weight: IMAGE_CONFIG.TEXT.AUTHOR.DEFAULT_WEIGHT,
        alignment: 'center'
      };
      
      // Render quote text
      ctx.font = `${quoteFont.weight} ${quoteFont.fontSize}px ${quoteFont.fontFamily}`;
      ctx.fillStyle = quoteFont.color;
      
      let quoteY = startY + titleHeight + titleToQuoteGap;
      
      wrappedQuote.forEach((line, index) => {
        if (design.layout.type === 'centered') {
          ctx.textAlign = 'center';
          ctx.fillText(line, canvas.width / 2, quoteY + (index * quoteLineHeight));
        } else if (design.layout.type === 'left-aligned') {
          ctx.textAlign = 'left';
          ctx.fillText(line, design.layout.margins.left, quoteY + (index * quoteLineHeight));
        } else if (design.layout.type === 'right-aligned') {
          ctx.textAlign = 'right';
          ctx.fillText(line, canvas.width - design.layout.margins.right, quoteY + (index * quoteLineHeight));
        }
      });
      
      // Render author
      ctx.font = `${authorFont.weight} ${authorFont.fontSize}px ${authorFont.fontFamily}`;
      ctx.fillStyle = authorFont.color;
      
      const authorText = `- ${author}`;
      const authorY = quoteY + (wrappedQuote.length * quoteLineHeight) + quoteToAuthorGap;
      
      if (design.layout.type === 'centered') {
        ctx.textAlign = 'center';
        ctx.fillText(authorText, canvas.width / 2, authorY);
      } else if (design.layout.type === 'left-aligned') {
        ctx.textAlign = 'left';
        ctx.fillText(authorText, design.layout.margins.left, authorY);
      } else if (design.layout.type === 'right-aligned') {
        ctx.textAlign = 'right';
        ctx.fillText(authorText, canvas.width - design.layout.margins.right, authorY);
      }
      
      // Save and return image path
      const imageUrl = await ImageStorage.saveImage(canvas);
      this.logger.log(`Successfully generated image: ${imageUrl}`);
      return imageUrl;
    } catch (error) {
      this.logger.error('Failed to generate image:', error);
      throw new Error(`Failed to generate image: ${error.message}`);
    }
  }
}