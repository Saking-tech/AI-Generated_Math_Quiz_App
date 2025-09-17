"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Trash2, Edit, Save, X } from "lucide-react";
import { ExportButtons } from "@/components/quiz/ExportButtons";
import { exportToJson, exportToMarkdown } from "@/lib/quizFormatters";
import { toQuizId, toQuestionId } from "@/lib/types";
import GlassSurface from "@/components/GlassSurface";

type QuestionType = "mcq_single" | "mcq_multiple" | "short_answer";

interface Question {
  _id?: string;
  questionText: string;
  questionType: QuestionType;
  options?: string[];
  correctAnswers: string[];
  points: number;
  order: number;
}

export default function EditQuizPage() {
  const params = useParams();
  const quizId = params.id as string;
  
  const quiz = useQuery(api.quizzes.getQuizWithQuestions, 
    quizId ? { quizId: toQuizId(quizId) } : "skip"
  );
  const exportQuizData = useQuery(api.importExport.exportQuizJson,
    quizId ? { quizId: toQuizId(quizId) } : "skip"
  );
  const updateQuiz = useMutation(api.quizzes.updateQuiz);
  const createQuestion = useMutation(api.questions.createQuestion);
  const updateQuestion = useMutation(api.questions.updateQuestion);
  const deleteQuestion = useMutation(api.questions.deleteQuestion);

  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState<Question>({
    questionText: "",
    questionType: "mcq_single",
    options: ["", "", "", ""],
    correctAnswers: [],
    points: 1,
    order: 0,
  });
  const [showAddQuestion, setShowAddQuestion] = useState(false);

  const handleUpdateQuiz = async (field: string, value: string | number | boolean) => {
    try {
      await updateQuiz({
        quizId: toQuizId(quizId),
        [field]: value,
      });
    } catch (error) {
      console.error("Error updating quiz:", error);
    }
  };

  const handleAddQuestion = async () => {
    if (!quiz || !newQuestion.questionText.trim()) return;

    try {
      await createQuestion({
        quizId: toQuizId(quizId),
        questionText: newQuestion.questionText,
        questionType: newQuestion.questionType,
        options: newQuestion.questionType !== "short_answer" ? newQuestion.options.filter(o => o.trim()) : undefined,
        correctAnswers: newQuestion.correctAnswers,
        points: newQuestion.points,
        order: quiz.questions.length,
      });
      
      setNewQuestion({
        questionText: "",
        questionType: "mcq_single",
        options: ["", "", "", ""],
        correctAnswers: [],
        points: 1,
        order: 0,
      });
      setShowAddQuestion(false);
    } catch (error) {
      console.error("Error creating question:", error);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      await deleteQuestion({ questionId: toQuestionId(questionId) });
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const handleUpdateQuestion = async (questionId: string, updates: Partial<Question>) => {
    try {
      await updateQuestion({
        questionId: toQuestionId(questionId),
        ...updates,
      });
      setEditingQuestion(null);
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  const handleExportQuiz = async (format: 'json' | 'markdown'): Promise<string> => {
    if (!exportQuizData) {
      throw new Error('Quiz data not available for export');
    }

    if (format === 'json') {
      return exportToJson(exportQuizData);
    } else {
      return exportToMarkdown(exportQuizData);
    }
  };

  if (!quiz) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen relative">
      {/* Content */}
      <div className="relative z-10 mobile-padding tablet-padding desktop-padding py-8 mobile:py-12">
        {/* Header Section */}
        <div className="text-center mb-8 mobile:mb-12">
          <h1 className="text-mobile-hero font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Edit Quiz
          </h1>
          <p className="text-mobile-body text-gray-300 max-w-2xl mx-auto">
            Modify your quiz details, add questions, and manage settings
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
        
          {/* Quiz Details */}
          <GlassSurface
            width="100%"
            height="auto"
            borderRadius={20}
            backgroundOpacity={0.7}
            opacity={0.9}
            blur={20}
            blueOffset={50}
            className="p-6 mobile:p-8 bg-purple-300/20 mb-6"
          >
            <Card className="bg-transparent border-0 shadow-none">
              <CardHeader>
                <CardTitle className="text-purple-300">Quiz Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-purple-300">Title</Label>
                  <Input
                    id="title"
                    value={quiz.title}
                    onChange={(e) => handleUpdateQuiz("title", e.target.value)}
                    className="bg-white/10 border-purple-400/30 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-purple-300">Description</Label>
                  <Textarea
                    id="description"
                    value={quiz.description || ""}
                    onChange={(e) => handleUpdateQuiz("description", e.target.value)}
                    className="bg-white/10 border-purple-400/30 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                  />
                </div>
                <div>
                  <Label htmlFor="duration" className="text-purple-300">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={quiz.duration || ""}
                    onChange={(e) => handleUpdateQuiz("duration", parseInt(e.target.value) || undefined)}
                    className="bg-white/10 border-purple-400/30 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="published"
                    checked={quiz.isPublished}
                    onCheckedChange={(checked) => handleUpdateQuiz("isPublished", checked)}
                    className="border-purple-400/30 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-400"
                  />
                  <Label htmlFor="published" className="text-purple-300">Published</Label>
                </div>
              </CardContent>
            </Card>
          </GlassSurface>

          {/* Export Section */}
          {exportQuizData && (
            <GlassSurface
              width="100%"
              height="auto"
              borderRadius={20}
              backgroundOpacity={0.7}
              opacity={0.9}
              blur={20}
              blueOffset={50}
              className="p-6 mobile:p-8 bg-purple-300/20 mb-6"
            >
              <ExportButtons
                quiz={quiz}
                onExport={handleExportQuiz}
              />
            </GlassSurface>
          )}

          {/* Questions */}
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
            <Card className="bg-transparent border-0 shadow-none">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-purple-300">Questions ({quiz.questions.length})</CardTitle>
                  <Button 
                    onClick={() => setShowAddQuestion(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {quiz.questions.map((question, index) => (
                    <QuestionCard
                      key={question._id}
                      question={question}
                      index={index}
                      isEditing={editingQuestion === question._id}
                      onEdit={() => setEditingQuestion(question._id)}
                      onSave={(updates) => handleUpdateQuestion(question._id, updates)}
                      onCancel={() => setEditingQuestion(null)}
                      onDelete={() => handleDeleteQuestion(question._id)}
                    />
                  ))}

                  {/* Add New Question Form */}
                  {showAddQuestion && (
                    <Card className="border-2 border-dashed border-purple-400/30 bg-white/5">
                      <CardHeader>
                        <CardTitle className="text-lg text-purple-300">Add New Question</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <QuestionForm
                          question={newQuestion}
                          onChange={setNewQuestion}
                          onSave={handleAddQuestion}
                          onCancel={() => setShowAddQuestion(false)}
                        />
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          </GlassSurface>
        </div>
      </div>
    </div>
  );
}

function QuestionCard({ 
  question, 
  index, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  onDelete 
}: {
  question: Question;
  index: number;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (updates: Partial<Question>) => void;
  onCancel: () => void;
  onDelete: () => void;
}) {
  const [editData, setEditData] = useState<Question>({
    questionText: question.questionText,
    questionType: question.questionType,
    options: question.options || ["", "", "", ""],
    correctAnswers: question.correctAnswers,
    points: question.points,
    order: question.order,
  });

  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Edit Question {index + 1}</CardTitle>
        </CardHeader>
        <CardContent>
          <QuestionForm
            question={editData}
            onChange={setEditData}
            onSave={() => onSave(editData)}
            onCancel={onCancel}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/5 border border-purple-400/20">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-medium text-purple-300">Question {index + 1}</h3>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={onEdit} className="bg-transparent border-purple-400/30 text-purple-300 hover:bg-purple-600/20 hover:text-white">
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="destructive" onClick={onDelete} className="bg-red-600 hover:bg-red-700 text-white border-0">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <p className="mb-3 text-white">{question.questionText}</p>
        
        <div className="text-sm text-gray-300 mb-2">
          Type: {question.questionType} | Points: {question.points}
        </div>
        
        {question.options && (
          <div className="space-y-1">
            {question.options.map((option: string, idx: number) => (
              <div key={idx} className={`p-2 rounded ${
                question.correctAnswers.includes(option) ? 'bg-green-600/20 border border-green-400/30 text-green-300' : 'bg-white/5 border border-purple-400/20 text-white'
              }`}>
                {String.fromCharCode(65 + idx)}. {option}
              </div>
            ))}
          </div>
        )}
        
        {question.questionType === "short_answer" && (
          <div className="text-sm text-gray-300">
            Correct answer(s): {question.correctAnswers.join(", ")}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function QuestionForm({ 
  question, 
  onChange, 
  onSave, 
  onCancel 
}: {
  question: Question;
  onChange: (question: Question) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const updateQuestion = (field: string, value: string | number | string[]) => {
    onChange({ ...question, [field]: value });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...question.options];
    newOptions[index] = value;
    onChange({ ...question, options: newOptions });
  };

  const toggleCorrectAnswer = (answer: string) => {
    let newCorrectAnswers = [...question.correctAnswers];
    
    if (question.questionType === "mcq_single") {
      newCorrectAnswers = [answer];
    } else {
      const index = newCorrectAnswers.indexOf(answer);
      if (index > -1) {
        newCorrectAnswers.splice(index, 1);
      } else {
        newCorrectAnswers.push(answer);
      }
    }
    
    onChange({ ...question, correctAnswers: newCorrectAnswers });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="questionText" className="text-purple-300">Question Text</Label>
        <Textarea
          id="questionText"
          value={question.questionText}
          onChange={(e) => updateQuestion("questionText", e.target.value)}
          placeholder="Enter your question"
          className="bg-white/10 border-purple-400/30 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
        />
      </div>

      <div>
        <Label htmlFor="questionType" className="text-purple-300">Question Type</Label>
        <select
          id="questionType"
          value={question.questionType}
          onChange={(e) => updateQuestion("questionType", e.target.value)}
          className="w-full p-2 border border-purple-400/30 rounded bg-white/10 text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
        >
          <option value="mcq_single" className="bg-gray-800">Multiple Choice (Single Answer)</option>
          <option value="mcq_multiple" className="bg-gray-800">Multiple Choice (Multiple Answers)</option>
          <option value="short_answer" className="bg-gray-800">Short Answer</option>
        </select>
      </div>

      <div>
        <Label htmlFor="points" className="text-purple-300">Points</Label>
        <Input
          id="points"
          type="number"
          value={question.points}
          onChange={(e) => updateQuestion("points", parseInt(e.target.value) || 1)}
          min="1"
          className="bg-white/10 border-purple-400/30 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
        />
      </div>

      {question.questionType !== "short_answer" ? (
        <div>
          <Label className="text-purple-300">Options</Label>
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="text-sm font-medium w-8 text-purple-300">
                  {String.fromCharCode(65 + index)}.
                </span>
                <Input
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  className="bg-white/10 border-purple-400/30 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                />
                {question.questionType === "mcq_single" ? (
                  <RadioGroup
                    value={question.correctAnswers[0] || ""}
                    onValueChange={(value) => toggleCorrectAnswer(value)}
                  >
                    <RadioGroupItem value={option} className="border-purple-400/30 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-400" />
                  </RadioGroup>
                ) : (
                  <Checkbox
                    checked={question.correctAnswers.includes(option)}
                    onCheckedChange={() => toggleCorrectAnswer(option)}
                    className="border-purple-400/30 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-400"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <Label htmlFor="correctAnswer" className="text-purple-300">Correct Answer(s)</Label>
          <Input
            id="correctAnswer"
            value={question.correctAnswers.join(", ")}
            onChange={(e) => updateQuestion("correctAnswers", e.target.value.split(",").map(s => s.trim()))}
            placeholder="Enter correct answer(s), separated by commas"
            className="bg-white/10 border-purple-400/30 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
          />
        </div>
      )}

      <div className="flex space-x-2">
        <Button 
          onClick={onSave} 
          disabled={!question.questionText.trim()}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 disabled:opacity-50"
        >
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="bg-transparent border-purple-400/30 text-purple-300 hover:bg-purple-600/20 hover:text-white"
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
}
