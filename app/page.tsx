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
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/pokeapi";
import { NamedAPIResource, Pokemon } from "pokenode-ts";

const ITEMS_PER_PAGE = 20;

export default function Home() {
  const [allPokemon, setAllPokemon] = useState<NamedAPIResource[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<NamedAPIResource[]>(
    [],
  );
  const [displayedDetails, setDisplayedDetails] = useState<Pokemon[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Initial load: Fetch the list of all pokemon (names and URLs)
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const response = await api.listPokemons(0, 10000); // There are approx 1302 right now
        setAllPokemon(response.results);
        setFilteredPokemon(response.results);
      } catch (error) {
        console.error("Error fetching full pokemon list:", error);
      }
    };
    fetchAll();
  }, []);

  // Filter list on search query change
  useEffect(() => {
    // Basic debounce using a small timeout is fine, but for local filtering it's usually fast enough to be immediate.
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim() === "") {
        setFilteredPokemon(allPokemon);
      } else {
        const lowerQuery = searchQuery.toLowerCase();
        setFilteredPokemon(
          allPokemon.filter((p) => p.name.includes(lowerQuery)),
        );
      }
      setCurrentPage(1); // Reset to first page on new search
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, allPokemon]);

  // Load detailed data for the currently visible slice of pokemon
  useEffect(() => {
    const fetchVisibleDetails = async () => {
      if (filteredPokemon.length === 0) {
        setDisplayedDetails([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const visibleSlice = filteredPokemon.slice(startIndex, endIndex);

      try {
        const detailedData = await Promise.all(
          visibleSlice.map((p) => api.getPokemonByName(p.name)),
        );
        setDisplayedDetails(detailedData);
      } catch (error) {
        console.error("Error fetching detailed pokemon data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVisibleDetails();
  }, [filteredPokemon, currentPage]);

  const totalPages = Math.ceil(filteredPokemon.length / ITEMS_PER_PAGE);

  return (
    <main>
      {/*Main header*/}
      <div className="flex h-61 w-full items-center">
        <nav>
          <h1 className="text-forloop-text-primary">Pokémon Browser</h1>
          <h2 className="text-forloop-text-muted-foreground text-center">
            Search and find Pokémon
          </h2>
        </nav>
      </div>

      <Separator className="bg-forloop-border my-0 h-px w-full"></Separator>

      <div className="box-border h-full w-full px-35 pb-10">
        <div className="flex w-full justify-between py-10">
          <h2 className="text-forloop-text-foreground">Explore Pokémon</h2>

          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              placeholder="Find Pokémon..."
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Loading State or Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="text-forloop-text-muted-foreground h-8 w-8 animate-spin" />
          </div>
        ) : displayedDetails.length === 0 ? (
          <div className="text-forloop-text-muted-foreground flex items-center justify-center py-20">
            No Pokémon found matching &quot;{searchQuery}&quot;
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-20">
            {displayedDetails.map((poke) => (
              <Link href={`/details?id=${poke.id}`} key={poke.id}>
                <Card className="grid size-fit grid-cols-1 duration-300 ease-in-out hover:shadow-xl">
                  <CardHeader className="bg-forloop-bg-secondary relative h-56 w-66.5 overflow-hidden rounded-t-[10px] p-0">
                    {poke.sprites.front_default ? (
                      <Image
                        className="rendering-pixelated object-contain p-4"
                        src={poke.sprites.front_default || ""}
                        fill
                        alt={`${poke.name} image`}
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
                          {poke.name}
                        </h3>
                      </CardTitle>
                      <CardDescription>
                        <h4 className="text-forloop-text-muted-foreground">
                          #{poke.id.toString().padStart(4, "0")}
                        </h4>
                      </CardDescription>
                    </CardContent>
                  </div>
                  <CardFooter>
                    <div className="flex gap-2">
                      {poke.types.slice(0, 2).map((t) => (
                        <Badge key={t.slot} className="capitalize">
                          {t.type.name}
                        </Badge>
                      ))}
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {!isLoading && filteredPokemon.length > 0 && (
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              variant="outline"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <span className="text-forloop-text-muted-foreground text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              variant="outline"
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <Separator className="bg-forloop-border my-0 h-px w-full"></Separator>

      <footer className="flex h-61 w-full items-center justify-center">
        <div>
          <h4 className="text-forloop-text-primary flex w-full py-10 text-center">
            Thank you for using Pokémon Browser!
          </h4>
        </div>
      </footer>
    </main>
  );
}
