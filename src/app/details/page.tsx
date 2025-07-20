'use client'; 
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';

// Define types for the car data
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

const DetailPage = () => {
  const [carsList, setCarsList] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [selectedCapacity, setSelectedCapacity] = useState<number[]>([]);
  const [selectedTransmission, setSelectedTransmission] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([20, 1000]);

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

      // Filter out duplicates based on car name and image_url
      const uniqueCars = fetchedCars.filter(
        (car, index, self) =>
          index === self.findIndex((c) => c.name === car.name && c.image_url === car.image_url)
      );

      setCarsList(uniqueCars);
      setFilteredCars(uniqueCars); // Initially set filteredCars to all cars
    };

    fetchData();
  }, []);  

  const handleRentNow = (car: Car) => {
    // Retrieve current cart items from localStorage or initialize an empty array
    const currentCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
  
    // Check if the car already exists in the cart
    const existingCarIndex = currentCartItems.findIndex((item: Car) => item._id === car._id);

  
    if (existingCarIndex !== -1) {
      // If the car already exists, increase the quantity
      currentCartItems[existingCarIndex].quantity = (currentCartItems[existingCarIndex].quantity || 1) + 1;
    } else {
      // If the car doesn't exist, add it to the cart with a quantity of 1
      currentCartItems.push({ ...car, quantity: 1 });
    }
  
    // Update cart items in localStorage
    localStorage.setItem('cartItems', JSON.stringify(currentCartItems));
  
    // Update cart count
    const newCartCount = currentCartItems.length;
    localStorage.setItem('cartCount', newCartCount.toString());
  
    // Trigger a re-render or notify the Navbar by updating state
    window.dispatchEvent(new Event('cartUpdated')); // This will notify the Navbar to update cart count
  };

  // Handle checkbox change to filter by seating capacity
  const handleCheckboxChange = (capacity: number) => {
    setSelectedCapacity((prevSelected) => {
      const updatedSelected = prevSelected.includes(capacity)
        ? prevSelected.filter((item) => item !== capacity)
        : [...prevSelected, capacity];

      // Apply both seating capacity and price range filters
      filterCars(updatedSelected, selectedTransmission, priceRange);

      return updatedSelected;
    });
  };

  // Handle checkbox change to filter by transmission type
  const handleTransmissionChange = (transmission: string) => {
    setSelectedTransmission((prevSelected) => {
      const newTransmission = prevSelected === transmission ? null : transmission;

      // Apply both transmission and price range filters
      filterCars(selectedCapacity, newTransmission, priceRange);

      return newTransmission;
    });
  };

  // Handle price range change and filter cars
  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLInputElement>, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setPriceRange([newValue[0], newValue[1]]);
      filterCars(selectedCapacity, selectedTransmission, [newValue[0], newValue[1]]);
    }
  };

  // Filter cars based on selected filters (capacity, transmission, and price range)
  const filterCars = (capacityFilter: number[], transmissionFilter: string | null, priceFilter: [number, number]) => {
    let filtered = carsList;

    // Filter by seating capacity if selected
    if (capacityFilter.length > 0) {
      filtered = filtered.filter((car) =>
        capacityFilter.includes(car.seating_capacity)
      );
    }

    // Filter by transmission if selected
    if (transmissionFilter) {
      filtered = filtered.filter((car) => car.transmission === transmissionFilter);
    }

    // Filter by price range
    filtered = filtered.filter(
      (car) => car.price_per_day >= priceFilter[0] && car.price_per_day <= priceFilter[1]
    );

    setFilteredCars(filtered);
  };

  const [car, setCar] = useState<any | null>(null);

  useEffect(() => {
    const savedCar = localStorage.getItem('selectedCar');
    if (savedCar) {
      setCar(JSON.parse(savedCar));
    }
  }, []);

  
  const reviews = [
    {
      id: 1,
      userImage: '/userreview3.jpg',
      userName: 'John Doe',
      userOrganization: 'CEO at Bukalapak',
      reviewText: 'Great car, highly recommend! Smooth ride and very comfortable.',
    },
    {
      id: 2,
      userImage: '/userreview2.jpg',
      userName: 'Jane Smith',
      userOrganization: 'Manager at Google',
      reviewText: 'Loved the car! Efficient fuel consumption and very stylish.',
    },
    {
      id: 3,
      userImage: '/userreview3.jpg',
      userName: 'Michael Johnson',
      userOrganization: 'CTO at Microsoft',
      reviewText: 'Excellent experience. The car was perfect for my family trip.',
    },
    {
      id: 4,
      userImage: '/userreview2.jpg',
      userName: 'Sarah Lee',
      userOrganization: 'Developer at Apple',
      reviewText: 'Very spacious and comfortable. The best car rental service I have used.',
    },
    {
      id: 5,
      userImage: '/userreview3.jpg',
      userName: 'David Brown',
      userOrganization: 'Product Lead at Amazon',
      reviewText: 'The car was great, had an enjoyable trip with no issues at all.',
    },
  ];

  if (!car) {
    return <div>Loading...</div>; // Show loading message while the car data is being fetched
  }

  return (
    <div className="w-full flex">
      {/* Filter Section */}
      <div className="first w-[25%] sm:block hidden p-4 bg-white rounded-lg shadow-lg border border-gray-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Filter by Car Capacity</h2>
        <div>
          {[2, 4, 6].map((capacity) => (
            <div key={capacity} className="flex items-center mb-4">
              <input
                type="checkbox"
                id={`capacity-${capacity}`}
                checked={selectedCapacity.includes(capacity)}
                onChange={() => handleCheckboxChange(capacity)}
                className="mr-3 cursor-pointer"
              />
              <label htmlFor={`capacity-${capacity}`} className="text-gray-600 font-medium">{capacity} People</label>
            </div>
          ))}
        </div>

        {/* Price Filter Section */}
        <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">Filter by Price</h2>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">${priceRange[0]}</span>
            <span className="text-gray-500">${priceRange[1]}</span>
          </div>
          <input
            type="range"
            min="20"
            max="1000"
            step="10"
            value={priceRange[0]}
            onChange={(e) => handlePriceRangeChange(e, [Number(e.target.value), priceRange[1]])}
            className="w-full cursor-pointer bg-blue-100 rounded-lg"
          />
          <input
            type="range"
            min="20"
            max="1000"
            step="10"
            value={priceRange[1]}
            onChange={(e) => handlePriceRangeChange(e, [priceRange[0], Number(e.target.value)])}
            className="w-full cursor-pointer bg-blue-100 rounded-lg"
          />
        </div>

        {/* Transmission Filter Section */}
        <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">Filter by Transmission</h2>
        <div>
          {['Manual', 'Automatic'].map((transmission) => (
            <div key={transmission} className="flex items-center mb-4">
              <input
                type="checkbox"
                id={`transmission-${transmission}`}
                checked={selectedTransmission === transmission}
                onChange={() => handleTransmissionChange(transmission)}
                className="mr-3 cursor-pointer"
              />
              <label htmlFor={`transmission-${transmission}`} className="text-gray-600 font-medium">{transmission}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="sec w-full sm:w-[75%] bg-[#f6f7f9] p-4 sm:p-6 flex flex-col gap-10 font-[family-name:var(--font-geist-sans)]">
        {/* Car Details Section */}
        <section className="w-full flex flex-col md:flex-row gap-5 items-center justify-around">
          <div className="first flex flex-col gap-4 w-full h-[100%] lg:max-w-[470px] lg:max-h-[508px]">
            <div className="bg-white w-full h-full rounded-xl shadow-md p-2 flex justify-center items-center">
              <Image
                src={car.image_url || '/placeholder-image.png'}
                alt={car.name || 'Car Image'}
                width={300}
                height={0}
                className="object-cover rounded-lg  shadow-md"
              />
            </div>
          </div>
          <div className="flex flex-col w-full lg:max-w-[492px] h-auto lg:max-h-[508px] bg-white justify-between rounded-xl shadow-md">
            <div className="p-4 flex flex-col gap-4">
              {/* Car Name */}
              <h2 className="font-bold text-lg sm:text-xl lg:text-2xl text-gray-800">{car.name}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-left">
                  <p className="text-gray-500">Car Type</p>
                  <p className="font-bold">{car.type || 'Sports'}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500">Capacity</p>
                  <p className="font-bold">{car.seating_capacity || '5 Seats'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-left">
                  <p className="text-gray-500">Transmission</p>
                  <p className="font-bold">{car.transmission || 'Automatic'}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500">Fuel Capacity</p>
                  <p className="font-bold">{car.fuel_capacity || '60 Liters'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 items-center">
                <div className="text-left">
                  <h1 className="font-bold text-lg sm:text-xl lg:text-2xl text-gray-800">
                    ${car.price_per_day}{' '}
                    <span className="text-gray-500 text-sm lg:text-base">day</span>
                  </h1>
                </div>
                <div className="text-right">
                <Link href={"/addToCart"}>
                <button
  className="bg-[#3563e9] hover:bg-[#264ac6] transition-all p-3 sm:p-4 px-6 sm:px-10 text-nowrap text-white rounded-md w-full max-w-[200px] text-center"
  onClick={() => handleRentNow(car)} // This will call handleRentNow with the current car
>
  Rent Now
</button>
</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="popular w-full flex flex-col gap-4 ">
          <div className="first w-full flex items-center justify-between ">
            <h1 className="text-gray-500 text-lg sm:text-xl">Reviews ({reviews.length})</h1>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 ">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-6 rounded-xl shadow-md flex flex-col gap-4 animate-fadeIn transition-transform transform hover:scale-105 hover:shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <Image src={review.userImage} alt={review.userName} width={48} height={48} />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-bold text-lg">{review.userName}</h3>
                    <p className="text-gray-500 text-sm">{review.userOrganization}</p>
                  </div>
                </div>
                <div className="text-gray-600 text-base">{review.reviewText}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Car Section */}
        <section className="popular w-full flex flex-col gap-4">
          <div className="first w-full flex items-center justify-between">
            <h1 className="text-gray-500 text-lg sm:text-xl">Popular Cars ({filteredCars.length})</h1>
            <Link href={"/categories"}>
              {/* <h1 className="text-[#3563e9] font-bold hover:underline decoration-[#3563e9]">
                View All
              </h1> */}
            </Link>
          </div>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {filteredCars.map((car) => (
            <div key={car._id} className="w-full max-w-[320px] mx-auto h-auto flex flex-col justify-between border rounded-lg shadow-md p-4 bg-white opacity-0 animate-fadeIn transition-transform transform hover:scale-105 hover:shadow-lg">
             
                <div className="flex flex-col space-y-1.5 p-6">
                  <div className="w-full flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">{car.name}</h1>
                    {/* Heart Icon Toggle */}
                    {/* <HeartToggle /> */}
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

                {/* Align the icons and labels with proper spacing */}
                <div className="w-full flex flex-col sm:flex-row justify-between items-start gap-6 p-4 pt-0">
                  {/* Fuel Capacity */}
                  <div className="flex items-center gap-2">
                    <Image src="/gas-station.png" alt="Fuel Icon" width={20} height={20} />
                    <p className="text-sm text-gray-500">{car.fuel_capacity}</p>
                  </div>

                  {/* Transmission */}
                  <div className="flex items-center gap-2">
                    <Image src="/car_transmission.png" alt="Transmission Icon" width={20} height={20} />
                    <p className="text-sm text-gray-500">{car.transmission}</p>
                  </div>

                  {/* Seating Capacity */}
                  <div className="flex items-center gap-2">
                    <Image src="/seating_capacity.png" alt="Seating Icon" width={20} height={20} />
                    <p className="text-sm text-gray-500">{car.seating_capacity}</p>
                  </div>
                </div>

                <div className="w-full flex items-center justify-between p-6 pt-0">
                  <p className="text-xl font-bold">${car.price_per_day} / day</p>
                  <Link href={"/details"}> {/* Navigate to details page */}
                    <button 
                      className="bg-[#3563e9] w-full h-full py-2 mx-4  text-white rounded-md"
                      onClick={() => handleRentNow(car)} // Save the car data to localStorage
                    >
                      Rent Now
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="button w-full text-center">
          <Link href="/categories">
            <button className="bg-[#3563e9] px-4 py-2 text-white rounded-md mt-5">
              Show More Cars
            </button>
          </Link>
        </section>
      </div>
    </div>
  );
};


export default DetailPage;
