import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Quote } from './models/quote.model';
import axios from 'axios';

interface QuoteSource {
  name: string;
  url: string;
  transform: (data: any) => { text: string; author: string };
}

@Injectable()
export class QuotesService {
  private readonly logger = new Logger(QuotesService.name);
  private quoteSources: QuoteSource[] = [
    {
      name: 'quotable',
      url: 'https://api.quotable.io/random',
      transform: (data) => ({
        text: data.content,
        author: data.author
      })
    },
    {
      name: 'zen-quotes',
      url: 'https://zenquotes.io/api/random',
      transform: (data) => ({
        text: data[0].q,
        author: data[0].a
      })
    }
  ];

  constructor(private prisma: PrismaService) {}

  async fetchNewQuotes(limit = 10): Promise<Quote[]> {
    this.logger.log(`Starting to fetch new quotes, limit: ${limit}`);
    const allFetchedQuotes: Quote[] = [];

    for (const source of this.quoteSources) {
      try {
        this.logger.log(`Fetching quotes from ${source.name}`);
        const quotes = await this.fetchQuotesFromSource(source, limit);
        this.logger.log(`Got ${quotes.length} new quotes from ${source.name}`);
        
        if (quotes.length > 0) {
          const savedQuotes = await this.saveQuotes(quotes, source.name);
          allFetchedQuotes.push(...savedQuotes);
        } else {
          this.logger.log(`No new quotes to save from ${source.name}`);
        }
      } catch (error) {
        this.logger.error(`Failed to fetch quotes from ${source.name}`, error);
      }
    }

    this.logger.log(`Total new quotes fetched and saved: ${allFetchedQuotes.length}`);
    return allFetchedQuotes;
  }

  private async fetchQuotesFromSource(source: QuoteSource, limit: number): Promise<Partial<Quote>[]> {
    const quotes: Partial<Quote>[] = [];

    for (let i = 0; i < limit; i++) {
      try {
        const response = await axios.get(source.url);
        const transformedQuote = source.transform(response.data);
        
        this.logger.debug(`Got quote from ${source.name}: "${transformedQuote.text.substring(0, 30)}..." by ${transformedQuote.author}`);

        // Check if quote already exists
        const existingQuote = await this.prisma.quote.findFirst({
          where: {
            text: transformedQuote.text,
            author: transformedQuote.author
          }
        });

        if (!existingQuote) {
          quotes.push({
            text: transformedQuote.text,
            author: transformedQuote.author,
            source: source.name,
            lastUsedAt: null
          });
          this.logger.debug(`Added new quote to batch: "${transformedQuote.text.substring(0, 30)}..."`);
        } else {
          this.logger.debug(`Quote already exists in database, skipping`);
        }
      } catch (error) {
        this.logger.error(`Error fetching quote from ${source.name}`, error);
      }
    }

    return quotes;
  }

  private async saveQuotes(quotes: Partial<Quote>[], sourceName: string): Promise<Quote[]> {
    if (quotes.length === 0) {
      this.logger.log(`No quotes to save from ${sourceName}`);
      return [];
    }
    
    try {
      const savedQuotes: Quote[] = [];
      
      for (const quote of quotes) {
        try {
          const savedQuote = await this.prisma.quote.create({
            data: quote as any,
          });
          savedQuotes.push(savedQuote);
          this.logger.debug(`Saved quote: "${quote.text?.substring(0, 30)}..."`);
        } catch (error) {
          this.logger.error(`Failed to save individual quote: ${error.message}`);
        }
      }
      
      this.logger.log(`Successfully saved ${savedQuotes.length} quotes from ${sourceName}`);
      return savedQuotes;
    } catch (error) {
      this.logger.error(`Failed to save quotes from ${sourceName}`, error);
      return [];
    }
  }

  async getRandomQuote(): Promise<Quote | null> {
    try {
      this.logger.log('Attempting to get a random quote');
      const quotesCount = await this.prisma.quote.count();
      
      this.logger.log(`Total quotes in database: ${quotesCount}`);
      
      if (quotesCount === 0) {
        this.logger.log('No quotes available in database');
        // If no quotes exist, try to fetch some
        const newQuotes = await this.fetchNewQuotes(5);
        if (newQuotes.length > 0) {
          this.logger.log(`Fetched ${newQuotes.length} new quotes, returning first one`);
          return newQuotes[0];
        }
        this.logger.log('Could not fetch any new quotes');
        return null;
      }
      
      const skip = Math.floor(Math.random() * quotesCount);
      this.logger.log(`Selecting quote at position ${skip}`);
      
      const [quote] = await this.prisma.quote.findMany({
        take: 1,
        skip: skip,
      });

      if (quote) {
        this.logger.log(`Found quote: "${quote.text.substring(0, 30)}..." by ${quote.author}`);
        
        // Update last used timestamp
        const updatedQuote = await this.prisma.quote.update({
          where: { id: quote.id },
          data: { 
            lastUsedAt: new Date(),
            usageCount: { increment: 1 }
          }
        });
        
        this.logger.log(`Updated lastUsedAt for quote ID ${quote.id}`);
        return updatedQuote;
      }

      this.logger.log('No quote found despite having count > 0');
      return null;
    } catch (error) {
      this.logger.error(`Failed to retrieve random quote: ${error.message}`, error);
      return null;
    }
  }

  async getQuoteByType(type?: string): Promise<Quote | null> {
    // For now, it will behave like getRandomQuote()
    return this.getRandomQuote();
  }

  async addQuoteCategory(quoteId: string, category: string): Promise<Quote | null> {
    try {
      const quote = await this.prisma.quote.findUnique({
        where: { id: quoteId }
      });
      
      if (!quote) {
        this.logger.error(`Quote with ID ${quoteId} not found`);
        return null;
      }

      // Update category
      const updatedQuote = await this.prisma.quote.update({
        where: { id: quoteId },
        data: { category }
      });
      
      this.logger.log(`Added category ${category} to quote ID ${quoteId}`);
      return updatedQuote;
    } catch (error) {
      this.logger.error(`Failed to add category to quote ID ${quoteId}`, error);
      return null;
    }
  }

  // Debug method to show all quotes
  async debugShowAllQuotes(): Promise<Quote[]> {
    const quotes = await this.prisma.quote.findMany();
    this.logger.log(`Total Quotes in Database: ${quotes.length}`);
    quotes.forEach(quote => {
      this.logger.log(`Quote: ${quote.text} by ${quote.author} (Source: ${quote.source})`);
    });
    return quotes;
  }
}