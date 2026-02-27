import { Loader2 } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";

export default function Loading() {
  return (
    <main>
      <div className="flex h-[80px] items-center pl-[80px]">
        <h3 className="text-forloop-text-primary text-left">Pokémon Browser</h3>
      </div>
      <div className="box-border h-[70vh] w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-forloop-text-muted-foreground" />
          <p className="text-forloop-text-muted-foreground">
            Loading Pokémon details...
          </p>
        </div>
      </div>
    </main>
  );
}
