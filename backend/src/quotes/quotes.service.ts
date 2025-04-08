import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Quote } from '@prisma/client';
import axios from 'axios';

interface QuoteSource {
  name: string;
  url: string;
  transform: (data: any) => { text: string; author: string };
}

// Seed quotes in case API fails
const SEED_QUOTES = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", source: "seed" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon", source: "seed" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", source: "seed" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill", source: "seed" },
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker", source: "seed" }
];

@Injectable()
export class QuotesService implements OnModuleInit {
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

  constructor(
    private prisma: PrismaService
  ) {}

  async onModuleInit() {
    // Check if there are any quotes in the database
    const count = await this.prisma.quote.count();
    
    if (count === 0) {
      this.logger.log('No quotes found in database. Seeding initial quotes...');
      // Seed the database with initial quotes
      await this.seedInitialQuotes();
      
      // Then try to fetch from APIs
      await this.fetchNewQuotes();
    } else {
      this.logger.log(`Found ${count} quotes in database.`);
    }
  }

  async seedInitialQuotes() {
    try {
      this.logger.log('Seeding database with initial quotes...');
      
      for (const quote of SEED_QUOTES) {
        try {
          await this.prisma.quote.create({
            data: quote
          });
        } catch (error) {
          if (error.code === 'P2002') {
            this.logger.log(`Seed quote already exists: ${quote.text}`);
          } else {
            this.logger.error(`Error seeding quote: ${error.message}`);
          }
        }
      }
      
      this.logger.log('Initial quotes seeded successfully.');
    } catch (error) {
      this.logger.error('Failed to seed initial quotes', error);
    }
  }

  async fetchNewQuotes(limit = 5): Promise<Quote[]> {
    const allFetchedQuotes: Quote[] = [];
    this.logger.log(`Fetching ${limit} new quotes from each source...`);

    for (const source of this.quoteSources) {
      try {
        this.logger.log(`Fetching quotes from ${source.name}...`);
        const quotes = await this.fetchQuotesFromSource(source, limit);
        this.logger.log(`Fetched ${quotes.length} quotes from ${source.name}`);
        
        const savedQuotes = await this.saveQuotes(quotes, source.name);
        allFetchedQuotes.push(...savedQuotes);
      } catch (error) {
        this.logger.error(`Failed to fetch quotes from ${source.name}`, error.message);
      }
    }

    this.logger.log(`Total new quotes fetched and saved: ${allFetchedQuotes.length}`);
    return allFetchedQuotes;
  }

  private async fetchQuotesFromSource(source: QuoteSource, limit: number): Promise<Partial<Quote>[]> {
    const quotes: Partial<Quote>[] = [];

    for (let i = 0; i < limit; i++) {
      try {
        const response = await axios.get(source.url, { timeout: 5000 });
        const transformedQuote = source.transform(response.data);

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
            lastUsedAt: null,
            usageCount: 0
          });
        }
      } catch (error) {
        this.logger.error(`Error fetching quote from ${source.name}: ${error.message}`);
        break; // Stop trying if there's an error, to avoid excessive API calls
      }
    }

    return quotes;
  }

  private async saveQuotes(quotes: Partial<Quote>[], sourceName: string): Promise<Quote[]> {
    try {
      const savedQuotes: Quote[] = [];
      
      for (const quote of quotes) {
        try {
          if (!quote.text || !quote.author || !quote.source) {
            this.logger.warn('Incomplete quote data, skipping...');
            continue; // Skip this iteration instead of returning
          }
          const savedQuote = await this.prisma.quote.create({
            data: {
              text: quote.text,
              author: quote.author,
              source: quote.source,
              lastUsedAt: quote.lastUsedAt,
              usageCount: quote.usageCount || 0
            },
          });
          savedQuotes.push(savedQuote);
        } catch (error) {
          if (error.code === 'P2002') {
            this.logger.log(`Quote already exists: ${quote.text}`);
          } else {
            this.logger.error(`Error saving quote: ${error.message}`);
          }
        }
      }
      
      this.logger.log(`Saved ${savedQuotes.length} quotes from ${sourceName}`);
      return savedQuotes;
    } catch (error) {
      this.logger.error(`Failed to save quotes from ${sourceName}`, error);
      return [];
    }
  }

  async getRandomQuote(): Promise<Quote | null> {
    try {
      // Check if any quotes exist
      const quotesCount = await this.prisma.quote.count();
      
      if (quotesCount === 0) {
        this.logger.warn('No quotes found in database. Seeding initial quotes...');
        await this.seedInitialQuotes();
        // Try again after seeding
        return this.getRandomQuote();
      }
      
      // Get a random quote
      const skip = Math.floor(Math.random() * quotesCount);
      const quote = await this.prisma.quote.findFirst({
        skip: skip,
        take: 1,
      });

      if (quote) {
        // Update last used timestamp
        await this.prisma.quote.update({
          where: { id: quote.id },
          data: { 
            lastUsedAt: new Date(),
            usageCount: { increment: 1 }
          },
        });
        return quote;
      } else {
        this.logger.error('Failed to get random quote despite having quotes in database');
        return null;
      }
    } catch (error) {
      this.logger.error(`Failed to retrieve random quote: ${error.message}`);
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
        data: { category: category }
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
    try {
      const quotes = await this.prisma.quote.findMany();
      this.logger.log(`Total Quotes in Database: ${quotes.length}`);
      
      if (quotes.length === 0) {
        this.logger.warn('No quotes found in database');
      } else {
        quotes.forEach(quote => {
          this.logger.log(`Quote: ${quote.text} by ${quote.author} (Source: ${quote.source})`);
        });
      }
      
      return quotes;
    } catch (error) {
      this.logger.error(`Error retrieving quotes: ${error.message}`);
      throw error;
    }
  }
}