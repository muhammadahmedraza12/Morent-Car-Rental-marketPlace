'use client';  // Mark as a client-side component
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
  quantity: number;
}

export default function AddToCart() {
  const [cartItems, setCartItems] = useState<Car[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    const savedCartItems = localStorage.getItem('cartItems');
    if (savedCartItems) {
      const items: Car[] = JSON.parse(savedCartItems);
      setCartItems(items);
      calculateTotal(items);
    }
  }, []);

  const removeFromCart = (car: Car) => {
    const updatedCartItems = cartItems.filter(item => item._id !== car._id);
    setCartItems(updatedCartItems);
    calculateTotal(updatedCartItems);

    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    localStorage.setItem('cartCount', updatedCartItems.length.toString());
    window.dispatchEvent(new Event('cartUpdated'));  // Trigger cart update event
  };

  const calculateTotal = (items: Car[]) => {
    const total = items.reduce((sum, car) => sum + (car.price_per_day * car.quantity), 0);
    setTotalPrice(total);
  };

  const updateQuantity = (car: Car, increment: boolean) => {
    const updatedCartItems = cartItems.map((item) =>
      item._id === car._id
        ? {
            ...item,
            quantity: increment ? item.quantity + 1 : Math.max(1, item.quantity - 1),
          }
        : item
    );
    setCartItems(updatedCartItems);
    calculateTotal(updatedCartItems);

    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    localStorage.setItem('cartCount', updatedCartItems.length.toString());
    window.dispatchEvent(new Event('cartUpdated'));  // Trigger cart update event
  };

  const proceedToCheckout = () => {
    // Store the cart data and total price in localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    localStorage.setItem('totalPrice', totalPrice.toString());

    // Navigate to payment page (you can use link or redirection here)
    window.location.href = '/payment';
  };

  return (
    <div className="bg-[#f6f7f9] min-h-screen p-6 lg:p-20 flex flex-col gap-10 font-[family-name:var(--font-geist-sans)]">
      <section className="w-full flex flex-col gap-8">
        <h1 className="text-2xl font-semibold text-gray-700">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center text-gray-500">Your cart is empty.</div>
        ) : (
          <div className="w-full flex flex-col gap-6">
            {cartItems.map((car) => (
              <div key={car._id} className="w-full flex items-center justify-between bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center gap-4">
                  <Image
                    src={car.image_url || "/placeholder-image.png"}
                    alt={car.name}
                    width={80}
                    height={50}
                    className="rounded-md"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="flex flex-col">
                    <h3 className="font-semibold text-lg">{car.name}</h3>
                    <p className="text-sm text-gray-500">{car.brand}</p>
                    <p className="text-sm text-gray-500">${car.price_per_day} / day</p>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => updateQuantity(car, false)}
                        className="bg-gray-300 text-sm p-1 rounded"
                      >
                        -
                      </button>
                      <p className="text-sm text-gray-500">Quantity: {car.quantity}</p>
                      <button
                        onClick={() => updateQuantity(car, true)}
                        className="bg-gray-300 text-sm p-1 rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(car)}
                  className="text-[#e74c3c] font-semibold hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {cartItems.length > 0 && (
          <div className="w-full flex justify-between items-center bg-white rounded-lg shadow-md p-4 mt-8">
            <p className="text-xl font-semibold">Total: ${totalPrice}</p>
            <button
              onClick={proceedToCheckout}
              className="bg-[#3563e9] text-white py-2 px-4 rounded-md"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
