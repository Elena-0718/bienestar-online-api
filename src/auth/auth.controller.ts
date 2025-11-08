import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/users/Dtos/loginUser.dto';
import { CreateUserDto } from 'src/users/Dtos/createUser.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Post('iniciarSesion')
    singIn(@Body() loginUserDto: LoginUserDto) {
        return this.authService.SingInService(loginUserDto);
    }

        @Post('registrar')
  async registrar(@Body() createUserDto: CreateUserDto) {
    return await this.authService.RegistrarUsuarioService(createUserDto);
  }
}
