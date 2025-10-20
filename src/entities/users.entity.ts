import { Column, Entity, PrimaryGeneratedColumn, OneToOne, OneToMany, JoinColumn, } from "typeorm";
import { Credential } from './credential.entity';
import { Pay } from './pay.entity';
import { Suscription } from './subscription.entity';

@Entity({name:'users'})
export class User {

@PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'bigint',
    unique: true,
  })
  phoneNumber: number;

  @Column({
    type: Date,
  })
  birthDate: Date;

  @Column({
    type: 'boolean',
    default: true,
    })
    isfemale: boolean;
  

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;
    credential_id: any;

   @OneToOne(() => Credential, (credential) => credential.user, { cascade: true })
  @JoinColumn({ name: 'credential_id' }) // nombre de la columna FK en BD
  credential: Credential;
    purchase: any;
    
    
    @OneToMany(() => Pay, (pay) => pay.user)
  pay: Pay[];
    

    @OneToMany(() => Suscription, (subscription) => subscription.user)
    subscription: Suscription[];

    

}