import { Injectable } from '@nestjs/common';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common/exceptions';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ){}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try{
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    }catch(error){
      this.handleExceptions(error);
    }
  }

  findAll() {
    return this.pokemonModel.find();
  }

  async findOne(toSearch: string) {
    let pokemon: Pokemon;
    if( !isNaN(+toSearch)){
      pokemon = await this.pokemonModel.findOne({number: toSearch});
    }else if(isValidObjectId(toSearch)){
      pokemon = await this.pokemonModel.findById(toSearch);
    }else{
      pokemon = await this.pokemonModel.findOne({name: toSearch.toLowerCase().trim()});
    }

    if(!pokemon){
      throw new NotFoundException(`Pokemon with id, name or number ${toSearch} not found`);
    }
    return pokemon;
  }

  async update(toSearch: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(toSearch);
    if(updatePokemonDto.name){
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }
    try{
      await pokemon.updateOne(updatePokemonDto, {new: true});
    }catch(error){
      this.handleExceptions(error);
    }
    
    return {...pokemon.toJSON(), ...updatePokemonDto};
  }

  async remove(id: string) {
    //const result = await this.pokemonModel.findByIdAndDelete(id);
    const {deletedCount} = await this.pokemonModel.deleteOne({_id:id});
    if(deletedCount === 0){
      throw new BadRequestException(`Pokemon with id "${id}" not found`);
    }
    return ;
  }

  private handleExceptions(error:any){
    if(error.code === 11000){
      throw new BadRequestException(`Pokemon exists in db ${JSON.stringify(error.keyValue)}`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`);
  }
}
