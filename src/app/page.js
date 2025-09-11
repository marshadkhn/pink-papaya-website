// src/app/page.js
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white p-4 font-sans">
      <div className="flex flex-col items-center text-center">
        {/* Responsive Logo Image Container */}
        <div className="mb-8 w-48 sm:w-64 lg:w-80">
          {" "}
          {/* Controls the size */}
          <Image
            src="/logo-files/logo-black.svg"
            alt="Pink Papaya Stays Logo"
            width={0} // Set to 0
            height={0} // Set to 0
            sizes="100vw"
            className="h-auto w-full" // Fills the container
            priority
          />
        </div>

        {/* Responsive Stay Tuned Text */}
        <p className="text-lg font-medium text-gray-700 sm:text-xl lg:text-2xl">
          Stay tuned for the official Pink Papaya website
        </p>
      </div>
    </main>
  );
}
