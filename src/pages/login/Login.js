import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'; 
import { Context } from '../../context';
import { HomeOutlined } from "@ant-design/icons";
//import { toast } from 'react-toastify'; 

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {state,dispatch} =useContext(Context)
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            
            const { data: { csrfToken } } = await axios.get(`${process.env.REACT_APP_API_URL}csrf-token`);

            // Set CSRF token as a cookie named _csrf
            document.cookie = `_csrf=${csrfToken}; path=/`;

            const response = await axios.post(`${process.env.REACT_APP_API_URL}login`, { email, password },{ withCredentials: true });
            console.log('LOGIN RESPONSE', response);
            dispatch({
                type:"LOGIN",
                payload:response.data
            })
            //save in local storage
            window.localStorage.setItem("user",JSON.stringify(response.data))
            setSuccessMessage('Authentication successful');
           toast.success("Welcome")
 
             navigate("/", {replace: true});
        } catch (error) {
            toast.error(error)
        }
    };
  return (
    <div className="flex items-center w-full mx-auto h-screen diagonal-background">
      <form
        onSubmit={handleLogin}
        className="grid place-items-center lg:w-5/12 sm:w-9/12 w-11/12 mx-auto bg-white text-[#4f7cff] shadow-2xl rounded-3xl"
      >
        <div className="pt-16 pb-4 text-3xl font-bold capitalize">
          Login
        </div>
        {/*************FULLNAME *************/}
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
          <div>Don't have an account?</div>
          <div>
            <a href="/register" className="hover:underline">
              Register Now
            </a>
          </div>
        </div>
        {/*********** Register Button*************/}
        <div className="mx-auto flex justify-center items-center pt-6 pb-16" style={{}}>
          <button
            type="submit"
            className="bg-[#3d5fc4] text-white rounded-md text-base uppercase w-24 py-2"
          >
            Register
          </button>
          <button
            className="bg-[#9b42f5] text-white rounded-md text-base w-24 py-2"
            style={{display:"flex", width:"120px",marginLeft:"15px",justifyContent:"center"}}
            onClick={()=>navigate("/")}
          >
               <p style={{marginLeft:'7px'}}>Go Home </p><HomeOutlined style={{ marginRight: "15px" ,marginTop:"3px",marginLeft:'5px'}} />
          </button>
        </div>
      </form>
    </div>
  );
};
export default Register;
