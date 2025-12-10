import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  BookOpen, 
  Search,
  HelpCircle,
  Send,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  FileText,
  Video,
  Users,
  ArrowRight,
  Sparkles,
  Bot,
  Headphones
} from 'lucide-react';
import Header from '@/components/Header';

const mockFAQs = [
  {
    id: 1,
    question: "How do I upload documents for analysis?",
    answer: "Go to the Dashboard and use the 'Upload PDF' button. You can also drag and drop files directly onto the upload zone.",
    category: "Getting Started",
    helpful: 45
  },
  {
    id: 2,
    question: "How accurate are the AI-generated flashcards?",
    answer: "Our AI creates flashcards based on your uploaded content with high accuracy. You can always edit and customize them as needed.",
    category: "AI Features",
    helpful: 32
  },
  {
    id: 3,
    question: "Can I use Impify offline?",
    answer: "Currently, Impify requires an internet connection for AI analysis and cloud synchronization. Offline mode is planned for future updates.",
    category: "Technical",
    helpful: 28
  },
  {
    id: 4,
    question: "How does the study progress tracking work?",
    answer: "Your study progress is automatically tracked when you review flashcards and interact with study materials. Progress is displayed in your dashboard.",
    category: "Features",
    helpful: 38
  },
  {
    id: 5,
    question: "Is my data secure and private?",
    answer: "Yes, we use industry-standard encryption and security measures. Your documents and study data are private and secure.",
    category: "Security",
    helpful: 52
  }
];

const mockCategories = [
  { id: 'all', name: 'All Topics', icon: BookOpen, color: 'text-primary' },
  { id: 'getting-started', name: 'Getting Started', icon: HelpCircle, color: 'text-blue-500' },
  { id: 'ai-features', name: 'AI Features', icon: Sparkles, color: 'text-purple-500' },
  { id: 'technical', name: 'Technical', icon: FileText, color: 'text-green-500' },
  { id: 'features', name: 'Features', icon: CheckCircle, color: 'text-indigo-500' },
  { id: 'security', name: 'Security', icon: AlertCircle, color: 'text-red-500' },
];

