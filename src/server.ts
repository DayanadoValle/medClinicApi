import 'reflect-metadata';
import express, { Application } from 'express';
import cors from 'cors';
import { AppDataSource } from './database/data-source';
import { routes } from './routes';
import {
  errorMiddleware,
  notFoundMiddleware,
} from './middlewares/errorMiddleware';
import { env } from './config/env';

async function bootstrap(): Promise<void> {
  const app: Application = express();

  app.use(cors());
  app.use(express.json());

  app.use(routes);

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  try {
    await AppDataSource.initialize();
    console.log('Conexao com o banco de dados estabelecida com sucesso.');

    app.listen(env.port, () => {
      console.log(`MedClinic API rodando em http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar a aplicacao:', error);
    process.exit(1);
  }
}

bootstrap();
