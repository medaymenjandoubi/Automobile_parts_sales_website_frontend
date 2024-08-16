import axios from "axios";
import React, { useState } from "react";
import { toast } from 'react-toastify'; 
const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !fullName || !password) {
      console.log("please fill all the fields");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      console.log("please provide a valid email");
      return;
    }
    try {
        const { data } = await axios.post(`${process.env.REACT_APP_API_URL}register`, { fullName, email, password });
        console.log('This is the data', data);
        toast.success('Registration successful'); // Show success toast
      } catch (error) {
        // Log detailed error information
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Error data:', error.response.data);
          toast.error(`Registration failed: ${error.response.data}`); // Show error toast with message from server
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Error request:', error.request);
          toast.error('No response from server. Please try again.');
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error message:', error.message);
          toast.error('An unexpected error occurred. Please try again.');
        }
      }
  };
  return (
    <div className="flex items-center w-full mx-auto h-screen diagonal-background">
      <form
        onSubmit={handleSubmit}
        className="grid place-items-center lg:w-5/12 sm:w-9/12 w-11/12 mx-auto bg-white text-[#4f7cff] shadow-2xl rounded-3xl"
      >
        <div className="pt-16 pb-4 text-3xl font-bold capitalize">
          Register To Bousnina Auto services
        </div>
        {/*************FULLNAME *************/}
        <div className="w-full flex flex-col px-14 py-8">
          <label>Fullname</label>
          <input
            type="text"
            className="w-full border border-gray-300 round-lg px-3 py-3 mt-1 text-lg outline-none text-[black]"
            placeholder="your fullname"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          ></input>
        </div>
        {/*************EMAIL*************/}
        <div className="w-full flex flex-col px-14 py-8">
          <label>Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 round-lg px-3 py-3 mt-1 text-lg outline-none text-[black]"
            placeholder="example123@gmail.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        {/*************PASSWORD*************/}
        <div className="w-full flex flex-col px-14 py-8">
          <label>Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 round-lg px-3 py-3 mt-1 text-lg outline-none text-[black]"
            placeholder="**********"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        {/********** navigation link for users who already have accounts */}
        <div className="w-full flex justify-between items-center px-14 pb-8 text-[#3d5fc4]">
          <div>Already have an account ? </div>
          <div>
            <a href="/login" className="hover:underline">
              Login Now
            </a>
          </div>
        </div>
        {/*********** Register Button*************/}
        <div className="mx-auto flex justify-center items-center pt-6 pb-16">
          <button
            type="submit"
            className="bg-[#3d5fc4] text-white rounded-md text-base uppercase w-24 py-2"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};
export default Register;
