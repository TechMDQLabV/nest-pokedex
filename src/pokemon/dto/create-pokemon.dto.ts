import { IsInt, IsPositive, IsString, Min, MinLength } from "class-validator";

export class CreatePokemonDto {
    @IsString()
    @MinLength(1)
    name: string;

    @IsPositive()
    @IsInt()
    @Min(1)
    readonly number: number;
}
