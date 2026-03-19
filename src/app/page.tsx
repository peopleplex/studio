'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { 
  Sparkles, 
  Type, 
  FileText, 
  Search,
  Hammer,
  FileEdit,
  Eraser,
  Building2,
  Hash,
  BrainCircuit,
  Info,
  Copy,
  MessagesSquare,
  Eye,
  PenLine,
  BarChart4,
  Menu,
  Settings2,
  ChevronRight
} from 'lucide-react';
import { generateSeoDraftArticle } from '@/ai/flows/generate-seo-draft-article-flow';
import { getSeoOptimizationSuggestions, type GetSeoOptimizationSuggestionsOutput } from '@/ai/flows/get-seo-optimization-suggestions';
import { calculateSeoMetrics, type SeoMetrics } from '@/lib/seo-utils';
import { SeoPanel } from '@/components/SeoPanel';

export default function RankForgeEditor() {
  // Article State
  const [topic, setTopic] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('Professional');
  const [geoOptimization, setGeoOptimization] = useState('SearchGPT, Google SGE');
  const [targetWordCount, setTargetWordCount] = useState('1000');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  
  // App State
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [metrics, setMetrics] = useState<SeoMetrics>({
    score: 0,
    wordCount: 0,
    keywordDensity: 0,
    headingCount: 0,
    readability: 'Poor',
  });
  const [suggestions, setSuggestions] = useState<GetSeoOptimizationSuggestionsOutput | null>(null);
  const { toast } = useToast();

  // Keyword array conversion
  const keywordList = keywords.split(',').map(k => k.trim()).filter(k => k.length > 0);

  // Live SEO Metrics
  useEffect(() => {
    const calculated = calculateSeoMetrics(content, keywordList);
    setMetrics(calculated);
  }, [content, keywords]);

  const handleAnalyze = async (manualContent?: string) => {
    const contentToAnalyze = manualContent || content;
    if (contentToAnalyze.length < 50) {
      if (!manualContent) {
        toast({
          variant: 'destructive',
          title: 'Content Too Short',
          description: 'Please write or generate at least 50 words to analyze SEO quality.',
        });
      }
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await getSeoOptimizationSuggestions({
        articleContent: contentToAnalyze,
        targetKeywords: keywordList,
        geoOptimization: geoOptimization || undefined,
      });
      setSuggestions(result);
    } catch (error: any) {
      console.error('Analysis failed:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Error',
        description: error.message || 'Failed to analyze content.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

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
    setIsPreview(false);
    setSuggestions(null); 
    
    try {
      const result = await generateSeoDraftArticle({
        topic,
        companyName,
        companyDescription,
        keywords: keywordList,
        tone,
        outputFormat: format,
        targetWordCount: parseInt(targetWordCount) || undefined,
        geoOptimization: geoOptimization,
      });
      
      setContent(result.content);
      setIsPreview(true);
      
      const titleMatch = result.content.match(/^# (.*)/);
      if (titleMatch) setTitle(titleMatch[1]);
      else setTitle(topic);
      
      toast({
        title: 'Content Forged',
        description: `Your ${format} is complete. Running Intelligence Analysis...`,
      });

      await handleAnalyze(result.content);
      
      toast({
        title: 'Analysis Complete',
        description: 'Forge Intelligence has updated your SEO and G.E.O suggestions.',
      });

    } catch (error: any) {
      console.error('Forge Error Detail:', error);
      toast({
        variant: 'destructive',
        title: 'Forge Error',
        description: error.message || 'Failed to generate content.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const clearEditor = () => {
    if (confirm('Are you sure you want to clear all content?')) {
      setContent('');
      setTitle('');
      setSuggestions(null);
    }
  };

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    toast({
      title: 'Copied!',
      description: 'Content has been copied to your clipboard.',
    });
  };

  const LeftPanelContent = () => (
    <Tabs defaultValue="parameters" className="w-full flex flex-col h-full overflow-hidden">
      <div className="px-4 py-3 border-b shrink-0">
        <TabsList className="grid w-full grid-cols-2 bg-slate-100/50">
          <TabsTrigger value="parameters" className="text-xs">Forge Setup</TabsTrigger>
          <TabsTrigger value="ai" className="text-xs">AI Tools</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="parameters" className="flex-1 overflow-hidden m-0">
        <ScrollArea className="h-full">
          <div className="p-5 space-y-6 pb-20">
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
                <Label htmlFor="tone" className="text-xs font-bold text-slate-500 uppercase">Tone of Voice</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger className="bg-slate-50/50">
                    <MessagesSquare className="h-3.5 w-3.5 text-slate-400 mr-2" />
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Conversational">Conversational</SelectItem>
                    <SelectItem value="Authoritative">Authoritative</SelectItem>
                    <SelectItem value="Informative">Informative</SelectItem>
                    <SelectItem value="Creative">Creative</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company" className="text-xs font-bold text-slate-500 uppercase">Company Name</Label>
                <div className="relative">
                  <Building2 className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <Input 
                    id="company" 
                    placeholder="Brand or Organization" 
                    className="bg-slate-50/50 pl-8"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs font-bold text-slate-500 uppercase">Company Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Brief overview..." 
                  className="bg-slate-50/50 min-h-[80px] resize-none text-sm"
                  value={companyDescription}
                  onChange={(e) => setCompanyDescription(e.target.value)}
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="geo" className="text-xs font-bold text-slate-500 uppercase">G.E.O Focus</Label>
                <div className="relative">
                  <BrainCircuit className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-primary" />
                  <Input 
                    id="geo" 
                    placeholder="SearchGPT, Google SGE..." 
                    className="bg-slate-50/50 pl-8 h-8 text-sm"
                    value={geoOptimization}
                    onChange={(e) => setGeoOptimization(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wordcount" className="text-xs font-bold text-slate-500 uppercase">Number of Words</Label>
                <div className="relative">
                  <Hash className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <Input 
                    id="wordcount" 
                    type="number"
                    className="bg-slate-50/50 pl-8 h-8 text-sm"
                    value={targetWordCount}
                    onChange={(e) => setTargetWordCount(e.target.value)}
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
              <Button 
                onClick={() => handleGenerate('article')} 
                disabled={isGenerating} 
                className="w-full text-xs h-9 bg-primary"
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

            <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 space-y-3">
              <div className="flex items-center gap-2 text-accent font-bold text-sm">
                <BarChart4 className="h-4 w-4" />
                SEO Intelligence
              </div>
              <Button 
                onClick={() => handleAnalyze()} 
                disabled={isAnalyzing || content.length < 50} 
                variant="outline"
                className="w-full text-xs h-9 border-accent text-accent"
              >
                {isAnalyzing ? "Analyzing..." : "Update Intelligence"}
              </Button>
            </div>
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC] overflow-hidden text-slate-900">
      {/* Responsive Header */}
      <header className="h-14 border-b bg-white flex items-center justify-between px-4 lg:px-6 shrink-0 z-20">
        <div className="flex items-center gap-3 lg:gap-6">
          <div className="flex lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[300px]">
                <SheetTitle className="sr-only">Forge Parameters</SheetTitle>
                <SheetDescription className="sr-only">Configure your SEO content parameters and AI tools.</SheetDescription>
                <LeftPanelContent />
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-primary rounded-md p-1">
              <Hammer className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold tracking-tight text-primary hidden sm:inline">RankForge AI</span>
          </div>
          
          <div className="h-4 w-px bg-slate-200 hidden lg:block"></div>
          
          <div className="flex flex-col">
            <Input 
              placeholder="Article Title..." 
              className="border-none p-0 h-auto text-sm font-semibold focus-visible:ring-0 bg-transparent w-[120px] sm:w-[200px] lg:w-[300px]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="flex items-center gap-2 text-[9px] lg:text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              <span className="hidden sm:inline">{isAnalyzing ? 'Analyzing...' : 'Intelligence Active'}</span>
              <span className="hidden sm:inline">&bull;</span>
              <span>{metrics.wordCount} words</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <div className="lg:hidden flex items-center gap-1">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
                  <BarChart4 className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0 w-[320px] sm:w-[380px]">
                <SheetTitle className="sr-only">SEO Intelligence</SheetTitle>
                <SheetDescription className="sr-only">View SEO metrics and G.E.O optimization suggestions.</SheetDescription>
                <SeoPanel 
                  metrics={metrics} 
                  suggestions={suggestions} 
                  isLoading={isAnalyzing} 
                  content={content}
                />
              </SheetContent>
            </Sheet>
          </div>

          <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block"></div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleCopy}
            className="text-primary hover:bg-primary/5 h-8 px-2 sm:px-3 text-xs"
          >
            <Copy className="h-3.5 w-3.5 sm:mr-2" />
            <span className="hidden sm:inline">Copy</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearEditor} 
            className="text-slate-400 hover:text-destructive h-8 px-2 sm:px-3 text-xs"
          >
            <Eraser className="h-3.5 w-3.5" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Desktop Panel */}
        <aside className="hidden lg:flex w-[340px] border-r bg-white flex-col shrink-0">
          <LeftPanelContent />
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 bg-[#F1F5F9] relative flex flex-col p-3 sm:p-4 lg:p-6 overflow-hidden">
          <div className="flex-1 max-w-5xl mx-auto w-full bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col relative">
            <div className="h-10 border-b bg-slate-50/50 flex items-center px-4 justify-between shrink-0">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="hidden sm:flex gap-1">
                   <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                   <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                   <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                </div>
                <Badge variant="secondary" className="text-[9px] bg-slate-200 text-slate-600 border-none font-bold uppercase">
                  {isPreview ? 'Preview' : 'Editor'}
                </Badge>
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                <button 
                  onClick={() => setIsPreview(false)}
                  className={cn(
                    "flex items-center gap-1 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all",
                    !isPreview ? "bg-white text-primary shadow-sm" : "text-slate-400"
                  )}
                >
                  <PenLine className="h-3 w-3" /> <span className="hidden xs:inline">Edit</span>
                </button>
                <button 
                  onClick={() => setIsPreview(true)}
                  className={cn(
                    "flex items-center gap-1 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all",
                    isPreview ? "bg-white text-primary shadow-sm" : "text-slate-400"
                  )}
                >
                  <Eye className="h-3 w-3" /> <span className="hidden xs:inline">View</span>
                </button>
              </div>
            </div>

            <div className="flex-1 p-4 sm:p-8 lg:p-12 overflow-y-auto custom-scrollbar bg-white">
              {content.length === 0 && !isGenerating && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 lg:space-y-6">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-200">
                    <FileEdit className="h-6 w-6 lg:h-8 lg:w-8 text-slate-300" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-lg lg:text-xl font-bold text-slate-800">Start Your Forge</h2>
                    <p className="text-xs lg:text-sm text-slate-400 max-w-[200px] mx-auto">Configure your parameters in the sidebar to begin.</p>
                  </div>
                </div>
              )}

              {isGenerating && (
                <div className="h-full flex flex-col items-center justify-center space-y-4 lg:space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 animate-ping h-full w-full rounded-full bg-primary/20"></div>
                    <div className="relative bg-white p-4 lg:p-5 rounded-3xl border shadow-lg">
                      <Sparkles className="h-8 w-8 lg:h-10 lg:w-10 text-primary animate-pulse" />
                    </div>
                  </div>
                  <h2 className="text-md lg:text-lg font-bold">Forging Content...</h2>
                </div>
              )}

              {!isGenerating && content.length > 0 && (
                isPreview ? (
                  <div className="prose prose-slate max-w-none prose-headings:font-headline prose-h1:text-2xl lg:prose-h1:text-4xl prose-p:text-base lg:prose-p:text-lg">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                  </div>
                ) : (
                  <Textarea 
                    className="w-full border-none resize-none p-0 text-base lg:text-lg leading-relaxed focus-visible:ring-0 min-h-full font-body placeholder:text-slate-200"
                    placeholder="Your article content goes here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                )
              )}
            </div>
          </div>
          
          <div className="h-8 lg:h-10 flex items-center justify-between px-2 pt-2 shrink-0">
             <div className="flex gap-4 lg:gap-6 text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
               <span className="flex items-center gap-1"><FileText className="h-3 w-3 text-primary" /> {metrics.wordCount}</span>
               <span className="flex items-center gap-1"><Search className="h-3 w-3 text-accent" /> {metrics.keywordDensity}%</span>
             </div>
             <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                Live Analysis
             </div>
          </div>
        </main>

        {/* Right Desktop Panel */}
        <aside className="hidden lg:flex w-[340px] border-l bg-white flex-col shrink-0">
          <SeoPanel 
            metrics={metrics} 
            suggestions={suggestions} 
            isLoading={isAnalyzing} 
            content={content}
          />
        </aside>
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        @media (min-width: 1024px) {
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        }
      `}</style>
    </div>
  );
}
