import { Document } from 'mongoose';
import { Schema, SchemaFactory } from '@nestjs/mongoose'
import { Prop } from '@nestjs/mongoose/dist';

@Schema()
export class Pokemon extends Document{
    @Prop({
        unique: true,
        index: true
    })
    name: string;

    @Prop({
        unique: true,
        index: true
    })
    number: number;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);