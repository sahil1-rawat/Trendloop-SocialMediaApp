import axios from 'axios';

export const fetchPosts = async ({ setPosts, setReels, setIsLoading }) => {
  try {
    const res = await axios.get('/api/post/all', {
      withCredentials: true,
    });

    if (res.status === 200) {
      setPosts(res.data.posts);
      setReels(res.data.reels);
    }
  } catch (err) {
    console.error('Failed to fetch posts:', err);
  } finally {
    setIsLoading(false);
  }
};

export const fetchUsers = async ({ setUser, params }) => {
  try {
    const res = await axios.get(`/api/user/${params.id}`);
    if (res.status === 200) {
      setUser(res.data);
    }
  } catch (err) {
    console.log(err);
  }
};

export const fetchUser = async ({ setUsersData, setIsAuth }) => {
  try {
    const { data } = await axios.get('/api/user/me', {
      withCredentials: true,
    });

    setUsersData(data);
    setIsAuth(true);
  } catch (error) {
    console.log(error.message);
    setIsAuth(false);
  }
};
