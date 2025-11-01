import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Trophy, Sparkles, BugIcon } from "lucide-react";
import { useQuery } from "convex/react";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import RequestFeatureForm from "@/components/RequestForm";


export default function History() {
  const navigate = useNavigate();
  const globalHistory = useQuery(api.draws.getGlobalHistory);
  const globalCooldowns = useQuery(api.draws.getGlobalCooldowns);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [requestFeatureOpen, setRequestFeatureOpen] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getRemainingCooldown = (cooldownEnd: number) => {
    const remaining = Math.max(0, cooldownEnd - currentTime);
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const totalSeconds = Math.ceil(remaining / 1000);
    return { hours, minutes, totalSeconds };
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b border-white/10 bg-[#111111]/50 backdrop-blur-sm sticky top-0 z-40"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00ff88] to-[#0088ff] rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(0,255,136,0.3)]">
              <Trophy className="h-6 w-6 text-black" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#00ff88] to-[#0088ff] bg-clip-text text-transparent">
              Roll History
            </h1>
          </div>
          <div className="flex items-center gap-3">
          {requestFeatureOpen && <RequestFeatureForm />}
          <Button variant="outline" onClick={() => setRequestFeatureOpen(!requestFeatureOpen)} className="border-[#ff0080]/30 hover:border-[#ff0080] hover:bg-[#ff0080]/10">
              <BugIcon className="h-4 w-4 mr-2" />
              Request a Feature
            </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="border-[#00ff88]/30 hover:border-[#00ff88] hover:bg-[#00ff88]/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Global Cooldowns */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card className="bg-[#111111] border-[#ff0080]/30 shadow-[0_0_15px_rgba(255,0,128,0.1)]">
              <CardHeader>
                <CardTitle className="text-[#ff0080] flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Active Cooldowns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  {!globalCooldowns || globalCooldowns.length === 0 ? (
                    <p className="text-white/50 text-center py-8">No active cooldowns</p>
                  ) : (
                    <div className="space-y-3">
                      {globalCooldowns.map((cooldown) => {
                        const remaining = getRemainingCooldown(cooldown.cooldownEnd);
                        return (
                          <motion.div
                            key={cooldown._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-4 bg-[#0a0a0a] rounded-lg border border-[#ff0080]/30"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="text-white font-bold">{cooldown.participantName}</p>
                                <p className="text-[#0088ff] text-sm">{cooldown.itemName}</p>
                              </div>
                              <div className="flex items-center gap-1 text-[#ff0080]">
                                <Clock className="h-4 w-4" />
                                <span className="font-mono font-bold">{remaining.hours}h {remaining.minutes}m</span>
                              </div>
                            </div>
                            <div className="w-full bg-[#111111] rounded-full h-2 overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-[#ff0080] to-[#ff0080]/50"
                                initial={{ width: "100%" }}
                                animate={{ width: "0%" }}
                                transition={{ duration: remaining.totalSeconds, ease: "linear" }}
                              />
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>

          {/* Global Roll History */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card className="bg-[#111111] border-[#00ff88]/30 shadow-[0_0_15px_rgba(0,255,136,0.1)]">
              <CardHeader>
                <CardTitle className="text-[#00ff88] flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  All Rolls ({globalHistory?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  {!globalHistory || globalHistory.length === 0 ? (
                    <p className="text-white/50 text-center py-8">No rolls yet</p>
                  ) : (
                    <div className="space-y-3">
                      {globalHistory.map((entry, index) => (
                        <motion.div
                          key={entry._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.02 }}
                          className="p-4 bg-[#0a0a0a] rounded-lg border border-[#00ff88]/30 hover:border-[#00ff88] transition-all"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-[#00ff88] to-[#0088ff] rounded-lg flex items-center justify-center">
                                <Trophy className="h-5 w-5 text-black" />
                              </div>
                              <div>
                                <p className="text-white">
                                  <span className="text-[#00ff88] font-bold">{entry.winner}</span>
                                  <span className="text-white/70"> won </span>
                                  <span className="text-[#0088ff] font-bold">{entry.itemName}</span>
                                </p>
                                <p className="text-white/50 text-sm">
                                  Cooldown: {entry.cooldownDuration}h
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-white/70 text-sm">
                                {new Date(entry.timestamp).toLocaleDateString()}
                              </p>
                              <p className="text-white/50 text-xs">
                                {new Date(entry.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}