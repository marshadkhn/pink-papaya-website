"use client";

import { cn } from "@/utils/utils";
import { ChevronDown } from "lucide-react";

type FilterBarProps = {
  categories: { id: string; name: string }[];
  locations: { id: string; name: string }[];
  selectedCategory: string;
  selectedLocation: string;
  selectedGuests: string;
  onCategoryChange: (category: string) => void;
  onLocationChange: (location: string) => void;
  onGuestsChange: (guests: string) => void;
  onClearFilters: () => void;
  className?: string;
};

function SelectField({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-[10px] uppercase tracking-[0.16em] font-bold text-neutral-400">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full appearance-none bg-white border border-neutral-200 rounded-xl",
            "px-4 py-3 text-[13.5px] text-neutral-800 font-bricolage font-medium",
            "focus:outline-none focus:ring-2 focus:ring-[#16323C]/15 focus:border-[#16323C]/40",
            "transition-all cursor-pointer",
            value && "border-[#16323C]/40 text-[#16323C]"
          )}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400 pointer-events-none" />
      </div>
    </div>
  );
}

export default function FilterBar({
  categories,
  locations,
  selectedCategory,
  selectedLocation,
  selectedGuests,
  onCategoryChange,
  onLocationChange,
  onGuestsChange,
  onClearFilters,
  className,
}: FilterBarProps) {
  const hasActiveFilters =
    selectedCategory !== "" || selectedLocation !== "" || selectedGuests !== "";

  return (
    <div className={cn("space-y-7", className)}>
      {/* Header */}
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-playfair font-semibold text-neutral-900">
          Filters
        </h2>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-[11px] font-semibold uppercase tracking-wider text-[#9A6648] hover:text-[#7a4f34] transition-colors font-bricolage"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-neutral-100" />

      {/* Filters */}
      <div className="space-y-5">
        <SelectField
          label="Category"
          value={selectedCategory}
          onChange={onCategoryChange}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </SelectField>

        <SelectField
          label="Location"
          value={selectedLocation}
          onChange={onLocationChange}
        >
          <option value="">All Locations</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name}
            </option>
          ))}
        </SelectField>

        <SelectField
          label="Guests"
          value={selectedGuests}
          onChange={onGuestsChange}
        >
          <option value="">Any Guests</option>
          <option value="1">1 Guest</option>
          <option value="2">2 Guests</option>
          <option value="3">3 Guests</option>
          <option value="4">4+ Guests</option>
        </SelectField>
      </div>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="pt-1 flex flex-wrap gap-2">
          {selectedCategory && (
            <button
              onClick={() => onCategoryChange("")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#16323C]/8 text-[#16323C] text-[10.5px] font-semibold uppercase tracking-wider font-bricolage hover:bg-[#16323C]/15 transition-colors"
            >
              {categories.find((c) => c.id === selectedCategory)?.name}
              <span className="text-[#16323C]/50 text-xs leading-none">×</span>
            </button>
          )}
          {selectedLocation && (
            <button
              onClick={() => onLocationChange("")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#16323C]/8 text-[#16323C] text-[10.5px] font-semibold uppercase tracking-wider font-bricolage hover:bg-[#16323C]/15 transition-colors"
            >
              {locations.find((l) => l.id === selectedLocation)?.name}
              <span className="text-[#16323C]/50 text-xs leading-none">×</span>
            </button>
          )}
          {selectedGuests && (
            <button
              onClick={() => onGuestsChange("")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#16323C]/8 text-[#16323C] text-[10.5px] font-semibold uppercase tracking-wider font-bricolage hover:bg-[#16323C]/15 transition-colors"
            >
              {selectedGuests}+ Guests
              <span className="text-[#16323C]/50 text-xs leading-none">×</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
