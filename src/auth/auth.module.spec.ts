import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

describe('AuthModule', () => {
  let module: TestingModule;
  let authService: AuthService;
  let authController: AuthController;
  let jwtStrategy: JwtStrategy;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.register({
          secret: 'your_secret_key', // Match with the one used in the module
          signOptions: { expiresIn: '60m' }, // Match with the one used in the module
        }),
      ],
      providers: [AuthService, JwtStrategy],
      controllers: [AuthController],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    authController = module.get<AuthController>(AuthController);
    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
    expect(authService).toBeDefined();
    expect(authController).toBeDefined();
    expect(jwtStrategy).toBeDefined();
  });

  it('should provide AuthService', () => {
    expect(authService).toBeDefined();
  });

  it('should provide JwtStrategy', () => {
    expect(jwtStrategy).toBeDefined();
  });

  it('should provide AuthController', () => {
    expect(authController).toBeDefined();
  });

  it('should configure JwtModule with correct options', () => {
    const jwtService = module.get<JwtService>(JwtService);
    expect(jwtService).toBeDefined();
    // Check if JwtModule is configured with the correct secret and options
    expect(jwtService['options'].secret).toBe('your_secret_key');
    expect(jwtService['options'].signOptions.expiresIn).toBe('60m');
  });
});
