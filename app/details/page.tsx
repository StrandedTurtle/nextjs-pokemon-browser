"use client";

// Add Suspense import
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Keep other imports the same
import { Separator } from "@radix-ui/react-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft } from "lucide-react";

// Create a new component for the actual content
function PokemonDetailsContent() {
  // Interfaces remain the same
  interface Pokemon {
    name: string;
    id: number;
    image: string;
    types: string[];
    url: string;
    speciesUrl: string;
    height: number;
    weight: number;
    abilityName: string;
    abilityUrl: string;
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  }

  interface DetailedPokemon {
    category: string;
    dexinfo: string;
    abilityInfo: string;
    genderRate: number;
  }

  const [pokemonDetail, setDetailedPokemon] = useState<DetailedPokemon>();
  const searchParams = useSearchParams(); // Keep useSearchParams here
  const [pokemonData, setPokemonData] = useState<Pokemon | null>(null);

  // useEffect hooks remain the same
  useEffect(() => {
    const name = searchParams.get("name");
    const id = searchParams.get("id");
    const image = searchParams.get("image");
    const types = searchParams.getAll("types");
    const url = searchParams.get("url");
    const weight = searchParams.get("weight");
    const height = searchParams.get("height");
    const abilityName = searchParams.get("abilityName");
    const abilityUrl = searchParams.get("abilityUrl");
    const hp = searchParams.get("hp");
    const attack = searchParams.get("attack");
    const defense = searchParams.get("defense");
    const specialAttack = searchParams.get("specialAttack");
    const specialDefense = searchParams.get("specialDefense");
    const speed = searchParams.get("speed");

    if (
      name &&
      id &&
      image &&
      types &&
      url &&
      weight &&
      height &&
      abilityName &&
      abilityUrl &&
      hp &&
      attack &&
      defense &&
      specialAttack &&
      specialDefense &&
      speed
    ) {
      const pokemon: Pokemon = {
        name,
        id: parseInt(id),
        image,
        types: types,
        url,
        weight: parseInt(weight),
        height: parseInt(height),
        speciesUrl: url.replace("pokemon", "pokemon-species"),
        abilityName,
        abilityUrl,
        hp: parseInt(hp),
        attack: parseInt(attack),
        defense: parseInt(defense),
        specialAttack: parseInt(specialAttack),
        specialDefense: parseInt(specialDefense),
        speed: parseInt(speed),
      };
      setPokemonData(pokemon);
    }
  }, [searchParams]);

  useEffect(() => {
    if (pokemonData) {
      fetch(pokemonData.speciesUrl)
        .then((res) => res.json())
        .then((data) => {
          setDetailedPokemon({
            category: data.genera
              .find(
                (genus: { language: { name: string } }) =>
                  genus.language.name === "en"
              )
              .genus.replace(" Pokémon", ""),
            dexinfo:
              data.flavor_text_entries.find(
                (entry: {
                  language: { name: string };
                  version: { name: string };
                }) => entry.language.name === "en" && entry.version.name === "x"
              )?.flavor_text || "No description available.",
            abilityInfo: "", // Initialize abilityInfo
            genderRate: data.gender_rate,
          });
        });
      fetch(pokemonData.abilityUrl)
        .then((res) => res.json())
        .then((data) => {
          setDetailedPokemon((prev) => ({
            ...prev!,
            abilityInfo:
              data.flavor_text_entries.find(
                (entry: { language: { name: string } }) =>
                  entry.language.name === "en"
              )?.flavor_text || "No description available.",
          }));
        });
    }
  }, [pokemonData]);

  // gender determination logic remains the same
  const genderTypes =
    pokemonDetail?.genderRate === 0
      ? "Male Only"
      : pokemonDetail?.genderRate === 1
      ? "Male / Female"
      : pokemonDetail?.genderRate === 8
      ? "Female Only"
      : "No Gender";

  // JSX rendering logic remains the same
  return (
    <main>
      {/* ... rest of your JSX from the original component ... */}
      <div className="flex h-[80px] items-center pl-[80px]">
        <h3 className="text-forloop-text-primary text-left">Pokémon Browser</h3>
      </div>

      <div className="flex h-[380px] w-full ">
        <div className="w-full h-[168px] my-[0px] bg-forloop-bg-primary">
          <div className="grid grid-cols-1 w-full h-full mt-[130px]">
            <div className="flex h-full w-full items-end justify-center">
              <Avatar className="size-[208px] border-4 bg-forloop-bg-secondary">
                <AvatarImage
                  className="rendering-pixelated"
                  src={pokemonData?.image}
                  width={208}
                  height={208}
                  alt="Pokemon Avatar"
                />
                <AvatarFallback>PK</AvatarFallback>
              </Avatar>
            </div>

            <div className="flex h-full w-full items-end justify-center">
              <h2 className="text-forloop-text-primary pr-4 capitalize">
                {pokemonData?.name}
              </h2>
              <h2 className="text-forloop-text-muted-foreground">
                #{pokemonData?.id.toString().padStart(4, "0")}
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="box-border h-full w-full px-[140px] pb-[40px] pt-[40px]">
        <Card className="bg-forloop-border w-full h-full">
          <CardHeader className="justify-center">
            <div className="flex h-full w-full items-center justify-center">
              <Avatar className="size-[100px] border-1 bg-background">
                <AvatarImage
                  className="rendering-pixelated"
                  src="/static/cherishball.png"
                  width={100}
                  height={100}
                  alt="Pokeball"
                />
                <AvatarFallback>PB</AvatarFallback>
              </Avatar>
              <p className="pl-6">{pokemonDetail?.dexinfo}</p>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-3 grid-rows-2 gap-6 pt-14">
          <Card className="col-span-1 row-span-2 border-[1px] border-forloop-border w-full h-full">
            <CardHeader>
              <div>
                <CardTitle>
                  <h3 className="text-forloop-text-primary">Height</h3>
                </CardTitle>
                <CardDescription>
                  <p className="text-forloop-text-primary leading-10 pb-6">
                    {(pokemonData?.height ?? 0) / 10}m
                  </p>
                </CardDescription>
              </div>
              <div>
                <CardTitle>
                  <h3 className="text-forloop-text-primary">Category</h3>
                </CardTitle>
                <CardDescription>
                  <p className="text-forloop-text-primary leading-10 pb-6">
                    {pokemonDetail?.category}
                  </p>
                </CardDescription>
              </div>
              <div>
                <CardTitle>
                  <h3 className="text-forloop-text-primary">Weight</h3>
                </CardTitle>
                <CardDescription>
                  <p className="text-forloop-text-primary leading-10 pb-6">
                    {(pokemonData?.weight ?? 0) / 10}kg
                  </p>
                </CardDescription>
              </div>
              <div>
                <CardTitle>
                  <h3 className="text-forloop-text-primary">Gender</h3>
                </CardTitle>
                <CardDescription>
                  <p className="text-forloop-text-primary leading-10 pb-6">
                    {genderTypes}
                  </p>
                </CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card className="col-span-1 row-span-1 border-[1px] border-forloop-border w-full h-full">
            <CardHeader>
              <div>
                <CardTitle>
                  <h3 className="text-forloop-text-primary">Type</h3>
                </CardTitle>
                <div className="flex gap-[8px] pt-4">
                  <Badge className="capitalize">{pokemonData?.types[0]}</Badge>
                  {pokemonData?.types[1] && (
                    <Badge className="capitalize">
                      {pokemonData?.types[1]}
                    </Badge>
                  )}
                </div>
              </div>
              <div>
                <CardTitle>
                  <h3 className="text-forloop-text-primary pt-10">
                    Weaknesses
                  </h3>
                </CardTitle>
                <div className="flex gap-[8px] pt-4">
                  <Badge>Flying</Badge>
                  <Badge>Fire</Badge>
                  <Badge>Psychic</Badge>
                  <Badge>Ice</Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="col-span-1 row-span-1 border-[1px] border-forloop-border w-full h-full">
            <CardHeader>
              <div>
                <CardTitle>
                  <h3 className="text-forloop-text-primary">Ability</h3>
                </CardTitle>
                <CardDescription>
                  <div>
                    <p className="text-forloop-text-primary pt-4 capitalize">
                      {pokemonData?.abilityName}
                    </p>
                    <p className="italic">{pokemonDetail?.abilityInfo}</p>
                  </div>
                </CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card className="col-span-2 row-span-1 border-[1px] border-forloop-border w-full h-full">
            <CardHeader>
              <div className="grid grid-cols-2 grid-rows-6 justify-between gap-4">
                <h4 className="text-forloop-text-primary">HP</h4>
                <Progress
                  value={(pokemonData?.hp ?? 0) > 100 ? 100 : pokemonData?.hp}
                ></Progress>
                <h4 className="text-forloop-text-primary">Attack</h4>
                <Progress
                  value={
                    (pokemonData?.attack ?? 0) > 100 ? 100 : pokemonData?.attack
                  }
                ></Progress>
                <h4 className="text-forloop-text-primary">Defense</h4>
                <Progress
                  value={
                    (pokemonData?.defense ?? 0) > 100
                      ? 100
                      : pokemonData?.defense
                  }
                ></Progress>
                <h4 className="text-forloop-text-primary">Special Attack</h4>
                <Progress
                  value={
                    (pokemonData?.specialAttack ?? 0) > 100
                      ? 100
                      : pokemonData?.specialAttack
                  }
                ></Progress>
                <h4 className="text-forloop-text-primary">Special Defense</h4>
                <Progress
                  value={
                    (pokemonData?.specialDefense ?? 0) > 100
                      ? 100
                      : pokemonData?.specialDefense
                  }
                ></Progress>
                <h4 className="text-forloop-text-primary">Speed</h4>
                <Progress
                  value={
                    (pokemonData?.speed ?? 0) > 100 ? 100 : pokemonData?.speed
                  }
                ></Progress>
              </div>
            </CardHeader>
          </Card>
        </div>

        <Button asChild className="mt-10">
          <a href="/">
            <ChevronLeft></ChevronLeft>Return Home
          </a>
        </Button>
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

// Default export now wraps the content component in Suspense
export default function Home() {
  return (
    // Add a fallback UI, like a loading spinner or message
    <Suspense fallback={<div>Loading Pokémon details...</div>}>
      <PokemonDetailsContent />
    </Suspense>
  );
}
