import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly databaseService: DatabaseService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authentication;
    if (!token) {
      return false;
    }
    return this.validateToken(token);
  }

  async validateToken(token: string) {
    const accessToken = await this.databaseService.accessTokens.findUnique({
      where: { token },
    });

    if (!accessToken || !accessToken.isValid) {
      return false;
    }

    await this.databaseService.accessTokens.update({
      where: { token },
      data: { lastUsed: new Date() },
    });
    return true;
  }
}
