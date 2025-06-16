import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "@/components/ui/image-upload";
import { Checkbox } from "@/components/ui/checkbox";
import { createCulturalItem, updateCulturalItem } from "@/lib/services/cultural";
import { CulturalItem } from "@/types/schema";
import { toast } from "@/components/ui/use-toast";

interface CultureFormProps {
  item?: CulturalItem;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CultureForm({ item, onSuccess, onCancel }: CultureFormProps) {
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: item?.title || "",
    description: item?.description || "",
    image_url: item?.image_url || "",
    category: item?.category || "",
    is_featured: item?.is_featured || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (item) {
        await updateCulturalItem(
          item.id,
          {
            title: formData.title,
            description: formData.description,
            category: formData.category,
            image_url: formData.image_url,
            is_featured: formData.is_featured
          },
          selectedImage || undefined
        );
        toast({
          title: "Success",
          description: "Cultural item updated successfully",
        });
      } else {
        if (!selectedImage) {
          throw new Error("Please select an image");
        }
        await createCulturalItem(
          {
            title: formData.title,
            description: formData.description,
            category: formData.category,
            image_url: "",
            is_featured: formData.is_featured
          },
          selectedImage
        );
        toast({
          title: "Success",
          description: "Cultural item created successfully",
        });
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving cultural item:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save cultural item",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            required
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tradition">Tradition</SelectItem>
              <SelectItem value="festival">Festival</SelectItem>
              <SelectItem value="craft">Craft</SelectItem>
              <SelectItem value="music">Music</SelectItem>
              <SelectItem value="dance">Dance</SelectItem>
              <SelectItem value="food">Food</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_featured"
            checked={formData.is_featured}
            onCheckedChange={(checked) => 
              setFormData((prev) => ({ ...prev, is_featured: checked as boolean }))
            }
          />
          <Label htmlFor="is_featured">Feature this item on the home page</Label>
        </div>

        <div>
          <Label>Image</Label>
          <ImageUpload
            currentImageUrl={formData.image_url}
            onImageSelected={(file) => setSelectedImage(file)}
            className="mt-1"
          />
          {!item && !selectedImage && (
            <p className="text-sm text-red-500 mt-1">* Image is required for new items</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : item ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}