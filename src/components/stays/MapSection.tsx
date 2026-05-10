import { MapPin } from "lucide-react";

export default function MapSection({
  mapUrl,
  nearbyPlaces = [],
}: {
  mapUrl?: string;
  nearbyPlaces?: { name: string; distance: string }[];
}) {
  return (
    <section className="py-16">
      <p className="font-bricolage text-[11px] uppercase tracking-[0.14em] text-[#C07A5A] mb-3">
        Location
      </p>
      <h2 className="font-playfair text-3xl md:text-4xl text-[#16323C] mb-2">
        Where you&apos;ll be
      </h2>
      <p className="font-bricolage text-sm text-neutral-500 mb-10">
        Everything within easy reach
      </p>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {nearbyPlaces.length > 0 && (
          <div className="md:col-span-4 flex flex-col gap-4">
            {nearbyPlaces.map((place, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-[10px] bg-[#F7F2EA] flex items-center justify-center shrink-0">
                  <MapPin size={13} className="text-[#C07A5A]" />
                </div>
                <div>
                  <p className="font-bricolage text-[13.5px] font-medium text-[#16323C] leading-tight">
                    {place.name}
                  </p>
                  <p className="font-bricolage text-xs text-neutral-400 mt-0.5">
                    {place.distance}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={nearbyPlaces.length > 0 ? "md:col-span-8" : "md:col-span-12"}>
          <div className="w-full h-[380px] md:h-[460px] rounded-[20px] overflow-hidden shadow-sm border border-neutral-100">
            {mapUrl ? (
              <iframe
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="w-full h-full bg-[#F7F2EA] flex flex-col items-center justify-center gap-2">
                <MapPin size={20} className="text-neutral-300" />
                <p className="font-bricolage text-sm text-neutral-400">Map not available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
