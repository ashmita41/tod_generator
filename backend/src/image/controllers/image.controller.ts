import { Controller, Get, Render } from '@nestjs/common';
import { QuotesService } from '../../quotes/quotes.service';
import { ImageService } from '../services/image.service';
import { Quote } from '../../quotes/entities/quote.entity';
import { DesignConfig } from '../../design/interfaces/design-config.interface';
import { v4 as uuidv4 } from 'uuid';

@Controller('image')
export class ImageController {
  constructor(
    private readonly quotesService: QuotesService,
    private readonly imageService: ImageService
  ) {}

  // Default design configuration
  private getDefaultDesign(): DesignConfig {
    return {
      designId: uuidv4(), // Generate a unique ID for each design
      mode: 'random',
      background: {
        color: '#F0F0F0',
        type: 'solid'
      },
      layout: {
        type: 'centered',
        margins: {
          top: 50,
          bottom: 50,
          left: 50,
          right: 50
        }
      },
      typography: {
        title: {
          fontFamily: 'Arial',
          fontSize: 24,
          color: '#333333',
          weight: 'bold',
          alignment: 'center'
        },
        quote: {
          fontFamily: 'Georgia',
          fontSize: 36,
          color: '#000000',
          weight: 'normal',
          alignment: 'center'
        },
        author: {
          fontFamily: 'Arial',
          fontSize: 24,
          color: '#666666',
          weight: 'italic',
          alignment: 'center'
        }
      }
    };
  }

  @Get('quote-image')
  @Render('quote-image')
  async generateQuoteImage() {
    // Fetch a random quote with null safety
    const quote = await this.quotesService.getRandomQuote();
    
    // If quote is null, provide a default quote
    if (!quote) {
      return {
        imageUrl: await this.imageService.generateQuoteImage({
          quote: 'No quote available',
          author: 'Unknown',
          design: this.getDefaultDesign()
        })
      };
    }

    // Generate image with the quote
    return {
      imageUrl: await this.imageService.generateQuoteImage({
        quote: quote.text,
        author: quote.author,
        design: this.getDefaultDesign()
      })
    };
  }

  @Get('fallback-quote-image')
  @Render('quote-image')
  async generateFallbackQuoteImage() {
    // Fetch a new quote if the previous one failed
    const quote = await this.quotesService.getRandomQuote();
    
    // If quote is null, use a hardcoded fallback
    if (!quote) {
      return {
        imageUrl: await this.imageService.generateQuoteImage({
          quote: 'Creativity is intelligence having fun.',
          author: 'Albert Einstein',
          design: this.getDefaultDesign()
        })
      };
    }

    // Generate image with the quote
    return {
      imageUrl: await this.imageService.generateQuoteImage({
        quote: quote.text,
        author: quote.author,
        design: this.getDefaultDesign()
      })
    };
  }
}