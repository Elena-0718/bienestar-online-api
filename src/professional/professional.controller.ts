import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProfessionalService } from './professional.service';
import { CreateProfessionalDto } from './dtos/create-professional.dto';
import { UpdateProfessionalDto } from './dtos/update-professional.dto';
import { ApproveProfessionalDto } from './dtos/approve-professional.dto';
import { AdminCreateProfessionalDto } from './dtos/admin-create-professional.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from 'src/auth/Guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/Guards/roles.guard';
import { RolesDecorator } from 'src/decorators/roles.decorator';
import { Roles } from 'src/enum/roles.enum';

@Controller('professionals')
export class ProfessionalController {
  constructor(private readonly professionalService: ProfessionalService) {}

  /* =========================================================
      ✅ CREAR PERFIL (ADMIN)
      Admin envía userUuid en el body
  ========================================================= */
  @Post('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.ADMIN)
  createByAdmin(@Body() dto: AdminCreateProfessionalDto) {
    return this.professionalService.createByAdmin(dto);
  }

  /* =========================================================
      SUBIR FOTO DE PERFIL
  ========================================================= */
  @Post('upload-photo')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.PROFESSIONAL, Roles.ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './upload/professionals',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `pro-${uniqueSuffix}${ext}`);
        },
      }),
      limits: { fileSize: 2 * 1024 * 1024 },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return callback(
            new BadRequestException('Solo imágenes (jpg, jpeg, png, webp)'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async uploadPhoto(@Req() req, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No se recibió ninguna imagen');

    const userId = req.user.userId || req.user.uuid || req.user.user_uuid;
    const photoUrl = `http://localhost:3002/upload/professionals/${file.filename}`;

    return this.professionalService.updateProfessionalPhoto(userId, photoUrl);
  }

  /* =========================================================
      CREAR PERFIL (PROFESSIONAL)
  ========================================================= */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.PROFESSIONAL)
  create(@Req() req, @Body() dto: CreateProfessionalDto) {
    const userId = req.user.userId || req.user.uuid || req.user.user_uuid;
    return this.professionalService.create(userId, dto);
  }

  /* =========================================================
      ✅ LISTAR TODOS (Admin ve todo | User ve solo aprobados + activos)
  ========================================================= */
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req) {
    const role = req.user?.role;
    return this.professionalService.findAll(role);
  }

  /* =========================================================
      ✅ OBTENER UNO (Admin ve todo | User solo aprobados + activos)
  ========================================================= */
  @Get(':uuid')
  @UseGuards(JwtAuthGuard)
  findOne(@Req() req, @Param('uuid', ParseUUIDPipe) uuid: string) {
    const role = req.user?.role;
    return this.professionalService.findOne(uuid, role);
  }

  /* =========================================================
      ACTUALIZAR (PROFESSIONAL o ADMIN)
  ========================================================= */
  @Patch(':uuid')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.PROFESSIONAL, Roles.ADMIN)
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProfessionalDto,
  ) {
    return this.professionalService.update(uuid, dto);
  }

  /* =========================================================
      APROBAR (ADMIN)
  ========================================================= */
  @Patch(':uuid/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.ADMIN)
  approve(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: ApproveProfessionalDto,
  ) {
    return this.professionalService.approve(uuid, dto);
  }

  /* =========================================================
      DESACTIVAR (ADMIN)
  ========================================================= */
  @Patch(':uuid/deactivate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.ADMIN)
  deactivate(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.professionalService.deactivate(uuid);
  }

  /* =========================================================
      ELIMINAR (ADMIN)
  ========================================================= */
  @Delete(':uuid')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.ADMIN)
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.professionalService.remove(uuid);
  }
}