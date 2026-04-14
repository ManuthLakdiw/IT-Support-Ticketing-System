import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const adapter = new PrismaMariaDb({
      host: process.env.DB_HOST ?? 'localhost',
      user: process.env.DB_USER ?? 'root',
      password: process.env.DB_PASSWORD ?? 'Manu2006',
      database: process.env.DB_NAME ?? 'ticketing_db',
      connectionLimit: 10,
      // Required when the server uses RSA key-pair authentication and the
      // client doesn't have the public key cached locally. URL query-string
      // params (e.g. ?allowPublicKeyRetrieval=true) are ignored by the driver
      // adapter, so this must be set here in the programmatic config object.
      allowPublicKeyRetrieval: true,
    });

    super({
      adapter,
      log: [
        { level: 'info', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' },
        { level: 'error', emit: 'stdout' },
      ],
    });
  }

  async onModuleInit(): Promise<void> {
    this.logger.log('Connecting to the database...');
    await this.$connect();
    this.logger.log('Database connection established.');
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Disconnecting from the database...');
    await this.$disconnect();
    this.logger.log('Database connection closed.');
  }
}