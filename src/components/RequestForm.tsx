import { useState, FormEvent } from "react";
import { useConvex } from "convex/react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import DOMPurify from "dompurify";

export default function RequestFeatureForm() {
  const [open, setOpen] = useState(true);
  const [formData, setFormData] = useState({
    feature: "",
    description: "",
    priority: "",
    category: "",
  });
  const convex = useConvex();

  const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    
    if (!["low", "medium", "high"].includes(formData.priority)) {
      toast.error("Invalid priority", {
        description: `Please select a valid priority`,
        action: {
          label: "Close",
          onClick: () => setOpen(false),
        },
      });
      return;
    }
    if (!["feature", "bug", "improvement"].includes(formData.category)) {
      toast.error("Invalid category", {
        description: `Please select a valid category`,
        action: {
          label: "Close",
          onClick: () => setOpen(false),
        },
      });
      return;
    }
    const sanitizedFeature = DOMPurify.sanitize(formData.feature);
    const sanitizedDescription = DOMPurify.sanitize(formData.description);

    if (sanitizedFeature.length === 0 || sanitizedFeature.length > 100) {
        toast.error("Feature name must be between 1-100 characters", {
          description: `Please enter a valid feature name`,
          action: {
            label: "Close",
            onClick: () => setOpen(false),
          },
        });
        return;
      }
      if (sanitizedDescription.length === 0 || sanitizedDescription.length > 1000) {
        toast.error("Description must be between 1-1000 characters", {
          description: `Please enter a valid description`,
          action: {
            label: "Close",
            onClick: () => setOpen(false),
          },
        });
        return;
      }

    try {
      await convex.mutation(api.featureRequests.submitFeatureRequest, {
        feature: sanitizedFeature,
        description: sanitizedDescription,
        priority: formData.priority as "low" | "medium" | "high",
        category: formData.category as "feature" | "bug" | "improvement",
      });
      setOpen(false);
      handleToast();
    } catch (error) {
      console.error("Failed to submit:", error);
      toast.error("Failed to submit feature request");
    }
  };

  const handleToast = () => {
    toast.success(`${formData.category} request submitted successfully`, {
      description: `Thank you for your ${formData.category} request!`,
      action: {
        label: "Close",
        onClick: () => setOpen(false),
      },
    });
  };

  return (
    <>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <h1>Request a Feature</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 mb-4">
            <Input
              type="text"
              placeholder="Feature Name"
              className="w-full"
              name="feature"
              value={formData.feature}
              onChange={(e) => setFormData({ ...formData, feature: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-4">
            <Textarea
              placeholder="Description"
              className="w-full"
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4 mb-4">
            <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="feature">Feature</SelectItem>
                <SelectItem value="bug">Bug</SelectItem>
                <SelectItem value="improvement">Improvement</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-4">\
          <Button type="button" onClick={() => setOpen(false)} className="bg-gradient-to-r from-[#8332d5] to-[#0088ff]">
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-[#00ff88] to-[#0088ff]" onClick={() => {
              handleSubmit();
            }}>
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
}