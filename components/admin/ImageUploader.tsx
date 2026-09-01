import { useState, useRef } from "react";
import { FiUploadCloud, FiX, FiLoader, FiImage } from "react-icons/fi";

export default function ImageUploader({ 
  images, 
  onChange 
}: { 
  images: string[]; 
  onChange: (images: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag and drop refs
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragItem.current = position;
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragOverItem.current = position;
  };

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      const _images = [...images];
      const draggedItemContent = _images.splice(dragItem.current, 1)[0];
      _images.splice(dragOverItem.current, 0, draggedItemContent);
      onChange(_images);
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImages = [...images];
    let hasError = false;

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("file", files[i]);

      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          const data = await res.json();
          newImages.push(data.url);
        } else {
          hasError = true;
          console.error("Upload failed", await res.text());
        }
      } catch (err) {
        hasError = true;
        console.error("Upload failed", err);
      }
    }

    if (hasError) {
      alert("حدث خطأ أثناء رفع بعض الصور. تأكد أن حجم الصورة أقل من 4 ميجابايت.");
    }

    onChange(newImages);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function removeImage(index: number, url: string) {
    if (url.startsWith("/uploads/") || url.includes("cloudinary.com")) {
      try {
        await fetch("/api/admin/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url })
        });
      } catch (err) {
        console.error("Failed to delete file", err);
      }
    }
    
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <FiImage className="w-4 h-4 text-[#BCA37F]" />
        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">
          معرض الصور الفاخر
        </label>
      </div>
      
      {/* Upload Zone */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
          uploading 
            ? "bg-slate-50 border-slate-200" 
            : "bg-white border-slate-300 hover:border-[#BCA37F] hover:bg-[#BCA37F]/5 hover:shadow-md"
        }`}
      >
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleUpload}
          disabled={uploading}
        />
        
        {uploading ? (
          <div className="flex flex-col items-center text-[#BCA37F]">
            <FiLoader className="w-10 h-10 animate-spin mb-3" />
            <span className="text-sm font-black tracking-wide">جاري معالجة ورفع الصور...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center text-slate-400 group">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#BCA37F]/10 transition-all duration-300">
              <FiUploadCloud className="w-8 h-8 text-slate-400 group-hover:text-[#BCA37F] transition-colors" />
            </div>
            <span className="text-sm font-black text-[#0F1115] mb-1">اسحب الصور أو اضغط للاستعراض</span>
            <span className="text-[11px] font-bold uppercase tracking-widest">دقة عالية • بحد أقصى 5 ميجابايت</span>
          </div>
        )}
      </div>

      {/* Image Gallery */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {images.map((img, idx) => (
            <div 
              key={`${img}-${idx}`} 
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragEnter={(e) => handleDragEnter(e, idx)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              className="relative group rounded-2xl overflow-hidden border border-slate-200 aspect-[4/3] bg-slate-100 shadow-sm cursor-grab active:cursor-grabbing"
            >
              {/* Image Number Badge */}
              <div className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-[#1a2b3c]/70 backdrop-blur-sm text-white flex items-center justify-center text-xs font-bold pointer-events-none shadow-sm">
                {idx + 1}
              </div>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={`Car ${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out pointer-events-none" />
              
              {/* Glassmorphism Delete Overlay */}
              <div className="absolute inset-0 bg-[#0F1115]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(idx, img);
                  }}
                  className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-rose-500 hover:border-rose-500 transition-all duration-300 shadow-lg hover:scale-110"
                >
                  <FiX className="w-5 h-5" strokeWidth={3} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
