import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/productAuth/roles.enum';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async validateUser(username: string, roles: Role[]): Promise<any> {
    if (username && roles) {
      return { username, roles };
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      roles: user.roles,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