const Support = ({ user, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const filteredFAQs = mockFAQs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           faq.category.toLowerCase().replace(' ', '-') === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Your message has been sent! We\'ll get back to you soon.');
      setContactForm({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        message: ''
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (field, value) => {
    setContactForm(prev => ({
      ...prev,
      [field]: value
    }));
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

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    },
    hover: {
      y: -4,
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="overflow-auto">
        <motion.div
          ref={ref}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Header */}
          <motion.div 
            className="mb-8"
            variants={headerVariants}
          >
            <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl p-8 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <motion.h1 
                    className="text-4xl font-bold text-foreground mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Help & Support
                  </motion.h1>
                  <motion.p 
                    className="text-lg text-muted-foreground"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Get help, find answers, and connect with our support team
                  </motion.p>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                    <Headphones className="w-8 h-8 text-white" />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Quick Help Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            variants={containerVariants}
          >
            <motion.div variants={cardVariants} whileHover="hover">
              <Card className="bg-card border border-border rounded-xl p-6 text-center cursor-pointer h-full">
                <motion.div 
                  className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <MessageSquare className="w-6 h-6 text-primary" />
                </motion.div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Live Chat</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Chat with our AI assistant or connect with a human agent
                </p>
                <Button className="w-full bg-primary/10 hover:bg-primary/20 text-primary border-primary/20">
                  Start Chat
                </Button>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants} whileHover="hover">
              <Card className="bg-card border border-border rounded-xl p-6 text-center cursor-pointer h-full">
                <motion.div 
                  className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Video className="w-6 h-6 text-blue-500" />
                </motion.div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Video Call</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Schedule a video call with our support specialists
                </p>
                <Button className="w-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 border-blue-500/20">
                  Schedule Call
                </Button>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants} whileHover="hover">
              <Card className="bg-card border border-border rounded-xl p-6 text-center cursor-pointer h-full">
                <motion.div 
                  className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Mail className="w-6 h-6 text-green-500" />
                </motion.div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Email Support</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Send us a detailed message and we'll respond within 24 hours
                </p>
                <Button className="w-full bg-green-500/10 hover:bg-green-500/20 text-green-600 border-green-500/20">
                  Send Email
                </Button>
              </Card>
            </motion.div>
          </motion.div>

          {/* Search and Filter */}
          <motion.div 
            className="mb-8"
            variants={itemVariants}
          >
            <Card className="bg-card border border-border rounded-xl p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search FAQs and help articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background border-border text-foreground placeholder-muted-foreground"
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full lg:w-48 bg-background border-border text-foreground">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {mockCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id} className="text-foreground">
                        <div className="flex items-center gap-2">
                          <category.icon size={16} className={category.color} />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* FAQ Section */}
            <motion.div 
              className="lg:col-span-2"
              variants={containerVariants}
            >
              <motion.div 
                className="mb-6"
                variants={itemVariants}
              >
                <h2 className="text-2xl font-bold text-foreground mb-2">Frequently Asked Questions</h2>
                <p className="text-muted-foreground">
                  Find quick answers to common questions about Impify
                </p>
              </motion.div>

              <div className="space-y-4">
                <AnimatePresence>
                  {filteredFAQs.map((faq, index) => (
                    <motion.div
                      key={faq.id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      transition={{ delay: index * 0.1 }}
                      layout
                    >
                      <Card 
                        className="bg-card border border-border rounded-xl overflow-hidden cursor-pointer"
                        onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                      >
                        <CardContent className="p-0">
                          <div className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 pr-4">
                                <div className="flex items-center gap-3 mb-2">
                                  <Badge variant="outline" className="text-xs">
                                    {faq.category}
                                  </Badge>
                                  <div className="flex items-center gap-1 text-xs text-muted">
                                    <CheckCircle size={12} />
                                    {faq.helpful} helpful
                                  </div>
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">
                                  {faq.question}
                                </h3>
                              </div>
                              
                              <motion.div
                                animate={{ rotate: expandedFAQ === faq.id ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ArrowRight size={20} className="text-muted-foreground" />
                              </motion.div>
                            </div>
                          </div>
                          
                          <AnimatePresence>
                            {expandedFAQ === faq.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="border-t border-border"
                              >
                                <div className="p-6 pt-4">
                                  <p className="text-muted-foreground leading-relaxed">
                                    {faq.answer}
                                  </p>
                                  
                                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                                    <span className="text-sm text-muted">
                                      Was this helpful?
                                    </span>
                                    <div className="flex gap-2">
                                      <Button size="sm" variant="outline" className="button-dark text-xs">
                                        Yes
                                      </Button>
                                      <Button size="sm" variant="outline" className="button-dark text-xs">
                                        No
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {filteredFAQs.length === 0 && (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <HelpCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No results found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search terms or browse all categories
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              className="lg:col-span-1"
              variants={itemVariants}
            >
              <Card className="bg-card border border-border rounded-xl p-6 sticky top-8">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-foreground mb-2">Contact Support</h3>
                  <p className="text-muted-foreground text-sm">
                    Can't find what you're looking for? Send us a message.
                  </p>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      placeholder="Your name"
                      value={contactForm.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      required
                      className="bg-background border-border text-foreground"
                    />
                  </div>

                  <div>
                    <Input
                      type="email"
                      placeholder="Your email"
                      value={contactForm.email}
                      onChange={(e) => handleFormChange('email', e.target.value)}
                      required
                      className="bg-background border-border text-foreground"
                    />
                  </div>

                  <div>
                    <Select value={contactForm.category} onValueChange={(value) => handleFormChange('category', value)}>
                      <SelectTrigger className="bg-background border-border text-foreground">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="general" className="text-foreground">General Question</SelectItem>
                        <SelectItem value="technical" className="text-foreground">Technical Issue</SelectItem>
                        <SelectItem value="billing" className="text-foreground">Billing & Account</SelectItem>
                        <SelectItem value="feature" className="text-foreground">Feature Request</SelectItem>
                        <SelectItem value="bug" className="text-foreground">Bug Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Input
                      type="text"
                      placeholder="Subject"
                      value={contactForm.subject}
                      onChange={(e) => handleFormChange('subject', e.target.value)}
                      required
                      className="bg-background border-border text-foreground"
                    />
                  </div>

                  <div>
                    <Textarea
                      placeholder="Describe your question or issue..."
                      value={contactForm.message}
                      onChange={(e) => handleFormChange('message', e.target.value)}
                      required
                      rows={4}
                      className="bg-background border-border text-foreground resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={16} className="mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-border">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock size={14} />
                      <span>Response time: Usually within 24 hours</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User size={14} />
                      <span>Powered by AI and human support</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Additional Resources */}
          <motion.div 
            className="mt-12"
            variants={itemVariants}
          >
            <Card className="bg-card border border-border rounded-xl p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">More Resources</h3>
                <p className="text-muted-foreground">
                  Explore additional ways to get help and learn more about Impify
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: FileText,
                    title: "Documentation",
                    description: "Detailed guides and API docs",
                    color: "text-blue-500 bg-blue-500/10"
                  },
                  {
                    icon: Video,
                    title: "Video Tutorials",
                    description: "Step-by-step video guides",
                    color: "text-purple-500 bg-purple-500/10"
                  },
                  {
                    icon: Users,
                    title: "Community Forum",
                    description: "Connect with other users",
                    color: "text-green-500 bg-green-500/10"
                  },
                  {
                    icon: Bot,
                    title: "AI Assistant",
                    description: "Get instant answers",
                    color: "text-indigo-500 bg-indigo-500/10"
                  }
                ].map((resource, index) => (
                  <motion.div
                    key={resource.title}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                    whileHover="hover"
                  >
                    <Card className="bg-card border border-border rounded-xl p-6 text-center cursor-pointer h-full">
                      <div className={`w-12 h-12 ${resource.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                        <resource.icon size={24} />
                      </div>
                      <h4 className="font-semibold text-foreground mb-2">{resource.title}</h4>
                      <p className="text-muted-foreground text-sm mb-4">{resource.description}</p>
                      <Button size="sm" variant="outline" className="button-dark gap-2">
                        Explore <ExternalLink size={14} />
                      </Button>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Support;