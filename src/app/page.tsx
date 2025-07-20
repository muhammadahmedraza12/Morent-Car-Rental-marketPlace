
'use client';  
import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
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

export default function Home() {
  const [cars, setCars] = useState<Car[]>([]);
  const [favoriteCars, setFavoriteCars] = useState<Car[]>([]); // New state for favorite cars
  const [showAll, setShowAll] = useState(false); // State to control the visibility of all cars

  useEffect(() => {
    const fetchData = async () => {
      const query = `*[_type == "car"]{
        _id,
        name,
        brand,
        price_per_day,
        image_url,
        tags,
        fuel_capacity,
        transmission,
        seating_capacity
      }`;

      const fetchedCars: Car[] = await client.fetch(query);

      const uniqueCars = fetchedCars.filter(
        (car, index, self) =>
          index === self.findIndex((c) => c.name === car.name && c.image_url === car.image_url)
      );

      setCars(uniqueCars);

      // Load favorite cars from localStorage
      const storedFavoriteCars = JSON.parse(localStorage.getItem('favoriteCars') || '[]');
      setFavoriteCars(storedFavoriteCars);
    };

    fetchData();
  }, []);

  const handleHeartToggle = (car: Car) => {
    // Retrieve the current favorite cars from localStorage
    const storedFavoriteCars = JSON.parse(localStorage.getItem('favoriteCars') || '[]');

    const isFavorite = storedFavoriteCars.some((item: Car) => item._id === car._id);
    
    let updatedFavoriteCars;
    if (!isFavorite) {
      // If it's not a favorite, add it
      updatedFavoriteCars = [...storedFavoriteCars, car];
    } else {
      // If it's already a favorite, remove it
      updatedFavoriteCars = storedFavoriteCars.filter((item: Car) => item._id !== car._id);
    }

    // Update localStorage and state
    localStorage.setItem('favoriteCars', JSON.stringify(updatedFavoriteCars));
    setFavoriteCars(updatedFavoriteCars);
  };

  const handleAddToCart = (car: Car) => {
    // Retrieve the current cart from localStorage
    const storedCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
  
    // Check if the car is already in the cart
    const existingCarIndex = storedCart.findIndex((item: Car) => item._id === car._id);
  
    if (existingCarIndex === -1) {
      // If the car is not in the cart, add it with quantity 1
      storedCart.push({ ...car, quantity: 1 });
    } else {
      // If the car is already in the cart, increase its quantity
      storedCart[existingCarIndex].quantity += 1;
    }
  
    // Update cartItems in localStorage
    localStorage.setItem('cartItems', JSON.stringify(storedCart));
  
    // Update cart count based on the number of unique cars
    const uniqueCartItemsCount = storedCart.length; // Count unique items
    localStorage.setItem('cartCount', uniqueCartItemsCount.toString());
  
    // Trigger the cart update event to refresh the Navbar badge
    window.dispatchEvent(new Event('cartUpdated'));
  };

  return (
    <div className="bg-[#f6f7f9] min-h-screen p-4 sm:p-6 lg:p-20 flex flex-col gap-10 font-[family-name:var(--font-geist-sans)] animate-fadeIn">

<section className="first w-full flex flex-wrap sm:flex-nowrap gap-4 sm:gap-8 justify-center opacity-0 animate-fadeIn">
  <Image src={"/Ads 1.png"} alt="" width={640} height={360} className="max-w-full transition-transform transform hover:scale-105" />
  <Image src={"/Ads 2.png"} alt="" width={640} height={360} className="max-w-full transition-transform transform hover:scale-105" />
</section>

      <section className="popular w-full flex flex-col gap-4">
        <div className="first w-full flex items-center justify-between">
          <h1 className="text-gray-500 text-lg sm:text-xl">Popular Cars ({cars.length})</h1>
          <button
            className="text-[#3563e9] font-bold hover:underline decoration-[#3563e9]"
            onClick={() => setShowAll((prev) => !prev)} // Toggle between showAll true/false
          >
            {showAll ? "Show Less" : "View All"}
          </button>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {(showAll ? cars : cars.slice(0, 4)).map((car) => (
            <div key={car._id} className="w-full max-w-[320px] mx-auto h-auto flex flex-col justify-between border rounded-lg shadow-md p-4 bg-white opacity-0 animate-fadeIn transition-transform transform hover:scale-105 hover:shadow-lg">


              <div className="flex flex-col space-y-1.5 p-6">
                <div className="w-full flex items-center justify-between">
                  <h1 className="text-2xl font-semibold">{car.name}</h1>
                  <div className="ml-4"> {/* Add margin-left to provide spacing */}
                    <HeartToggle
                      car={car}
                      isFavorite={favoriteCars.some((item) => item._id === car._id)} // Check if car is in favorites
                      onToggle={handleHeartToggle}
                    />
                  </div>
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
                <button 
  className="bg-[#3563e9] w-full py-2 mx-4 text-white rounded-md transition-transform transform hover:scale-105 animate-buttonHover"
  onClick={() => {
    localStorage.setItem('selectedCar', JSON.stringify(car)); // Save car to localStorage
    handleAddToCart(car); // Add to cart when clicked
  }}
>
  Rent Now
</button>

                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="button w-full flex justify-center">
        {!showAll && (
          <button
            className="bg-[#3563e9] px-4 py-2 text-white rounded-md mt-5"
            onClick={() => setShowAll(true)} // Show all cars on button click
          >
            Show More Cars
          </button>
        )}
      </section>
    </div>
  );
}

const HeartToggle = ({ car, isFavorite, onToggle }: { car: Car, isFavorite: boolean, onToggle: (car: Car) => void }) => {
  return (
  <div
  className="relative cursor-pointer flex items-center justify-center border-2 border-[#e7eef6] rounded-full p-4 transition-transform transform hover:scale-110 animate-heartHover"
  onClick={() => onToggle(car)}
>
  <Image
    src={isFavorite ? "/selected-heart.png" : "/unselected-heart.png"}
    alt="Heart Icon"
    width={25}
    height={25}
    className="absolute top-1/2 transform -translate-y-1/2"
  />
</div>
  );
};
