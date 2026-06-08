import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';


@Entity('users')      //имя таблицы
export class User {
  @PrimaryGeneratedColumn()   //указывает чо поле id - первичный ключ
  id: number;

  @Column({ name: 'full_name' })  //имя
  fullName: string;

  @Column()               //почта
  email: string;

  @Column()      //телефон
  phone: string;

  @Column({ name: 'city_id' })    //id города
  cityId: number;

  @Column({ name: 'registration_date', type: 'date', default: () => 'GETDATE()' })
  registrationDate: Date;
}

