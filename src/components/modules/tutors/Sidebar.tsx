"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RiSearchLine, RiFilter3Line, RiUserAddFill } from "@remixicon/react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const ratings = [
  { label: "5 Stars", value: "5" },
  { label: "4 Stars & Above", value: "4" },
  { label: "3 Stars & Above", value: "3" },
  { label: "2 Stars & Above", value: "2" },
  { label: "1 Star & Above", value: "1" },
];

function FindTutorSidebar({ categories }: { categories: any[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("categories")?.split(",") || []
  );
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [minRating, setMinRating] = useState(searchParams.get("minRating") || "");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = Array.isArray(categories) ? categories.filter((cat) =>
    cat?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const handleCategoryChange = (name: string) => {
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedCategories.length > 0) {
      params.set("categories", selectedCategories.join(","));
    } else {
      params.delete("categories");
    }

    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");

    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");

    if (minRating) params.set("minRating", minRating);
    else params.delete("minRating");

    params.set("page", "1"); // Reset to page 1 on filter change

    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAll = () => {
    setSelectedCategories([]);
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
    router.push(pathname);
  };

  return (
    <aside className="w-full lg:w-72 flex flex-col gap-6">
      <Card className="p-0 border-none shadow-sm ring-1 ring-border">
        <CardContent className="p-5 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <RiFilter3Line className="size-5 text-primary" />
              Filters
            </h3>
            <button
              onClick={clearAll}
              className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              CLEAR ALL
            </button>
          </div>

          {/* Subjects */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Subjects
            </label>
            <div className="relative">
              <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search subjects..."
                className="pl-9 h-10 bg-muted/30 border-none ring-1 ring-border focus-visible:ring-primary/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2.5 mt-1 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {filteredCategories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="peer appearance-none size-5 rounded border border-input checked:bg-primary checked:border-primary transition-all cursor-pointer"
                      checked={selectedCategories.includes(category.name)}
                      onChange={() => handleCategoryChange(category.name)}
                    />
                    <svg
                      className="absolute size-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                    {category.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <hr className="border-border/50" />

          {/* Price Range */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Price per hour
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                className="h-9 text-xs"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span className="text-muted-foreground">-</span>
              <Input
                type="number"
                placeholder="Max"
                className="h-9 text-xs"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          <hr className="border-border/50" />

          {/* Rating */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Rating
            </label>
            <div className="flex flex-col gap-2.5">
              {ratings.map((rating) => (
                <label
                  key={rating.value}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="rating"
                      className="peer appearance-none size-5 rounded-full border border-input checked:bg-primary checked:border-primary transition-all cursor-pointer"
                      checked={minRating === rating.value}
                      onChange={() => setMinRating(rating.value)}
                    />
                    <div className="absolute size-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                  <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                    {rating.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <Button
            onClick={applyFilters}
            className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 mt-2"
          >
            <RiFilter3Line className="size-4" />
            Apply Filters
          </Button>
        </CardContent>
      </Card>

      {/* Promo Card */}
      <Card className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900 shadow-none">
        <CardContent className="p-5 flex flex-col gap-4">
          <div className="space-y-1">
            <h4 className="font-bold text-emerald-900 dark:text-emerald-100">Want to teach?</h4>
            <p className="text-sm text-emerald-800/70 dark:text-emerald-200/70 leading-relaxed">
              Join our community as an expert tutor.
            </p>
          </div>
          {/* <Button variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg h-10">
            <RiUserAddFill className="size-5 mr-2" />
            Be a Tutor
          </Button> */}
          <Link href="/register?role=tutor" className="bg-emerald-600 flex items-center justify-center gap-2 hover:bg-emerald-700 text-white rounded-lg h-10">
            <RiUserAddFill className="size-4" />
            Be a Tutor
          </Link>

        </CardContent>
      </Card>
    </aside>
  );
}

export default FindTutorSidebar;
