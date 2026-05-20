import { Body, Controller, HttpCode, HttpStatus, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { LoginDto } from 'src/credentials/dtos/login.dto'; // ✅ Asegúrate de importar tu DTO de login

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /* ===============================
      🔐 INICIO DE SESIÓN (LOGIN)
     =============================== */
  @Post('login') // 👈 ¡ESTA ES LA RUTA QUE FALTABA!
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    // Llama al servicio que ya programamos antes
    return this.authService.signInService(loginDto);
  }

  /* ===============================
      📝 REGISTRO DE USUARIO (SIGN-UP)
     =============================== */
  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './upload/users',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  async signUp(@UploadedFile() file: Express.Multer.File, @Body('data') data: string) {
    // Tu lógica de parseo de JSON y limpieza de DTO (que está muy bien hecha)
    const rawData = JSON.parse(data);
    const user = rawData.createUserDto;

    const cleanUserDto = {
      fullName: user.fullName,
      document: String(user.document).trim(),
      birthDate: user.birthDate,
      sex: user.sex,
      phone: String(user.phone || '').trim(), 
      address: (user.address && user.address.trim() !== '') 
               ? user.address.trim() 
               : 'Dirección No Registrada',
      email: user.email, 
      objective: user.objective,
      weight: user.weight ? Number(parseFloat(String(user.weight)).toFixed(2)) : 0,
      height: Number(user.height) < 10 
              ? Math.round(Number(user.height) * 100) 
              : Math.round(Number(user.height)),
      observations: user.observations || '',
      photoUrl: '' 
    };

    if (file) {
      cleanUserDto.photoUrl = `http://localhost:3002/upload/users/${file.filename}`;
    }

    const finalDto = {
      createCredentialDto: rawData.createCredentialDto,
      createUserDto: cleanUserDto
    };

    return this.authService.signUpService(finalDto);
  }
}