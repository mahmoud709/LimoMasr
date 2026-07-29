"use client";

import { useEffect, useRef, useState } from "react";
import { FiBold, FiItalic, FiUnderline, FiList, FiAlignLeft, FiAlignCenter, FiAlignRight } from "react-icons/fi";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isEn?: boolean;
}

export default function RichTextEditor({ value, onChange, placeholder, isEn = false }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const exec = (command: string, val: string | undefined = undefined) => {
    document.execCommand(command, false, val);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white flex flex-col">
      <div className="bg-slate-50 border-b border-slate-200 p-2 flex flex-wrap gap-1 shrink-0">
        <button type="button" onClick={() => exec('formatBlock', 'H3')} className="p-2 hover:bg-slate-200 rounded text-slate-700 font-bold text-sm transition-colors" title="عنوان رئيسي">H3</button>
        <button type="button" onClick={() => exec('formatBlock', 'H4')} className="p-2 hover:bg-slate-200 rounded text-slate-700 font-bold text-sm transition-colors" title="عنوان فرعي">H4</button>
        <button type="button" onClick={() => exec('formatBlock', 'P')} className="p-2 hover:bg-slate-200 rounded text-slate-700 font-bold text-sm transition-colors" title="نص عادي">P</button>
        <div className="w-px h-6 bg-slate-300 mx-1 my-auto"></div>
        <button type="button" onClick={() => exec('bold')} className="p-2 hover:bg-slate-200 rounded text-slate-700 transition-colors" title="عريض"><FiBold /></button>
        <button type="button" onClick={() => exec('italic')} className="p-2 hover:bg-slate-200 rounded text-slate-700 transition-colors" title="مائل"><FiItalic /></button>
        <button type="button" onClick={() => exec('underline')} className="p-2 hover:bg-slate-200 rounded text-slate-700 transition-colors" title="تسطير"><FiUnderline /></button>
        <div className="w-px h-6 bg-slate-300 mx-1 my-auto"></div>
        <button type="button" onClick={() => exec('insertUnorderedList')} className="p-2 hover:bg-slate-200 rounded text-slate-700 transition-colors" title="قائمة نقطية"><FiList /></button>
        <div className="w-px h-6 bg-slate-300 mx-1 my-auto"></div>
        <button type="button" onClick={() => exec('justifyRight')} className="p-2 hover:bg-slate-200 rounded text-slate-700 transition-colors" title="محاذاة لليمين"><FiAlignRight /></button>
        <button type="button" onClick={() => exec('justifyCenter')} className="p-2 hover:bg-slate-200 rounded text-slate-700 transition-colors" title="توسيط"><FiAlignCenter /></button>
        <button type="button" onClick={() => exec('justifyLeft')} className="p-2 hover:bg-slate-200 rounded text-slate-700 transition-colors" title="محاذاة لليسار"><FiAlignLeft /></button>
        <div className="w-px h-6 bg-slate-300 mx-1 my-auto"></div>
        <button type="button" onClick={() => exec('removeFormat')} className="p-2 hover:bg-slate-200 rounded text-slate-500 text-xs font-bold transition-colors" title="إزالة التنسيق">إزالة التنسيق</button>
      </div>
      <div 
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className={`p-4 min-h-[300px] outline-none prose prose-slate max-w-none text-slate-800 text-base leading-loose focus:ring-2 focus:ring-inset focus:ring-[#BCA37F] ${isEn ? "text-left" : "text-right"}`}
        dir={isEn ? "ltr" : "rtl"}
        style={{ minHeight: '300px' }}
      />
    </div>
  );
}
