"use client"; 
import { useEffect, useState } from "react"; 
import { client } from "@/sanity/lib/client"; 
import Image from "next/image"; 
import Link from "next/link";  

export default function Car() {   
  const [cars, setCars] = useState([]);    

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

      const fetchedCars = await client.fetch(query);        

      // Filter out duplicates based on car name and image_url        
      const uniqueCars = fetchedCars         
        .filter(           
          (car, index, self) =>             
            index ===             
            self.findIndex(               
              (c) => c.name === car.name && c.image_url === car.image_url             
            )         
        );        

      setCars(uniqueCars);     
    };      

    fetchData();   
  }, []);    

  return (     
    <>       
      <h1 className="text-4xl m-12 md:text-xl leading-tight font-title text-center font-bold mb-4">         
        Our Cars       
      </h1>       
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">         
        {cars.map((car) => (           
          <div             
            key={car._id}             
            className="border rounded-lg shadow-md p-4 flex flex-col items-start"           
          >             
            <Link href={`/car/${car._id}`}>               
              {car.image_url ? (                 
                <Image                   
                  src={car.image_url}                   
                  alt={car.name || "Car"}                   
                  width={280}                   
                  height={280}                   
                  style={{ objectFit: "cover" }}                   
                  className="rounded-md"                 
                />               
              ) : (                 
                <Image                   
                  src="/placeholder-image.png"                   
                  alt="Placeholder"                   
                  width={300}                   
                  height={300}                   
                  className="product-image"                 
                />               
              )}               
              <h2 className={`ml-3 mt-2`}>{car.name}</h2>             
            </Link>             

            <div className="flex justify-between items-center w-full mt-4">               
              <p className="text-xl font-bold text-gray-800">                 
                ${car.price_per_day} / day               
              </p>               
              {car.image_url && (                 
                <Image                   
                  src="/images/AddCartbg.png"                   
                  alt="Thumbnail"                   
                  width={40}                   
                  height={40}                   
                  className="rounded-full"                 
                />               
              )}             
            </div>           
            {car.tags && (
              <div className="mt-2">
                {car.tags.map((tag, index) => (
                  <span key={index} className="text-sm bg-gray-200 px-2 py-1 rounded-full mr-2">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-2 text-sm text-gray-600">
              <p>Fuel Capacity: {car.fuel_capacity}</p>
              <p>Transmission: {car.transmission}</p>
              <p>Seats: {car.seating_capacity}</p>
            </div>
          </div>         
        ))}       
      </div>     
    </>   
  ); 
}
