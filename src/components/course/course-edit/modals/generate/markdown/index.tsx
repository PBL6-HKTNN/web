import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { FileText, Eye, Wand2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useGenerateContent } from "@/hooks/queries/automation-hooks";
import type { ContentGenerationReq } from "@/types/ai";

interface GenerateMarkdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyContent: (content: string) => void;
}

export function GenerateMarkdownModal({ isOpen, onClose, onApplyContent }: GenerateMarkdownModalProps) {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [activeTab, setActiveTab] = useState("generate");
  
  const { mutate: generateContent, isPending: isGenerating } = useGenerateContent();
  
  const handleGenerate = () => {
    if (!topic.trim()) return;
    
    const requestData: ContentGenerationReq = {
      user_request: `${topic.trim()}${description.trim() ? ' - ' + description.trim() : ''}`
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