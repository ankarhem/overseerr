import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  RelationCount,
} from 'typeorm';
import { Permission, hasPermission } from '../lib/permissions';
import { MediaRequest } from './MediaRequest';
import bcrypt from 'bcrypt';

@Entity()
export class User {
  public static filterMany(users: User[]): Partial<User>[] {
    return users.map((u) => u.filter());
  }

  static readonly filteredFields: string[] = ['plexToken', 'password'];

  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public email: string;

  @Column()
  public username: string;

  @Column({ nullable: true })
  public password?: string;

  @Column({ type: 'integer', default: 1 })
  public userType = 1;

  @Column({ nullable: true, select: false })
  public plexId?: number;

  @Column({ nullable: true, select: false })
  public plexToken?: string;

  @Column({ type: 'integer', default: 0 })
  public permissions = 0;

  @Column()
  public avatar: string;

  @RelationCount((user: User) => user.requests)
  public requestCount: number;

  @OneToMany(() => MediaRequest, (request) => request.requestedBy)
  public requests: MediaRequest[];

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(init?: Partial<User>) {
    Object.assign(this, init);
  }

  public filter(): Partial<User> {
    const filtered: Partial<User> = Object.assign(
      {},
      ...(Object.keys(this) as (keyof User)[])
        .filter((k) => !User.filteredFields.includes(k))
        .map((k) => ({ [k]: this[k] }))
    );

    return filtered;
  }

  public hasPermission(permissions: Permission | Permission[]): boolean {
    return !!hasPermission(permissions, this.permissions);
  }

  public passwordMatch(password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.password) {
        resolve(bcrypt.compare(password, this.password));
      } else {
        return reject(false);
      }
    });
  }
}
