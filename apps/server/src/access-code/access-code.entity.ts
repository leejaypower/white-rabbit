import { Entity, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class AccessCode {
  [OptionalProps]?: 'id' | 'terminalId' | 'isActive' | 'createdAt';

  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  code!: string;

  @Property({ nullable: true })
  terminalId: string | null = null;

  @Property({ default: true })
  isActive: boolean = true;

  @Property()
  createdAt: Date = new Date();
}
