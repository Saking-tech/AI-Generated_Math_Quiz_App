// Quiz format conversion utilities

export interface QuizExportData {
  quiz: {
    title: string;
    description?: string;
    duration?: number;
    isPublished?: boolean;
  };
  questions: Array<{
    questionText: string;
    questionType: "mcq_single" | "mcq_multiple" | "short_answer";
    options?: string[];
    correctAnswers: string[];
    points: number;
    order: number;
  }>;
  exportedAt?: string;
  version?: string;
}

export interface QuizImportData {
  quiz: {
    title: string;
    description?: string;
    duration?: number;
    isPublished?: boolean;
  };
  questions: Array<{
    questionText: string;
    questionType: "mcq_single" | "mcq_multiple" | "short_answer";
    options?: string[];
    correctAnswers: string[];
    points: number;
    order: number;
  }>;
  version?: string;
  exportedAt?: string;
}

// Convert quiz data to JSON format
export function exportToJson(quizData: QuizExportData): string {
  return JSON.stringify(quizData, null, 2);
}

// Parse JSON format to quiz data
export function parseJsonQuiz(jsonString: string): QuizImportData {
  try {
    const data = JSON.parse(jsonString);
    
    // Validate required fields
    if (!data.quiz || !data.quiz.title || !Array.isArray(data.questions)) {
      throw new Error("Invalid quiz format: missing required fields");
    }

    // Validate questions
    for (const question of data.questions) {
      if (!question.questionText || !question.questionType || !Array.isArray(question.correctAnswers)) {
        throw new Error("Invalid question format");
      }
      
      if (!["mcq_single", "mcq_multiple", "short_answer"].includes(question.questionType)) {
        throw new Error(`Invalid question type: ${question.questionType}`);
      }
    }

    return data as QuizImportData;
  } catch (error) {
    throw new Error(`Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Convert quiz data to Markdown format
export function exportToMarkdown(quizData: QuizExportData): string {
  let markdown = `# ${quizData.quiz.title}\n\n`;
  
  if (quizData.quiz.description) {
    markdown += `**Description:** ${quizData.quiz.description}\n\n`;
  }
  
  if (quizData.quiz.duration) {
    markdown += `**Duration:** ${quizData.quiz.duration} minutes\n\n`;
  }
  
  markdown += `**Status:** ${quizData.quiz.isPublished ? 'Published' : 'Draft'}\n\n`;
  
  if (quizData.exportedAt) {
    markdown += `**Exported:** ${new Date(quizData.exportedAt).toLocaleString()}\n\n`;
  }
  
  markdown += `---\n\n## Questions\n\n`;
  
  quizData.questions
    .sort((a, b) => a.order - b.order)
    .forEach((question, index) => {
      markdown += `### Question ${index + 1}\n\n`;
      markdown += `**Type:** ${getQuestionTypeLabel(question.questionType)}\n\n`;
      markdown += `**Points:** ${question.points}\n\n`;
      markdown += `**Question:** ${question.questionText}\n\n`;
      
      if (question.options && question.options.length > 0) {
        markdown += `**Options:**\n`;
        question.options.forEach((option, optionIndex) => {
          const letter = String.fromCharCode(65 + optionIndex);
          const isCorrect = question.correctAnswers.includes(option);
          markdown += `- ${letter}. ${option}${isCorrect ? ' ✓' : ''}\n`;
        });
        markdown += '\n';
      }
      
      if (question.questionType === "short_answer") {
        markdown += `**Correct Answer(s):** ${question.correctAnswers.join(', ')}\n\n`;
      }
      
      markdown += `---\n\n`;
    });
  
  return markdown;
}

// Parse Markdown format to quiz data
export function parseMarkdownQuiz(markdownString: string): QuizImportData {
  try {
    const lines = markdownString.split('\n');
    let currentIndex = 0;
    
    // Parse title
    const titleMatch = lines[currentIndex]?.match(/^# (.+)$/);
    if (!titleMatch) {
      throw new Error("Invalid markdown format: missing title");
    }
    
    const quiz: QuizImportData['quiz'] = {
      title: titleMatch[1].trim(),
    };
    
    currentIndex++;
    
    // Parse metadata
    while (currentIndex < lines.length && !lines[currentIndex].includes('## Questions')) {
      const line = lines[currentIndex].trim();
      
      if (line.startsWith('**Description:**')) {
        quiz.description = line.replace('**Description:**', '').trim();
      } else if (line.startsWith('**Duration:**')) {
        const durationMatch = line.match(/(\d+)/);
        if (durationMatch) {
          quiz.duration = parseInt(durationMatch[1]);
        }
      } else if (line.startsWith('**Status:**')) {
        quiz.isPublished = line.includes('Published');
      }
      
      currentIndex++;
    }
    
    // Find questions section
    while (currentIndex < lines.length && !lines[currentIndex].includes('## Questions')) {
      currentIndex++;
    }
    
    if (currentIndex >= lines.length) {
      throw new Error("Invalid markdown format: missing questions section");
    }
    
    currentIndex++; // Skip ## Questions line
    
    const questions: QuizImportData['questions'] = [];
    let questionOrder = 0;
    
    // Parse questions
    while (currentIndex < lines.length) {
      const line = lines[currentIndex].trim();
      
      if (line.startsWith('### Question')) {
        const question: QuizImportData['questions'][0] = {
          questionText: '',
          questionType: 'mcq_single',
          correctAnswers: [],
          points: 1,
          order: questionOrder++,
        };
        
        currentIndex++;
        
        // Parse question details
        while (currentIndex < lines.length && !lines[currentIndex].startsWith('### Question') && !lines[currentIndex].startsWith('---')) {
          const detailLine = lines[currentIndex].trim();
          
          if (detailLine.startsWith('**Type:**')) {
            const typeText = detailLine.replace('**Type:**', '').trim();
            question.questionType = parseQuestionType(typeText);
          } else if (detailLine.startsWith('**Points:**')) {
            const pointsMatch = detailLine.match(/(\d+)/);
            if (pointsMatch) {
              question.points = parseInt(pointsMatch[1]);
            }
          } else if (detailLine.startsWith('**Question:**')) {
            question.questionText = detailLine.replace('**Question:**', '').trim();
          } else if (detailLine.startsWith('**Options:**')) {
            question.options = [];
            currentIndex++;
            
            // Parse options
            while (currentIndex < lines.length && lines[currentIndex].trim().startsWith('- ')) {
              const optionLine = lines[currentIndex].trim();
              const optionMatch = optionLine.match(/^- [A-Z]\. (.+?)( ✓)?$/);
              if (optionMatch) {
                const optionText = optionMatch[1];
                const isCorrect = Boolean(optionMatch[2]);
                
                question.options!.push(optionText);
                if (isCorrect) {
                  question.correctAnswers.push(optionText);
                }
              }
              currentIndex++;
            }
            currentIndex--; // Adjust for the increment at the end of the loop
          } else if (detailLine.startsWith('**Correct Answer(s):**')) {
            const answersText = detailLine.replace('**Correct Answer(s):**', '').trim();
            question.correctAnswers = answersText.split(',').map(a => a.trim());
          }
          
          currentIndex++;
        }
        
        if (question.questionText) {
          questions.push(question);
        }
      } else {
        currentIndex++;
      }
    }
    
    if (questions.length === 0) {
      throw new Error("Invalid markdown format: no valid questions found");
    }
    
    return {
      quiz,
      questions,
      version: "1.0",
    };
  } catch (error) {
    throw new Error(`Failed to parse Markdown: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function getQuestionTypeLabel(type: string): string {
  switch (type) {
    case 'mcq_single':
      return 'Multiple Choice (Single Answer)';
    case 'mcq_multiple':
      return 'Multiple Choice (Multiple Answers)';
    case 'short_answer':
      return 'Short Answer';
    default:
      return type;
  }
}

function parseQuestionType(typeLabel: string): "mcq_single" | "mcq_multiple" | "short_answer" {
  const lower = typeLabel.toLowerCase();
  if (lower.includes('multiple') && lower.includes('single')) {
    return 'mcq_single';
  } else if (lower.includes('multiple')) {
    return 'mcq_multiple';
  } else if (lower.includes('short')) {
    return 'short_answer';
  }
  return 'mcq_single'; // Default
}

// File download utility
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
