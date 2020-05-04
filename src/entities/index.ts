import {Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne} from "typeorm/browser";

// USER ENTITY AND TYPES 
@Entity("user")
export class User {

    @PrimaryGeneratedColumn({ name: 'id', type: 'integer'})
    id?: number;

    @Column({ name: 'name', type: 'varchar', nullable: false })
    name!: string;

    @Column({ name: 'celsius', type: 'boolean', nullable: false })
    celsius!: boolean;

    @OneToMany(type => Symptom, symptom => symptom.user)
    symptoms?: Symptom[];
}


// SYMTOMS ENTITY AND TYPES 
export type symptomsTypes = 
    'cough' |
    'soreThroat' |
    'temperatureMorning' |
    'temperatureEvening' |
    'shortnessOfBreath' |
    'runnyNose' |
    'lossOfSmell' |
    'headache' |
    'abdominalPain' |
    'vomiting' |
    'bodyAches' |
    'diarrhea';

@Entity("Symptom")
export class Symptom {
    @PrimaryGeneratedColumn({ name: 'id', type: 'integer'})
    id?: number;

    @Column({ name: 'date', type: 'date', nullable: false})
    date!: Date

    @Column({ name: 'type', type: 'varchar', nullable: false})
    type!: string

    @Column({ name: 'value', type: 'integer', nullable: false})
    value!: number

    @ManyToOne(type => User, user => user.symptoms)
    user?: User;

}

@Entity("Configuration")
export class Configuration {
    @PrimaryGeneratedColumn({ name: 'id', type: 'integer'})
    id?: number;
    
    @Column({ name: 'showFirstScreen', type: 'boolean', default: true })
    showFirstScreen!: boolean;
}