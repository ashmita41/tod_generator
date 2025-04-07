import { Controller, Get, NotFoundException, Logger } from '@nestjs/common';
import { QuotesService } from './quotes/quotes.service';
import { Quote } from './quotes/models/quote.model';

@Controller('quotes')
export class AppController {  
  private readonly logger = new Logger(AppController.name); 
  
  constructor(private readonly quotesService: QuotesService) {}

  @Get('random')
  async getRandomQuote(): Promise<Quote> {
    this.logger.log('Received request for random quote');
    const quote = await this.quotesService.getRandomQuote();
    
    if (!quote) {
      this.logger.warn('No quotes available when requested');
      throw new NotFoundException('No quotes available. The system may still be initializing or there was an issue fetching quotes.');
    }
    
    return quote;
  }

  @Get('debug')
  async debugQuotes(): Promise<{ quotes: Quote[], count: number }> {
    this.logger.log('Received request for debug quotes');
    const quotes = await this.quotesService.debugShowAllQuotes();
    return { 
      quotes, 
      count: quotes.length 
    };
  }

  @Get('fetch')
  async fetchNewQuotes(): Promise<{ success: boolean, count: number }> {
    this.logger.log('Manually triggering quote fetch');
    const quotes = await this.quotesService.fetchNewQuotes(5);
    return { 
      success: true, 
      count: quotes.length 
    };
  }
}