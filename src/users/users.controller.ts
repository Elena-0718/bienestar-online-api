import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { UpdateUserDto } from './dtos/updateUser.dto';
import { UserService } from './users.service';

import { RolesDecorator } from 'src/decoratos/roles.decorator';
import { Roles } from 'src/enum/roles.enum';
import { JwtAuthGuard } from 'src/auth/Guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/Guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Usuarios')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  /* ===============================
      ADMIN
  =============================== */

  @Get('all')
  @ApiOperation({
    summary: 'Obtener todos los usuarios | ADMIN',
  })
  @HttpCode(HttpStatus.OK)
  @RolesDecorator(Roles.ADMIN)
  getAllUsers() {
    return this.userService.getAllUsersService();
  }

  @Get('find/:uuid')
  @ApiOperation({
    summary: 'Obtener usuario por UUID | ADMIN o PROFESIONAL',
  })
  @HttpCode(HttpStatus.OK)
  @RolesDecorator(Roles.ADMIN, Roles.PROFESSIONAL) // ✅ AJUSTE CLAVE
  getUserById(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ) {
    return this.userService.getUserByIdService(uuid);
  }

  /* ===============================
      PROFESIONALES
  =============================== */

  @Get('my-patients')
  @ApiOperation({
    summary: 'Obtener pacientes asignados por especialidad | PROFESIONAL',
  })
  @HttpCode(HttpStatus.OK)
  @RolesDecorator(Roles.PROFESSIONAL)
  getMyPatients(@Req() req) {
    return this.userService.getPatientsByProfessionalSpecialtyService(req);
  }

  /* ===============================
      PERFIL PROPIO
  =============================== */

  @Get('my-profile')
  @ApiOperation({
    summary: 'Ver mi perfil',
  })
  @HttpCode(HttpStatus.OK)
  @RolesDecorator(
    Roles.USER,
    Roles.PROFESSIONAL,
    Roles.ADMIN,
  )
  getMyProfile(@Req() req) {
    return this.userService.getUserProfileService(req);
  }

  @Put('update-my-profile')
  @ApiOperation({
    summary: 'Actualizar mi perfil',
  })
  @ApiBody({
    type: UpdateUserDto,
  })
  @HttpCode(HttpStatus.OK)
  @RolesDecorator(
    Roles.USER,
    Roles.PROFESSIONAL,
    Roles.ADMIN,
  )
  updateMyProfile(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUserProfileService(
      req,
      updateUserDto,
    );
  }

  /* ===============================
      SUBIR FOTO DE PERFIL
  =============================== */

  @Post('upload')
  @ApiOperation({ summary: 'Subir foto de perfil' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './upload/users',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);

          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return callback(
            new BadRequestException(
              'Solo se permiten imágenes (jpg, jpeg, png, webp)',
            ),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  @RolesDecorator(
    Roles.USER,
    Roles.PROFESSIONAL,
    Roles.ADMIN,
  )
  async uploadFile(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException(
        'No se recibió ninguna imagen',
      );
    }

    const userId = req.user.userId;

    const user =
      await this.userService.getUserByIdService(userId);

    if (!user) {
      throw new NotFoundException(
        'Usuario no encontrado',
      );
    }

    const photoUrl = `http://localhost:3002/upload/users/${file.filename}`;

    await this.userService.updateUserProfileService(
      req,
      { photoUrl },
    );

    return {
      message: 'Foto actualizada correctamente',
      url: photoUrl,
    };
  }
}