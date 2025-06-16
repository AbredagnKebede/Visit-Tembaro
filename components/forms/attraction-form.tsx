import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "@/components/ui/image-upload";
import { createAttraction, updateAttraction } from "@/lib/services/attractions";
import { Attraction } from "@/types/schema";
import { toast } from "@/components/ui/use-toast";

interface AttractionFormProps {
  attraction?: Attraction | null;
  onSuccess: () => void;
  onCancel: () => void;
  className?: string;
}

export function AttractionForm({ attraction, onSuccess, onCancel }: AttractionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: attraction?.name || "",
    short_description: attraction?.short_description || "",
    description: attraction?.description || "",
    category: attraction?.category || "",
    featured: attraction?.featured || false,
    location: {
      latitude: attraction?.location.latitude || 0,
      longitude: attraction?.location.longitude || 0,
      address: attraction?.location.address || ""
    },
    duration: attraction?.duration || "",
    difficulty: attraction?.difficulty || "",
    accessibility: attraction?.accessibility || "",
    highlights: attraction?.highlights.join(',') || "",
    best_time: attraction?.best_time || ""
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: locationField === 'latitude' || locationField === 'longitude' 
            ? parseFloat(value) || 0 
            : value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
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
      const dataToSubmit = {
        ...formData,
        highlights: formData.highlights.split(',').map(item => item.trim()).filter(item => item !== '')
      };

      if (attraction) {
        await updateAttraction(attraction.id, {
          ...dataToSubmit,
          image_url: attraction.image_url
        }, selectedImage || undefined);
        toast({ title: "Success", description: "Attraction updated successfully" });
      } else {
        if (!selectedImage) {
          throw new Error("Please select an image");
        }
        await createAttraction({
          ...dataToSubmit,
          image_url: ""
        }, selectedImage);
        toast({ title: "Success", description: "Attraction created successfully" });
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving attraction:", error);
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "Failed to save attraction", 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 h-full flex flex-col">
      <div className="space-y-4 flex-grow overflow-y-auto pr-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="shortDescription">Short Description</Label>
          <Textarea
            id="shortDescription"
            name="short_description"
            value={formData.short_description}
            onChange={handleChange}
            required
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="description">Full Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={6}
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
              <SelectItem value="natural">Natural Attraction</SelectItem>
              <SelectItem value="historical">Historical Site</SelectItem>
              <SelectItem value="recreational">Recreational</SelectItem>
              <SelectItem value="cultural">Cultural Site</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="difficulty">Difficulty</Label>
          <Input
            id="difficulty"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="accessibility">Accessibility</Label>
          <Input
            id="accessibility"
            name="accessibility"
            value={formData.accessibility}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="best_time">Best Time</Label>
          <Input
            id="best_time"
            name="best_time"
            value={formData.best_time}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="highlights">Highlights (comma-separated)</Label>
          <Textarea
            id="highlights"
            name="highlights"
            value={formData.highlights}
            onChange={handleChange}
            placeholder="e.g., Panoramic views, Sunset viewing, Photography opportunities"
            rows={3}
          />
        </div>

        <div>
          <Label>Location</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
            <div>
              <Label htmlFor="location.latitude" className="text-xs">Latitude</Label>
              <Input
                id="location.latitude"
                name="location.latitude"
                type="number"
                step="any"
                value={formData.location.latitude}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="location.longitude" className="text-xs">Longitude</Label>
              <Input
                id="location.longitude"
                name="location.longitude"
                type="number"
                step="any"
                value={formData.location.longitude}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="mt-2">
            <Label htmlFor="location.address" className="text-xs">Address</Label>
            <Input
              id="location.address"
              name="location.address"
              value={formData.location.address}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="featured" 
            checked={formData.featured}
            onCheckedChange={handleCheckboxChange}
          />
          <Label htmlFor="featured">Featured Attraction</Label>
        </div>

        <div>
          <Label>Image</Label>
          <ImageUpload 
            onImageSelected={(file) => setSelectedImage(file)}
            currentImageUrl={attraction?.image_url}
            className="mt-1"
          />
          {!attraction && !selectedImage && (
            <p className="text-sm text-red-500 mt-1">* Image is required for new attractions</p>
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
              {attraction ? "Updating..." : "Creating..."}
            </>
          ) : (
            attraction ? "Update Attraction" : "Create Attraction"
          )}
        </Button>
      </div>
    </form>
  );
}