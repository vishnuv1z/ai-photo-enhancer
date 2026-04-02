import React, { useState, useCallback } from "react";
import axios from "axios";
import BeforeAfterSlider from "react-before-after-slider-component";
import "react-before-after-slider-component/dist/build.css";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Download, 
  CloudUpload, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Image as ImageIcon 
} from "lucide-react";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const onSelectFile = useCallback((e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setOutput(null);
      setError(null);
    }
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
      setOutput(null);
      setError(null);
    } else {
      setError("Please drop a valid image file.");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/enhance",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob",
        }
      );

      const imageUrl = URL.createObjectURL(res.data);
      setOutput(imageUrl);
    } catch (err) {
      console.error(err);
      setError("Failed to enhance image. Please check your backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setOutput(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 selection:bg-purple-500/30 overflow-x-hidden">
      {/* Background Orbs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20 flex flex-col items-center">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-4">
            <Sparkles size={14} />
            <span>Smart Image Processing</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 tracking-tight mb-4">
            AI Photo Enhancer
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Enhance and upscale your images using optimized image processing techniques for better clarity and detail.
          </p>
        </motion.div>

        {/* Main Content Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-4xl glass rounded-3xl p-6 md:p-10 relative overflow-hidden"
        >
          {!preview ? (
            /* Upload Zone */
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl py-20 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer group
                ${isDragging ? 'border-purple-500 bg-purple-500/5' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}`}
            >
              <input 
                type="file" 
                onChange={onSelectFile} 
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*"
              />
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <CloudUpload className="text-slate-400 group-hover:text-purple-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload your photo</h3>
              <p className="text-slate-400 text-sm mb-6">Drag and drop or click to browse</p>
              <div className="flex gap-4 text-xs text-slate-500">
                <span>PNG, JPG, JPEG</span>
                <span>•</span>
                <span>Max 10MB</span>
              </div>
            </div>
          ) : (
            /* Analysis & Result View */
            <div className="space-y-8">
              {!output ? (
                /* Preview Before Enhancing */
                <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                  <div className="relative w-full max-w-xl aspect-square md:aspect-video rounded-2xl overflow-hidden glass border-white/20 group">
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={reset}
                        className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-red-500/20 hover:text-red-400 transition-all"
                        title="Remove image"
                      >
                        <RefreshCw size={24} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <button 
                      onClick={handleUpload}
                      disabled={loading}
                      className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="animate-spin" size={20} />
                          <span>Enhancing Image...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={20} />
                          <span>Enhance Quality</span>
                        </>
                      )}
                    </button>
                    <button 
                      onClick={reset}
                      disabled={loading}
                      className="px-6 py-3 glass glass-hover rounded-xl text-slate-300 flex items-center justify-center gap-2"
                    >
                      Change Photo
                    </button>
                  </div>
                </div>
              ) : (
                /* Enhanced Result with Slider */
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <CheckCircle2 size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Enhancement Complete</h3>
                        <p className="text-slate-400 text-sm">Drag slider to compare</p>
                      </div>
                    </div>
                    <button 
                      onClick={reset}
                      className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                    >
                      <RefreshCw size={14} /> Start Over
                    </button>
                  </div>

                  <div className="relative w-full max-w-2xl mx-auto aspect-[16/9] rounded-2xl overflow-hidden glass border-white/20 shadow-2xl">
                    <div className="w-full max-w-2xl mx-auto aspect-[16/9]">
                      <BeforeAfterSlider
                        firstImage={{ imageUrl: preview }}
                        secondImage={{ imageUrl: output }}
                        className="custom-slider"
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                    <a 
                      href={output} 
                      download="enhanced-image.jpg"
                      className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto px-8"
                    >
                      <Download size={20} />
                      Download HD Image
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3 text-sm"
              >
                <AlertCircle size={18} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-4xl">
          {[
            { icon: <Sparkles className="text-purple-400" />, title: "High-Quality Upscaling", text: "Enhances resolution using advanced interpolation techniques." },
            { icon: <ImageIcon className="text-blue-400" />, title: "Sharpen & Enhance", text: "Improves clarity with subtle sharpening and contrast adjustment." },
            { icon: <CheckCircle2 className="text-emerald-400" />, title: "Fast Processing", text: "Quick image enhancement with real-time preview." }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (i * 0.1) }}
              className="glass p-6 rounded-2xl flex flex-col items-center text-center group hover:bg-white/10 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h4 className="font-semibold mb-1">{feature.title}</h4>
              <p className="text-slate-400 text-sm">{feature.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-20 text-slate-500 text-sm">
          <p>© 2026 AI Photo Enhancer. Built using Flask & OpenCV.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;