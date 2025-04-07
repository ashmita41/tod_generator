import { Controller, Get, NotFoundException } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { Quote } from './models/quote.model';

@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Get('random')
  async getRandomQuote(): Promise<Quote> {
    const quote = await this.quotesService.getRandomQuote();
    if (!quote) {
      throw new NotFoundException('No quotes available');
    }
    return quote;
  }

  @Get('debug')
  async debugQuotes(): Promise<Quote[]> {
    return this.quotesService.debugShowAllQuotes();
  }
}