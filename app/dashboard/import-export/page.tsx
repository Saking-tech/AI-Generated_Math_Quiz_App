"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "../../../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/quiz/FileUpload";
import { ExportButtons } from "@/components/quiz/ExportButtons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { parseJsonQuiz, parseMarkdownQuiz, exportToJson, exportToMarkdown } from "@/lib/quizFormatters";
import { AlertCircle, CheckCircle, ArrowLeft, Upload, Download, FileText, Copy, Edit, Calendar, Clock, Globe, Lock, ChevronDown, FileJson, FileCode, Database, Settings } from "lucide-react";
import GlassSurface from "@/components/GlassSurface";
import TextType from "@/components/TextType";
import BlurText from "@/components/BlurText";

export default function ImportExportPage() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const quizzes = useQuery(api.quizzes.getQuizzesByCreator, 
    currentUser ? { creatorId: currentUser._id as any } : "skip"
  );
  const importQuiz = useMutation(api.importExport.importQuizJson);
  const [importing, setImporting] = useState(false);
  const [selectedQuizForExport, setSelectedQuizForExport] = useState<string>("");
  const exportQuizData = useQuery(
    api.importExport.exportQuizJson,
    selectedQuizForExport ? { quizId: selectedQuizForExport as any } : "skip"
  );
  const cloneQuiz = useMutation(api.importExport.cloneQuiz);
  const [importResult, setImportResult] = useState<{ success: boolean; message: string; quizId?: string } | null>(null);
  const [cloning, setCloning] = useState<string | null>(null);

  const handleFileUpload = async (content: string, filename: string, type: 'json' | 'markdown') => {
    if (!currentUser) return;

    setImporting(true);
    setImportResult(null);

    try {
      let quizData;
      
      if (type === 'json') {
        quizData = parseJsonQuiz(content);
      } else {
        quizData = parseMarkdownQuiz(content);
      }

      const quizId = await importQuiz({
        createdBy: currentUser._id as any,
        quizData,
      });

      setImportResult({
        success: true,
        message: `Successfully imported "${quizData.quiz.title}" with ${quizData.questions.length} questions.`,
        quizId,
      });
    } catch (error) {
      setImportResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to import quiz',
      });
    } finally {
      setImporting(false);
    }
  };

  const handleExportQuiz = async (format: 'json' | 'markdown'): Promise<string> => {
    if (!selectedQuizForExport || !exportQuizData) {
      throw new Error('No quiz selected for export or quiz data not available');
    }
    
    if (format === 'json') {
      return exportToJson(exportQuizData);
    } else {
      return exportToMarkdown(exportQuizData);
    }
  };

  const handleCloneQuiz = async (quizId: string, quizTitle: string) => {
    if (!currentUser) return;

    setCloning(quizId);
    try {
      const newQuizId = await cloneQuiz({
        sourceQuizId: quizId as any,
        createdBy: currentUser._id as any,
        newTitle: `${quizTitle} (Copy)`,
      });
      
      router.push(`/dashboard/quizzes/${newQuizId}`);
    } catch (error) {
      console.error('Failed to clone quiz:', error);
    } finally {
      setCloning(null);
    }
  };

  const selectedQuiz = quizzes?.find(q => q._id === selectedQuizForExport);

  const handleAnimationComplete = () => {
    console.log('Animation completed!');
  };

  return (
    <div className="min-h-screen relative">
      {/* Content */}
      <div className="relative z-10 mobile-padding tablet-padding desktop-padding py-8 mobile:py-12">
        {/* Header Section */}
        <div className="text-center mb-8 mobile:mb-12">
          <div className="flex items-center justify-center mb-6">
            <Button variant="outline" size="sm" asChild className="mr-4">
            <Link href="/dashboard/quizzes">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Quizzes
            </Link>
          </Button>
            <div className="p-3 mobile:p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-2xl border border-purple-400/30">
              <Database className="h-8 w-8 mobile:h-10 mobile:w-10 text-purple-300" />
        </div>
      </div>

          <h1 className="text-mobile-hero font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            <TextType
              text={["Import & Export Quizzes", "Import & Export Quizzes", "Import & Export Quizzes", "Import & Export Quizzes"]}
              typingSpeed={80}
              className="text-center"
            />
          </h1>

          <BlurText
            text="Import quizzes from files or export your existing quizzes in multiple formats. Manage your quiz data with ease and flexibility."
            delay={150}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className="text-mobile-body text-gray-300 max-w-3xl mx-auto text-center"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mobile:gap-12">
        {/* Import Section */}
        <div className="space-y-6">
            {/* Import Header Card */}
            <GlassSurface
              width="100%"
              height="auto"
              borderRadius={20}
              backgroundOpacity={0.7}
              opacity={0.9}
              blur={20}
              blueOffset={50}
              className="p-6 mobile:p-8 bg-purple-300/20"
            >
              <div className="text-center">
                <div className="w-16 h-16 mobile:w-20 mobile:h-20 mx-auto mb-4 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-full flex items-center justify-center border border-emerald-400/30">
                  <Upload className="h-8 w-8 mobile:h-10 mobile:w-10 text-emerald-300" />
                </div>
                <h2 className="text-mobile-title font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
                Import Quiz
                </h2>
                <p className="text-mobile-body text-gray-300">
                  Upload quiz files in JSON or Markdown format to import them into your account
                </p>
              </div>
            </GlassSurface>

            {/* File Upload Component */}
            <GlassSurface
              width="100%"
              height="auto"
              borderRadius={20}
              backgroundOpacity={0.7}
              opacity={0.9}
              blur={20}
              blueOffset={50}
              className="p-6 mobile:p-8 bg-purple-300/20"
            >
          <FileUpload 
            onFileUpload={handleFileUpload}
            acceptedTypes={['.json', '.md', '.txt']}
            maxSizeKB={2048}
          />
            </GlassSurface>

            {/* Import Status */}
          {importing && (
              <GlassSurface
                width="100%"
                height="auto"
                borderRadius={20}
                backgroundOpacity={0.7}
                opacity={0.9}
                blur={20}
                blueOffset={50}
                className="p-6 mobile:p-8 bg-purple-300/20"
              >
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold text-emerald-300 mb-2">Importing Quiz...</h3>
                  <p className="text-gray-300">Please wait while we process your file</p>
                </div>
              </GlassSurface>
            )}

            {/* Import Result */}
          {importResult && (
              <GlassSurface
                width="100%"
                height="auto"
                borderRadius={20}
                backgroundOpacity={0.7}
                opacity={0.9}
                blur={20}
                blueOffset={50}
                className="p-6 mobile:p-8 bg-purple-300/20"
              >
                <div className={`flex items-start ${importResult.success ? 'text-emerald-300' : 'text-red-300'}`}>
                  <div className="flex-shrink-0 mr-4">
                  {importResult.success ? (
                      <CheckCircle className="h-8 w-8 text-emerald-400" />
                  ) : (
                      <AlertCircle className="h-8 w-8 text-red-400" />
                  )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">
                      {importResult.success ? 'Import Successful!' : 'Import Failed'}
                    </h3>
                    <p className="text-gray-300 mb-4">{importResult.message}</p>
                    {importResult.success && importResult.quizId && (
                      <div className="flex flex-col mobile:flex-row gap-3">
                        <Button
                          asChild
                          size="sm"
                          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                        >
                          <Link href={`/dashboard/quizzes/${importResult.quizId}`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Quiz
                          </Link>
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="bg-transparent border-emerald-400/30 text-emerald-300 hover:bg-emerald-600/20 hover:text-white rounded-xl font-medium transition-all duration-300 hover:scale-105"
                        >
                          <Link href="/dashboard/quizzes">
                            <Database className="h-4 w-4 mr-2" />
                            View All Quizzes
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </GlassSurface>
          )}
        </div>

        {/* Export Section */}
        <div className="space-y-6">
            {/* Export Header Card */}
            <GlassSurface
              width="100%"
              height="auto"
              borderRadius={20}
              backgroundOpacity={0.7}
              opacity={0.9}
              blur={20}
              blueOffset={50}
              className="p-6 mobile:p-8 bg-purple-300/20"
            >
              <div className="text-center">
                <div className="w-16 h-16 mobile:w-20 mobile:h-20 mx-auto mb-4 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-full flex items-center justify-center border border-blue-400/30">
                  <Download className="h-8 w-8 mobile:h-10 mobile:w-10 text-blue-300" />
                </div>
                <h2 className="text-mobile-title font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2">
                Export Quiz
                </h2>
                <p className="text-mobile-body text-gray-300">
                  Select a quiz to export in JSON or Markdown format
                </p>
              </div>
            </GlassSurface>

            {/* Quiz Selection */}
            <GlassSurface
              width="100%"
              height="auto"
              borderRadius={20}
              backgroundOpacity={0.7}
              opacity={0.9}
              blur={20}
              blueOffset={50}
              className="p-6 mobile:p-8 bg-purple-300/20"
            >
              <div className="space-y-4">
                <Label htmlFor="quiz-select" className="text-lg font-semibold text-blue-300">
                  Select Quiz to Export
                </Label>
                <div className="relative">
                  <select
                    id="quiz-select"
                    value={selectedQuizForExport}
                    onChange={(e) => setSelectedQuizForExport(e.target.value)}
                    className="w-full p-4 bg-white/10 border border-blue-400/30 rounded-xl text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-gray-800 text-gray-300">Choose a quiz...</option>
                    {quizzes?.map((quiz) => (
                      <option key={quiz._id} value={quiz._id} className="bg-gray-800 text-gray-300">
                        {quiz.title} {quiz.isPublished ? '(Published)' : '(Draft)'}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-300 pointer-events-none" />
                </div>
              </div>
            </GlassSurface>

            {/* Export Buttons */}
          {selectedQuiz && exportQuizData && (
              <GlassSurface
                width="100%"
                height="auto"
                borderRadius={20}
                backgroundOpacity={0.7}
                opacity={0.9}
                blur={20}
                blueOffset={50}
                className="p-6 mobile:p-8 bg-purple-300/20"
              >
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-blue-300 mb-2">Export Formats</h3>
                  <p className="text-gray-300">Choose your preferred export format</p>
                </div>
            <ExportButtons
              quiz={selectedQuiz}
              onExport={handleExportQuiz}
            />
              </GlassSurface>
            )}

            {/* Quick Actions */}
            <GlassSurface
              width="100%"
              height="auto"
              borderRadius={20}
              backgroundOpacity={0.7}
              opacity={0.9}
              blur={20}
              blueOffset={50}
              className="p-6 mobile:p-8 bg-purple-300"
            >
              <div className="text-center mb-6">
                <div className="w-12 h-12 mobile:w-16 mobile:h-16 mx-auto mb-4 bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-full flex items-center justify-center border border-orange-400/30">
                  <Settings className="h-6 w-6 mobile:h-8 mobile:w-8 text-orange-300" />
                </div>
                <h3 className="text-lg font-semibold text-orange-300 mb-2">Quick Actions</h3>
                <p className="text-gray-300">Manage your quizzes with quick actions</p>
              </div>

              <div className="space-y-4">
                {quizzes?.slice(0, 5).map((quiz) => (
                  <div key={quiz._id} className="bg-white/5 border border-orange-400/20 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 group">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white truncate mb-1">{quiz.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            {quiz.isPublished ? (
                              <>
                                <Globe className="h-3 w-3 text-green-400" />
                                <span className="text-green-400">Published</span>
                              </>
                            ) : (
                              <>
                                <Lock className="h-3 w-3 text-gray-400" />
                                <span>Draft</span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Created {new Date(quiz.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                    </div>
                      <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => handleCloneQuiz(quiz._id, quiz.title)}
                        disabled={cloning === quiz._id}
                          className="bg-gradient-to-r from-orange-600/80 to-red-600/80 hover:from-orange-600 hover:to-red-600 text-white border-0 rounded-lg font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50"
                      >
                          <Copy className="h-4 w-4 mr-1" />
                        {cloning === quiz._id ? 'Cloning...' : 'Clone'}
                      </Button>
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="bg-transparent border-orange-400/30 text-orange-300 hover:bg-orange-600/20 hover:text-white rounded-lg font-medium transition-all duration-300 hover:scale-105"
                        >
                        <Link href={`/dashboard/quizzes/${quiz._id}`}>
                            <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {!quizzes || quizzes.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-gray-600/20 to-gray-700/20 rounded-full flex items-center justify-center border border-gray-500/30">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-400 mb-4">No quizzes found</p>
                    <Button
                      asChild
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                    >
                      <Link href="/dashboard/create-quiz">
                        <FileText className="h-4 w-4 mr-2" />
                        Create Your First Quiz
                      </Link>
                    </Button>
                  </div>
                ) : null}
              </div>
            </GlassSurface>
          </div>
        </div>
      </div>
    </div>
  );
}
