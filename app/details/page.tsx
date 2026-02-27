import React from "react";
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
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/pokeapi";

export default async function DetailsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const idStr = params.id as string;

  if (!idStr) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Pokémon ID provided</h2>
          <Button asChild>
            <Link href="/">
              <ChevronLeft className="mr-2" />
              Return Home
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  const id = parseInt(idStr, 10);

  // Fetch from PokéAPI using pokenode-ts
  const [pokemon, species] = await Promise.all([
    api.getPokemonById(id),
    api.getPokemonSpeciesById(id),
  ]);

  // Extract English specific text
  const englishGenus =
    species.genera
      .find((g) => g.language.name === "en")
      ?.genus?.replace(" Pokémon", "") || "Unknown Category";
  const englishFlavorText =
    species.flavor_text_entries
      .find((entry) => entry.language.name === "en")
      ?.flavor_text?.replace(/\f/g, " ") || "No description available.";

  // Fetch the first ability's text
  let abilityInfo = "No description available.";
  const firstAbility = pokemon.abilities.find((a) => !a.is_hidden)?.ability;
  if (firstAbility) {
    const abilityName = firstAbility.name;
    const abilityData = await api.getAbilityByName(abilityName);
    const englishAbilityText = abilityData.flavor_text_entries
      .find((entry) => entry.language.name === "en")
      ?.flavor_text?.replace(/\f/g, " ");
    if (englishAbilityText) abilityInfo = englishAbilityText;
  }

  // Gender logic
  const genderRate = species.gender_rate;
  const genderText =
    genderRate === -1
      ? "Unknown / Genderless"
      : genderRate === 0
        ? "Male Only"
        : genderRate === 8
          ? "Female Only"
          : "Male / Female";

  // Stat Mapping
  const getStat = (name: string) =>
    pokemon.stats.find((s) => s.stat.name === name)?.base_stat ?? 0;
  const hp = getStat("hp");
  const attack = getStat("attack");
  const defense = getStat("defense");
  const specialAttack = getStat("special-attack");
  const specialDefense = getStat("special-defense");
  const speed = getStat("speed");

  const imageUrl = pokemon.sprites.front_default || "";

  return (
    <main>
      <div className="flex h-[80px] items-center pl-[80px]">
        <h3 className="text-forloop-text-primary text-left">Pokémon Browser</h3>
      </div>

      <div className="flex h-[380px] w-full ">
        <div className="w-full h-[168px] my-[0px] bg-forloop-bg-primary">
          <div className="grid grid-cols-1 w-full h-full mt-[130px]">
            <div className="flex h-full w-full items-end justify-center">
              <Avatar className="size-[208px] border-4 bg-forloop-bg-secondary relative">
                {imageUrl ? (
                  <Image
                    className="rendering-pixelated object-contain transform scale-[0.65]"
                    src={imageUrl}
                    fill
                    alt={`${pokemon.name} Avatar`}
                  />
                ) : (
                  <AvatarFallback className="text-4xl">?</AvatarFallback>
                )}
              </Avatar>
            </div>

            <div className="flex h-full w-full items-end justify-center">
              <h2 className="text-forloop-text-primary pr-4 capitalize">
                {pokemon.name}
              </h2>
              <h2 className="text-forloop-text-muted-foreground">
                #{pokemon.id.toString().padStart(4, "0")}
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="box-border h-full w-full px-[140px] pb-[40px] pt-[40px]">
        <Card className="bg-forloop-border w-full h-full shadow-sm">
          <CardHeader className="justify-center">
            <div className="flex h-full w-full items-center justify-center">
              <Avatar className="size-[100px] border-1 bg-background">
                <AvatarImage
                  className="rendering-pixelated"
                  src="/static/cherishball.png"
                  alt="Pokeball"
                />
                <AvatarFallback>PB</AvatarFallback>
              </Avatar>
              <p className="pl-6 text-forloop-text-foreground">
                {englishFlavorText}
              </p>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-3 grid-rows-2 gap-6 pt-14">
          <Card className="col-span-1 row-span-2 border-[1px] border-forloop-border w-full h-full shadow-sm">
            <CardHeader className="space-y-6">
              <div>
                <CardTitle>
                  <h3 className="text-forloop-text-primary">Height</h3>
                </CardTitle>
                <CardDescription>
                  <span className="text-forloop-text-primary text-lg font-medium leading-10">
                    {pokemon.height / 10}m
                  </span>
                </CardDescription>
              </div>
              <div>
                <CardTitle>
                  <h3 className="text-forloop-text-primary">Category</h3>
                </CardTitle>
                <CardDescription>
                  <span className="text-forloop-text-primary text-lg font-medium leading-10">
                    {englishGenus}
                  </span>
                </CardDescription>
              </div>
              <div>
                <CardTitle>
                  <h3 className="text-forloop-text-primary">Weight</h3>
                </CardTitle>
                <CardDescription>
                  <span className="text-forloop-text-primary text-lg font-medium leading-10">
                    {pokemon.weight / 10}kg
                  </span>
                </CardDescription>
              </div>
              <div>
                <CardTitle>
                  <h3 className="text-forloop-text-primary">Gender</h3>
                </CardTitle>
                <CardDescription>
                  <span className="text-forloop-text-primary text-lg font-medium leading-10">
                    {genderText}
                  </span>
                </CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card className="col-span-1 row-span-1 border-[1px] border-forloop-border w-full h-full shadow-sm">
            <CardHeader>
              <div>
                <CardTitle>
                  <h3 className="text-forloop-text-primary">Type</h3>
                </CardTitle>
                <div className="flex gap-[8px] pt-4">
                  {pokemon.types.map((t) => (
                    <Badge
                      key={t.slot}
                      className="capitalize text-sm py-1 px-3"
                    >
                      {t.type.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="col-span-1 row-span-1 border-[1px] border-forloop-border w-full h-full shadow-sm">
            <CardHeader>
              <div>
                <CardTitle>
                  <h3 className="text-forloop-text-primary">Primary Ability</h3>
                </CardTitle>
                <CardDescription className="pt-4 space-y-2">
                  <span className="text-forloop-text-primary block font-medium capitalize text-lg">
                    {firstAbility?.name?.replace("-", " ") || "None"}
                  </span>
                  <p className="italic text-base">{abilityInfo}</p>
                </CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card className="col-span-2 row-span-1 border-[1px] border-forloop-border w-full h-full shadow-sm">
            <CardHeader>
              <div className="grid grid-cols-2 grid-rows-6 justify-between gap-x-8 gap-y-4 items-center">
                <h4 className="text-forloop-text-primary font-medium">HP</h4>
                <div className="flex items-center gap-4">
                  <Progress value={Math.min(hp, 100)} className="h-2" />
                  <span className="text-sm font-medium w-8">{hp}</span>
                </div>

                <h4 className="text-forloop-text-primary font-medium">
                  Attack
                </h4>
                <div className="flex items-center gap-4">
                  <Progress value={Math.min(attack, 100)} className="h-2" />
                  <span className="text-sm font-medium w-8">{attack}</span>
                </div>

                <h4 className="text-forloop-text-primary font-medium">
                  Defense
                </h4>
                <div className="flex items-center gap-4">
                  <Progress value={Math.min(defense, 100)} className="h-2" />
                  <span className="text-sm font-medium w-8">{defense}</span>
                </div>

                <h4 className="text-forloop-text-primary font-medium">
                  Special Attack
                </h4>
                <div className="flex items-center gap-4">
                  <Progress
                    value={Math.min(specialAttack, 100)}
                    className="h-2"
                  />
                  <span className="text-sm font-medium w-8">
                    {specialAttack}
                  </span>
                </div>

                <h4 className="text-forloop-text-primary font-medium">
                  Special Defense
                </h4>
                <div className="flex items-center gap-4">
                  <Progress
                    value={Math.min(specialDefense, 100)}
                    className="h-2"
                  />
                  <span className="text-sm font-medium w-8">
                    {specialDefense}
                  </span>
                </div>

                <h4 className="text-forloop-text-primary font-medium">Speed</h4>
                <div className="flex items-center gap-4">
                  <Progress value={Math.min(speed, 100)} className="h-2" />
                  <span className="text-sm font-medium w-8">{speed}</span>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        <Button asChild className="mt-10 mb-20" size="lg">
          <Link href="/">
            <ChevronLeft className="mr-2" />
            Return Home
          </Link>
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
