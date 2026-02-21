
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Camera, X, ChevronRight, ChevronLeft, Send, Loader2 } from 'lucide-react';
import { useStorage } from '../hooks/useStorage';

interface ReviewFormProps {
  productId: string;
  onSuccess: () => void;
  onSubmit: (data: any) => Promise<any>;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, onSuccess, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { uploadImage, uploading } = useStorage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    rating: 5,
    fit: 50,
    title: '',
    content: '',
    nickname: '',
    email: '',
    size_ordered: 'M',
    height: '',
    weight: '',
    photo_url: ''
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    const preview = URL.createObjectURL(file);
    setPhotoPreview(preview);

    const uploadedUrl = await uploadImage(file, `reviews/${productId}/${Date.now()}-${file.name}`);
    if (uploadedUrl) {
      setFormData(prev => ({ ...prev, photo_url: uploadedUrl }));
    }
  };

  const handleFinalSubmit = async () => {
    if (formData.content.length < 25) {
      alert('Review content must be at least 25 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      // Basic sanitization
      const sanitizedData = {
        ...formData,
        title: formData.title.replace(/<[^>]*>?/gm, '').trim(),
        content: formData.content.replace(/<[^>]*>?/gm, '').trim(),
      };

      await onSubmit(sanitizedData);
      onSuccess();
    } catch (err) {
      console.error(err);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  return (
    <div className="bg-zinc-900/30 backdrop-blur-xl border border-white/5 p-8 relative overflow-hidden group">
      {/* Decorative background element */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 blur-3xl rounded-full group-hover:bg-white/10 transition-colors" />
      
      <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
        <h3 className="font-cinzel text-lg tracking-widest uppercase">MANIFEST YOUR THOUGHTS</h3>
        <div className="flex gap-2">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1 w-8 transition-all ${step === s ? 'bg-white' : 'bg-zinc-800'}`} />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 block">Imperial Metrics (Optional)</label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="HEIGHT (e.g. 6'2&quot;)"
                  className="bg-black/50 border border-white/10 p-4 text-xs tracking-widest focus:border-white focus:outline-none transition-colors"
                  value={formData.height}
                  onChange={e => setFormData({ ...formData, height: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="WEIGHT (e.g. 180 lbs)"
                  className="bg-black/50 border border-white/10 p-4 text-xs tracking-widest focus:border-white focus:outline-none transition-colors"
                  value={formData.weight}
                  onChange={e => setFormData({ ...formData, weight: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 block">Size Obtained</label>
              <div className="flex gap-2">
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setFormData({ ...formData, size_ordered: size })}
                    className={`grow py-3 text-[10px] border transition-all ${
                      formData.size_ordered === size ? 'bg-white text-black border-white' : 'bg-transparent text-zinc-500 border-zinc-800'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-4 bg-white/5 hover:bg-white hover:text-black border border-white/10 text-[10px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-2"
            >
              Next Protocol <ChevronRight size={14} />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="space-y-4 text-center">
              <label className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 block">Rating</label>
              <div className="flex justify-center gap-3">
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} onClick={() => setFormData({ ...formData, rating: star })}>
                    <Star
                      size={28}
                      className={`transition-all ${star <= formData.rating ? 'fill-white text-white drop-shadow-[0_0_8px_white]' : 'text-zinc-800 hover:text-zinc-600'}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 block">Sizing Calibration</label>
                <span className="text-[9px] font-mono text-white italic">
                  {100 - Math.abs(formData.fit - 50) * 2}% - {formData.fit < 40 ? 'Small' : formData.fit > 60 ? 'Large' : 'Natural'}
                </span>
              </div>
              <div className="relative pt-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  className="w-full h-1 bg-zinc-800 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                  value={formData.fit}
                  onChange={e => setFormData({ ...formData, fit: parseInt(e.target.value) })}
                />
                <div className="relative mt-4 h-3">
                  <span className="absolute left-0 text-[8px] uppercase tracking-widest text-zinc-600">Too Tight</span>
                  <span className="absolute left-1/2 -translate-x-1/2 text-[8px] uppercase tracking-widest text-zinc-400">Natural</span>
                  <span className="absolute right-0 text-[8px] uppercase tracking-widest text-zinc-600">Too Oversized</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 py-4 bg-zinc-900 border border-white/5 text-[10px] uppercase tracking-[0.4em] text-zinc-500 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <ChevronLeft size={14} /> Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="grow py-4 bg-white/5 hover:bg-white hover:text-black border border-white/10 text-[10px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-2"
              >
                Next Protocol <ChevronRight size={14} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <input
                type="text"
                placeholder="MANIFEST TITLE (Short summary)"
                className="w-full bg-black/50 border border-white/10 p-5 text-xs tracking-widest focus:border-white focus:outline-none transition-colors"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
              <textarea
                placeholder="DETAILED EVIDENCE (Min. 25 characters)"
                rows={4}
                className="w-full bg-black/50 border border-white/10 p-5 text-xs tracking-widest focus:border-white focus:outline-none transition-colors resize-none"
                value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
              />
              <p className="text-[8px] text-zinc-600 tracking-widest uppercase">
                {formData.content.length}/25 MINIMUM CHARACTERS REQUIRED
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="CODIFIED NICKNAME"
                className="bg-black/50 border border-white/10 p-5 text-xs tracking-widest focus:border-white focus:outline-none transition-colors"
                value={formData.nickname}
                onChange={e => setFormData({ ...formData, nickname: e.target.value })}
              />
              <input
                type="email"
                placeholder="SECURE EMAIL"
                className="bg-black/50 border border-white/10 p-5 text-xs tracking-widest focus:border-white focus:outline-none transition-colors"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-4">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/5 hover:border-white/20 transition-all p-8 flex flex-col items-center justify-center gap-3 cursor-pointer group/upload"
              >
                {photoPreview ? (
                  <div className="relative w-24 h-24">
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover rounded border border-white/10" />
                    <button 
                      onClick={(e) => { e.stopPropagation(); setPhotoPreview(null); setFormData(f => ({ ...f, photo_url: '' })); }}
                      className="absolute -top-2 -right-2 bg-black w-6 h-6 flex items-center justify-center border border-white/10 rounded-full hover:bg-white hover:text-black transition-colors"
                    >
                      <X size={12} />
                    </button>
                    {uploading && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Loader2 className="animate-spin text-white" size={16} />
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Camera size={24} className="text-zinc-600 group-hover/upload:text-white transition-colors" />
                    <p className="text-[9px] uppercase tracking-[0.4em] text-zinc-600 group-hover/upload:text-zinc-400">UPLOAD VISUAL INTEL (MAX 5MB)</p>
                  </>
                )}
                <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleFileChange} />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 py-5 bg-zinc-900 border border-white/5 text-[10px] uppercase tracking-[0.4em] text-zinc-500 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <ChevronLeft size={14} /> Back
              </button>
              <button
                disabled={isSubmitting || formData.content.length < 25 || !formData.nickname || !formData.email}
                onClick={handleFinalSubmit}
                className="grow py-5 bg-white text-black text-[11px] font-bold uppercase tracking-[0.6em] hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Send size={14} />}
                Transmit Review
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReviewForm;
