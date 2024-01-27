import { config } from 'dotenv';
import { app } from './app';

config();

async function main() {
  app.listen(3000, () => {
    console.log('server started at port', 3000);
  });
}

main();
