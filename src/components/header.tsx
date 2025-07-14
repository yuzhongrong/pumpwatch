import { Flame } from 'lucide-react';

export function Header() {
  return (
    <header className="mb-12">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <div className="grid place-content-center bg-primary/10 text-primary rounded-lg w-12 h-12">
            <Flame className="h-6 w-6" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground font-headline">Pump Watch</h1>
          <p className="text-muted-foreground mt-1">
            Your daily source for the latest token trends on Solana's pump.fun.
          </p>
        </div>
      </div>
    </header>
  );
}
