import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Plus, Trash2, X, Sparkles, Clock, Trophy, RotateCcw } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";

interface NamePickerProps {
  sessionId: Id<"drawSessions">;
  onBack: () => void;
}

export function NamePicker({ sessionId, onBack }: NamePickerProps) {
  const session = useQuery(api.draws.getSession, { sessionId });
  const performDraw = useMutation(api.draws.performDraw);
  const resetCooldowns = useMutation(api.draws.resetCooldowns);
  const globalCooldowns = useQuery(api.draws.getGlobalCooldowns);
  
  const [drawing, setDrawing] = useState(false);
  const [currentWinner, setCurrentWinner] = useState<{ winner: string; item: string; audioUrl?: string | null } | null>(null);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#00ff88]" />
      </div>
    );
  }

  const handleDraw = async (itemIndex: number) => {
    setDrawing(true);
    setCurrentWinner(null);
    
    try {
      const result = await performDraw({ sessionId, itemIndex });
      
      setTimeout(() => {
        setCurrentWinner(result);
        setDrawing(false);
        
        // Play audio if available
        if (result.audioPath) {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
          audioRef.current = new Audio(result.audioPath);
          audioRef.current.play().catch(err => {
            console.error("Failed to play audio:", err);
          });
        }
        
        toast.success(`${result.winner} won ${result.item}!`, {
          description: "Cooldown has been applied",
        });
      }, 2000);
    } catch (error) {
      setDrawing(false);
      toast.error(error instanceof Error ? error.message : "Failed to perform draw");
    }
  };

  const handleResetCooldowns = async () => {
    try {
      await resetCooldowns({ sessionId });
      toast.success("All cooldowns have been reset");
    } catch (error) {
      toast.error("Failed to reset cooldowns");
    }
  };

  const getAvailableNames = () => {
    return session.names.filter((name) => {
      const cooldownEnd = session.cooldowns[name] || 0;
      return cooldownEnd <= currentTime;
    });
  };

  const getRemainingCooldown = (name: string) => {
    const cooldownEnd = session.cooldowns[name] || 0;
    const remaining = Math.max(0, cooldownEnd - currentTime);
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    return { hours, minutes, totalSeconds: Math.ceil(remaining / 1000) };
  };

  const getGlobalCooldownForName = (name: string, itemName: string) => {
    if (!globalCooldowns) return null;
    return globalCooldowns.find(
      gc => gc.participantName === name && gc.itemName === itemName && gc.cooldownEnd > currentTime
    );
  };

  const availableNames = getAvailableNames();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          className="border-[#00ff88]/30 hover:border-[#00ff88] hover:bg-[#00ff88]/10"
        >
          <X className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button
          variant="outline"
          onClick={handleResetCooldowns}
          className="border-[#ff0080]/30 hover:border-[#ff0080] hover:bg-[#ff0080]/10"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Cooldowns
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Names Panel */}
        <Card className="bg-[#111111] border-[#00ff88]/30 shadow-[0_0_15px_rgba(0,255,136,0.1)]">
          <CardHeader>
            <CardTitle className="text-[#00ff88] flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Participants ({availableNames.length}/{session.names.length} available)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2">
                {session.names.map((name, index) => {
                  const cooldown = getRemainingCooldown(name);
                  const isOnCooldown = cooldown.totalSeconds > 0;
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-3 rounded-lg border flex items-center justify-between ${
                        isOnCooldown
                          ? "bg-[#0a0a0a] border-[#ff0080]/30 opacity-50"
                          : "bg-[#0a0a0a] border-[#00ff88]/30"
                      }`}
                    >
                      <span className="text-white font-medium">{name}</span>
                      {isOnCooldown && (
                        <div className="flex items-center gap-2 text-[#ff0080] text-sm">
                          <Clock className="h-4 w-4" />
                          {cooldown.hours}h {cooldown.minutes}m
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Items Panel */}
        <Card className="bg-[#111111] border-[#0088ff]/30 shadow-[0_0_15px_rgba(0,136,255,0.1)]">
          <CardHeader>
            <CardTitle className="text-[#0088ff] flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Items to Draw
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-3">
                {session.items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="bg-[#0a0a0a] border-[#0088ff]/30 hover:border-[#0088ff] transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-white font-bold text-lg">{item.name}</h3>
                          <span className="text-[#0088ff] text-sm">
                            {item.cooldown}h cooldown
                          </span>
                        </div>
                        <Button
                          onClick={() => handleDraw(index)}
                          disabled={drawing || availableNames.length === 0}
                          className="w-full bg-gradient-to-r from-[#0088ff] to-[#00ff88] hover:shadow-[0_0_20px_rgba(0,136,255,0.5)] transition-all"
                        >
                          {drawing ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Drawing...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 mr-2" />
                              Draw Winner
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Winner Display */}
      <AnimatePresence>
        {currentWinner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm"
            onClick={() => setCurrentWinner(null)}
          >
            <Card className="bg-gradient-to-br from-[#111111] to-[#0a0a0a] border-[#00ff88] border-2 shadow-[0_0_50px_rgba(0,255,136,0.5)] max-w-md w-full mx-4">
              <CardContent className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <Trophy className="h-16 w-16 text-[#00ff88] mx-auto mb-4" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-2">Winner!</h2>
                <p className="text-[#00ff88] text-5xl font-bold mb-4">{currentWinner.winner}</p>
                <p className="text-white/70 text-lg mb-2">won</p>
                <p className="text-[#0088ff] text-2xl font-bold">{currentWinner.item}</p>
                <Button
                  onClick={() => setCurrentWinner(null)}
                  className="mt-6 bg-[#00ff88] hover:bg-[#00ff88]/80 text-black"
                >
                  Close
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History */}
      {session.history.length > 0 && (
        <Card className="bg-[#111111] border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Draw History</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {[...session.history].reverse().map((entry, index) => (
                  <div
                    key={index}
                    className="p-3 bg-[#0a0a0a] rounded-lg border border-white/10 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[#00ff88] font-bold">{entry.winner}</span>
                      <span className="text-white/70"> won </span>
                      <span className="text-[#0088ff] font-bold">{entry.itemName}</span>
                      <span className="text-white/50 text-sm ml-2">({entry.cooldownDuration}h cooldown)</span>
                    </div>
                    <span className="text-white/50 text-sm">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}