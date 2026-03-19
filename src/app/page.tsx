'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Sparkles, 
  Save, 
  Download, 
  Send, 
  Trash2, 
  ListChecks, 
  Type, 
  FileText, 
  Target, 
  Globe, 
  ShieldCheck, 
  Zap, 
  Search,
  Settings2,
  Hammer,
  FileEdit,
  Eraser
} from 'lucide-react';
import { generateSeoDraftArticle } from '@/ai/flows/generate-seo-draft-article-flow';
import { getSeoOptimizationSuggestions, type GetSeoOptimizationSuggestionsOutput } from '@/ai/flows/get-seo-optimization-suggestions';
import { calculateSeoMetrics, type SeoMetrics } from '@/lib/seo-utils';
import { SeoPanel } from '@/components/SeoPanel';
import { ExportDialog } from '@/components/ExportDialog';

export default function RankForgeEditor() {
  // Article State
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [audience, setAudience] = useState('');
  const [location, setLocation] = useState('');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  
  // App State
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [metrics, setMetrics] = useState<SeoMetrics>({
    score: 0,
    wordCount: 0,
    keywordDensity: 0,
    headingCount: 0,
    readability: 'Poor',
  });
  const [suggestions, setSuggestions] = useState<GetSeoOptimizationSuggestionsOutput | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const { toast } = useToast();

  // Keyword array conversion
  const keywordList = keywords.split(',').map(k => k.trim()).filter(k => k.length > 0);

  // Live SEO Analysis
  useEffect(() => {
    const calculated = calculateSeoMetrics(content, keywordList);
    setMetrics(calculated);
  }, [content, keywords]);

  // AI Suggestions triggering (Debounced)
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (content.length > 100) {
        setIsAnalyzing(true);
        try {
          const result = await getSeoOptimizationSuggestions({
            articleContent: content,
            targetKeywords: keywordList,
            targetAudience: audience || 'General Public',
            targetLocation: location || undefined,
          });
          setSuggestions(result);
        } catch (error) {
          console.error('Analysis failed:', error);
        } finally {
          setIsAnalyzing(false);
        }
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [content, keywords, audience, location]);

  const handleGenerate = async (format: 'article' | 'outline') => {
    if (!topic || !keywords) {
      toast({
        variant: 'destructive',
        title: 'Input Required',
        description: 'Please provide a topic and at least one keyword to begin forging.',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateSeoDraftArticle({
        topic,
        keywords: keywordList,
        audienceInsights: audience || 'General audience looking for professional information.',
        outputFormat: format,
      });
      
      setContent(result.content);
      const titleMatch = result.content.match(/^# (.*)/);
      if (titleMatch) setTitle(titleMatch[1]);
      else setTitle(topic);
      
      toast({
        title: 'Content Forged',
        description: `Your ${format} has been successfully generated using E.E.A.T principles.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Forge Error',
        description: 'Failed to generate content. Please check your connection and try again.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const clearEditor = () => {
    if (confirm('Are you sure you want to clear all content?')) {
      setContent('');
      setTitle('');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC] overflow-hidden text-slate-900">
      {/* Precision Header */}
      <header className="h-14 border-b bg-white flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-primary rounded-md p-1">
              <Hammer className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold tracking-tight text-primary">RankForge AI</span>
          </div>
          
          <div className="h-4 w-px bg-slate-200"></div>
          
          <div className="flex flex-col">
            <Input 
              placeholder="Article Title..." 
              className="border-none p-0 h-auto text-sm font-semibold focus-visible:ring-0 bg-transparent w-[300px]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              <span className="flex items-center gap-1 text-accent">
                <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse"></div>
                Live Analysis
              </span>
              <span>&bull;</span>
              <span>{metrics.wordCount} words</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={clearEditor} className="text-slate-500 hover:text-destructive">
            <Eraser className="h-4 w-4 mr-2" /> Clear
          </Button>
          <div className="h-4 w-px bg-slate-200 mx-2"></div>
          <Button variant="outline" size="sm" className="bg-white" onClick={() => toast({ title: 'Saved locally' })}>
            <Save className="h-4 w-4 mr-2" /> Save
          </Button>
          <Button size="sm" className="shadow-sm shadow-primary/20" onClick={() => setExportOpen(true)}>
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Control Panel */}
        <aside className="w-[340px] border-r bg-white flex flex-col shrink-0">
          <Tabs defaultValue="parameters" className="w-full flex flex-col flex-1">
            <div className="px-4 py-3 border-b">
              <TabsList className="grid w-full grid-cols-2 bg-slate-100/50">
                <TabsTrigger value="parameters" className="text-xs">Forge Setup</TabsTrigger>
                <TabsTrigger value="ai" className="text-xs">AI Tools</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="parameters" className="flex-1 overflow-hidden m-0">
              <ScrollArea className="h-full">
                <div className="p-5 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="topic" className="text-xs font-bold text-slate-500 uppercase">Primary Topic</Label>
                      <Input 
                        id="topic" 
                        placeholder="e.g. Modern Web Architecture" 
                        className="bg-slate-50/50"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="keywords" className="text-xs font-bold text-slate-500 uppercase">Target Keywords</Label>
                      <Textarea 
                        id="keywords" 
                        placeholder="keyword1, keyword2..." 
                        className="bg-slate-50/50 min-h-[80px] resize-none"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                      />
                      <p className="text-[10px] text-slate-400">Separate keywords with commas for best analysis.</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="audience" className="text-xs font-bold text-slate-500 uppercase">Target Audience</Label>
                      <Input 
                        id="audience" 
                        placeholder="e.g. Tech Professionals" 
                        className="bg-slate-50/50 h-8 text-sm"
                        value={audience}
                        onChange={(e) => setAudience(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-xs font-bold text-slate-500 uppercase">G.E.O Focus</Label>
                      <div className="relative">
                        <Globe className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                        <Input 
                          id="location" 
                          placeholder="Global / Specific Region" 
                          className="bg-slate-50/50 pl-8 h-8 text-sm"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="ai" className="flex-1 overflow-hidden m-0">
              <ScrollArea className="h-full">
                <div className="p-5 space-y-6">
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-3">
                    <div className="flex items-center gap-2 text-primary font-bold text-sm">
                      <Sparkles className="h-4 w-4" />
                      Content Forge
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Generate high-ranking content using built-in E.E.A.T and G.E.O intelligence.
                    </p>
                    <div className="space-y-2 pt-2">
                      <Button 
                        onClick={() => handleGenerate('article')} 
                        disabled={isGenerating} 
                        className="w-full text-xs h-9 bg-primary shadow-lg shadow-primary/20"
                      >
                        {isGenerating ? "Forging..." : "Generate Full Article"}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => handleGenerate('outline')} 
                        disabled={isGenerating} 
                        className="w-full text-xs h-9"
                      >
                        Create Detailed Outline
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Optimization Modules</h3>
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between p-3 rounded-lg border bg-white hover:border-primary/30 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-3">
                          <ShieldCheck className="h-4 w-4 text-accent" />
                          <span className="text-xs font-medium">E.E.A.T Validator</span>
                        </div>
                        <Zap className="h-3 w-3 text-slate-300 group-hover:text-primary" />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg border bg-white hover:border-primary/30 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-3">
                          <Target className="h-4 w-4 text-primary" />
                          <span className="text-xs font-medium">Search Intent Match</span>
                        </div>
                        <Zap className="h-3 w-3 text-slate-300 group-hover:text-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 bg-[#F1F5F9] relative flex flex-col p-6 overflow-hidden">
          <div className="flex-1 max-w-5xl mx-auto w-full bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col relative">
            <div className="h-10 border-b bg-slate-50/50 flex items-center px-4 gap-4 overflow-x-auto shrink-0 scrollbar-hide">
              <div className="flex gap-1">
                 <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
              </div>
              <div className="h-4 w-px bg-slate-200"></div>
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="text-[9px] bg-slate-200 text-slate-600 border-none font-bold uppercase">Markdown</Badge>
                <div className="flex gap-2">
                  <button className="p-1 hover:bg-slate-200 rounded transition-colors"><Type className="h-3.5 w-3.5 text-slate-500" /></button>
                  <button className="p-1 hover:bg-slate-200 rounded transition-colors"><ListChecks className="h-3.5 w-3.5 text-slate-500" /></button>
                  <button className="p-1 hover:bg-slate-200 rounded transition-colors"><FileEdit className="h-3.5 w-3.5 text-slate-500" /></button>
                </div>
              </div>
            </div>

            <div className="flex-1 p-8 lg:p-12 overflow-y-auto custom-scrollbar">
              {content.length === 0 && !isGenerating && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-500">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-200 shadow-sm">
                    <FileEdit className="h-8 w-8 text-slate-300" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold text-slate-800">Your Forge is Ready</h2>
                    <p className="text-sm text-slate-400 max-w-[260px] mx-auto">Start typing manually or use AI Tools on the left to ignite your first draft.</p>
                  </div>
                </div>
              )}

              {isGenerating && (
                <div className="h-full flex flex-col items-center justify-center space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 animate-ping h-full w-full rounded-full bg-primary/20"></div>
                    <div className="relative bg-white p-5 rounded-3xl border shadow-xl">
                      <Sparkles className="h-10 w-10 text-primary animate-pulse" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <h2 className="text-lg font-bold">Forging Content...</h2>
                    <div className="flex items-center gap-1.5 justify-center">
                      <span className="w-1 h-1 rounded-full bg-primary animate-bounce"></span>
                      <span className="w-1 h-1 rounded-full bg-primary animate-bounce delay-75"></span>
                      <span className="w-1 h-1 rounded-full bg-primary animate-bounce delay-150"></span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4">Applying Ranking Principles</p>
                  </div>
                </div>
              )}

              {!isGenerating && content.length > 0 && (
                <Textarea 
                  className="w-full border-none resize-none p-0 text-lg leading-relaxed focus-visible:ring-0 min-h-full font-body scrollbar-hide placeholder:text-slate-200"
                  placeholder="The story begins here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              )}
            </div>
          </div>
          
          <div className="h-10 flex items-center justify-between px-2 pt-2 shrink-0">
             <div className="flex gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
               <span className="flex items-center gap-1.5"><FileText className="h-3 w-3 text-primary" /> {metrics.wordCount} words</span>
               <span className="flex items-center gap-1.5"><Type className="h-3 w-3 text-accent" /> {metrics.headingCount} sections</span>
               <span className="flex items-center gap-1.5"><Search className="h-3 w-3 text-blue-500" /> {metrics.keywordDensity}% density</span>
             </div>
             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                Workspace Sync Active
             </div>
          </div>
        </main>

        {/* Intelligence Sidebar */}
        <aside className="w-[340px] border-l bg-white flex flex-col shrink-0">
          <SeoPanel 
            metrics={metrics} 
            suggestions={suggestions} 
            isLoading={isAnalyzing} 
            content={content}
          />
        </aside>
      </div>

      <ExportDialog 
        open={exportOpen} 
        onOpenChange={setExportOpen} 
        content={content} 
        title={title || topic} 
      />
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #CBD5E1;
        }
      `}</style>
    </div>
  );
}
