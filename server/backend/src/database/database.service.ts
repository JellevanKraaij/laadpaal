import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  withExtensions() {
    return this.$extends({
      result: {
        chargeSessions: {
          totalWh: {
            needs: { startWh: true, endWh: true },
            compute(chargeSessions) {
              if (!chargeSessions.startWh || !chargeSessions.endWh) return null;
              return chargeSessions.endWh - chargeSessions.startWh;
            },
          },
        },
      },
    });
  }
}
