import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
  ParseUUIDPipe,
  Req,
  Patch,
  Post,
} from '@nestjs/common';
import { CredentialService } from './credential.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/Guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/Guards/roles.guard';
import { RolesDecorator } from 'src/decoratos/roles.decorator';
import { Roles } from 'src/enum/roles.enum';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ChangeRoleDto } from './dtos/change-role.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';

@ApiTags('Credenciales de usuarios')
@ApiBearerAuth()
@Controller('credentials')
////
export class CredentialController {
  constructor(private readonly credentialService: CredentialService) {}

  //RUTAS PÚBLICAS (SIN JWT)
 //

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Solicitar recuperación de contraseña | PÚBLICA',
    description: 'Envía un correo al usuario con las instrucciones para restablecer su clave.' 
  })
  @ApiResponse({ status: 200, description: 'Si el correo existe, se enviarán las instrucciones.' })
  // Si tienes un decorador @Public(), úsalo aquí para saltar el JwtAuthGuard
  // @Public() 
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.credentialService.forgotPasswordService(dto);
  }

@Patch('reset-password-token')
@HttpCode(HttpStatus.OK)
@ApiOperation({ summary: 'Restablecer contraseña usando el token del correo | PÚBLICA' })
resetPassword(@Body() dto: { token: string, newPassword: string }) {
  return this.credentialService.resetPasswordWithTokenService(dto);
}

  /* =========================
     RUTAS ADMIN
  ========================== */

  @Get('all')
@ApiOperation({
  summary: 'Obtener todas las credenciales | ADMIN',
})
@ApiQuery({ name: 'email', required: false })
@HttpCode(HttpStatus.OK)
@RolesDecorator(Roles.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
getAllCredentials(@Query('email') email?: string) {
  if (email) {
    return this.credentialService.getCredentialByEmailService(email);
  }
  return this.credentialService.getAllCredentialsService();
}


  @Get(':uuid')
  @ApiOperation({
    summary: 'Obtener credencial por UUID | ADMIN',
  })
  @ApiParam({ name: 'uuid', type: 'string' })
  @HttpCode(HttpStatus.OK)
  @RolesDecorator(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getCredentialById(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.credentialService.getCredentialByIdService(uuid);
  }

  /* =========================
     RUTAS COMPARTIDAS
  ========================== */


  @Patch('change-password/:uuid')
  @ApiOperation({ summary: 'Cambiar contraseña | PROPIO' })
  @ApiBody({ type: ChangePasswordDto })
  @HttpCode(HttpStatus.OK)
  @RolesDecorator(Roles.ADMIN, Roles.USER, Roles.PROFESSIONAL)
  @UseGuards(JwtAuthGuard, RolesGuard)
  changePassword(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: ChangePasswordDto,
    @Req() req,
  ) {
    return this.credentialService.patchChangePasswordService(
      uuid,
      dto,
      req.user,
    );
  }

  @Delete('desactivate/:uuid')
  @ApiOperation({ summary: 'Desactivar cuenta | PROPIO o ADMIN' })
  @HttpCode(HttpStatus.OK)
  @RolesDecorator(Roles.ADMIN, Roles.USER, Roles.PROFESSIONAL)
  @UseGuards(JwtAuthGuard, RolesGuard)
  deleteCredential(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Req() req,
  ) {
    return this.credentialService.deleteCredentialService(uuid, req.user);
  }

  @Put('activate/:uuid')
  @ApiOperation({ summary: 'Activar cuenta | ADMIN' })
  @HttpCode(HttpStatus.OK)
  @RolesDecorator(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  activateCredential(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.credentialService.activateCredentialService(uuid);
  }

  @Put('change-role/:uuid')
  @ApiOperation({ summary: 'Cambiar rol | ADMIN' })
  @ApiBody({ type: ChangeRoleDto })
  @HttpCode(HttpStatus.OK)
  @RolesDecorator(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  changeRole(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: ChangeRoleDto,
  ) {
    return this.credentialService.putChangeUserRole(uuid, dto);
  }
}
