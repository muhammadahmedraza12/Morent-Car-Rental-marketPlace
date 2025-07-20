'use client';  
import { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const { user, isSignedIn } = useUser();
  const { signOut, openSignIn } = useClerk();
  const [cartCount, setCartCount] = useState(0);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    // Load the cart count from localStorage when the component mounts
    const savedCartCount = localStorage.getItem('cartCount');
    if (savedCartCount) {
      setCartCount(Number(savedCartCount));
    }

    // Event listener to update cart count when the cart is updated (after checkout)
    const handleCartUpdate = () => {
      const updatedCartCount = localStorage.getItem('cartCount');
      if (updatedCartCount) {
        setCartCount(Number(updatedCartCount)); // Update the cart count from localStorage
      } else {
        setCartCount(0); // Set to 0 if cartItems are cleared
      }
    };

    // Add event listener for cart updates
    window.addEventListener('cartUpdated', handleCartUpdate);

    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const handleProfileClick = () => {
    if (isSignedIn) {
      setShowLogoutModal(true);
    } else {
      openSignIn({
        redirectUrl: window.location.origin,
      });
    }
  };

  const handleLogout = () => {
    signOut();
    setShowLogoutModal(false);
  };

  const closeLogoutModal = () => {
    setShowLogoutModal(false);
  };

  return (
    <div className="w-full bg-white h-auto flex flex-col md:flex-row items-center justify-between p-4 md:p-8 border-b-2 border-b-[#e7eef6]">
      <div className="first flex flex-col md:flex-row items-center gap-4 md:gap-16">
        <h1 className="text-[#3563e9] text-4xl font-bold">MORENT</h1>
        <div className="input relative w-full md:w-auto">
          <Image src="/search-normal.png" alt="Search Icon" width={20} height={20} className="absolute top-1/2 left-4 transform -translate-y-1/2" />
          <input
            type="text"
            title="search"
            placeholder="Search something here"
            className="border-2 border-[#e7eef6] w-full md:w-[492px] h-[44px] rounded-full p-2 pl-12 pr-12"
          />
          <Image src="/filter.png" alt="Filter Icon" width={20} height={20} className="absolute top-1/2 right-4 transform -translate-y-1/2" />
        </div>
      </div>

      <div className="icons mt-4 md:mt-0">
        <div className="icons flex flex-row gap-4">
          <Link href="/addToCart">
            <div className="relative cursor-pointer flex items-center justify-center border-2 border-[#e7eef6] rounded-full p-2">
              <Image src="/add-to-cart-icon.png" alt="Add to Cart" width={25} height={25} />
              {cartCount > 0 && (
                <span className="absolute bottom-7 right-0 bg-red-500 text-white text-xs font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
          </Link>
{HeartToggle()}
          {/* Profile Icon */}
          <div
            className="relative cursor-pointer flex items-center justify-center border-2 border-[#e7eef6] rounded-full p-2"
            onClick={handleProfileClick}
          >
            {isSignedIn ? (
              <Image
                src={user?.imageUrl || '/default-profile.png'}
                alt="Profile"
                width={25}
                height={25}
                className="rounded-full"
              />
            ) : (
              <Image
                src="/navbar-profile-icon.png"
                alt="Profile Icon"
                width={25}
                height={25}
              />
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Logout */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[300px] md:w-[400px]">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Are you sure you want to log out?</h2>
            <div className="flex justify-between space-x-4">
              <button
                className="bg-[#3563E9] text-white py-2 px-4 rounded-md w-full  transition"
                onClick={handleLogout}
              >
                Yes
              </button>
              <button
                className="bg-gray-300 text-black py-2 px-4 rounded-md w-full hover:bg-gray-400 transition"
                onClick={closeLogoutModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// Heart Toggle Component for "favorite cars" section
const HeartToggle = () => {
  const [isHeartSelected, setIsHeartSelected] = useState(false);

  const toggleHeart = () => {
    setIsHeartSelected((prev) => !prev);
  };

  return (
    <Link href="/favoriteCars">
      <div
        className="relative cursor-pointer flex items-center justify-center border-2 border-[#e7eef6] rounded-full p-2"
        onClick={toggleHeart}
      >
        <Image
          src={"/selected-heart.png"} // Use a heart icon for favorites
          alt="Heart Icon"
          width={25}
          height={25}
        />
      </div>
    </Link>
  );
};




