import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "@/components/ui/image-upload";
import { createGalleryItem, updateGalleryItem } from "@/lib/services/gallery";
import { GalleryItem } from "@/types/schema";
import { toast } from "@/components/ui/use-toast";

interface GalleryFormProps {
  item?: GalleryItem;
  onSuccess: () => void;
  onCancel: () => void;
}

export function GalleryForm({ item, onSuccess, onCancel }: GalleryFormProps) {
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: item?.title || "",
    description: item?.description || "",
    image_url: item?.image_url || "",
    category: item?.category || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (item) {
        await updateGalleryItem(
          item.id,
          {
            title: formData.title,
            description: formData.description,
            category: formData.category,
            image_url: formData.image_url
          },
          selectedImage || undefined
        );
        toast({
          title: "Success",
          description: "Gallery item updated successfully",
        });
      } else {
        if (!selectedImage) {
          throw new Error("Please select an image");
        }
        await createGalleryItem(
          {
            title: formData.title,
            description: formData.description,
            category: formData.category,
            image_url: "" // This will be set by the service after upload
          },
          selectedImage
        );
        toast({
          title: "Success",
          description: "Gallery item created successfully",
        });
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving gallery item:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save gallery item",
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
              <SelectItem value="nature">Nature</SelectItem>
              <SelectItem value="culture">Culture</SelectItem>
              <SelectItem value="events">Events</SelectItem>
              <SelectItem value="people">People</SelectItem>
              <SelectItem value="architecture">Architecture</SelectItem>
              <SelectItem value="landscape">Landscape</SelectItem>
            </SelectContent>
          </Select>
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