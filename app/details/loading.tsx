import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <main>
      <div className="flex h-20 items-center pl-20">
        <h3 className="text-forloop-text-primary text-left">Pokémon Browser</h3>
      </div>
      <div className="box-border flex h-[70vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-forloop-text-muted-foreground h-10 w-10 animate-spin" />
          <p className="text-forloop-text-muted-foreground">
            Loading Pokémon details...
          </p>
        </div>
      </div>
    </main>
  );
}
