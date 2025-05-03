/* eslint-disable @next/next/no-img-element */
"use client";

import { Separator } from "@radix-ui/react-separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  interface Pokemon {
    name: string;
    id: number;
    image: string;
    types: string[];
    url: string;
    weight: number;
    height: number;
    abilityName: string;
    abilityUrl: string;
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  }

  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [nextUrl, setNextUrl] = useState("");
  const [prevUrl, setPrevUrl] = useState("");

  const initialUrl = "https://pokeapi.co/api/v2/pokemon?limit=10&offset=0";

  useEffect(() => {
    fetchData(initialUrl);
  }, []);

  const fetchData = async (url: string) => {
    const response = await fetch(url);
    const data = await response.json();
    const detailedPokemon = data.results.map(
      async (pokemon: { url: string }) => {
        const pokeResponse = await fetch(pokemon.url);
        const pokeData = await pokeResponse.json();
        return {
          name: pokeData.name,
          id: pokeData.id,
          image: pokeData.sprites.front_default,
          types: pokeData.types.map(
            (type: { type: { name: any } }) => type.type.name
          ),
          url: pokemon.url,
          weight: pokeData.weight,
          height: pokeData.height,
          abilityName: pokeData.abilities.find(
            (ability: { is_hidden: boolean; ability: { name: string } }) =>
              !ability.is_hidden
          )?.ability.name,
          abilityUrl: pokeData.abilities.find(
            (ability: { is_hidden: boolean; ability: { url: string } }) =>
              !ability.is_hidden
          )?.ability.url,
          hp: pokeData.stats[0].base_stat,
          attack: pokeData.stats[1].base_stat,
          defense: pokeData.stats[2].base_stat,
          specialAttack: pokeData.stats[3].base_stat,
          specialDefense: pokeData.stats[4].base_stat,
          speed: pokeData.stats[5].base_stat,
        };
      }
    );

    const detailedPokemonData = await Promise.all(detailedPokemon);
    setPokemon(detailedPokemonData);
    setNextUrl(data.next);
    setPrevUrl(data.previous);
  };

  return (
    <main>
      {/*Main header*/}
      <div className="flex h-[244px] w-full items-center">
        <nav>
          <h1 className="text-forloop-text-primary">Pokémon Browser</h1>
          <h2 className="text-forloop-text-muted-foreground text-center">
            Search and find Pokémon
          </h2>
        </nav>
      </div>

      <Separator className="w-full h-[1px] my-[0px] bg-forloop-border"></Separator>

      <div className="box-border h-full w-full px-[140px] pb-[40px]">
        <div className="flex w-full justify-between py-[40px]">
          <h2 className="text-forloop-text-foreground">Explore Pokémon</h2>

          <div className=" flex w-full max-w-sm items-center space-x-2">
            <Input type="text" placeholder="Find Pokémon" id="search" />
            <Button type="submit" id="searchBtn">
              Search
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-[20px] gap-y-[40px] md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-[80px]">
          {" "}
          {/*Grid for cards*/}
          {/*make cards with retrieved pokemon data*/}
          {pokemon.map((poke) => (
            <Link
              href={{
                pathname: "/details",
                query: {
                  name: poke.name,
                  id: poke.id,
                  image: poke.image,
                  types: poke.types,
                  url: poke.url,
                  weight: poke.weight,
                  height: poke.height,
                  abilityName: poke.abilityName,
                  abilityUrl: poke.abilityUrl,
                  hp: poke.hp,
                  attack: poke.attack,
                  defense: poke.defense,
                  specialAttack: poke.specialAttack,
                  specialDefense: poke.specialDefense,
                  speed: poke.speed,
                },
              }}
              key={poke.id}
            >
              {/*Send data to details page*/}
              <Card className="grid grid-cols-1 size-fit ease-in-out duration-300 hover:shadow-xl">
                <CardHeader className="p-0 max-h-[224px] max-w-[264]">
                  <img
                    className="bg-forloop-bg-secondary w-full h-full object-cover rounded-t-[10px] rendering-pixelated"
                    src={poke?.image}
                    width={266}
                    height={224}
                    alt="Pokemon Image"
                  />
                </CardHeader>
                <div className="flex h-[103px] w-[266px] py-[24px]">
                  <CardContent className="h-full w-full">
                    <CardTitle>
                      <h3 className="text-forloop-text-foreground capitalize">
                        {poke?.name}
                      </h3>
                    </CardTitle>
                    <CardDescription>
                      <h4 className="text-forloop-text-muted-foreground">
                        #{poke?.id.toString().padStart(4, "0")}
                      </h4>
                    </CardDescription>
                  </CardContent>
                </div>
                <CardFooter>
                  <div className="flex gap-[8px]">
                    <Badge className="capitalize">{poke?.types[0]}</Badge>
                    {poke?.types[1] && (
                      <Badge className="capitalize">{poke?.types[1]}</Badge>
                    )}{" "}
                    {/*This is to only render second type if one exists. can do this way as every pokemon has one or two types*/}
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>

        {/*The preventDefault stops the button from refreshing page when on first page, also stops scroll back to top of page*/}

        <div className="flex justify-center gap-4 mt-10">
          <Button asChild>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (prevUrl) fetchData(prevUrl);
              }}
            >
              <ChevronLeft />
              Back
            </a>
          </Button>
          <Button asChild>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (nextUrl) fetchData(nextUrl);
              }}
            >
              Next
              <ChevronRight />
            </a>
          </Button>
        </div>
      </div>

      <Separator className="w-full h-[1px] my-[0px] bg-forloop-border"></Separator>

      <footer className="flex h-[244px] w-full items-center justify-center">
        <div>
          <h4 className="flex text-forloop-text-primary w-full py-10 text-center">
            Thank you for using Pokémon Browser!
          </h4>
        </div>
      </footer>
    </main>
  );
}
