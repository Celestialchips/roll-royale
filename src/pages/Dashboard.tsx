import { Button } from "@/components/ui/button";
import { NamePicker } from "@/components/NamePicker";
import { SessionSetup } from "@/components/SessionSetup";
import { Id } from "@/convex/_generated/dataModel";
import { motion } from "framer-motion";
import { BugIcon, Dices, History } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import RequestFeatureForm from "@/components/RequestForm";

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentSession, setCurrentSession] = useState<Id<"drawSessions"> | null>(null);
  const [requestFeatureOpen, setRequestFeatureOpen] = useState(false);

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
              <Dices className="h-6 w-6 text-black" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#00ff88] to-[#0088ff] bg-clip-text text-transparent">
              Roll Delux: MU
            </h1>
          </div>
          {requestFeatureOpen && <RequestFeatureForm />}
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setRequestFeatureOpen(!requestFeatureOpen)} className="border-[#ff0080]/30 hover:border-[#ff0080] hover:bg-[#ff0080]/10">
              <BugIcon className="h-4 w-4 mr-2" />
              Request a Feature
            </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/history")}
            className="border-[#0088ff]/30 hover:border-[#0088ff] hover:bg-[#0088ff]/10"
          >
            <History className="h-4 w-4 mr-2" />
            Roll History
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
                <div className="flex items-center justify-center gap-4">
                  <img src="/turkey2.gif" alt="Turkey" className="size-24 md:size-48 lg:size-64" />
                </div>
                <h2 className="text-4xl font-bold text-white mb-2">
                  What tasty morsels dropped today?
                </h2>
                <p className="text-white/70">
                  Add each pilgrim and their respective item cooldowns to roll
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