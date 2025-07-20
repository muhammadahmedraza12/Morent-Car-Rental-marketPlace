
'use client'; 
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Image from 'next/image';



export default function Payment() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [cvc, setCvc] = useState('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string[] }>({
    name: [],
    phone: [],
    address: [],
    city: [],
    pickupLocation: [],
    pickupDate: [],
    dropoffLocation: [],
    dropoffDate: [],
    cardNumber: [],
    expirationDate: [],
    cardholderName: [],
    cvc: [],
  });

  useEffect(() => {
    // Retrieve the cart data from localStorage
    const savedCartItems = localStorage.getItem('cartItems');
    const savedTotalPrice = localStorage.getItem('totalPrice');

    if (savedCartItems) {
      setCartItems(JSON.parse(savedCartItems));
    }
    if (savedTotalPrice) {
      setTotalPrice(Number(savedTotalPrice));
    }
  }, []);

  const validateForm = () => {
    const errors: { [key: string]: string[] } = {
      name: [],
      phone: [],
      address: [],
      city: [],
      pickupLocation: [],
      pickupDate: [],
      dropoffLocation: [],
      dropoffDate: [],
      cardNumber: [],
      expirationDate: [],
      cardholderName: [],
      cvc: [],
    };

    if (!name) errors.name.push('Name is required.');
    if (!phone) errors.phone.push('Phone number is required.');
    if (!address) errors.address.push('Address is required.');
    if (!city) errors.city.push('City is required.');
    if (!pickupLocation) errors.pickupLocation.push('Pick-up location is required.');
    if (!pickupDate) errors.pickupDate.push('Pick-up date is required.');
    if (!dropoffLocation) errors.dropoffLocation.push('Drop-off location is required.');
    if (!dropoffDate) errors.dropoffDate.push('Drop-off date is required.');
    if (paymentMethod === 'credit-card') {
      if (!cardNumber) errors.cardNumber.push('Card number is required.');
      if (!expirationDate) errors.expirationDate.push('Expiration date is required.');
      if (!cardholderName) errors.cardholderName.push('Cardholder name is required.');
      if (!cvc) errors.cvc.push('CVC is required.');
    }

    return errors;
  };
  const [loading, setLoading] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);
  
    const hasErrors = Object.values(errors).some((errorArray) => errorArray.length > 0);
    if (!hasErrors) {
      setLoading(true); 
  
      setTimeout(() => {
        window.location.href = '/confirmation'; // Redirect to confirmation page
      }, 3000); 
    }
  };
   
  // Store ratings for each item separately
  const [ratings, setRatings] = useState<number[]>(new Array(cartItems.length).fill(0));

  // Handle star rating for each item
  const handleRating = (index: number, rating: number) => {
    const newRatings = [...ratings];
    newRatings[index] = rating;
    setRatings(newRatings);
  };

  // Calculate totals and tax
  const calculateTotal = () => {
    let subtotal = 0;
    cartItems.forEach((item) => {
      subtotal += Number(item.price_per_day) * item.quantity;
    });
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const { subtotal, tax, total } = calculateTotal();

  return (
    <div className="payment w-full bg-[#f6f7f9] p-6 flex flex-wrap gap-6 justify-center font-[family-name:var(--font-geist-sans)] flex-row-reverse">
      {/* Rental Summary Section */}
      <section className="w-full lg:w-[852px] bg-white p-6 rounded-lg shadow-md mb-8 animate__animated animate__fadeIn">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Rental Summary</h2>
        {cartItems.length > 0 && (
          <div className="flex flex-col gap-6">
            {/* Loop through cart items */}
            {cartItems.map((item, index) => (
              <div key={index} className="flex gap-6 items-center">
                <Image
                  src={item.image_url || '/placeholder-image.png'}
                  alt={item.name}
                  width={100}
                  height={60}
                  className="rounded-md transition-transform transform hover:scale-105"
                />
                <div className="flex flex-col w-full">
                  <p className="text-lg font-semibold">{item.name}</p>

                  {/* Star Rating */}
                  <div className="flex gap-2 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handleRating(index, i + 1)}
                        className={`text-2xl transition-colors ${i < ratings[index] ? 'text-yellow-500' : 'text-gray-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>

                  {/* Pricing Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-between">
                      <p className="font-semibold">Quantity</p>
                      <p>{item.quantity}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-semibold">Price per day</p>
                      <p>${Number(item.price_per_day).toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-semibold">Total</p>
                      <p>${(Number(item.price_per_day) * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Divider only after item pricing */}
                  {index < cartItems.length - 1 && <hr className="my-4 border-t border-gray-300" />}
                </div>
              </div>
            ))}

            {/* Total pricing (for all items) */}
            <div className="mt-6">
              <div className="flex justify-between text-lg font-semibold">
                <p>Subtotal</p>
                <p>${subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold">Tax (10%)</p>
                <p>${tax.toFixed(2)}</p>
              </div>
              <div className="flex justify-between mt-4 text-xl font-semibold border-t pt-4">
                <p>Total Rental Price (including tax)</p>
                <p>${total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Billing Info Section */}
      <form onSubmit={handleSubmit} className="w-full lg:w-[852px] flex flex-col gap-8 animate__animated animate__fadeIn animate__delay-1s">
               <Card className="w-full animate-fadeIn transition-transform transform hover:scale-105 hover:shadow-lg">
        <CardHeader>
           <CardTitle>Billing Info</CardTitle>
           <CardDescription className="flex justify-between">
               <h1>Please enter your billing info</h1>
               <h1>Step 1 of 4</h1>
             </CardDescription>
           </CardHeader>
           <CardContent>
             <div className="flex flex-wrap gap-4">
               <div className="w-full lg:w-[48%]">
                 <Input
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-[#f6f7f9] px-8 h-[56px] rounded-xl"
                />
                {formErrors.name.length > 0 && <p className="text-red-600 text-sm">{formErrors.name[0]}</p>}
              </div>
              <div className="w-full lg:w-[48%]">
                <Input
                  placeholder="Your Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-[#f6f7f9] px-8 h-[56px] rounded-xl"
                />
                {formErrors.phone.length > 0 && <p className="text-red-600 text-sm">{formErrors.phone[0]}</p>}
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="w-full lg:w-[48%]">
                <Input
                  placeholder="Your Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="bg-[#f6f7f9] px-8 h-[56px] rounded-xl"
                />
                {formErrors.address.length > 0 && <p className="text-red-600 text-sm">{formErrors.address[0]}</p>}
              </div>
              <div className="w-full lg:w-[48%]">
                <Input
                  placeholder="Your City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-[#f6f7f9] px-8 h-[56px] rounded-xl"
                />
                {formErrors.city.length > 0 && <p className="text-red-600 text-sm">{formErrors.city[0]}</p>}
              </div>
            </div>
          </CardContent>
        </Card>


     
         {/* Rental Info Section */}
         <Card className="w-full animate-fadeIn transition-transform transform hover:scale-105 hover:shadow-lg">
           <CardHeader>
             <CardTitle>Rental Info</CardTitle>
             <CardDescription className="flex justify-between">
               <h1>Pick-up and Drop-off info</h1>
               <h1>Step 2 of 4</h1>
             </CardDescription>
           </CardHeader>
           <CardContent>
             {/* Pick-up Info */}
           <div className="flex items-center gap-4">
           <input
                type="radio"
                id="pickup"
                name="pickup-dropoff"
                checked={pickupLocation !== ''}
                onChange={() => setPickupLocation('')}
              /> 
               <label htmlFor="pickup" className="font-bold">Pick-up</label>
             </div>
             <div className="flex flex-wrap gap-4 mt-4">
               <div className="w-full lg:w-[48%]">
             <Input
                  placeholder="Pick-up Location"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="bg-[#f6f7f9] px-8 h-[56px] rounded-xl"
                />
                {formErrors.pickupLocation.length > 0 && <p className="text-red-600 text-sm">{formErrors.pickupLocation[0]}</p>}
              </div>
              <div className="w-full lg:w-[48%]">
                <Input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="bg-[#f6f7f9] px-8 h-[56px] rounded-xl"
                />
                {formErrors.pickupDate.length > 0 && <p className="text-red-600 text-sm">{formErrors.pickupDate[0]}</p>}
              </div>
            </div>

            {/* Drop-off Info */}
            <div className="flex items-center gap-4 mt-6">
              {/* <input
                type="radio"
                id="dropoff"
                name="pickup-dropoff"
                checked={dropoffLocation !== ''}
                onChange={() => setDropoffLocation('')}
              /> */}
              <label htmlFor="dropoff" className="font-bold">Drop-off</label>
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="w-full lg:w-[48%]">
                <Input
                  placeholder="Drop-off Location"
                  value={dropoffLocation}
                  onChange={(e) => setDropoffLocation(e.target.value)}
                  className="bg-[#f6f7f9] px-8 h-[56px] rounded-xl"
                />
                {formErrors.dropoffLocation.length > 0 && <p className="text-red-600 text-sm">{formErrors.dropoffLocation[0]}</p>}
              </div>
              <div className="w-full lg:w-[48%]">
                <Input
                  type="date"
                  value={dropoffDate}
                  onChange={(e) => setDropoffDate(e.target.value)}
                  className="bg-[#f6f7f9] px-8 h-[56px] rounded-xl"
                />
                {formErrors.dropoffDate.length > 0 && <p className="text-red-600 text-sm">{formErrors.dropoffDate[0]}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method Section */}
        <Card className="w-full animate__animated animate__fadeIn animate__delay-2s">
  <CardHeader>
    <CardTitle>Payment Method</CardTitle>
    <CardDescription className="flex justify-between">
      <h1>Enter your payment method</h1>
      <h1>Step 3 of 4</h1>
    </CardDescription>
  </CardHeader>
  <CardContent>
    {/* Credit Card Option */}
    <div className="flex items-center gap-4 transition-all duration-300 hover:scale-105">
      <input
        type="radio"
        id="credit-card"
        name="payment-method"
        value="credit-card"
        checked={paymentMethod === 'credit-card'}
        onChange={() => setPaymentMethod('credit-card')}
        className="transition-transform"
      />
      <label htmlFor="credit-card" className="font-bold">Credit Card</label>
      <div className="flex gap-4 ml-auto">
        <Image src="/visa-icon.png" alt="Visa" width={40} height={25} />
        <Image src="/master-card.png" alt="MasterCard" width={40} height={25} />
      </div>
    </div>

    {paymentMethod === 'credit-card' && (
      <>
        {/* Card Number and Expiration Date */}
        <div className="flex flex-wrap gap-4 mt-4 animate__animated animate__fadeIn animate__delay-2s">
          <Input
            placeholder="Card Number"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="w-full lg:w-[48%] bg-[#f6f7f9] px-8 h-[56px] rounded-xl"
          />
          {formErrors.cardNumber.length > 0 && <p className="text-red-600 text-sm">{formErrors.cardNumber[0]}</p>}
          <Input
            placeholder="Expiration Date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            className="w-full lg:w-[48%] bg-[#f6f7f9] px-8 h-[56px] rounded-xl"
          />
          {formErrors.expirationDate.length > 0 && <p className="text-red-600 text-sm">{formErrors.expirationDate[0]}</p>}
        </div>

        {/* Cardholder Name and CVC */}
        <div className="flex flex-wrap gap-4 mt-4 animate__animated animate__fadeIn animate__delay-3s">
          <Input
            placeholder="Cardholder Name"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            className="w-full lg:w-[48%] bg-[#f6f7f9] px-8 h-[56px] rounded-xl"
          />
          {formErrors.cardholderName.length > 0 && <p className="text-red-600 text-sm">{formErrors.cardholderName[0]}</p>}
          <Input
            placeholder="CVC"
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
            className="w-full lg:w-[48%] bg-[#f6f7f9] px-8 h-[56px] rounded-xl"
          />
          {formErrors.cvc.length > 0 && <p className="text-red-600 text-sm">{formErrors.cvc[0]}</p>}
        </div>
      </>
    )}

    {/* PayPal Option */}
    <div className="flex items-center gap-4 mt-6 transition-all duration-300 hover:scale-105 animate__animated animate__fadeIn animate__delay-4s">
      <input
        type="radio"
        id="paypal"
        name="payment-method"
        value="paypal"
        checked={paymentMethod === 'paypal'}
        onChange={() => setPaymentMethod('paypal')}
        className="transition-transform"
      />
      <label htmlFor="paypal" className="font-bold">PayPal</label>
      <Image src="/paypal-icon.png" alt="PayPal" width={40} height={25} className="ml-auto" />
    </div>

    {/* Bitcoin Option */}
    <div className="flex items-center gap-4 mt-6 transition-all duration-300 hover:scale-105 animate__animated animate__fadeIn animate__delay-5s">
      <input
        type="radio"
        id="bitcoin"
        name="payment-method"
        value="bitcoin"
        checked={paymentMethod === 'bitcoin'}
        onChange={() => setPaymentMethod('bitcoin')}
        className="transition-transform"
      />
      <label htmlFor="bitcoin" className="font-bold">Bitcoin</label>
      <Image src="/bitcoin-icon.png" alt="Bitcoin" width={40} height={40} className="ml-auto" />
    </div>
  </CardContent>
</Card>

<div className="flex justify-center mt-8">
<div className="flex justify-center mt-8">
  <button 
    disabled={loading}
    type="submit"
    className="w-full lg:w-[400px] py-3 bg-blue-500 text-white rounded-xl text-lg relative"
  >
    <span className={loading ? "opacity-0" : "opacity-100"}>Pay Now</span>

    {/* Loader, with absolute positioning and centered inside the button */}
    {loading && (
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="w-6 h-6 border-4 border-t-4 border-white border-solid rounded-full animate-spin"></div>
      </div>
    )}
  </button>
</div>

</div>

      </form>
    </div>
  );
}

