import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Dices, Zap, Clock, Trophy, ArrowRight, History, CoffeeIcon, BugIcon, XIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import RequestFeatureForm from "@/components/RequestForm";

export default function Landing() {
  const navigate = useNavigate();
  const [requestFeatureOpen, setRequestFeatureOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Animated Background */}
      {/* Halloween themed background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff0080]/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00ff88]/10 rounded-full blur-[100px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#0088ff]/10 rounded-full blur-[100px] animate-pulse delay-2000" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 border-b border-white/10 bg-[#111111]/50 backdrop-blur-sm"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
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
            <Button variant="outline" onClick={() => window.open("https://buymeacoffee.com/ryanglassdj", "_blank")} 
            className="border-[#0088ff]/30 hover:border-[#0088ff] hover:bg-[#0088ff]/10">
              <CoffeeIcon className="h-4 w-4 mr-2" />
              Buy me a coffee
            </Button>
            <Button
              onClick={() => navigate("/history")}
              variant="outline"
              className="border-[#0088ff]/30 hover:border-[#0088ff] hover:bg-[#0088ff]/10"
            >
              <History className="h-4 w-4 mr-2" />
              Roll History
            </Button>
            <Button
              onClick={() => navigate("/dashboard")}
              className="bg-gradient-to-r from-[#00ff88] to-[#0088ff] hover:shadow-[0_0_20px_rgba(0,255,136,0.5)] transition-all"
            >
              Get Started
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="mb-8 inline-block"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-[#00ff88] via-[#0088ff] to-[#ff0080] rounded-2xl flex items-center justify-center shadow-[0_0_50px_rgba(0,255,136,0.4)] mx-auto">
              <Dices className="h-12 w-12 text-black" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-[#00ff88] via-[#0088ff] to-[#ff0080] bg-clip-text text-transparent"
          >
            Delux Dark Epoch: MU Random Name Roller
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl lg:text-2xl text-white/70 mb-8 max-w-2xl mx-auto"
          >
            Fair and transparent random draws with intelligent cooldown management
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              onClick={() => navigate("/dashboard")}
              size="lg"
              className="text-lg px-8 py-6 bg-gradient-to-r from-[#00ff88] to-[#0088ff] hover:shadow-[0_0_30px_rgba(0,255,136,0.5)] transition-all"
            >
              Start Drawing
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-6 bg-[#111111] border border-[#00ff88]/30 rounded-xl shadow-[0_0_15px_rgba(0,255,136,0.1)] hover:shadow-[0_0_25px_rgba(0,255,136,0.2)] transition-all"
          >
            <div className="w-12 h-12 bg-[#00ff88]/20 rounded-lg flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-[#00ff88]" />
            </div>
            <h3 className="text-xl font-bold text-[#00ff88] mb-2">
              Instant Random Selection
            </h3>
            <p className="text-white/70">
              Fair and unbiased random selection algorithm ensures everyone has an equal chance
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-6 bg-[#111111] border border-[#0088ff]/30 rounded-xl shadow-[0_0_15px_rgba(0,136,255,0.1)] hover:shadow-[0_0_25px_rgba(0,136,255,0.2)] transition-all"
          >
            <div className="w-12 h-12 bg-[#0088ff]/20 rounded-lg flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-[#0088ff]" />
            </div>
            <h3 className="text-xl font-bold text-[#0088ff] mb-2">
              Smart Cooldowns
            </h3>
            <p className="text-white/70">
              Customizable cooldown periods prevent the same person from winning multiple times in a row
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="p-6 bg-[#111111] border border-[#ff0080]/30 rounded-xl shadow-[0_0_15px_rgba(255,0,128,0.1)] hover:shadow-[0_0_25px_rgba(255,0,128,0.2)] transition-all"
          >
            <div className="w-12 h-12 bg-[#ff0080]/20 rounded-lg flex items-center justify-center mb-4">
              <Trophy className="h-6 w-6 text-[#ff0080]" />
            </div>
            <h3 className="text-xl font-bold text-[#ff0080] mb-2">
              Multiple Items
            </h3>
            <p className="text-white/70">
              Draw for multiple items with individual cooldown settings for each prize
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center p-12 bg-gradient-to-br from-[#111111] to-[#0a0a0a] border border-[#00ff88]/30 rounded-2xl shadow-[0_0_50px_rgba(0,255,136,0.2)]"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Start Drawing?
          </h2>
          <p className="text-white/70 text-lg mb-8">
            Create your first draw session in seconds
          </p>
          <Button
            onClick={() => navigate("/dashboard")}
            size="lg"
            className="text-lg px-8 py-6 bg-gradient-to-r from-[#00ff88] via-[#0088ff] to-[#ff0080] hover:shadow-[0_0_30px_rgba(0,255,136,0.5)] transition-all"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-[#111111]/50 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 text-center text-white/50">
          <p>Built with ❤️ by Chippia from Uruk 16, Delux Dark Epoch: MU</p>
        </div>
      </footer>
    </div>
  );
}