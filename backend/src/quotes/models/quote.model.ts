import { Quote as PrismaQuote } from '@prisma/client';

// Re-export the Prisma generated type as our domain model
export type Quote = PrismaQuote;

// export class QuoteModel implements PrismaQuote {
//   id: string;
//   text: string;
//   author: string;
//   source: string;
//   lastUsedAt: Date | null;
//   usageCount: number;
//   createdAt: Date;
//   category: string | null;
//
// }