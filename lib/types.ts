export interface PokemonBaseData {
  id: number;
  name: string;
  image: string;
  types: string[];
}

export interface PokemonDetailedData extends PokemonBaseData {
  weight: number;
  height: number;
  abilityName?: string;
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}
