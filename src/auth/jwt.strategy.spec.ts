import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  describe('validate', () => {
    it('should return the correct user object from the JWT payload', async () => {
      const payload = { username: 'testuser', roles: ['admin'] };
      const result = await strategy.validate(payload);

      expect(result).toEqual({
        username: payload.username,
        roles: payload.roles,
      });
    });
  });
});
