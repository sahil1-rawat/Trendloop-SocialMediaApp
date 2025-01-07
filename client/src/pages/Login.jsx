import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/index.jsx';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {
    isLoading,
    isAuth,
    setIsAuth,
    usersData,
    setUsersData,
    setIsLoading,
  } = useUserStore();

  const navigate = useNavigate();
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false); // Page has loaded
    }, 1000); // Simulated loading time (adjust as needed)
    return () => clearTimeout(timeout);
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:7000/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const resData = await res.json();

      if (res.ok) {
        navigate('/account');
        toast.success(resData.message);
        setUsersData(resData.user);
        setIsAuth(true);
      } else {
        toast.error(resData.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className='flex items-center justify-center min-h-screen bg-gray-100'>
          <div className='w-16 h-16 border-4 border-blue-500 border-solid rounded-full animate-spin border-t-transparent'></div>
        </div>
      ) : (
        <div className='min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex items-center justify-center'>
          <div className='bg-white shadow-xl rounded-2xl overflow-hidden w-full max-w-4xl flex flex-col md:flex-row'>
            {/* Left Section */}
            <div className='hidden md:flex w-1/2 bg-gradient-to-b from-blue-400 to-indigo-500 flex-col items-center justify-center text-white p-8'>
              <h1 className='text-4xl font-bold mb-4'>New Here?</h1>
              <p className='text-center mb-8'>
                Don’t have an account yet? Create one to get started.
              </p>

              <Link
                to='/register'
                className='bg-white text-indigo-500 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition'>
                Register Now
              </Link>
            </div>

            <div className='w-full md:w-1/2 bg-white p-8 md:p-10'>
              <h1 className='text-3xl font-bold text-gray-800 mb-6 text-center'>
                Login to <span className='text-purple-600'>Trendloop</span>
              </h1>
              <p className='text-gray-600 mt-4 mb-3 flex justify-center'>
                <img
                  src='https://readme-typing-svg.herokuapp.com/?lines=Your+Social+media+account+is+waiting!;Log+in+to+stay+connected.&color=800080'
                  className='mx-auto'
                />
              </p>

              <form onSubmit={handleSubmit} className='mt-6'>
                <div className='space-y-5'>
                  <div>
                    <input
                      type='email'
                      className='custom-input'
                      placeholder='Email Address'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <input
                      type='password'
                      className='custom-input'
                      placeholder='Password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className='text-center mt-6'>
                    <button type='submit' className='auth-btn w-full'>
                      Login
                    </button>
                  </div>
                </div>
              </form>
              <div className='md:hidden mt-8 px-6 text-center space-y-4'>
                <h2 className='text-lg font-semibold text-gray-800 mb-2'>
                  Don't have an account yet?
                </h2>
                <Link
                  to='/register'
                  className='bg-white text-indigo-500 px-6 rounded-full font-semibold hover:underline transition'>
                  Register Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
