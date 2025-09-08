"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/quiz/FileUpload";
import { ExportButtons } from "@/components/quiz/ExportButtons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { parseJsonQuiz, parseMarkdownQuiz, exportToJson, exportToMarkdown } from "@/lib/quizFormatters";
import { AlertCircle, CheckCircle, ArrowLeft, Upload, Download } from "lucide-react";

export default function ImportExportPage() {
  const { user } = useUser();
  const router = useRouter();
  const userData = useQuery(api.users.getUserByClerkId, 
    user ? { clerkId: user.id } : "skip"
  );
  const quizzes = useQuery(api.quizzes.getQuizzesByCreator, 
    userData ? { creatorId: userData._id } : "skip"
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
    if (!userData) return;

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
        createdBy: userData._id,
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
    if (!userData) return;

    setCloning(quizId);
    try {
      const newQuizId = await cloneQuiz({
        sourceQuizId: quizId as any,
        createdBy: userData._id,
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

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Button variant="outline" size="sm" asChild className="mb-4">
            <Link href="/dashboard/quizzes">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Quizzes
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Import & Export Quizzes</h1>
          <p className="text-gray-600 mt-2">
            Import quizzes from files or export your existing quizzes in JSON or Markdown format.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Import Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Import Quiz
              </CardTitle>
              <CardDescription>
                Upload a quiz file in JSON or Markdown format to import it into your account.
              </CardDescription>
            </CardHeader>
          </Card>

          <FileUpload 
            onFileUpload={handleFileUpload}
            acceptedTypes={['.json', '.md', '.txt']}
            maxSizeKB={2048}
          />

          {importing && (
            <Card>
              <CardContent className="text-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p>Importing quiz...</p>
              </CardContent>
            </Card>
          )}

          {importResult && (
            <Card>
              <CardContent className="py-4">
                <div className={`flex items-start ${importResult.success ? 'text-green-800' : 'text-red-800'}`}>
                  {importResult.success ? (
                    <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium">
                      {importResult.success ? 'Import Successful!' : 'Import Failed'}
                    </p>
                    <p className="text-sm mt-1">{importResult.message}</p>
                    {importResult.success && importResult.quizId && (
                      <div className="mt-3 space-x-2">
                        <Button size="sm" asChild>
                          <Link href={`/dashboard/quizzes/${importResult.quizId}`}>
                            Edit Quiz
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link href="/dashboard/quizzes">
                            View All Quizzes
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Export Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Download className="h-5 w-5 mr-2" />
                Export Quiz
              </CardTitle>
              <CardDescription>
                Select a quiz to export in JSON or Markdown format.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="quiz-select">Select Quiz to Export</Label>
                  <select
                    id="quiz-select"
                    value={selectedQuizForExport}
                    onChange={(e) => setSelectedQuizForExport(e.target.value)}
                    className="w-full p-2 border rounded-md mt-1"
                  >
                    <option value="">Choose a quiz...</option>
                    {quizzes?.map((quiz) => (
                      <option key={quiz._id} value={quiz._id}>
                        {quiz.title} {quiz.isPublished ? '(Published)' : '(Draft)'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {selectedQuiz && exportQuizData && (
            <ExportButtons
              quiz={selectedQuiz}
              onExport={handleExportQuiz}
            />
          )}

          {/* Quiz Management */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quizzes?.slice(0, 5).map((quiz) => (
                  <div key={quiz._id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{quiz.title}</p>
                      <p className="text-sm text-gray-600">
                        {quiz.isPublished ? 'Published' : 'Draft'} • 
                        Created {new Date(quiz.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCloneQuiz(quiz._id, quiz.title)}
                        disabled={cloning === quiz._id}
                      >
                        {cloning === quiz._id ? 'Cloning...' : 'Clone'}
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/dashboard/quizzes/${quiz._id}`}>
                          Edit
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
                
                {!quizzes || quizzes.length === 0 ? (
                  <p className="text-center text-gray-600 py-4">
                    No quizzes found. <Link href="/dashboard/create-quiz" className="text-blue-600 hover:underline">Create your first quiz</Link>
                  </p>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
