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
import { FileText, Eye, Wand2, X, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useGenerateContent } from "@/hooks/queries/automation-hooks";
import { useCourseEdit } from "@/contexts/course/use-course-edit";
import { useGetLessonsByModule } from "@/hooks/queries/course/module-hooks";
import type { ContentGenerationReq, AttachedContextItem } from "@/types/ai";
import { LessonType, type Lesson } from "@/types/db/course/lesson";

interface GenerateMarkdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyContent: (content: string) => void;
  attachedContext: AttachedContextItem[];
  onAddContext: (item: AttachedContextItem) => void;
  onRemoveContext: (index: number) => void;
  onClearContext: () => void;
}

export function GenerateMarkdownModal({ 
  isOpen, 
  onClose, 
  onApplyContent, 
  attachedContext, 
  onAddContext, 
  onRemoveContext, 
  onClearContext 
}: GenerateMarkdownModalProps) {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [activeTab, setActiveTab] = useState("generate");
  const [selectedLessons, setSelectedLessons] = useState<Set<string>>(new Set());
  
  const { mutate: generateContent, isPending: isGenerating } = useGenerateContent();
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
    
    const requestData: ContentGenerationReq = {
      user_request: `${topic.trim()}${description.trim() ? ' - ' + description.trim() : ''}`,
      attached_context: attachedContext.length > 0 ? attachedContext : undefined
    };
    
    generateContent(requestData, {
      onSuccess: (response) => {
        if (response.isSuccess && response.data?.content) {
          setGeneratedContent(response.data.content);
          setActiveTab("preview");
        }
      }
    });
  };
  
  const handleApply = () => {
    if (!generatedContent) return;
    
    onApplyContent(generatedContent);
    handleClose();
  };
  
  const handleClose = () => {
    setTopic("");
    setDescription("");
    setGeneratedContent("");
    setActiveTab("generate");
    setSelectedLessons(new Set());
    onClearContext();
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate Markdown Content
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
              disabled={!generatedContent}
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
                  placeholder="Enter the topic for content generation..."
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
                  Generate Content
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="preview" className="flex-1 flex flex-col">
            {generatedContent ? (
              <>
                <div className="flex-1 overflow-auto border rounded-lg p-4">
                  <div className="max-h-96 prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {generatedContent}
                    </ReactMarkdown>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between items-center">
                  <Button variant="outline" onClick={() => setActiveTab("generate")}>
                    Back to Edit
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleClose}>
                      Cancel
                    </Button>
                    <Button onClick={handleApply}>
                      Apply to Lesson
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground">No content generated yet</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}