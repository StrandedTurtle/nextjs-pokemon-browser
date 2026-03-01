"use client";

import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Pokemon } from "pokenode-ts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PokemonCardProps {
  pokemon: Pokemon;
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  return (
    <Link href={`/details?id=${pokemon.id}`}>
      <Card className="grid size-fit grid-cols-1 duration-300 ease-in-out hover:shadow-xl">
        <CardHeader className="bg-forloop-bg-secondary relative h-56 w-66.5 overflow-hidden rounded-t-[10px] p-0">
          {pokemon.sprites.front_default ? (
            <Image
              className="rendering-pixelated object-contain p-4"
              src={pokemon.sprites.front_default}
              fill
              alt={`${pokemon.name} image`}
            />
          ) : (
            <div className="text-forloop-text-muted-foreground flex h-full w-full items-center justify-center text-sm">
              No Image
            </div>
          )}
        </CardHeader>
        <div className="flex h-25.75 w-66.5 py-6">
          <CardContent className="h-full w-full">
            <CardTitle>
              <h3 className="text-forloop-text-foreground truncate capitalize">
                {pokemon.name}
              </h3>
            </CardTitle>
            <CardDescription>
              <h4 className="text-forloop-text-muted-foreground">
                #{pokemon.id.toString().padStart(4, "0")}
              </h4>
            </CardDescription>
          </CardContent>
        </div>
        <CardFooter>
          <div className="flex gap-2">
            {pokemon.types.slice(0, 2).map((t) => (
              <Badge key={t.slot} className="capitalize">
                {t.type.name}
              </Badge>
            ))}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
