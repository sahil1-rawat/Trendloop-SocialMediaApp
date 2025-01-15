import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Addpost from './AddPost';

const NewPost = () => {
  return (
    <div className='flex justify-center items-center min-h-[80vh] '>
      <Addpost type='post' />
    </div>
  );
};

export default NewPost;
