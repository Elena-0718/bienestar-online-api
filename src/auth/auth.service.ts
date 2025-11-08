import { CredentialRepository } from "src/credential/credential.repository";
import { LoginUserDto } from 'src/users/Dtos/loginUser.dto';
import * as bcrypt from 'bcrypt';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "src/users/Dtos/createUser.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(private readonly credencialRepository: CredentialRepository,
        private readonly jwtService: JwtService,
    ) {}
    
async SingInService(loginUserDto: LoginUserDto) {
        const credentialExisting = await this.credencialRepository.getCredentialByUsername(loginUserDto.userName,);
        if (!credentialExisting) {
            throw new NotFoundException("Credenciales invalidadas   ")
    }
    const validatePassword = await bcrypt.compare(loginUserDto.password, credentialExisting.password);
    if (!validatePassword) {
         throw new NotFoundException("Credenciales invalidadas   ")
  }
  if (credentialExisting.user.isActive === false) {
      throw new ConflictException(
        'El usuario esta inactivo comuniquese con el administrador',
      );
    }
const payload = {
      id: credentialExisting.user.uuid,
      role: credentialExisting.roles,
      username: credentialExisting.userName,
    };

    const token = this.jwtService.sign(payload);

    return {
      message: 'Inicio de sesion exitoso',
      token,
    };
  }

async RegistrarUsuarioService(createUserDto: CreateUserDto) {
    // Verificar si ya existe el usuario
    const userExisting = await this.credencialRepository.getCredentialByUsername(
      createUserDto.userName,
    );

    if (userExisting) {
      throw new BadRequestException('El usuario ya existe');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    
    const newUser = await this.credencialRepository.createCredential({
      ...createUserDto,
      password: hashedPassword,
      roles: createUserDto.roles || 'user',
    });

    return {
      message: 'Usuario registrado exitosamente',
      user: {
        userName: newUser.userName,
        hashedPassword: newUser.password,
        role: newUser.roles,
      },
    };
  }
}

