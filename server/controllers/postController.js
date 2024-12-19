import { Post } from '../models/postModel.js';
import getDataUrl from '../utils/urlGenerator.js';
import cloudinary from 'cloudinary';

// Post
export const newPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const ownerId = req.user._id;
    const file = req.file;
    const fileUrl = getDataUrl(file);
    let option;
    const type = req.query.type;

    if (type === 'reel') {
      option = {
        resource_type: 'video',
      };
    } else {
      option = {};
    }
    const myCloud = await cloudinary.v2.uploader.upload(
      fileUrl.content,
      option
    );
    const post = await Post.create({
      caption,
      post: {
        id: myCloud.public_id,
        url: myCloud.secure_url,
      },
      owner: ownerId,
      type,
    });
    res.status(201).json({
      message: 'Post Created',
      post,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// delete Post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        message: 'Post Not Found',
      });
    }
    if (req.user._id.toString() !== post.owner.toString()) {
      return res.status(404).json({
        message: 'Unauthorized User',
      });
    }

    await cloudinary.v2.uploader.destroy(post.post.id);
    await post.deleteOne();
    return res.status(201).json({
      message: 'Post Deleted',
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Edit caption
export const editCaption = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const { newCaption } = req.body;
    if (!post) {
      return res.status(404).json({
        message: 'Post Not Found',
      });
    }
    if (post.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Unauthorized User',
      });
    }
    post.caption = newCaption;
    await post.save();
    console.log(post);
    return res.status(201).json({
      message: 'Caption Edited',
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

//Get All post of the user

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({ type: 'post' })
      .sort({ createdAt: -1 })
      .select('-password')
      .populate('owner', '-password');
    const reels = await Post.find({ type: 'reels' })
      .sort({ createdAt: -1 })
      .select('-password')
      .populate('owner', '-password');
    res.json({ posts, reels });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Comment on Post

export const commentOnPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const isOnlySpaces = (str) => str.trim().length === 0;
    const { comment } = req.body;
    if (!post) {
      return res.status(404).json({
        message: 'Post Not Found',
      });
    }
    if (!comment || isOnlySpaces(comment)) {
      return res.status(404).json({
        message: "can't send empty comment",
      });
    }

    post.comments.push({
      user: req.user._id,
      name: req.user.name,
      comment,
    });
    await post.save();
    return res.status(201).json({
      message: 'Comment Added Successfully',
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Delete Comment

export const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
      });
    }
    if (req.query.commentId) {
      return res.status(404).json({
        message: 'Please give comment id',
      });
    }

    const commentIndex = post.comments.findIndex(
      (item) => item._id.toString() === req.body.commentId.toString()
    );
    if (commentIndex === -1) {
      return res.status(400).json({
        message: 'Comment not found',
      });
    }
    const comment = post.comments[commentIndex];
    if (
      post.owner.toString() === req.user._id.toString() ||
      comment.user.toString() === req.user._id.toString()
    ) {
      post.comments.splice(commentIndex, 1);
      await post.save();
      return res.json({
        message: 'Comment deleted',
      });
    } else {
      return res.status(400).json({
        message: 'You are not allowed to delete this comment',
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// like unlike post
export const likeUnlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
      });
    }
    if (post.likes.includes(req.user._id)) {
      const index = post.likes.indexOf(req.user._id);
      post.likes.splice(index, 1);

      await post.save();
      res.json({
        message: 'Post Unliked',
      });
    } else {
      post.likes.push(req.user._id);
      await post.save();
      res.json({
        message: 'Post liked',
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
