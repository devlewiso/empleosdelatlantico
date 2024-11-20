import { useState, useEffect } from 'react';
import { JobPost } from '../types';

const REPORT_THRESHOLD = 3; // Number of reports before auto-hiding

export function useJobPosts() {
  const [posts, setPosts] = useState<JobPost[]>([]);

  useEffect(() => {
    const loadPosts = () => {
      const savedPosts = localStorage.getItem('jobPosts');
      if (savedPosts) {
        const parsedPosts = JSON.parse(savedPosts);
        // Filter out posts older than 24 hours and hidden posts
        const currentTime = Date.now();
        const activePosts = parsedPosts.filter(
          (post: JobPost) => 
            currentTime - post.timestamp < 24 * 60 * 60 * 1000 && 
            !post.hidden
        );
        setPosts(activePosts);
        // Update storage if posts were filtered out
        if (activePosts.length !== parsedPosts.length) {
          localStorage.setItem('jobPosts', JSON.stringify(activePosts));
        }
      }
    };

    loadPosts();
    // Check for expired posts every minute
    const interval = setInterval(loadPosts, 60000);
    return () => clearInterval(interval);
  }, []);

  const addPost = (post: Omit<JobPost, 'id' | 'likes' | 'timestamp' | 'reports' | 'hidden'>) => {
    const newPost: JobPost = {
      ...post,
      id: Date.now().toString(),
      likes: 0,
      timestamp: Date.now(),
      reports: 0,
      hidden: false,
    };
    const updatedPosts = [newPost, ...posts];
    localStorage.setItem('jobPosts', JSON.stringify(updatedPosts));
    setPosts(updatedPosts);
  };

  const likePost = (postId: string) => {
    const updatedPosts = posts.map((post) =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    );
    localStorage.setItem('jobPosts', JSON.stringify(updatedPosts));
    setPosts(updatedPosts);
  };

  const reportPost = (postId: string) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        const reports = post.reports + 1;
        return {
          ...post,
          reports,
          hidden: reports >= REPORT_THRESHOLD
        };
      }
      return post;
    }).filter(post => !post.hidden);
    
    localStorage.setItem('jobPosts', JSON.stringify(updatedPosts));
    setPosts(updatedPosts);
  };

  return { posts, addPost, likePost, reportPost };
}