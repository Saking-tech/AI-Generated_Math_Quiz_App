"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Code, Copy, CheckCircle } from "lucide-react";
import { downloadFile } from "@/lib/quizFormatters";

interface ExportButtonsProps {
  quiz: any;
  onExport: (format: 'json' | 'markdown') => Promise<string>;
}

export function ExportButtons({ quiz, onExport }: ExportButtonsProps) {
  const [exporting, setExporting] = useState<'json' | 'markdown' | null>(null);
  const [copied, setCopied] = useState(false);

  const handleExport = async (format: 'json' | 'markdown') => {
    setExporting(format);
    try {
      const content = await onExport(format);
      const filename = `${quiz.title.replace(/[^a-zA-Z0-9]/g, '_')}.${format === 'json' ? 'json' : 'md'}`;
      const mimeType = format === 'json' ? 'application/json' : 'text/markdown';
      
      downloadFile(content, filename, mimeType);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(null);
    }
  };

  const handleCopyLink = async () => {
    try {
      const quizUrl = `${window.location.origin}/quizzes/${quiz._id}`;
      await navigator.clipboard.writeText(quizUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Download className="h-5 w-5 mr-2" />
          Export Quiz
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={() => handleExport('json')}
            disabled={!!exporting}
            variant="outline"
            className="w-full"
          >
            <Code className="h-4 w-4 mr-2" />
            {exporting === 'json' ? 'Exporting...' : 'Export as JSON'}
          </Button>

          <Button
            onClick={() => handleExport('markdown')}
            disabled={!!exporting}
            variant="outline"
            className="w-full"
          >
            <FileText className="h-4 w-4 mr-2" />
            {exporting === 'markdown' ? 'Exporting...' : 'Export as Markdown'}
          </Button>
        </div>

        <div className="border-t pt-4">
          <Button
            onClick={handleCopyLink}
            variant="ghost"
            className="w-full"
          >
            {copied ? (
              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
            ) : (
              <Copy className="h-4 w-4 mr-2" />
            )}
            {copied ? 'Link Copied!' : 'Copy Quiz Link'}
          </Button>
        </div>

        <div className="space-y-3 text-sm text-gray-600">
          <div>
            <span className="font-medium">JSON Export:</span> Complete quiz data including all questions, answers, and settings. Perfect for backup or importing to another system.
          </div>
          <div>
            <span className="font-medium">Markdown Export:</span> Human-readable format ideal for documentation, sharing with colleagues, or printing.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
