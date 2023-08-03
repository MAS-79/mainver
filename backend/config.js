import dotenv from 'dotenv';

dotenv.config();

export default {
  PORT: process.env.PORT || 8000,
 
  JWT_SECRET: process.env.JWT_SECRET,
 
};
