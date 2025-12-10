import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import axiosInstance from '@/api/axios';
import { ENDPOINTS } from '@/api/api';
import {
  Users,
  MessageSquare,
  Heart,
  Share2,
  Search,
  Filter,
  Plus,
  Clock,
  Eye,
  MessageCircle,
  ThumbsUp,
  Award,
  BookOpen,
  FileText,
  Calendar,
  MoreHorizontal,
  Bell,
  UserCheck,
  UserPlus
} from 'lucide-react';

const Community = ({ user, onLogout }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [posting, setPosting] = useState(false);
  
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(ENDPOINTS.communityPosts);
      const postsData = response.data.posts || [];

      // Transform API data to match component structure
      const transformedPosts = postsData.map(post => ({
        id: post.id,
        title: post.content.substring(0, 50) + (post.content.length > 50 ? '...' : ''), // Create title from content
        content: post.content,
        author: {
          name: post.author.name,
          avatar: post.author.name.charAt(0).toUpperCase(),
          verified: false, // API doesn't provide this
          title: post.author.role || "Community Member"
        },
        category: "General", // API doesn't provide categories yet
        likes: post.likes_count,
        comments: 0, // API doesn't provide this yet
        views: 0, // API doesn't provide this yet
        timeAgo: formatTimeAgo(post.created_at),
        tags: [], // API doesn't provide tags yet
        is_liked: post.is_liked
      }));

      setPosts(transformedPosts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      toast.error('Failed to load community posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) return 'Today';
      if (diffDays === 2) return 'Yesterday';
      if (diffDays <= 7) return `${diffDays - 1} days ago`;

      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return 'Unknown date';
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await axiosInstance.post(ENDPOINTS.communityPostLike(postId));

      // Update local state based on API response
      setPosts(prev => prev.map(post =>
        post.id === postId
          ? {
              ...post,
              likes: response.data.likes_count,
              is_liked: !post.is_liked
            }
          : post
      ));

      toast.success(response.data.likes_count > 0 ? 'Post liked!' : 'Like removed!');
    } catch (error) {
      console.error('Failed to like post:', error);
      toast.error('Failed to like post');
    }
  };

  const handleFollow = (authorId) => {
    toast.success('Followed successfully!');
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      toast.error('Please enter some content for your post');
      return;
    }

    try {
      setPosting(true);
      const response = await axiosInstance.post(ENDPOINTS.communityPosts, {
        content: newPostContent.trim()
      });

      // Add the new post to the local state
      const newPost = {
        id: response.data.post.id,
        title: newPostContent.substring(0, 50) + (newPostContent.length > 50 ? '...' : ''),
        content: newPostContent,
        author: {
          name: user?.name || 'You',
          avatar: user?.name?.charAt(0).toUpperCase() || 'Y',
          verified: false,
          title: "Community Member"
        },
        category: "General",
        likes: 0,
        comments: 0,
        views: 0,
        timeAgo: 'Just now',
        tags: [],
        is_liked: false
      };

      setPosts(prev => [newPost, ...prev]);
      setNewPostContent('');
      setShowCreatePost(false);
      toast.success('Post created successfully!');
    } catch (error) {
      console.error('Failed to create post:', error);
      toast.error('Failed to create post');
    } finally {
      setPosting(false);
    }
  };

  const categoryIcons = {
    'Study Tips': BookOpen,
    'AI Tools': FileText,
    'Resources': Award,
    'Questions': MessageSquare
  };

  const categoryColors = {
    'Study Tips': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    'AI Tools': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    'Resources': 'bg-green-500/10 text-green-600 border-green-500/20',
    'Questions': 'bg-orange-500/10 text-orange-600 border-orange-500/20'
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const postVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };


  const sidebarVariants = {
    hidden: { opacity: 0, x: -60 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="flex-1 overflow-auto">
        <motion.div
          ref={ref}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Header */}
          <motion.div 
            className="mb-8"
            variants={postVariants}
          >
            <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl p-8 border border-border">
              <motion.h1 
                className="text-4xl font-bold text-foreground mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Community Hub
              </motion.h1>
              <motion.p 
                className="text-lg text-muted-foreground mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Connect with fellow students, share knowledge, and discover study resources
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                  onClick={() => setShowCreatePost(true)}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Post
                </Button>
              </motion.div>
            </div>
          </motion.div>


          {/* Search Bar */}
          <motion.div
            className="mb-6"
            variants={postVariants}
          >
            <Card className="bg-card border border-border rounded-xl p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search posts, topics, or users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                />
              </div>
            </Card>
          </motion.div>

          {/* Posts */}
          <motion.div
            className="space-y-6"
            variants={containerVariants}
          >
              {loading ? (
                <div className="text-center py-12">
                  <motion.div
                    className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <p className="mt-4 text-muted-foreground">Loading posts...</p>
                </div>
              ) : filteredPosts.length === 0 ? (
                <Card className="bg-card border border-border rounded-xl p-12 text-center">
                  <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No posts found</h3>
                  <p className="text-muted-foreground mb-6">Be the first to share something with the community!</p>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Post
                  </Button>
                </Card>
              ) : (
                filteredPosts.map((post, index) => {
                  const Icon = categoryIcons[post.category] || FileText;
                  const colorClass = categoryColors[post.category] || 'bg-gray-500/10 text-gray-600 border-gray-500/20';
                  
                  return (
                    <motion.div
                      key={post.id}
                      variants={postVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-elevated transition-all duration-300 group">
                        <CardContent className="p-6">
                          {/* Post Header */}
                          <div className="flex items-start gap-4 mb-4">
                            <motion.div
                              className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-semibold text-lg"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {post.author.avatar}
                            </motion.div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                  {post.author.name}
                                </h4>
                                {post.author.verified && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.3 }}
                                  >
                                    <Award className="w-4 h-4 text-blue-500" />
                                  </motion.div>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{post.author.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Clock className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{post.timeAgo}</span>
                              </div>
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Post Content */}
                          <div className="mb-4">
                            <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                              {post.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                              {post.content}
                            </p>
                          </div>

                          {/* Category Badge */}
                          <div className="mb-4">
                            <Badge variant="outline" className={colorClass}>
                              <Icon className="w-3 h-3 mr-1" />
                              {post.category}
                            </Badge>
                          </div>

                          {/* Tags */}
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {post.tags.map((tag, tagIndex) => (
                                <motion.span
                                  key={tag}
                                  className="px-2 py-1 bg-muted/50 text-muted-foreground text-xs rounded-full border border-border"
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: tagIndex * 0.1 }}
                                >
                                  #{tag}
                                </motion.span>
                              ))}
                            </div>
                          )}

                          {/* Post Actions */}
                          <div className="flex items-center justify-between pt-4 border-t border-border">
                            <div className="flex items-center gap-6">
                              <motion.button
                                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleLike(post.id)}
                              >
                                <Heart className="w-4 h-4 group-hover:fill-current" />
                                <span className="text-sm">{post.likes}</span>
                              </motion.button>
                              
                              <motion.button
                                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <MessageCircle className="w-4 h-4" />
                                <span className="text-sm">{post.comments}</span>
                              </motion.button>
                              
                              <motion.button
                                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Eye className="w-4 h-4" />
                                <span className="text-sm">{post.views}</span>
                              </motion.button>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-primary"
                              >
                                <Share2 className="w-4 h-4" />
                              </Button>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleFollow(post.author.id)}
                                className="button-dark"
                              >
                                <UserPlus className="w-4 h-4 mr-1" />
                                Follow
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })
              )}
          </motion.div>
        </motion.div>
      </div>

      {/* Create Post Modal */}
      <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
            <DialogDescription>
              Share your thoughts, questions, or study tips with the community.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Textarea
              placeholder="What's on your mind? Share your study experiences, ask questions, or help others learn..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="min-h-[120px] resize-none"
              maxLength={1000}
            />
            <div className="text-xs text-muted-foreground text-right">
              {newPostContent.length}/1000 characters
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreatePost(false);
                setNewPostContent('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreatePost}
              disabled={!newPostContent.trim() || posting}
              className="bg-primary hover:bg-primary/90"
            >
              {posting ? (
                <>
                  <motion.div
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Posting...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Post
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Community;