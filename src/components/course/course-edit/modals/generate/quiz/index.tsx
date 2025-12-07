import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { HelpCircle, Eye, Wand2, CheckCircle2, X, BookOpen } from "lucide-react";
import { useGenerateQuiz } from "@/hooks/queries/automation-hooks";
import { useGetLessonsByModule } from "@/hooks/queries/course/module-hooks";
import type { QuizGenerationReq, AttachedContextItem } from "@/types/ai";
import type { QuizQuestion } from "@/types/db/course/quiz-question";
import type { Answer } from "@/types/db/course/answer";
import { LessonType, type Lesson } from "@/types/db/course/lesson";
import { useCourseEdit } from "@/contexts/course/use-course-edit";

interface GenerateQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyQuiz: (quiz: { title: string; description: string; questions: QuizQuestion[] }, mode: "replace" | "append") => void;
  attachedContext: AttachedContextItem[];
  onAddContext: (item: AttachedContextItem) => void;
  onRemoveContext: (index: number) => void;
  onClearContext: () => void;
}

export function GenerateQuizModal({ 
  isOpen, 
  onClose, 
  onApplyQuiz, 
  attachedContext, 
  onAddContext, 
  onRemoveContext, 
  onClearContext 
}: GenerateQuizModalProps) {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState("5");
  const [applyMode, setApplyMode] = useState<"replace" | "append">("append");
  const [generatedQuiz, setGeneratedQuiz] = useState<{
    title: string;
    description: string;
    questions: QuizQuestion[];
  } | null>(null);
  const [activeTab, setActiveTab] = useState("generate");
  const [selectedLessons, setSelectedLessons] = useState<Set<string>>(new Set());
  
  const { mutate: generateQuiz, isPending: isGenerating } = useGenerateQuiz();
  const { selectedModuleId } = useCourseEdit();
  const { data: moduleResponse } = useGetLessonsByModule(selectedModuleId!);
  
  const availableLessons = moduleResponse?.data?.filter(
    (lesson: Lesson) => lesson.lessonType === LessonType.MARKDOWN && lesson.contentUrl
  ) || [];

  const handleLessonToggle = (lesson: Lesson, checked: boolean) => {
    const newSelected = new Set(selectedLessons);
    if (checked) {
      newSelected.add(lesson.id);
      onAddContext({
        title: lesson.title,
        content: lesson.contentUrl || ''
      });
    } else {
      newSelected.delete(lesson.id);
      const contextIndex = attachedContext.findIndex(item => item.title === lesson.title);
      if (contextIndex !== -1) {
        onRemoveContext(contextIndex);
      }
    }
    setSelectedLessons(newSelected);
  };
  
  const handleGenerate = () => {
    if (!topic.trim()) return;
    
    const requestData: QuizGenerationReq = {
      user_request: `${topic.trim()}${description.trim() ? ' - ' + description.trim() : ''}`,
      quantity: parseInt(numberOfQuestions) || 5,
      attached_context: attachedContext.length > 0 ? attachedContext : undefined
    };
    
    generateQuiz(requestData, {
      onSuccess: (response) => {
        if (response.isSuccess && response.data) {
          setGeneratedQuiz({
            title: `Quiz: ${topic}`,
            description: description.trim() || `Generated quiz about ${topic}`,
            questions: response.data.questions
          });
          setActiveTab("preview");
        }
      }
    });
  };
  
  const handleApply = () => {
    if (!generatedQuiz) return;
    
    onApplyQuiz(generatedQuiz, applyMode);
    handleClose();
  };
  
  const handleClose = () => {
    setTopic("");
    setDescription("");
    setNumberOfQuestions("5");
    setApplyMode("append");
    setGeneratedQuiz(null);
    setActiveTab("generate");
    setSelectedLessons(new Set());
    onClearContext();
    onClose();
  };
  
  const getQuestionTypeLabel = (type: number) => {
    switch (type) {
      case 0:
        return 'Single Choice';
      case 1:
        return 'Multiple Choice';
      case 2:
        return 'True/False';
      case 3:
        return 'Short Answer';
      default:
        return 'Unknown';
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Generate Quiz
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              Generate
            </TabsTrigger>
            <TabsTrigger 
              value="preview" 
              disabled={!generatedQuiz}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate" className="flex-1 space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic *</Label>
                <Input
                  id="topic"
                  placeholder="Enter the topic for quiz generation..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={isGenerating}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Provide additional context or specific requirements..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isGenerating}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="numberOfQuestions">Number of Questions</Label>
                <Input
                  id="numberOfQuestions"
                  type="number"
                  min="1"
                  max="20"
                  placeholder="5"
                  value={numberOfQuestions}
                  onChange={(e) => setNumberOfQuestions(e.target.value)}
                  disabled={isGenerating}
                />
              </div>
              
              {/* Context Attachment Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Attach Context from Current Module</Label>
                  <Badge variant="secondary" className="text-xs">
                    {attachedContext.length} attached
                  </Badge>
                </div>
                
                {availableLessons.length > 0 ? (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Available Markdown Lessons
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 max-h-32 overflow-y-auto">
                      {availableLessons.map((lesson: Lesson) => (
                        <div key={lesson.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`lesson-${lesson.id}`}
                            checked={selectedLessons.has(lesson.id)}
                            onCheckedChange={(checked) => handleLessonToggle(lesson, checked as boolean)}
                            disabled={isGenerating}
                          />
                          <Label
                            htmlFor={`lesson-${lesson.id}`}
                            className="text-sm font-normal cursor-pointer flex-1 truncate"
                          >
                            {lesson.title}
                          </Label>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="py-4">
                      <p className="text-sm text-muted-foreground text-center">
                        No markdown lessons available in this module
                      </p>
                    </CardContent>
                  </Card>
                )}
                
                {attachedContext.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Attached Context:</Label>
                    <div className="flex flex-wrap gap-2">
                      {attachedContext.map((item, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {item.title}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="ml-1 h-auto p-0 text-muted-foreground hover:text-destructive"
                            onClick={() => {
                              onRemoveContext(index);
                              const lessonToDeselect = availableLessons.find((l: Lesson) => l.title === item.title);
                              if (lessonToDeselect) {
                                const newSelected = new Set(selectedLessons);
                                newSelected.delete(lessonToDeselect.id);
                                setSelectedLessons(newSelected);
                              }
                            }}
                            disabled={isGenerating}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleClose} disabled={isGenerating}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleGenerate} 
                  disabled={!topic.trim() || isGenerating}
                >
                  {isGenerating && <Spinner className="mr-2 h-4 w-4" />}
                  Generate Quiz
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="preview" className="flex-1 flex flex-col">
            {generatedQuiz ? (
              <>
                <div className="flex-1 overflow-auto space-y-4">
                  {/* Quiz Header */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <HelpCircle className="h-5 w-5" />
                        {generatedQuiz.title}
                      </CardTitle>
                      {generatedQuiz.description && (
                        <p className="text-sm text-muted-foreground">
                          {generatedQuiz.description}
                        </p>
                      )}
                    </CardHeader>
                  </Card>
                  
                  {/* Questions */}
                  <div className="max-h-96 overflow-y-scroll space-y-4">
                    {generatedQuiz.questions.map((question, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-base">
                              {index + 1}. {question.questionText}
                            </CardTitle>
                            <Badge variant="outline">
                              {getQuestionTypeLabel(question.questionType)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {question.answers?.map((answer: Answer, answerIndex: number) => (
                              <div 
                                key={answerIndex} 
                                className={`flex items-center gap-2 p-2 rounded border ${
                                  answer.isCorrect
                                    ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'
                                    : 'bg-gray-50 border-gray-200 dark:bg-gray-900 dark:border-gray-700'
                                }`}
                              >
                                {answer.isCorrect && (
                                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                                )}
                                <span className="font-medium">
                                  {String.fromCharCode(65 + answerIndex)}.
                                </span>
                                <span>{answer.answerText}</span>
                              </div>
                            ))}
                            {question.questionType === 3 && (
                              <div className="p-2 bg-green-50 border border-green-200 rounded dark:bg-green-950 dark:border-green-800">
                                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                                  Correct Answer: {question.answers.find(a => a.isCorrect)?.answerText || 'N/A'}
                                </span>
                              </div>
                            )}

                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>How to apply generated questions?</Label>
                    <RadioGroup value={applyMode} onValueChange={(value) => setApplyMode(value as "replace" | "append")}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="append" id="append" />
                        <Label htmlFor="append">Add to existing questions</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="replace" id="replace" />
                        <Label htmlFor="replace">Replace all existing questions</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Button variant="outline" onClick={() => setActiveTab("generate")}>
                      Back to Edit
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={handleClose}>
                        Cancel
                      </Button>
                      <Button onClick={handleApply}>
                        {applyMode === "replace" ? "Replace Quiz" : "Add Questions"}
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground">No quiz generated yet</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}