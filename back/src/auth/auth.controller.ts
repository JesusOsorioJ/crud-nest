import { Controller, Post, Body, UseGuards, Request, Get, HttpCode } from '@nestjs/common';
import { Request as ExpressRequest } from 'express'; 
import { AuthService } from './auth.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Registro de usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente.' })
  @Post('register')
  async register(@Body() registerDto: any) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'Login de usuario' })
  @ApiResponse({ status: 200, description: 'Usuario autenticado y se retorna JWT.' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Request() req: ExpressRequest) {
    return this.authService.login(req.user);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  getProfile(@Request() req: ExpressRequest) {
    return req.user;
  }
}
