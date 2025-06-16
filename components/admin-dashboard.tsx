"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"
import { Mountain, LogOut, Upload, FileText, ImageIcon, MapPin, Users, Calendar, Mail, Trash2, Eye, Check, Plus, X, AlertCircle } from "lucide-react"
import { NewsForm } from "@/components/forms/news-form"
import { AttractionForm } from "@/components/forms/attraction-form"
import { GalleryForm } from "@/components/forms/gallery-form"
import { CultureForm } from "@/components/forms/culture-form"

// Import Firebase services
import { getAllContactMessages, markMessageAsRead, deleteContactMessage } from "@/lib/services/contact"
import { getAllNewsArticles, createNewsArticle, updateNewsArticle, deleteNewsArticle } from "@/lib/services/news"
import { getAllAttractions, createAttraction, updateAttraction, deleteAttraction } from "@/lib/services/attractions"
import { getAllGalleryItems, createGalleryItem, deleteGalleryItem } from "@/lib/services/gallery"
import { getAllCulturalItems, createCulturalItem, updateCulturalItem, deleteCulturalItem } from "@/lib/services/cultural"

// Import types
import { ContactMessage, NewsArticle, Attraction, GalleryItem, CulturalItem } from "@/types/schema"

// Update the AuthContextType interface
interface AuthContextType {
  user: User | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

export function AdminDashboard() {
  const { user, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  
  // State for data
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([])
  const [attractions, setAttractions] = useState<Attraction[]>([])
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [culturalItems, setCulturalItems] = useState<CulturalItem[]>([])
  
  // Loading states
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [loadingNews, setLoadingNews] = useState(false)
  const [loadingAttractions, setLoadingAttractions] = useState(false)
  const [loadingGallery, setLoadingGallery] = useState(false)
  const [loadingCulture, setLoadingCulture] = useState(false)
  
  // Error states
  const [messagesError, setMessagesError] = useState<string | null>(null)
  const [newsError, setNewsError] = useState<string | null>(null)
  const [attractionsError, setAttractionsError] = useState<string | null>(null)
  const [galleryError, setGalleryError] = useState<string | null>(null)
  const [cultureError, setCultureError] = useState<string | null>(null)
  
  // Selected item states
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  
  // Dialog states
  const [messageDialogOpen, setMessageDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{id: string, type: 'message' | 'news' | 'attraction' | 'gallery' | 'culture'} | null>(null)
  
  // Form states
  const [newsFormOpen, setNewsFormOpen] = useState(false)
  const [attractionFormOpen, setAttractionFormOpen] = useState(false)
  const [galleryFormOpen, setGalleryFormOpen] = useState(false)
  const [cultureFormOpen, setCultureFormOpen] = useState(false)
  const [selectedNewsArticle, setSelectedNewsArticle] = useState<NewsArticle | null>(null)
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null)
  const [selectedCulturalItem, setSelectedCulturalItem] = useState<CulturalItem | null>(null)
  
  // Load data when tab changes
  useEffect(() => {
    if (activeTab === "messages") {
      fetchMessages()
    } else if (activeTab === "news") {
      fetchNews()
    } else if (activeTab === "attractions") {
      fetchAttractions()
    } else if (activeTab === "gallery") {
      fetchGallery()
    } else if (activeTab === "culture") {
      fetchCulture()
    }
  }, [activeTab])
  
  // Fetch contact messages
  const fetchMessages = async () => {
    setLoadingMessages(true)
    setMessagesError(null)
    try {
      const data = await getAllContactMessages()
      setMessages(data)
    } catch (error) {
      console.error("Error fetching messages:", error)
      setMessagesError("Failed to load messages. Please try again.")
    } finally {
      setLoadingMessages(false)
    }
  }
  
  // Fetch news articles
  const fetchNews = async () => {
    setLoadingNews(true)
    setNewsError(null)
    try {
      const data = await getAllNewsArticles()
      setNewsArticles(data)
    } catch (error) {
      console.error("Error fetching news:", error)
      setNewsError("Failed to load news articles. Please try again.")
    } finally {
      setLoadingNews(false)
    }
  }
  
  // Fetch attractions
  const fetchAttractions = async () => {
    setLoadingAttractions(true)
    setAttractionsError(null)
    try {
      const data = await getAllAttractions()
      setAttractions(data)
    } catch (error) {
      console.error("Error fetching attractions:", error)
      setAttractionsError("Failed to load attractions. Please try again.")
    } finally {
      setLoadingAttractions(false)
    }
  }
  
  // Fetch gallery items
  const fetchGallery = async () => {
    setLoadingGallery(true)
    setGalleryError(null)
    try {
      const data = await getAllGalleryItems()
      setGalleryItems(data)
    } catch (error) {
      console.error("Error fetching gallery items:", error)
      setGalleryError("Failed to load gallery items. Please try again.")
    } finally {
      setLoadingGallery(false)
    }
  }
  
  // Fetch cultural items
  const fetchCulture = async () => {
    setLoadingCulture(true)
    setCultureError(null)
    try {
      const data = await getAllCulturalItems()
      setCulturalItems(data)
    } catch (error) {
      console.error("Error fetching cultural items:", error)
      setCultureError("Failed to load cultural items. Please try again.")
    } finally {
      setLoadingCulture(false)
    }
  }
  
  // View message details
  const viewMessage = async (message: ContactMessage) => {
    setSelectedMessage(message)
    setMessageDialogOpen(true)
    
    // Mark as read if not already read
    if (!message.read) {
      try {
        await markMessageAsRead(message.id)
        // Update the message in the list
        setMessages(messages.map(m => 
          m.id === message.id ? { ...m, read: true } : m
        ))
      } catch (error) {
        console.error("Error marking message as read:", error)
        toast({
          title: "Error",
          description: "Failed to mark message as read",
          variant: "destructive"
        })
      }
    }
  }
  
  // Confirm delete
  const confirmDelete = (id: string, type: 'message' | 'news' | 'attraction' | 'gallery' | 'culture') => {
    setItemToDelete({ id, type })
    setDeleteDialogOpen(true)
  }
  
  // Handle delete
  const handleDelete = async () => {
    if (!itemToDelete) return
    
    try {
      switch (itemToDelete.type) {
        case 'message':
          await deleteContactMessage(itemToDelete.id)
          setMessages(messages.filter(m => m.id !== itemToDelete.id))
          toast({ title: "Success", description: "Message deleted successfully" })
          break
        case 'news':
          await deleteNewsArticle(itemToDelete.id)
          setNewsArticles(newsArticles.filter(n => n.id !== itemToDelete.id))
          toast({ title: "Success", description: "News article deleted successfully" })
          break
        case 'attraction':
          await deleteAttraction(itemToDelete.id)
          setAttractions(attractions.filter(a => a.id !== itemToDelete.id))
          toast({ title: "Success", description: "Attraction deleted successfully" })
          break
        case 'gallery':
          await deleteGalleryItem(itemToDelete.id)
          setGalleryItems(galleryItems.filter(g => g.id !== itemToDelete.id))
          toast({ title: "Success", description: "Gallery item deleted successfully" })
          break
        case 'culture':
          await deleteCulturalItem(itemToDelete.id)
          setCulturalItems(culturalItems.filter(c => c.id !== itemToDelete.id))
          toast({ title: "Success", description: "Cultural item deleted successfully" })
          break
      }
    } catch (error) {
      console.error("Error deleting item:", error)
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive"
      })
    } finally {
      setDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  // Format date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString()
  }

  // Form functions
  const openNewsForm = (article?: NewsArticle) => {
    setSelectedNewsArticle(article || null)
    setNewsFormOpen(true)
  }

  const openAttractionForm = (attraction?: Attraction) => {
    setSelectedAttraction(attraction || null)
    setAttractionFormOpen(true)
  }

  const openGalleryForm = () => {
    setGalleryFormOpen(true)
  }

  const openCultureForm = (item?: CulturalItem) => {
    setSelectedCulturalItem(item || null)
    setCultureFormOpen(true)
  }

  // Update the message details display
  const MessageDetails = ({ message }: { message: ContactMessage | null }) => {
    if (!message) return null
    
    return (
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium">From:</p>
          <p>{message.name} ({message.email})</p>
        </div>
        <div>
          <p className="text-sm font-medium">Subject:</p>
          <p>{message.subject}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Message:</p>
          <p className="whitespace-pre-wrap">{message.message}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Date:</p>
          <p>{message.created_at && formatDate(message.created_at)}</p>
        </div>
      </div>
    )
  }

  const handleLogout = async () => {
    try {
      await signOut()
      // Redirect to login page or handle logout success
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Mountain className="h-8 w-8 text-green-600" />
              <span className="font-bold text-xl">Visit Tembaro Admin</span>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">{user?.email}</Badge>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Manage your tourism website content</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="attractions">Attractions</TabsTrigger>
            <TabsTrigger value="culture">Culture</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12,543</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Gallery Items</CardTitle>
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{galleryItems.length || 0}</div>
                  <p className="text-xs text-muted-foreground">Total items in gallery</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">News Articles</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{newsArticles.length || 0}</div>
                  <p className="text-xs text-muted-foreground">Total published articles</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Messages</CardTitle>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{messages.filter(m => !m.read).length || 0}</div>
                  <p className="text-xs text-muted-foreground">Unread inquiries</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest updates to your website</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {messages.length > 0 && (
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">New contact message from {messages[0].name}</p>
                          <p className="text-xs text-gray-500">{formatDate(messages[0].created_at)}</p>
                        </div>
                      </div>
                    )}
                    {newsArticles.length > 0 && (
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">News article published: {newsArticles[0].title}</p>
                          <p className="text-xs text-gray-500">{formatDate(newsArticles[0].publish_date)}</p>
                        </div>
                      </div>
                    )}
                    {galleryItems.length > 0 && (
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">New gallery image: {galleryItems[0].title}</p>
                          <p className="text-xs text-gray-500">{formatDate(galleryItems[0].created_at)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab("gallery")}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New Images
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab("news")}>
                    <FileText className="h-4 w-4 mr-2" />
                    Create News Article
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab("attractions")}>
                    <MapPin className="h-4 w-4 mr-2" />
                    Add New Attraction
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab("messages")}>
                    <Mail className="h-4 w-4 mr-2" />
                    View Messages
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="gallery">
            <Card>
              <CardHeader>
                <CardTitle>Gallery Management</CardTitle>
                <CardDescription>Upload and manage images and videos</CardDescription>
              </CardHeader>
              <CardContent>
                {galleryError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{galleryError}</AlertDescription>
                  </Alert>
                )}
                
                <div className="flex justify-end mb-4">
                  <Button onClick={openGalleryForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Gallery Item
                  </Button>
                </div>
                
                {loadingGallery ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-500">Loading gallery items...</p>
                  </div>
                ) : galleryItems.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No gallery items yet. Add your first image!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {galleryItems.map((item) => (
                      <Card key={item.id} className="overflow-hidden">
                        <div className="aspect-video relative">
                          <img 
                            src={item.image_url} 
                            alt={item.title} 
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium">{item.title}</h3>
                          <p className="text-sm text-gray-500 mb-2">{item.description}</p>
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => confirmDelete(item.id, 'gallery')}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="news">
            <Card>
              <CardHeader>
                <CardTitle>News Management</CardTitle>
                <CardDescription>Create and manage news articles and events</CardDescription>
              </CardHeader>
              <CardContent>
                {newsError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{newsError}</AlertDescription>
                  </Alert>
                )}
                
                <div className="flex justify-end mb-4">
                  <Button onClick={() => openNewsForm()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Article
                  </Button>
                </div>
                
                {loadingNews ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-500">Loading news articles...</p>
                  </div>
                ) : newsArticles.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No articles yet. Create your first news article!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {newsArticles.map((article) => (
                      <Card key={article.id}>
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/4 p-4">
                            <img 
                              src={article.image_url} 
                              alt={article.title} 
                              className="w-full h-32 object-cover rounded-md"
                            />
                          </div>
                          <div className="md:w-3/4 p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium text-lg">{article.title}</h3>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge>{article.category}</Badge>
                                  <span className="text-sm text-gray-500">{formatDate(article.publish_date)}</span>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm" onClick={() => openNewsForm(article)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => confirmDelete(article.id, 'news')}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{article.excerpt}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attractions">
            <Card>
              <CardHeader>
                <CardTitle>Attractions Management</CardTitle>
                <CardDescription>Add and edit tourist attractions</CardDescription>
              </CardHeader>
              <CardContent>
                {attractionsError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{attractionsError}</AlertDescription>
                  </Alert>
                )}
                
                <div className="flex justify-end mb-4">
                  <Button onClick={() => openAttractionForm()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Attraction
                  </Button>
                </div>
                
                {loadingAttractions ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-500">Loading attractions...</p>
                  </div>
                ) : attractions.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No attractions yet. Add your first tourist attraction!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {attractions.map((attraction) => (
                      <Card key={attraction.id}>
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/4 p-4">
                            <img 
                              src={attraction.image_url} 
                              alt={attraction.name} 
                              className="w-full h-32 object-cover rounded-md"
                            />
                          </div>
                          <div className="md:w-3/4 p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium text-lg">{attraction.name}</h3>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge>{attraction.category}</Badge>
                                  <span className="text-sm text-gray-500">{attraction.location.address}</span>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm" onClick={() => openAttractionForm(attraction)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => confirmDelete(attraction.id, 'attraction')}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{attraction.short_description}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="culture">
            <Card>
              <CardHeader>
                <CardTitle>Cultural Content</CardTitle>
                <CardDescription>Manage cultural heritage information</CardDescription>
              </CardHeader>
              <CardContent>
                {cultureError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{cultureError}</AlertDescription>
                  </Alert>
                )}
                
                <div className="flex justify-end mb-4">
                  <Button onClick={() => openCultureForm()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Cultural Item
                  </Button>
                </div>
                
                {loadingCulture ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-500">Loading cultural items...</p>
                  </div>
                ) : culturalItems.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No cultural items yet. Add your first cultural heritage item!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {culturalItems.map((item) => (
                      <Card key={item.id} className="overflow-hidden">
                        <div className="aspect-video relative">
                          <img 
                            src={item.image_url} 
                            alt={item.title} 
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium">{item.title}</h3>
                          <p className="text-sm text-gray-500 mb-2">{item.description}</p>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" size="sm" onClick={() => openCultureForm(item)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => confirmDelete(item.id, 'culture')}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Contact Messages</CardTitle>
                <CardDescription>View and respond to visitor inquiries</CardDescription>
              </CardHeader>
              <CardContent>
                {messagesError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{messagesError}</AlertDescription>
                  </Alert>
                )}
                
                {loadingMessages ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-500">Loading messages...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Mail className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No messages yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <Card key={message.id} className={message.read ? "" : "border-l-4 border-blue-500"}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{message.subject}</h3>
                              <p className="text-sm text-gray-500">From: {message.name} ({message.email})</p>
                              <p className="text-xs text-gray-400">{formatDate(message.created_at)}</p>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => viewMessage(message)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => confirmDelete(message.id, 'message')}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{message.message}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Message Dialog */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedMessage?.subject}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <MessageDetails message={selectedMessage} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMessageDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Form Dialogs */}
      <Dialog open={newsFormOpen} onOpenChange={setNewsFormOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedNewsArticle ? "Edit News Article" : "Create News Article"}</DialogTitle>
          </DialogHeader>
          <NewsForm 
            article={selectedNewsArticle || undefined}
            onSuccess={() => {
              setNewsFormOpen(false)
              fetchNews()
            }}
            onCancel={() => setNewsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={attractionFormOpen} onOpenChange={setAttractionFormOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedAttraction ? "Edit Attraction" : "Create New Attraction"}</DialogTitle>
            <DialogDescription>
              {selectedAttraction ? "Edit the details of the attraction." : "Fill in the details for a new attraction."}
            </DialogDescription>
          </DialogHeader>
          {attractionFormOpen && (
            <AttractionForm
              attraction={selectedAttraction}
              onSuccess={() => {
                setAttractionFormOpen(false)
                setSelectedAttraction(null)
                fetchAttractions()
              }}
              onCancel={() => {
                setAttractionFormOpen(false)
                setSelectedAttraction(null)
              }}
              className="p-4"
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={galleryFormOpen} onOpenChange={setGalleryFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Gallery Item</DialogTitle>
          </DialogHeader>
          <GalleryForm 
            onSuccess={() => {
              setGalleryFormOpen(false)
              fetchGallery()
            }}
            onCancel={() => setGalleryFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={cultureFormOpen} onOpenChange={setCultureFormOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedCulturalItem ? "Edit Cultural Item" : "Add Cultural Item"}</DialogTitle>
          </DialogHeader>
          <CultureForm 
            item={selectedCulturalItem || undefined}
            onSuccess={() => {
              setCultureFormOpen(false)
              fetchCulture()
            }}
            onCancel={() => setCultureFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
