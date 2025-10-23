import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { Plus, Trash2, Sparkles, Loader2, Music } from "lucide-react";
import { useState } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

interface SessionSetupProps {
  onSessionCreated: (sessionId: Id<"drawSessions">) => void;
}

// Available audio files in the public folder
const AUDIO_OPTIONS = [
  { value: "none", label: "No Audio" },
  { value: "/audio/ahfk.wav", label: "Ahhhh" },
  { value: "/audio/lloyd.wav", label: "Lloyd" },
  { value: "/audio/fen.wav", label: "Fenny" },
  { value: "/audio/geno.wav", label: "Genocide" },
  { value: "/audio/park.wav", label: "Park" },
];

export function SessionSetup({ onSessionCreated }: SessionSetupProps) {
  const [names, setNames] = useState<string[]>([""]);
  const [items, setItems] = useState<{ name: string; cooldown: number }[]>([
    { name: "", cooldown: 24 },
  ]);
  const [creating, setCreating] = useState(false);
  const [audioSelections, setAudioSelections] = useState<Record<string, string>>({});

  const createSession = useMutation(api.draws.createSession);

  const addName = () => {
    setNames([...names, ""]);
  };

  const removeName = (index: number) => {
    setNames(names.filter((_, i) => i !== index));
  };

  const updateName = (index: number, value: string) => {
    const newNames = [...names];
    newNames[index] = value;
    setNames(newNames);
  };

  const addItem = () => {
    setItems([...items, { name: "", cooldown: 24 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: "name" | "cooldown", value: string | number) => {
    const newItems = [...items];
    if (field === "name") {
      newItems[index].name = value as string;
    } else {
      newItems[index].cooldown = value as number;
    }
    setItems(newItems);
  };

  const handleAudioSelection = (name: string, audioPath: string) => {
    if (audioPath === "none") {
      const newSelections = { ...audioSelections };
      delete newSelections[name];
      setAudioSelections(newSelections);
    } else {
      setAudioSelections(prev => ({ ...prev, [name]: audioPath }));
    }
  };

  const handleCreate = async () => {
    const validNames = names.filter((n) => n.trim() !== "");
    const validItems = items.filter((i) => i.name.trim() !== "" && i.cooldown > 0);

    if (validNames.length < 2) {
      toast.error("Please add at least 2 names");
      return;
    }

    if (validItems.length === 0) {
      toast.error("Please add at least 1 item");
      return;
    }

    setCreating(true);
    try {
      // Filter audio selections to only include valid names
      const validAudioSelections: Record<string, string> = {};
      for (const [name, audioPath] of Object.entries(audioSelections)) {
        if (validNames.includes(name)) {
          validAudioSelections[name] = audioPath;
        }
      }

      const sessionId = await createSession({
        names: validNames,
        items: validItems,
        audioSelections: Object.keys(validAudioSelections).length > 0 ? validAudioSelections : undefined,
      });
      toast.success("Session created successfully!");
      onSessionCreated(sessionId);
    } catch (error) {
      toast.error("Failed to create session");
      setCreating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Names Section */}
      <Card className="bg-[#111111] border-[#00ff88]/30 shadow-[0_0_15px_rgba(0,255,136,0.1)]">
        <CardHeader>
          <CardTitle className="text-[#00ff88] flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Participants
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {names.map((name, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-2"
              >
                <div className="flex-1 space-y-2">
                  <Input
                    value={name}
                    onChange={(e) => updateName(index, e.target.value)}
                    placeholder={`Name ${index + 1}`}
                    className="bg-[#0a0a0a] border-[#00ff88]/30 focus:border-[#00ff88] text-white"
                  />
                  {name.trim() && (
                    <div>
                      <Label className="text-white/70 text-xs flex items-center gap-1 mb-1">
                        <Music className="h-3 w-3" />
                        Winner Audio (Optional)
                      </Label>
                      <Select
                        value={audioSelections[name] || "none"}
                        onValueChange={(value) => handleAudioSelection(name, value)}
                      >
                        <SelectTrigger className="bg-[#0a0a0a] border-[#00ff88]/30 focus:border-[#00ff88] text-white text-xs">
                          <SelectValue placeholder="Select audio" />
                        </SelectTrigger>
                        <SelectContent>
                          {AUDIO_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                {names.length > 1 && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeName(index)}
                    className="border-[#ff0080]/30 hover:border-[#ff0080] hover:bg-[#ff0080]/10"
                  >
                    <Trash2 className="h-4 w-4 text-[#ff0080]" />
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
          <Button
            onClick={addName}
            variant="outline"
            className="w-full border-[#00ff88]/30 hover:border-[#00ff88] hover:bg-[#00ff88]/10 text-[#00ff88]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Name
          </Button>
        </CardContent>
      </Card>

      {/* Items Section */}
      <Card className="bg-[#111111] border-[#0088ff]/30 shadow-[0_0_15px_rgba(0,136,255,0.1)]">
        <CardHeader>
          <CardTitle className="text-[#0088ff] flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Items & Cooldowns
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="space-y-2 p-3 bg-[#0a0a0a] rounded-lg border border-[#0088ff]/30"
              >
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label className="text-white/70 text-xs">Item Name</Label>
                    <Input
                      value={item.name}
                      onChange={(e) => updateItem(index, "name", e.target.value)}
                      placeholder={`Item ${index + 1}`}
                      className="bg-[#111111] border-[#0088ff]/30 focus:border-[#0088ff] text-white mt-1"
                    />
                  </div>
                  {items.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeItem(index)}
                      className="border-[#ff0080]/30 hover:border-[#ff0080] hover:bg-[#ff0080]/10 mt-5"
                    >
                      <Trash2 className="h-4 w-4 text-[#ff0080]" />
                    </Button>
                  )}
                </div>
                <div>
                  <Label className="text-white/70 text-xs">Cooldown (hours)</Label>
                  <Input
                    type="number"
                    value={item.cooldown}
                    onChange={(e) => updateItem(index, "cooldown", parseInt(e.target.value) || 0)}
                    min="0"
                    className="bg-[#111111] border-[#0088ff]/30 focus:border-[#0088ff] text-white mt-1"
                  />
                </div>
              </motion.div>
            ))}
          </div>
          <Button
            onClick={addItem}
            variant="outline"
            className="w-full border-[#0088ff]/30 hover:border-[#0088ff] hover:bg-[#0088ff]/10 text-[#0088ff]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </CardContent>
      </Card>

      {/* Create Button */}
      <div className="lg:col-span-2">
        <Button
          onClick={handleCreate}
          disabled={creating}
          className="w-full h-14 text-lg bg-gradient-to-r from-[#00ff88] via-[#0088ff] to-[#ff0080] hover:shadow-[0_0_30px_rgba(0,255,136,0.5)] transition-all"
        >
          {creating ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Creating Session...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 mr-2" />
              Create Draw Session
            </>
          )}
        </Button>
      </div>
    </div>
  );
}