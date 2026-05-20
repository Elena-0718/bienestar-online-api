import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { CredentialRepository } from 'src/credentials/credential.repository';
import { LoginDto } from 'src/credentials/dtos/login.dto';
import { SignUpDto } from 'src/credentials/dtos/sign-up.dto';
import { UserRepository } from 'src/users/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly credentialRepository: CredentialRepository,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  /* ===============================
      REGISTRO DE USUARIO
  =============================== */
  async signUpService(signUpDto: SignUpDto) {
    const { createCredentialDto, createUserDto } = signUpDto;

    const credentialExists = await this.credentialRepository.getCredentialByEmailRepository(
      createCredentialDto.email,
    );

    if (credentialExists) {
      throw new ConflictException('Este correo ya se encuentra registrado.');
    }

    const hashedPassword = await bcrypt.hash(createCredentialDto.password, 10);

    const newCredential = await this.credentialRepository.postCreateCredentialRepository({
      email: createCredentialDto.email,
      password: hashedPassword,
    });

    const userExists = await this.userRepository.getUserByEmailRepository(
      createUserDto.email,
    );

    if (userExists) {
      throw new ConflictException('El usuario ya existe.');
    }

    const newUser = await this.userRepository.createUserRepository({
      fullName: createUserDto.fullName,
      document: createUserDto.document,
      birthDate: new Date(createUserDto.birthDate),
      sex: createUserDto.sex,
      phone: createUserDto.phone,
      address: createUserDto.address, 
      email: createUserDto.email,
      objective: createUserDto.objective,
      weight: createUserDto.weight,
      height: createUserDto.height,
      observations: createUserDto.observations,
      photoUrl: createUserDto.photoUrl,
      credential: newCredential,
    });

    const { password, ...credentialWithoutPassword } = newCredential;
    const { credential, ...userWithoutCredential } = newUser as any;

    return {
      message: 'Usuario registrado exitosamente.',
      credential: credentialWithoutPassword,
      profile: userWithoutCredential,
    };
  }

  /* ===============================
      LOGIN (CORREGIDO)
  =============================== */
  async signInService(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const credential = await this.credentialRepository.getCredentialByEmailRepository(email);

    if (!credential || !credential.isActive) {
      throw new UnauthorizedException('Credenciales incorrectas o cuenta inactiva.');
    }

    const isPasswordValid = await bcrypt.compare(password, credential.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales incorrectas.');
    }

    const payload = {
      sub: credential.user.uuid,
      email: credential.email,
      role: credential.role,
    };

    // ✅ CAMBIO CLAVE: Devolvemos 'token' en lugar de 'accessToken' 
    // para que coincida con lo que busca tu Frontend.
    return {
      message: 'Inicio de sesión exitoso.',
      token: this.jwtService.sign(payload), 
      user: {
        id: credential.user.uuid,
        name: credential.user.fullName,
        email: credential.email,
        address: credential.user.address, // Agregado para el Profile
        photoUrl: credential.user.photoUrl, // Agregado para el Navbar
        role: credential.role,
      }
    };
  }
}