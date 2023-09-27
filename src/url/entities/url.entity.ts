import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Url {
  constructor(target: string) {
    this.target = target;
  }

  @PrimaryColumn()
  id: string;

  @Column({ unique: true, update: false })
  target: string;

  @Column({ default: 0 })
  timesVisited: number;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @BeforeInsert()
  populateMetadata() {
    this.id = String(Math.random()).substring(2);
  }
}
