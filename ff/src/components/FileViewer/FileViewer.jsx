import React, { useEffect, useState } from "react";
import { Document, Page } from "react-pdf"; // add package
import LoaderScreen from "@/components/ui/LoaderScreen";

const CACHE_PREFIX = "impify_file_preview_";

export default function FileViewer({ fileUrl, fileId }) {
  const [dataUrl, setDataUrl] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    let cancelled = false;
    async function load(){
      setLoading(true);
      setError(null);
      try {
        // check localStorage cache first
        const cached = localStorage.getItem(CACHE_PREFIX + fileId);
        if (cached) {
          setDataUrl(cached);
          setLoading(false);
          return;
        }

        const r = await fetch(fileUrl);
        if (!r.ok) throw new Error("File load failed");
        const blob = await r.blob();
        const reader = new FileReader();
        reader.onload = () => {
          if (cancelled) return;
          const data = reader.result;
          setDataUrl(data);
          // store small caches only (avoid huge localStorage)
          try {
            const sizeKB = Math.round(blob.size / 1024);
            if (sizeKB < 500) localStorage.setItem(CACHE_PREFIX + fileId, data);
          } catch(e) {}
          setLoading(false);
        };
        reader.readAsDataURL(blob);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load file");
        setLoading(false);
      }
    }
    load();
    return ()=> cancelled = true;
  }, [fileUrl, fileId]);

  if (loading) return <div className="p-6"><LoaderScreen/></div>;
  if (error) return (
    <div className="p-6 text-center">
      <div className="text-white/70 mb-3">Could not load file: {error}</div>
      <button className="px-4 py-2 bg-blue-600 rounded" onClick={()=>{ localStorage.removeItem(CACHE_PREFIX + fileId); window.location.reload(); }}>Retry</button>
    </div>
  );
  return (
    <div className="p-4">
      <Document file={dataUrl}><Page pageNumber={1} /></Document>
    </div>
  );
}