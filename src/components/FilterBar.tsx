"use client";

import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/utils/utils";

type PropertyType = { id: string; name: string };
type Location = { id: string; name: string };
type Collection = { id: string; name: string };

type FilterBarProps = {
  propertyTypes: PropertyType[];
  locations: Location[];
  collections: Collection[];
  selectedPropertyType: string;
  selectedBedrooms: number;
  selectedLocations: string[];
  selectedCollections: string[];
  onPropertyTypeChange: (id: string) => void;
  onBedroomsChange: (val: number) => void;
  onLocationsChange: (ids: string[]) => void;
  onCollectionsChange: (ids: string[]) => void;
  onClearFilters: () => void;
  className?: string;
};

function Divider() {
  return <div className="h-px bg-neutral-200" />;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400 font-bricolage mb-3">
      {children}
    </p>
  );
}

export default function FilterBar({
  propertyTypes,
  locations,
  collections,
  selectedPropertyType,
  selectedBedrooms,
  selectedLocations,
  selectedCollections,
  onPropertyTypeChange,
  onBedroomsChange,
  onLocationsChange,
  onCollectionsChange,
  onClearFilters,
  className,
}: FilterBarProps) {
  const hasActive =
    (selectedPropertyType && selectedPropertyType !== "all-homes") ||
    selectedBedrooms > 1 ||
    selectedLocations.length > 0 ||
    selectedCollections.length > 0;

  function toggleLocation(id: string) {
    onLocationsChange(
      selectedLocations.includes(id)
        ? selectedLocations.filter((l) => l !== id)
        : [...selectedLocations, id]
    );
  }

  function toggleCollection(id: string) {
    onCollectionsChange(
      selectedCollections.includes(id)
        ? selectedCollections.filter((c) => c !== id)
        : [...selectedCollections, id]
    );
  }

  return (
    <div className={cn("bg-white", className)}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-neutral-700" strokeWidth={2} />
          <span className="font-semibold text-[15px] text-neutral-900 font-bricolage">Filters</span>
        </div>
        {hasActive && (
          <button
            onClick={onClearFilters}
            className="text-[11px] font-semibold uppercase tracking-wider text-[#9A6648] hover:text-[#7a4f34] transition-colors font-bricolage"
          >
            Clear all
          </button>
        )}
      </div>

      <Divider />

      {/* Property Type */}
      <div className="py-5">
        <SectionLabel>Property Type</SectionLabel>
        <div className="space-y-2.5">
          {propertyTypes.map((pt) => {
            const active = selectedPropertyType === pt.id || (!selectedPropertyType && pt.id === "all-homes");
            return (
              <label
                key={pt.id}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <span
                  className={cn(
                    "flex-shrink-0 w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-colors",
                    active
                      ? "border-neutral-900 bg-neutral-900"
                      : "border-neutral-300 bg-white group-hover:border-neutral-500"
                  )}
                >
                  {active && <span className="w-[6px] h-[6px] rounded-full bg-white" />}
                </span>
                <input
                  type="radio"
                  name="propertyType"
                  value={pt.id}
                  checked={active}
                  onChange={() => onPropertyTypeChange(pt.id === "all-homes" ? "" : pt.id)}
                  className="sr-only"
                />
                <span className={cn("text-[13.5px] font-bricolage", active ? "text-neutral-900 font-medium" : "text-neutral-600")}>
                  {pt.name}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <Divider />

      {/* Number of Bedrooms */}
      <div className="py-5">
        <SectionLabel>Number of Bedrooms</SectionLabel>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onBedroomsChange(Math.max(1, selectedBedrooms - 1))}
            className="w-7 h-7 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-neutral-500 hover:text-neutral-900 transition-colors text-base leading-none"
            aria-label="Decrease bedrooms"
          >
            −
          </button>
          <span className="text-[15px] font-medium text-neutral-900 font-bricolage w-4 text-center">
            {selectedBedrooms}
          </span>
          <button
            onClick={() => onBedroomsChange(selectedBedrooms + 1)}
            className="w-7 h-7 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-neutral-500 hover:text-neutral-900 transition-colors text-base leading-none"
            aria-label="Increase bedrooms"
          >
            +
          </button>
        </div>
      </div>

      <Divider />

      {/* Goa Locations */}
      {locations.length > 0 && (
        <>
          <div className="py-5">
            <SectionLabel>Goa Locations</SectionLabel>
            <div className="space-y-2.5">
              {locations.map((loc) => {
                const checked = selectedLocations.includes(loc.id);
                return (
                  <label key={loc.id} className="flex items-center gap-2.5 cursor-pointer group">
                    <span
                      className={cn(
                        "flex-shrink-0 w-[16px] h-[16px] rounded-sm border-2 flex items-center justify-center transition-colors",
                        checked
                          ? "border-neutral-900 bg-neutral-900"
                          : "border-neutral-300 bg-white group-hover:border-neutral-500"
                      )}
                    >
                      {checked && (
                        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                          <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleLocation(loc.id)}
                      className="sr-only"
                    />
                    <span className={cn("text-[13.5px] font-bricolage", checked ? "text-neutral-900 font-medium" : "text-neutral-600")}>
                      {loc.name}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
          <Divider />
        </>
      )}

      {/* Collections */}
      {collections.length > 0 && (
        <div className="py-5">
          <SectionLabel>Collections</SectionLabel>
          <div className="space-y-2.5">
            {collections.map((col) => {
              const checked = selectedCollections.includes(col.id);
              return (
                <label key={col.id} className="flex items-center gap-2.5 cursor-pointer group">
                  <span
                    className={cn(
                      "flex-shrink-0 w-[16px] h-[16px] rounded-sm border-2 flex items-center justify-center transition-colors",
                      checked
                        ? "border-neutral-900 bg-neutral-900"
                        : "border-neutral-300 bg-white group-hover:border-neutral-500"
                    )}
                  >
                    {checked && (
                      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                        <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleCollection(col.id)}
                    className="sr-only"
                  />
                  <span className={cn("text-[13.5px] font-bricolage", checked ? "text-neutral-900 font-medium" : "text-neutral-600")}>
                    {col.name}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
