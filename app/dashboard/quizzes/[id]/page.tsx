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
    quizId ? { quizId: quizId as any } : "skip"
  );
  const exportQuizData = useQuery(api.importExport.exportQuizJson,
    quizId ? { quizId: quizId as any } : "skip"
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
        quizId: quizId as any,
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
        quizId: quizId as any,
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
      await deleteQuestion({ questionId: questionId as any });
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const handleUpdateQuestion = async (questionId: string, updates: Partial<Question>) => {
    try {
      await updateQuestion({
        questionId: questionId as any,
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
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Edit Quiz</h1>
        
        {/* Quiz Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Quiz Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={quiz.title}
                onChange={(e) => handleUpdateQuiz("title", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={quiz.description || ""}
                onChange={(e) => handleUpdateQuiz("description", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={quiz.duration || ""}
                onChange={(e) => handleUpdateQuiz("duration", parseInt(e.target.value) || undefined)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="published"
                checked={quiz.isPublished}
                onCheckedChange={(checked) => handleUpdateQuiz("isPublished", checked)}
              />
              <Label htmlFor="published">Published</Label>
            </div>
          </CardContent>
        </Card>

        {/* Export Section */}
        {exportQuizData && (
          <ExportButtons
            quiz={quiz}
            onExport={handleExportQuiz}
          />
        )}

        {/* Questions */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Questions ({quiz.questions.length})</CardTitle>
              <Button onClick={() => setShowAddQuestion(true)}>
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
                <Card className="border-2 border-dashed">
                  <CardHeader>
                    <CardTitle className="text-lg">Add New Question</CardTitle>
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
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-medium">Question {index + 1}</h3>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="destructive" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <p className="mb-3">{question.questionText}</p>
        
        <div className="text-sm text-gray-600 mb-2">
          Type: {question.questionType} | Points: {question.points}
        </div>
        
        {question.options && (
          <div className="space-y-1">
            {question.options.map((option: string, idx: number) => (
              <div key={idx} className={`p-2 rounded ${
                question.correctAnswers.includes(option) ? 'bg-green-100' : 'bg-gray-50'
              }`}>
                {String.fromCharCode(65 + idx)}. {option}
              </div>
            ))}
          </div>
        )}
        
        {question.questionType === "short_answer" && (
          <div className="text-sm text-gray-600">
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
        <Label htmlFor="questionText">Question Text</Label>
        <Textarea
          id="questionText"
          value={question.questionText}
          onChange={(e) => updateQuestion("questionText", e.target.value)}
          placeholder="Enter your question"
        />
      </div>

      <div>
        <Label htmlFor="questionType">Question Type</Label>
        <select
          id="questionType"
          value={question.questionType}
          onChange={(e) => updateQuestion("questionType", e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="mcq_single">Multiple Choice (Single Answer)</option>
          <option value="mcq_multiple">Multiple Choice (Multiple Answers)</option>
          <option value="short_answer">Short Answer</option>
        </select>
      </div>

      <div>
        <Label htmlFor="points">Points</Label>
        <Input
          id="points"
          type="number"
          value={question.points}
          onChange={(e) => updateQuestion("points", parseInt(e.target.value) || 1)}
          min="1"
        />
      </div>

      {question.questionType !== "short_answer" ? (
        <div>
          <Label>Options</Label>
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="text-sm font-medium w-8">
                  {String.fromCharCode(65 + index)}.
                </span>
                <Input
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + index)}`}
                />
                {question.questionType === "mcq_single" ? (
                  <RadioGroup
                    value={question.correctAnswers[0] || ""}
                    onValueChange={(value) => toggleCorrectAnswer(value)}
                  >
                    <RadioGroupItem value={option} />
                  </RadioGroup>
                ) : (
                  <Checkbox
                    checked={question.correctAnswers.includes(option)}
                    onCheckedChange={() => toggleCorrectAnswer(option)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <Label htmlFor="correctAnswer">Correct Answer(s)</Label>
          <Input
            id="correctAnswer"
            value={question.correctAnswers.join(", ")}
            onChange={(e) => updateQuestion("correctAnswers", e.target.value.split(",").map(s => s.trim()))}
            placeholder="Enter correct answer(s), separated by commas"
          />
        </div>
      )}

      <div className="flex space-x-2">
        <Button onClick={onSave} disabled={!question.questionText.trim()}>
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        <Button variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
}
