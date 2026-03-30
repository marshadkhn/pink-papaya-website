import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/utils/utils";
import { Star } from "lucide-react";

export type Feedback = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
};

export default function FeedbackCard({
  feedback,
  className,
}: {
  feedback: Feedback;
  className?: string;
}) {
  const stars = Array.from({ length: 5 }, (_, i) => i < (feedback.rating ?? 0));

  return (
    <Card
      className={cn(
        "h-full rounded-[14px] border border-neutral-100 bg-white p-8 md:p-10 shadow-[0_2px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_2px_30px_rgba(0,0,0,0.06)] transition-all duration-500 min-h-[350px] max-w-[480px]",
        className
      )}
    >
      <CardContent className="flex h-full flex-col p-0 space-y-6 md:space-y-8">
        {/* Rating Section - Centered */}
        <div className="flex items-center justify-center gap-1.5 pt-2">
          {stars.map((filled, i) => (
            <Star
              key={i}
              className={cn(
                "h-7 w-7 md:h-8 md:w-8",
                filled ? "fill-[#fbbf24] text-[#fbbf24]" : "text-neutral-200"
              )}
            />
          ))}
        </div>

        {/* Testimonial Text - Centered & Serif */}
        <div className="flex-1 text-center px-4">
          <p className="text-xl md:text-2xl font-playfair leading-[1.6] text-neutral-800">
            {feedback.text}
          </p>
        </div>

        {/* Footer Section: Profile & Google Badge */}
        <div className="flex items-center justify-between pt-6 border-none gap-6">
          {/* Left: Profile Information */}
          <div className="flex items-center gap-3">
            {feedback.avatar ? (
              <div 
                className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-cover bg-center border border-neutral-100 shadow-sm shrink-0"
                style={{ backgroundImage: `url(${feedback.avatar})` }}
              />
            ) : (
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 font-bold text-sm shrink-0">
                    {feedback.name.charAt(0)}
                </div>
            )}
            <div className="flex flex-col">
              <span className="text-sm md:text-base font-bold text-neutral-900 font-bricolage line-clamp-1">
                {feedback.name}
              </span>
              <span className="text-[10px] md:text-xs text-neutral-400 font-medium font-bricolage leading-none uppercase tracking-wider">
                {feedback.role}
              </span>
            </div>
          </div>

          {/* Right: Google Reviews Branding */}
          <div className="flex items-center gap-1.5 shrink-0">
             <div className="flex flex-col items-end">
                <div className="flex items-center gap-1.5 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
                  <svg className="h-5 w-5 md:h-6 md:w-6" viewBox="0 0 24 24">
                     <path
                       fill="#4285F4"
                       d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                     />
                     <path
                       fill="#34A853"
                       d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                     />
                     <path
                       fill="#FBBC05"
                       d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                     />
                     <path
                       fill="#EA4335"
                       d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                     />
                   </svg>
                   <div className="flex flex-col -space-y-0.5">
                      <span className="text-neutral-900 font-bold text-xs md:text-sm font-sans tracking-tight">Google</span>
                      <span className="text-neutral-400 text-[8px] md:text-[9px] font-bold font-sans uppercase tracking-[0.05em]">Reviews</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
