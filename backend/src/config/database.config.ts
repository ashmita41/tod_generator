import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  url: process.env.DATABASE_URL || 
       `postgresql://${process.env.DB_USERNAME || 'postgres'}:${
         process.env.DB_PASSWORD || '12345'
       }@${process.env.DB_HOST || 'localhost'}:${
         process.env.DB_PORT || '5432'
       }/${process.env.DB_NAME || 'tod_generator'}`,
}));