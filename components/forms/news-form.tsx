import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "@/components/ui/image-upload";
import { createNewsArticle, updateNewsArticle } from "@/lib/services/news";
import { NewsArticle } from "@/types/schema";
import { toast } from "@/components/ui/use-toast";

interface NewsFormProps {
  article?: NewsArticle;
  onSuccess: () => void;
  onCancel: () => void;
}

export function NewsForm({ article, onSuccess, onCancel }: NewsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: article?.title || "",
    content: article?.content || "",
    excerpt: article?.excerpt || "",
    category: article?.category || "",
    author: article?.author || "",
    featured: article?.featured || false,
    publish_date: article?.publish_date || new Date().toISOString().split('T')[0]
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, featured: checked }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (article) {
        // Update existing article
        await updateNewsArticle(article.id, {
          ...formData,
          image_url: article.image_url
        }, selectedImage || undefined);
        toast({ title: "Success", description: "News article updated successfully" });
      } else {
        // Create new article
        if (!selectedImage) {
          throw new Error("Please select an image");
        }
        await createNewsArticle({
          ...formData,
          image_url: "" // This will be set after upload
        }, selectedImage);
        toast({ title: "Success", description: "News article created successfully" });
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving news article:", error);
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "Failed to save news article", 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            required
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={8}
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select 
            value={formData.category} 
            onValueChange={handleSelectChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="events">Events</SelectItem>
              <SelectItem value="announcements">Announcements</SelectItem>
              <SelectItem value="tourism">Tourism</SelectItem>
              <SelectItem value="culture">Culture</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="publishDate">Publish Date</Label>
          <Input
            id="publishDate"
            name="publish_date"
            type="date"
            value={formData.publish_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="featured" 
            checked={formData.featured}
            onCheckedChange={handleCheckboxChange}
          />
          <Label htmlFor="featured">Featured Article</Label>
        </div>

        <div>
          <Label>Image</Label>
          <ImageUpload 
            onImageSelected={(file) => setSelectedImage(file)}
            currentImageUrl={article?.image_url}
            className="mt-1"
          />
          {!article && !selectedImage && (
            <p className="text-sm text-red-500 mt-1">* Image is required for new articles</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
              {article ? "Updating..." : "Creating..."}
            </>
          ) : (
            article ? "Update Article" : "Create Article"
          )}
        </Button>
      </div>
    </form>
  );
}