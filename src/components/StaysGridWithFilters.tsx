"use client";

import { useMemo, useCallback, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import StayCard from "./StayCard";
import FilterBar from "./FilterBar";

type Stay = {
  id: string;
  title: string;
  imageUrl: string;
  area: string;
  bed: string;
  guests: string;
  category?: string;
  categories?: string[];
  propertyType?: string;
  description?: string;
  pricePerNight?: string;
  images?: string[];
  amenities?: string[];
  location?: string;
};

type Location = { id: string; name: string; stayIds: string[] };
type PropertyType = { id: string; name: string };
type Collection = { id: string; name: string };

type Props = {
  stays: Stay[];
  locations: Location[];
  propertyTypes: PropertyType[];
  collections: Collection[];
};

function parseBedrooms(bed: string): number {
  const m = bed.match(/\d+/);
  return m ? parseInt(m[0], 10) : 1;
}

export default function StaysGridWithFilters({ stays, locations, propertyTypes, collections }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const selectedPropertyType = searchParams.get("type") || "";
  const selectedBedrooms = parseInt(searchParams.get("bedrooms") || "1", 10);
  const locsParam = searchParams.get("locs") || "";
  const colsParam = searchParams.get("cols") || "";
  const selectedLocations = useMemo(
    () => (locsParam ? locsParam.split(",").filter(Boolean) : []),
    [locsParam]
  );
  const selectedCollections = useMemo(
    () => (colsParam ? colsParam.split(",").filter(Boolean) : []),
    [colsParam]
  );

  const updateParam = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(updates)) {
        if (v) params.set(k, v);
        else params.delete(k);
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  const handlePropertyType = (id: string) => {
    updateParam({ type: id });
    setMobileFiltersOpen(false);
  };

  const handleBedrooms = (val: number) => {
    updateParam({ bedrooms: val > 1 ? String(val) : "" });
  };

  const handleLocations = (ids: string[]) => {
    updateParam({ locs: ids.join(",") });
  };

  const handleCollections = (ids: string[]) => {
    updateParam({ cols: ids.join(",") });
  };

  const handleClearFilters = () => {
    router.push(pathname, { scroll: false });
    setMobileFiltersOpen(false);
  };

  const filteredStays = useMemo(() => {
    let filtered = [...stays];

    if (selectedPropertyType && selectedPropertyType !== "all-homes") {
      filtered = filtered.filter((s) => s.propertyType === selectedPropertyType);
    }

    if (selectedBedrooms > 1) {
      filtered = filtered.filter((s) => parseBedrooms(s.bed) >= selectedBedrooms);
    }

    if (selectedLocations.length > 0) {
      filtered = filtered.filter((s) => {
        return selectedLocations.some((locId) => {
          const loc = locations.find((l) => l.id === locId);
          return loc?.stayIds.includes(s.id);
        });
      });
    }

    if (selectedCollections.length > 0) {
      filtered = filtered.filter((s) => {
        const cats = s.categories?.length ? s.categories : s.category ? [s.category] : [];
        return cats.some((c) => selectedCollections.includes(c));
      });
    }

    return filtered;
  }, [stays, selectedPropertyType, selectedBedrooms, selectedLocations, selectedCollections, locations]);

  const activeFilterCount = [
    selectedPropertyType && selectedPropertyType !== "all-homes",
    selectedBedrooms > 1,
    selectedLocations.length > 0,
    selectedCollections.length > 0,
  ].filter(Boolean).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
      {/* Mobile filter toggle */}
      <div className="lg:hidden flex items-center justify-between">
        <button
          onClick={() => setMobileFiltersOpen((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-200 text-sm font-medium text-neutral-700 hover:border-[#16323C]/40 hover:text-[#16323C] transition-all duration-200 active:scale-[0.97]"
        >
          {mobileFiltersOpen ? <X size={15} /> : <SlidersHorizontal size={15} />}
          {mobileFiltersOpen ? "Close Filters" : "Filters"}
          {activeFilterCount > 0 && (
            <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#16323C] text-white text-[9px] font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
        <p className="text-sm text-neutral-500">
          {filteredStays.length} {filteredStays.length === 1 ? "stay" : "stays"}
        </p>
      </div>

      <aside className={`lg:col-span-1 ${mobileFiltersOpen ? "block" : "hidden"} lg:block`}>
        <div className="sticky top-24">
          <FilterBar
            propertyTypes={propertyTypes}
            locations={locations}
            collections={collections}
            selectedPropertyType={selectedPropertyType}
            selectedBedrooms={selectedBedrooms}
            selectedLocations={selectedLocations}
            selectedCollections={selectedCollections}
            onPropertyTypeChange={handlePropertyType}
            onBedroomsChange={handleBedrooms}
            onLocationsChange={handleLocations}
            onCollectionsChange={handleCollections}
            onClearFilters={handleClearFilters}
          />
        </div>
      </aside>

      <div className="lg:col-span-3">
        <div className="hidden lg:flex items-center justify-between mb-8">
          <div className="text-sm font-medium text-neutral-500 uppercase tracking-widest">
            Showing {filteredStays.length} {filteredStays.length === 1 ? "stay" : "stays"}
          </div>
        </div>

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
