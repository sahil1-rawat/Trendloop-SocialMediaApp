import React, { useState, useEffect } from 'react';
import { FiEdit2 } from 'react-icons/fi';
import { AiOutlineLogout } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store';
import toast from 'react-hot-toast';

const Account = () => {
  const { usersData, isAuth, setUsersData, setIsAuth } = useUserStore();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const navigate = useNavigate();

  // Load saved data from localStorage when the component mounts

  // Update local state when usersData changes
  useEffect(() => {
    if (usersData) {
      setName(usersData.name || '');
      setProfilePic(usersData.profilePic?.url || '');
    }
  }, [usersData]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log('Updated Name:', name);
    console.log('Updated Profile Picture:', profilePic);
    setIsEditing(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    setName(usersData.name);
    setProfilePic(usersData.profilePic?.url);
    setIsEditing(false);
  };

  const logoutHandler = async () => {
    try {
      const res = await fetch('http://localhost:7000/api/auth/logout', {
        method: 'get',
        credentials: 'include',
      });
      if (res.ok) {
        setIsAuth(false);
        setUsersData([]);
        localStorage.removeItem('usersData');
        localStorage.removeItem('isAuth');
        navigate('/login');
        toast.success('logged out');
      }
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <>
      {isAuth && (
        <div className='bg-gray-100 min-h-screen flex flex-col items-center py-10'>
          <div className='bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl'>
            {/* Profile Picture Section */}
            <div className='relative flex flex-col items-center mb-6'>
              <img
                src={profilePic}
                alt='Profile'
                className='w-36 h-36 rounded-full border-4 border-black/45 shadow-lg cursor-pointer'
              />
              {isEditing && (
                <>
                  <div>
                    <div
                      className='relative bottom-20 text-black rounded-full cursor-pointer'
                      onClick={() =>
                        document.getElementById('profile-pic').click()
                      }>
                      <FiEdit2 size={24} />
                    </div>
                  </div>
                  <input
                    type='file'
                    className='hidden'
                    id='profile-pic'
                    onChange={handleFileChange}
                    accept='image/*'
                  />
                </>
              )}
            </div>

            {/* User Details Section */}
            <div className='text-center space-y-4'>
              {isEditing ? (
                <form
                  onSubmit={handleFormSubmit}
                  className='flex flex-col items-center gap-4'>
                  <input
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className='w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 max-w-md'
                    placeholder='Update your name'
                  />
                  <button
                    type='submit'
                    className='bg-green-500 hover:bg-green-600 text-white py-2 px-8 rounded-lg font-medium transition duration-200'>
                    Save Changes
                  </button>
                </form>
              ) : (
                <>
                  <h1 className='text-2xl font-bold text-gray-800'>{name}</h1>
                  <p className='bg-gray-200 text-gray-700 font-bold px-4 py-1 rounded-lg inline-block'>
                    {usersData.email}
                  </p>
                  <div className='flex justify-center gap-6 text-gray-600'>
                    <p>{usersData.followers.length} Followers</p>
                    <p>{usersData.followings.length} Following</p>
                  </div>
                </>
              )}
              {isEditing ? (
                <button
                  onClick={handleCancel}
                  className='bg-blue-500 hover:bg-blue-600 mt-4 text-white py-2 px-6 rounded-lg font-medium transition duration-200'>
                  Cancel
                </button>
              ) : (
                <button
                  onClick={handleEditToggle}
                  className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg font-medium transition duration-200'>
                  Edit Profile
                </button>
              )}
              <button
                className='mt-6 bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white py-3 px-12 rounded-lg font-semibold flex items-center justify-center gap-2 transition duration-200 shadow-lg'
                onClick={logoutHandler}>
                <AiOutlineLogout size={20} /> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Account;
