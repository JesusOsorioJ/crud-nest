import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn().mockImplementation((email: string) => {
        if (email === 'test@example.com') {
          return Promise.resolve({
            id: 1,
            email: 'test@example.com',
            password: bcrypt.hashSync('123456', 10),
            roles: ['USER'],
          });
        }
        return Promise.resolve(null);
      }),
      create: jest.fn().mockImplementation(async (dto) => ({
        id: 2,
        email: dto.email,
        password: await bcrypt.hash(dto.password, 10),
        roles: ['USER'],
      })),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('fake-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return the user data without password if validation succeeds', async () => {
      const user = await authService.validateUser('test@example.com', '123456');
      expect(user).toBeDefined();
      expect(user).toHaveProperty('email', 'test@example.com');
      expect(user).not.toHaveProperty('password');
    });

    it('should return null if validation fails', async () => {
      const user = await authService.validateUser('test@example.com', 'wrong-password');
      expect(user).toBeNull();
    });
  });

  describe('login', () => {
    it('should return a valid access and refresh token', async () => {
      const fakeUser = { id: 1, email: 'test@example.com', roles: ['USER'] };
      const tokens = await authService.login(fakeUser);
      expect(tokens).toHaveProperty('access_token', 'fake-jwt-token');
      expect(tokens).toHaveProperty('refresh_token', 'fake-jwt-token');
    });
  });
});
