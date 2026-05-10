"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RiSearchLine } from "@remixicon/react";

export const CategorySearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("searchTerm") || "");

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm) {
      params.set("searchTerm", searchTerm);
    } else {
      params.delete("searchTerm");
    }
    params.set("page", "1"); // Reset to page 1 on new search
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="max-w-2xl mx-auto mb-12">
      <div className="relative flex items-center gap-2 p-2 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-border group focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all duration-300">
        <RiSearchLine className="ml-3 size-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          type="text"
          placeholder="Search for a subject (e.g., Quantum Physics, UX Design)..."
          className="border-none bg-transparent focus-visible:ring-0 text-base h-12"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button 
          onClick={handleSearch}
          className="rounded-xl px-6 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
        >
          Search
        </Button>
      </div>
    </div>
  );
};
