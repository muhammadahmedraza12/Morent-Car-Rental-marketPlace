'use client';  
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Confirmation() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    const savedCartItems = localStorage.getItem('cartItems');
    const savedTotalPrice = localStorage.getItem('totalPrice');
    
    if (savedCartItems && savedTotalPrice) {
      setCartItems(JSON.parse(savedCartItems));
      setTotalPrice(Number(savedTotalPrice));
    }

    setTimeout(() => {
      localStorage.removeItem('cartItems');
      localStorage.removeItem('totalPrice');
      localStorage.removeItem('cartCount');

      // Dispatch event to notify cart updates
      window.dispatchEvent(new Event('cartUpdated'));

      setIsLoading(false);

      setTimeout(() => {
        window.location.href = '/';  // Redirect to home page
      }, 10000); // Redirect after 20 seconds delay

    }, 5000); 
  }, []);

  return (
    <div className="bg-[#3563e9] min-h-screen p-8 lg:p-16 flex flex-col gap-12 font-[family-name:var(--font-geist-sans)] animate-fadeIn transition-transform transform hover:scale-105 hover:shadow-lg">
    <section className="w-full flex flex-col gap-10bg-[#3563e9] rounded-lg p-8">
      <h1 className="text-3xl font-semibold text-white text-center">Payment Confirmation</h1>
  
      {isLoading ? (
        <div className="flex justify-center items-center gap-4 py-6">
          <div className="w-12 h-12 border-t-4 border-white border-solid rounded-full animate-spin"></div>
          <span className="text-lg text-white">Processing your payment...</span>
        </div>
      ) : (
        <div className="w-full">
          <p className="text-lg text-white text-center font-medium">Thank you for your payment! Your transaction has been processed successfully.</p>
  
          <div className="mt-10">
            <h3 className="text-2xl font-semibold text-white mb-4">Order Details</h3>
            
            <div className="w-full bg-white rounded-lg p-6">
              <div className="mb-6 flex justify-between items-center border-b pb-4">
                <p className="text-lg font-semibold text-gray-700">Total:</p>
                <p className="text-xl font-semibold text-gray-700">${totalPrice}</p>
              </div>
  
              <h4 className="text-lg font-semibold text-gray-800 mt-4 mb-3">Items:</h4>
              <ul className="space-y-4">
                {cartItems.map((item, index) => (
                  <li key={index} className="flex justify-between items-center p-4 bg-[#f9fafb] rounded-lg shadow-sm">
                    <div className="flex items-center gap-4">
                      <Image
                        src={item.image_url || "/placeholder-image.png"}
                        alt={item.name}
                        width={60}
                        height={40}
                        className="rounded-md"
                        style={{ objectFit: 'cover' }}
                      />
                      <span className="font-medium text-gray-700">{item.name}</span>
                    </div>
                    <span className="text-gray-500 text-sm">{item.price_per_day} x {item.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  </div>
  
  );
}
