import { Loader2 } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";

export default function Loading() {
  return (
    <main>
      <div className="flex h-61 w-full items-center">
        <nav>
          <h1 className="text-forloop-text-primary">Pokémon Browser</h1>
          <h2 className="text-forloop-text-muted-foreground text-center">
            Search and find Pokémon
          </h2>
        </nav>
      </div>

      <Separator className="bg-forloop-border my-0 h-px w-full"></Separator>

      <div className="box-border flex h-[50vh] w-full items-center justify-center px-35 pb-10">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-forloop-text-muted-foreground h-10 w-10 animate-spin" />
          <p className="text-forloop-text-muted-foreground">
            Loading Pokémon...
          </p>
        </div>
      </div>
    </main>
  );
}
