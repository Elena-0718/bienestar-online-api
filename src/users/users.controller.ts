import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/entities/users.entity';
import { CreateUserDto } from './Dtos/createUser.dto';
import { Roles } from 'src/enum/roles.enum';  
import { RolesDecorator } from 'src/decoratos/roles.decorator';
import { AuthGuard } from 'src/auth/Guards/auth.guard';
import { RolesGuard } from 'src/auth/Guards/roles.guard';
import { UpdateUserDto } from './Dtos/updateUser.dto';



@Controller('users')
export class UsersController {
  
    constructor(private readonly userService: UsersService) {}
//Ruta para obtener todos los usuarios 
 
   @Get('getAllUser')
@UseGuards(AuthGuard, RolesGuard)
@RolesDecorator(Roles.ADMIN)
getAllUser(@Query('name') name: string) {
  if (name) {
    return this.userService.getUserByNameService(name);
  }
  return this.userService.getAllUserService();
}

  // Ruta para obtener un usuario por su ID

  @Get("getUserById/:uuid")
  getUserById(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.userService.getUserByIdService(uuid);   
  }

// Ruta para crear un nuevo usuario

   @Post('createUser')
   postCreateUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.postCreateUserService(createUserDto);
  
  }
  // Ruta para actualizar un usuario

  @Put('updateUser')
  @UseGuards(AuthGuard)
  putUpdateUser(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.putUpdateUserService(updateUserDto);
  }
// Ruta para eliminar un usuario por su ID

@Delete('deleteUser/:uuid')
  @UseGuards(AuthGuard)
  deleteUser(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.userService.deleteUserService(uuid);
  }
}
