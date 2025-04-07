import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { QuotesService } from './quotes/quotes.service';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);
  
  constructor(private readonly quotesService: QuotesService) {}

  async onModuleInit() {
    this.logger.log('Application starting up - initializing quotes');
    try {
      // Automatically fetch quotes when the application starts
      const quotes = await this.quotesService.fetchNewQuotes(10);
      this.logger.log(`Successfully fetched ${quotes.length} quotes during initialization`);
    } catch (error) {
      this.logger.error('Failed to fetch quotes during initialization', error);
    }
  }

  getHello(): string {
    return 'Welcome to Thought of the Day Generator!';
  }
}