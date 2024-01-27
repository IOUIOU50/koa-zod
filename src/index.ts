import { config } from 'dotenv';
import { app } from './app';
import { prisma } from './lib/prisma-client';

config();

async function main() {
  await prisma.$connect();
  app.listen(3000, () => {
    console.log('server started at port', 3000);
  });
}

main();
