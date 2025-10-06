import { Button } from "@/components/ui/button";
import { NamePicker } from "@/components/NamePicker";
import { SessionSetup } from "@/components/SessionSetup";
import { useAuth } from "@/hooks/use-auth";
import { Id } from "@/convex/_generated/dataModel";
import { motion } from "framer-motion";
import { Loader2, LogOut, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function Dashboard() {
  const { isLoading, isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [currentSession, setCurrentSession] = useState<Id<"drawSessions"> | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#00ff88]" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
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
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-10 h-10 bg-gradient-to-br from-[#00ff88] to-[#0088ff] rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(0,255,136,0.3)]">
              <Sparkles className="h-6 w-6 text-black" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#00ff88] to-[#0088ff] bg-clip-text text-transparent">
              Lucky Draw
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/70 hidden sm:inline">
              {user.email || "Guest User"}
            </span>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="border-[#ff0080]/30 hover:border-[#ff0080] hover:bg-[#ff0080]/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {currentSession ? (
            <NamePicker
              sessionId={currentSession}
              onBack={() => setCurrentSession(null)}
            />
          ) : (
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-white mb-2">
                  Create Your Draw Session
                </h2>
                <p className="text-white/70">
                  Add participants and items with cooldowns to get started
                </p>
              </div>
              <SessionSetup onSessionCreated={setCurrentSession} />
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}