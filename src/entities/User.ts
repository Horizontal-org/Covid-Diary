import {Entity, Column, PrimaryGeneratedColumn} from "typeorm/browser";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name!: string;

    @Column()
    celsius!: boolean;

}
