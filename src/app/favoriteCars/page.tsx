'use client';  // Add this line to mark the file as a client component 
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Car {
  _id: string;
  name: string;
  brand: string;
  price_per_day: number;
  image_url?: string;
  tags?: string[];
  fuel_capacity: string;
  transmission: string;
  seating_capacity: number;
}

export default function FavoriteCars() {
  const [favoriteCars, setFavoriteCars] = useState<Car[]>([]);

  useEffect(() => {
    const storedFavoriteCars = JSON.parse(localStorage.getItem('favoriteCars') || '[]');
    setFavoriteCars(storedFavoriteCars);
  }, []);

  return (
    <div className="bg-[#f6f7f9] min-h-screen p-4 sm:p-6 lg:p-20 flex flex-col gap-10 font-[family-name:var(--font-geist-sans)]">
      <section className="popular w-full flex flex-col gap-4">
        <h1 className="text-gray-500 text-lg sm:text-xl">Favorite Cars ({favoriteCars.length})</h1>
        
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {favoriteCars.length === 0 ? (
            <div className="text-center text-gray-500">No favorite cars yet</div>
          ) : (
            favoriteCars.map((car) => (
              <div key={car._id} className="w-full max-w-[320px] mx-auto h-auto flex flex-col justify-between border rounded-lg shadow-md p-4 bg-white">
                <div className="flex flex-col space-y-1.5 p-6">
                  <div className="w-full flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">{car.name}</h1>
                  </div>
                  <div className="text-sm text-muted-foreground">{car.brand}</div>
                </div>

                <div className="w-full flex flex-col items-center justify-center gap-4 p-6 pt-0">
                  {car.image_url ? (
                    <Image
                      src={car.image_url}
                      alt={car.name || "Car"}
                      width={220}
                      height={150}
                      style={{ objectFit: "cover" }}
                      className="rounded-md"
                    />
                  ) : (
                    <Image
                      src="/placeholder-image.png"
                      alt="Placeholder"
                      width={220}
                      height={150}
                      className="rounded-md"
                    />
                  )}
                </div>

                <div className="w-full flex flex-col sm:flex-row justify-between items-start gap-6 p-4 pt-0">
                  <div className="flex items-center gap-2">
                    <Image src="/gas-station.png" alt="Fuel Icon" width={20} height={20} />
                    <p className="text-sm text-gray-500">{car.fuel_capacity}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Image src="/car_transmission.png" alt="Transmission Icon" width={20} height={20} />
                    <p className="text-sm text-gray-500">{car.transmission}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Image src="/seating_capacity.png" alt="Seating Icon" width={20} height={20} />
                    <p className="text-sm text-gray-500">{car.seating_capacity}</p>
                  </div>
                </div>

                <div className="w-full flex items-center justify-between p-6 pt-0">
                  <p className="text-xl font-bold">${car.price_per_day} / day</p>
                  <Link href={"/details"}>
                    <button className="bg-[#3563e9] w-full py-2 mx-4 text-white rounded-md">
                      Rent Now
                    </button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
