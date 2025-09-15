"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, AlertCircle, FileJson, FileCode, CheckCircle } from "lucide-react";
import GlassSurface from "@/components/GlassSurface";

interface FileUploadProps {
  onFileUpload: (content: string, filename: string, type: 'json' | 'markdown') => void;
  acceptedTypes?: string[];
  maxSizeKB?: number;
}

export function FileUpload({ 
  onFileUpload, 
  acceptedTypes = ['.json', '.md', '.txt'],
  maxSizeKB = 1024 // 1MB default
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setUploading(true);

    try {
      // Validate file size
      if (file.size > maxSizeKB * 1024) {
        throw new Error(`File size must be less than ${maxSizeKB}KB`);
      }

      // Validate file type
      const fileExtension = file.name.toLowerCase().split('.').pop();
      if (!fileExtension || !acceptedTypes.some(type => type.includes(fileExtension))) {
        throw new Error(`File type must be one of: ${acceptedTypes.join(', ')}`);
      }

      // Read file content
      const content = await file.text();
      
      if (!content.trim()) {
        throw new Error('File is empty');
      }

      // Determine file type
      const type = fileExtension === 'json' ? 'json' : 'markdown';
      
      onFileUpload(content, file.name, type);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to read file');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      {/* Drag and Drop Area */}
      <div
        className={`border-2 border-dashed rounded-2xl p-8 mobile:p-12 text-center transition-all duration-300 ${
          dragActive
            ? 'border-emerald-400 bg-emerald-500/10 backdrop-blur-sm'
            : 'border-purple-400/30 hover:border-purple-400/50 bg-white/5 hover:bg-white/10'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
        />
        
        <div className="space-y-6">
          {/* Upload Icon */}
          <div className="w-20 h-20 mobile:w-24 mobile:h-24 mx-auto bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-full flex items-center justify-center border border-emerald-400/30">
            <Upload className="h-10 w-10 mobile:h-12 mobile:w-12 text-emerald-300" />
          </div>
          
          {/* Upload Text */}
          <div>
            <h3 className="text-xl mobile:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
              Drop your quiz file here
            </h3>
            <p className="text-mobile-body text-gray-300">
              Supports JSON and Markdown formats
            </p>
          </div>
          
          {/* Upload Button */}
          <div className="space-y-3">
            <Button 
              onClick={openFileDialog}
              disabled={uploading}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 px-8 py-4 rounded-xl font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FileText className="h-5 w-5 mr-2" />
                  Choose File
                </>
              )}
            </Button>
            
            <p className="text-sm text-gray-400">
              Max file size: {maxSizeKB}KB | Formats: {acceptedTypes.join(', ')}
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <GlassSurface
          width="100%"
          height="auto"
          borderRadius={15}
          backgroundOpacity={0.1}
          opacity={0.9}
          blur={10}
          className="p-4 bg-red-500/10 border border-red-400/30"
        >
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-300 mb-1">Upload Error</p>
              <p className="text-sm text-red-200">{error}</p>
            </div>
          </div>
        </GlassSurface>
      )}

      {/* Supported Formats */}
      <GlassSurface
        width="100%"
        height="auto"
        borderRadius={15}
        backgroundOpacity={0.1}
        opacity={0.9}
        blur={10}
        className="p-6 bg-purple-300/20"
      >
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-purple-300 mb-4">Supported Formats</h4>
          
          <div className="space-y-4">
            {/* JSON Format */}
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-lg flex items-center justify-center border border-blue-400/30 flex-shrink-0">
                <FileJson className="h-5 w-5 text-blue-300" />
              </div>
              <div>
                <h5 className="font-semibold text-blue-300 mb-1">JSON Format</h5>
                <p className="text-sm text-gray-300">
                  Complete quiz export with all questions and metadata. Perfect for technical users and data exchange.
                </p>
              </div>
            </div>

            {/* Markdown Format */}
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-lg flex items-center justify-center border border-green-400/30 flex-shrink-0">
                <FileCode className="h-5 w-5 text-green-300" />
              </div>
              <div>
                <h5 className="font-semibold text-green-300 mb-1">Markdown Format</h5>
                <p className="text-sm text-gray-300">
                  Human-readable format with questions and answers. Great for documentation and easy editing.
                </p>
              </div>
            </div>
          </div>

          {/* Format Tips */}
          <div className="mt-6 p-4 bg-white/5 rounded-xl border border-purple-400/20">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-emerald-300 mb-1">Pro Tips</p>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li>• JSON files should contain valid quiz data structure</li>
                  <li>• Markdown files should have clear question and answer formatting</li>
                  <li>• Both formats support multiple choice and open-ended questions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </GlassSurface>
    </div>
  );
}
