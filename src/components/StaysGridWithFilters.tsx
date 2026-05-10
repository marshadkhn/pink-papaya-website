"use client";

import { useMemo, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import StayCard from "./StayCard";
import FilterBar from "./FilterBar";
import { stayCategories } from "@/data/stays";

type Stay = {
  id: string;
  title: string;
  imageUrl: string;
  area: string;
  bed: string;
  guests: string;
  category?: string;
  description?: string;
  pricePerNight?: string;
  images?: string[];
  amenities?: string[];
  location?: string;
};

type Location = {
  id: string;
  name: string;
  stayIds: string[];
};

type StaysGridWithFiltersProps = {
  stays: Stay[];
  locations: Location[];
};

export default function StaysGridWithFilters({ stays, locations }: StaysGridWithFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get("category") || "";
  const selectedLocation = searchParams.get("location") || "";
  const selectedGuests = searchParams.get("guests") || "";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (name: string, value: string) => {
    router.push(`${pathname}?${createQueryString(name, value)}`, { scroll: false });
  };

  const handleClearFilters = () => {
    router.push(pathname, { scroll: false });
  };

  const filteredStays = useMemo(() => {
    let filtered = [...stays];

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((stay) => stay.category === selectedCategory);
    }

    // Filter by guests (minimum required)
    if (selectedGuests) {
      const minGuests = parseInt(selectedGuests, 10);
      filtered = filtered.filter((stay) => {
        const stayGuestsMatch = (stay.guests || "").match(/\d+/);
        const stayGuests = stayGuestsMatch ? parseInt(stayGuestsMatch[0], 10) : 0;
        return stayGuests >= minGuests;
      });
    }

    // Filter by location
    if (selectedLocation) {
      const locationData = locations.find((loc) => loc.id === selectedLocation);
      if (locationData) {
        filtered = filtered.filter((stay) => locationData.stayIds.includes(stay.id));
      }
    }

    return filtered;
  }, [stays, locations, selectedCategory, selectedLocation, selectedGuests]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
      <aside className="lg:col-span-1">
        <div className="sticky top-24">
          <FilterBar
            categories={stayCategories}
            locations={locations}
            selectedCategory={selectedCategory}
            selectedLocation={selectedLocation}
            selectedGuests={selectedGuests}
            onCategoryChange={(val) => handleFilterChange("category", val)}
            onLocationChange={(val) => handleFilterChange("location", val)}
            onGuestsChange={(val) => handleFilterChange("guests", val)}
            onClearFilters={handleClearFilters}
          />
        </div>
      </aside>

      <div className="lg:col-span-3">
        {/* Results summary */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-sm font-medium text-neutral-500 uppercase tracking-widest">
            Showing {filteredStays.length} {filteredStays.length === 1 ? "stay" : "stays"}
          </div>
        </div>

        {/* Stays grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredStays.length > 0 ? (
            filteredStays.map((s) => (
              <StayCard
                key={s.id}
                title={s.title}
                imageUrl={s.imageUrl}
                images={s.images}
                area={s.area}
                bed={s.bed}
                guests={s.guests}
                href={`/stays/${s.id}`}
                pricePerNight={s.pricePerNight}
                location={s.location}
                amenities={s.amenities}
              />
            ))
          ) : (
            <div className="col-span-full bg-neutral-50 rounded-2xl border-2 border-dashed border-neutral-200 py-20 text-center">
              <div className="max-w-xs mx-auto">
                <p className="text-lg font-playfair font-medium text-neutral-900 mb-2">No stays match your criteria</p>
                <p className="text-sm text-neutral-500 mb-6">Try adjusting your filters to find your perfect stay.</p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-2 bg-neutral-900 text-white rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
