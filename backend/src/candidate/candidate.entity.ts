import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum SeniorityLevel {
  JUNIOR = 'junior',
  SENIOR = 'senior',
}

@Entity('candidates')
export class Candidate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column({
    type: 'varchar',
    length: 10,
    default: SeniorityLevel.JUNIOR,
    enum: Object.values(SeniorityLevel),
  })
  seniority: SeniorityLevel;

  @Column('int')
  yearsOfExperience: number;

  @Column('boolean')
  availability: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
