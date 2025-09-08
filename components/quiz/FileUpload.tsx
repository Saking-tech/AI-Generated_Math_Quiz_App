"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, FileText, AlertCircle } from "lucide-react";

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Upload className="h-5 w-5 mr-2" />
          Import Quiz
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
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
          
          <div className="space-y-4">
            <FileText className="h-12 w-12 text-gray-400 mx-auto" />
            
            <div>
              <p className="text-lg font-medium text-gray-900">
                Drop your quiz file here
              </p>
              <p className="text-sm text-gray-600">
                Supports JSON and Markdown formats
              </p>
            </div>
            
            <div className="space-y-2">
              <Button 
                onClick={openFileDialog}
                disabled={uploading}
                variant="outline"
              >
                {uploading ? 'Processing...' : 'Choose File'}
              </Button>
              
              <p className="text-xs text-gray-500">
                Max file size: {maxSizeKB}KB | Formats: {acceptedTypes.join(', ')}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Upload Error</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        <div className="mt-6 space-y-3">
          <Label className="text-sm font-medium">Supported Formats:</Label>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div>
              <span className="font-medium">JSON Format:</span> Complete quiz export with all questions and metadata
            </div>
            <div>
              <span className="font-medium">Markdown Format:</span> Human-readable format with questions and answers
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
