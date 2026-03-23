import { useState, useEffect } from "react";
import { X, Monitor, Tablet, Smartphone, RotateCcw, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TemplatePreviewProps {
  url: string;
  onClose: () => void;
  title: string;
}

type DeviceType = "desktop" | "tablet" | "mobile";

export function TemplatePreview({ url, onClose, title }: TemplatePreviewProps) {
  const [device, setDevice] = useState<DeviceType>("desktop");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [slowLoading, setSlowLoading] = useState(false);

  // Refresh iframe
  const refresh = () => {
    setLoading(true);
    setSlowLoading(false);
    setError(false);
    setIframeKey(prev => prev + 1);
  };

  // Dimensions for different devices
  const dimensions = {
    desktop: "w-full h-full",
    tablet: "w-[768px] h-[1024px] max-w-full max-h-full",
    mobile: "w-[375px] h-[667px] max-w-full max-h-full",
  };

  // Handle iframe load
  const handleLoad = () => {
    setLoading(false);
  };

  // Pre-check URL or timeout if needed, though simple onLoad usually works
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setSlowLoading(true);
      }
    }, 6000);
    return () => clearTimeout(timer);
  }, [loading, iframeKey]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col bg-background/95 backdrop-blur-2xl overflow-hidden"
    >
      {/* Top Bar — refresh + device controls + close */}
      <div className="h-20 border-b border-border bg-card/80 backdrop-blur-md px-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          {/* OS Buttons */}
          <div className="hidden sm:flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40" />
          </div>

          {/* Refresh only — no URL text */}
          <button
            onClick={refresh}
            className="flex items-center gap-2 px-4 py-2.5 bg-muted/60 hover:bg-muted border border-border rounded-full transition-all text-muted-foreground hover:text-primary"
            title="Reload Preview"
          >
            <RotateCcw size={15} />
            <span className="hidden sm:block text-[10px] font-black uppercase tracking-widest">Reload</span>
          </button>
        </div>

        {/* Device Controls */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-2 p-1.5 bg-muted/80 rounded-2xl border border-border">
          {[
            { id: "desktop" as DeviceType, icon: Monitor, label: "Desktop" },
            { id: "tablet" as DeviceType, icon: Tablet, label: "Tablet" },
            { id: "mobile" as DeviceType, icon: Smartphone, label: "Mobile" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setDevice(item.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                device === item.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon size={16} />
              <span className="hidden lg:block">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:block text-end me-4">
            <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">Previewing</h4>
            <p className="text-xs font-black text-foreground uppercase tracking-tight">{title}</p>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center bg-foreground text-background rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-xl"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 p-6 sm:p-12 relative flex items-center justify-center overflow-auto bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:32px_32px]">
        {/* Loading Overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm"
            >
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-[6px] border-primary/20 border-t-primary animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 size={32} className="text-primary animate-pulse" />
                </div>
              </div>
              <p className="mt-8 text-[10px] font-black text-primary uppercase tracking-[0.4em] animate-pulse">Initializing Virtual Viewport</p>
              {slowLoading && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-[9px] text-muted-foreground font-bold uppercase tracking-widest text-center max-w-[200px]"
                >
                  Still loading? The repository may be waking up or processing heavy assets.
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Fallback */}
        {error && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-background text-center p-8">
            <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-8 border border-red-500/20 shadow-2xl">
              <AlertCircle size={40} />
            </div>
            <h3 className="text-2xl font-black text-foreground mb-4 font-oswald uppercase tracking-tight">Transmission Failed</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-10 font-medium leading-relaxed">
              We couldn't establish a secure connection with the demo repository. It might be down or restricted by a firewall.
            </p>
            <div className="flex gap-4">
              <button onClick={refresh} className="px-8 py-4 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-full hover:scale-105 transition-all">
                Try Reconnect
              </button>
              <a href={url} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-muted border border-border text-foreground text-xs font-black uppercase tracking-widest rounded-full hover:bg-card transition-all">
                Open External
              </a>
            </div>
          </div>
        )}

        {/* Iframe Viewport */}
        <motion.div 
          key={device}
          layout
          className={`relative bg-card rounded-[2.5rem] sm:rounded-[4rem] border-[12px] sm:border-[20px] border-border shadow-4xl overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.23, 1, 0.32, 1)] ${dimensions[device]}`}
        >
          {/* Inner Content Area */}
          <div className="w-full h-full relative bg-white">
            <iframe
              key={iframeKey}
              src={url}
              onLoad={handleLoad}
              className="w-full h-full border-none"
              sandbox="allow-scripts allow-same-origin allow-popups"
              title={`Demo of ${title}`}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
