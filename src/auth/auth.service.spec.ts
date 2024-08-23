import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../productAuth/roles.enum';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should return user object if username and roles are provided', async () => {
      const username = 'testuser';
      const roles = [Role.Admin];

      const result = await service.validateUser(username, roles);

      expect(result).toEqual({ username, roles });
    });

    it('should return null if username is missing', async () => {
      const result = await service.validateUser(null, [Role.Admin]);

      expect(result).toBeNull();
    });

    it('should return null if roles are missing', async () => {
      const result = await service.validateUser('testuser', null);

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const user = { username: 'testuser', roles: ['admin'] };
      const accessToken = 'mockedToken';

      jest.spyOn(jwtService, 'sign').mockReturnValue(accessToken);

      const result = await service.login(user);

      expect(result).toEqual({ access_token: accessToken });
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: user.username,
        roles: user.roles,
      });
    });
  });
});
