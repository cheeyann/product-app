import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UnauthorizedException } from '@nestjs/common';
import { Role } from '../productAuth/roles.enum';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return JWT token if credentials are valid', async () => {
      const loginDto: LoginDto = { username: 'testuser', roles: [Role.Admin] };
      const user = { username: 'testuser', roles: ['admin'] };
      const accessToken = 'mockedToken';

      jest.spyOn(service, 'validateUser').mockResolvedValue(user);
      jest
        .spyOn(service, 'login')
        .mockResolvedValue({ access_token: accessToken });

      const result = await controller.login(loginDto);

      expect(result).toEqual({ access_token: accessToken });
      expect(service.validateUser).toHaveBeenCalledWith(
        loginDto.username,
        loginDto.roles,
      );
      expect(service.login).toHaveBeenCalledWith(user);
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const loginDto: LoginDto = { username: 'testuser', roles: [Role.Admin] };

      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      await expect(controller.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );
      expect(service.validateUser).toHaveBeenCalledWith(
        loginDto.username,
        loginDto.roles,
      );
    });
  });
});
