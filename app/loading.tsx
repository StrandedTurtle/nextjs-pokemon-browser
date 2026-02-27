import { Loader2 } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";

export default function Loading() {
  return (
    <main>
      <div className="flex h-[244px] w-full items-center">
        <nav>
          <h1 className="text-forloop-text-primary">Pokémon Browser</h1>
          <h2 className="text-forloop-text-muted-foreground text-center">
            Search and find Pokémon
          </h2>
        </nav>
      </div>

      <Separator className="w-full h-[1px] my-[0px] bg-forloop-border"></Separator>

      <div className="box-border h-[50vh] w-full px-[140px] pb-[40px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-forloop-text-muted-foreground" />
          <p className="text-forloop-text-muted-foreground">
            Loading Pokémon...
          </p>
        </div>
      </div>
    </main>
  );
}
