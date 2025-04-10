import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';

interface HttpArgumentsHost {
  getRequest: () => any;
  getResponse: () => any;
  getNext: () => any;
}

describe('RolesGuard', () => {
  let rolesGuard: RolesGuard;
  let reflector: Partial<Reflector>;

  beforeEach(() => {
    reflector = {
      get: jest.fn().mockReturnValue(['ADMIN']),
    };
    rolesGuard = new RolesGuard(reflector as Reflector);
  });

  it('should allow access if user has required role', () => {
    const context: Partial<ExecutionContext> = {
      getHandler: () => () => {},
      switchToHttp: () =>
        ({
          getRequest: () => ({ user: { roles: ['ADMIN'] } }),
          getResponse: () => ({}),
          getNext: () => {},
        } as HttpArgumentsHost),
    };
    expect(rolesGuard.canActivate(context as ExecutionContext)).toBe(true);
  });

  it('should deny access if user does not have required role', () => {
    (reflector.get as jest.Mock).mockReturnValue(['ADMIN']);
    const context: Partial<ExecutionContext> = {
      getHandler: () => () => {},
      switchToHttp: () =>
        ({
          getRequest: () => ({ user: { roles: ['USER'] } }),
          getResponse: () => ({}),
          getNext: () => {},
        } as HttpArgumentsHost),
    };
    expect(rolesGuard.canActivate(context as ExecutionContext)).toBe(false);
  });
});
