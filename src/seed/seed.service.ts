import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
  ){}

  async executeSeed() {
    await this.pokemonModel.deleteMany();
    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=1000');
    const pokemonToInsert: {name: string, number: number}[] = [];
    data.results.forEach(async({name, url}) => {
      const segments = url.split('/');
      const number = +segments[segments.length-2];

      pokemonToInsert.push({name, number});
    });

    await this.pokemonModel.insertMany(pokemonToInsert);
    return 'Seed executed';
  }

  async executeSeed1() {
    await this.pokemonModel.deleteMany();
    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=1000');
    const insertPromisesArray = [];
    data.results.forEach(async({name, url}) => {
      const segments = url.split('/');
      const number = +segments[segments.length-2];

      insertPromisesArray.push(this.pokemonModel.create({name, number}));
    });

    await Promise.all(insertPromisesArray);
    return 'Seed executed';
  }

  async executeSeed2() {
    await this.pokemonModel.deleteMany();
    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=1000');
    data.results.forEach(async({name, url}) => {
      const segments = url.split('/');
      const number = +segments[segments.length-2];

      const pokemon = await this.pokemonModel.create({name, number});
    });

    return 'Seed executed';
  }
}
