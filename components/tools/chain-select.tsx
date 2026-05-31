"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CHAINS } from "@/lib/tools/chains";

export function ChainSelect({
  value,
  onChange,
  disabled,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className={className ?? "h-11 w-full sm:w-44"} aria-label="Chain">
        <SelectValue placeholder="Chain" />
      </SelectTrigger>
      <SelectContent>
        {CHAINS.map((chain) => (
          <SelectItem key={chain.id} value={chain.id}>
            {chain.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
