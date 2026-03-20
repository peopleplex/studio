'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { 
  Sparkles, 
  FileText, 
  Search,
  Hammer,
  Eraser,
  Copy,
  BarChart4,
  Zap,
  Settings2,
  ChevronRight,
  Layout,
  FileDown
} from 'lucide-react';
import { generateSeoDraftArticle } from '@/ai/flows/generate-seo-draft-article-flow';
import { getSeoOptimizationSuggestions, type GetSeoOptimizationSuggestionsOutput } from '@/ai/flows/get-seo-optimization-suggestions';
import { checkPlagiarism, type CheckPlagiarismOutput } from '@/ai/flows/check-plagiarism-flow';
import { calculateSeoMetrics, type SeoMetrics } from '@/lib/seo-utils';
import { SeoPanel } from '@/components/SeoPanel';
import { ExportDialog } from '@/components/ExportDialog';

export default function RankForgeEditor() {
  // Article State
  const [topic, setTopic] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [audienceInsights, setAudienceInsights] = useState('');
  const [uniqueInsights, setUniqueInsights] = useState('');
  const [coreObjective, setCoreObjective] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('Professional');
  const [geoOptimization, setGeoOptimization] = useState('SearchGPT, Google SGE');
  const [targetWordCount, setTargetWordCount] = useState('1000');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  
  // App State
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCheckingPlagiarism, setIsCheckingPlagiarism] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [metrics, setMetrics] = useState<SeoMetrics>({
    score: 0,
    wordCount: 0,
    keywordDensity: 0,
    headingCount: 0,
    readability: 'Poor',
  });
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Normalized suggestions state
  const [suggestions, setSuggestions] = useState<GetSeoOptimizationSuggestionsOutput | null>(null);
  const [plagiarismReport, setPlagiarismReport] = useState<CheckPlagiarismOutput | null>(null);
  const { toast } = useToast();

  const keywordList = useMemo(() => keywords.split(',').map(k => k.trim()).filter(k => k.length > 0), [keywords]);

  // Live SEO Metrics
  useEffect(() => {
    const calculated = calculateSeoMetrics(content, keywordList);
    setMetrics(calculated);
  }, [content, keywordList]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content, isPreview]);

  const handleAnalyze = async () => {
    if (content.length < 50) {
      toast({
        variant: 'destructive',
        title: 'Content Too Short',
        description: 'Please write or generate at least 50 words to analyze SEO quality.',
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await getSeoOptimizationSuggestions({
        articleContent: content,
        targetKeywords: keywordList,
        geoOptimization: geoOptimization || undefined,
      });
      
      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Analysis Error',
          description: result.error,
        });
      } else if (result.data) {
        setSuggestions(result.data);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Analysis Error',
        description: error.message || 'Failed to analyze content.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCheckPlagiarism = async () => {
    if (content.length < 50) {
      toast({
        variant: 'destructive',
        title: 'Content Too Short',
        description: 'Please write or generate at least 50 words to check for plagiarism.',
      });
      return;
    }

    setIsCheckingPlagiarism(true);
    try {
      const result = await checkPlagiarism({
        articleContent: content,
      });

      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Originality Check Error',
          description: result.error,
        });
      } else if (result.data) {
        setPlagiarismReport(result.data);
        toast({
          title: 'Plagiarism Check Complete',
          description: `Originality risk: ${result.data.riskLevel}`,
        });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Check Failed',
        description: error.message || 'Failed to analyze originality.',
      });
    } finally {
      setIsCheckingPlagiarism(false);
    }
  };

  const handleGenerate = async (format: 'article' | 'outline') => {
    if (!topic || !keywords) {
      toast({
        variant: 'destructive',
        title: 'Input Required',
        description: 'Please provide a topic and at least one keyword.',
      });
      return;
    }

    setIsGenerating(true);
    setSuggestions(null); 
    setPlagiarismReport(null);
    
    try {
      const result = await generateSeoDraftArticle({
        topic,
        companyName,
        companyDescription,
        audienceInsights,
        uniqueInsights,
        coreObjective,
        keywords: keywordList,
        tone,
        outputFormat: format,
        targetWordCount: parseInt(targetWordCount) || undefined,
        geoOptimization: geoOptimization,
      });

      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Forge Error',
          description: result.error,
        });
      } else if (result.data) {
        const forgeData = result.data;
        setContent(forgeData.content);
        
        const titleMatch = forgeData.content.match(/^# (.*)/);
        if (titleMatch) setTitle(titleMatch[1]);
        else setTitle(topic);

        if (forgeData.seoAnalysis) {
          setSuggestions({
            overallAssessment: forgeData.seoAnalysis.overallAssessment,
            suggestions: {
              eEAT: forgeData.seoAnalysis.suggestions.eEAT,
              gEO: forgeData.seoAnalysis.suggestions.gEO,
              readability: forgeData.seoAnalysis.suggestions.readability,
              keywordDensity: forgeData.seoAnalysis.suggestions.keywordDensity,
              internalLinking: forgeData.seoAnalysis.suggestions.links,
              externalLinking: [],
              contentFreshness: [],
              callToAction: [],
            }
          });
        }
        
        toast({
          title: 'Forge Complete',
          description: `Content generated. Check intelligence modules for next steps.`,
        });
      }

    } catch (error: any) {
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
      setPlagiarismReport(null);
    }
  };

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    toast({
      title: 'Copied!',
      description: 'Content copied to clipboard.',
    });
  };

  const ParameterSidebar = () => (
    <Tabs defaultValue="parameters" className="w-full flex flex-col h-full overflow-hidden">
      <TabsList className="grid w-full grid-cols-2 rounded-none bg-slate-50 border-b shrink-0">
        <TabsTrigger value="parameters">Parameters</TabsTrigger>
        <TabsTrigger value="ai">AI Tools</TabsTrigger>
      </TabsList>

      <TabsContent value="parameters" className="flex-1 overflow-y-auto m-0 p-4 scrollbar-thin">
        <div className="space-y-6 pb-20 lg:pb-8">
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Targeting</h3>
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input id="topic" placeholder="e.g. Benefits of SEO" value={topic} onChange={(e) => setTopic(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords (comma separated)</Label>
              <Textarea id="keywords" placeholder="seo, ranking, content marketing" value={keywords} onChange={(e) => setKeywords(e.target.value)} />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Brand Context</h3>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input id="companyName" placeholder="My Organization" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyOverview">Organization Overview</Label>
              <Textarea id="companyOverview" placeholder="Describe your brand..." value={companyDescription} onChange={(e) => setCompanyDescription(e.target.value)} />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Configuration</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tone</Label>
                <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full rounded-md border border-input px-3 py-2 text-sm bg-white">
                  <option>Professional</option>
                  <option>Conversational</option>
                  <option>Technical</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Word Count</Label>
                <Input type="number" value={targetWordCount} onChange={(e) => setTargetWordCount(e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="ai" className="flex-1 overflow-y-auto m-0 p-4 space-y-4 scrollbar-thin">
        <div className="space-y-4 pb-20 lg:pb-8">
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 space-y-3">
            <p className="text-xs font-medium text-primary flex items-center gap-2">
              <Zap className="h-3 w-3" /> Generator
            </p>
            <Button onClick={() => handleGenerate('article')} disabled={isGenerating} className="w-full">Forge Article</Button>
            <Button variant="outline" onClick={() => handleGenerate('outline')} disabled={isGenerating} className="w-full">Forge Outline</Button>
          </div>

          <div className="p-4 rounded-lg border bg-white space-y-3">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              <BarChart4 className="h-3 w-3" /> Analysis
            </p>
            <Button onClick={handleAnalyze} disabled={isAnalyzing || content.length < 50} variant="outline" className="w-full">Update SEO Intel</Button>
            <Button onClick={handleCheckPlagiarism} disabled={isCheckingPlagiarism || content.length < 50} variant="outline" className="w-full">Check Originality</Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      <header className="h-16 border-b bg-white flex items-center justify-between px-4 md:px-6 shrink-0 z-50 sticky top-0 shadow-sm">
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary rounded-md p-1.5 shrink-0">
              <Hammer className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-primary hidden sm:inline-block">RankForge AI</span>
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
            <Link href="/" className="text-primary border-b-2 border-primary pb-1">Editor</Link>
            <Link href="/docs" className="text-muted-foreground hover:text-primary transition-colors">Methodology</Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="lg:hidden flex items-center gap-1">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings2 className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-80">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle className="text-sm font-bold uppercase tracking-widest">Setup & Tools</SheetTitle>
                </SheetHeader>
                <div className="h-[calc(100vh-64px)] overflow-hidden">
                   <ParameterSidebar />
                </div>
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <BarChart4 className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0 w-80 md:w-96">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle className="text-sm font-bold uppercase tracking-widest">SEO Insights</SheetTitle>
                </SheetHeader>
                <div className="h-[calc(100vh-64px)] overflow-hidden">
                  <SeoPanel 
                    metrics={metrics} 
                    suggestions={suggestions} 
                    plagiarismReport={plagiarismReport}
                    isLoading={isAnalyzing || isCheckingPlagiarism} 
                    content={content}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Separator orientation="vertical" className="h-4 mx-1 lg:hidden" />

          <Input 
            placeholder="Draft Title..." 
            className="border-none h-auto py-1 text-sm font-medium focus-visible:ring-0 bg-transparent w-[120px] sm:w-[200px]"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          
          <Separator orientation="vertical" className="h-4 mx-1 hidden sm:block" />
          
          <div className="hidden sm:flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={handleCopy} title="Copy to clipboard">
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsExportOpen(true)} title="Export content">
              <FileDown className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={clearEditor} className="text-destructive" title="Clear editor">
              <Eraser className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden lg:flex w-80 border-r bg-white flex-col shrink-0">
          <ParameterSidebar />
        </aside>

        <main className="flex-1 flex flex-col bg-white overflow-hidden">
          <div className="h-12 border-b flex items-center justify-between px-6 shrink-0 bg-white z-10 shadow-sm">
             <div className="flex items-center gap-4">
               <button 
                 onClick={() => setIsPreview(false)} 
                 className={cn(
                   "text-sm font-bold h-12 border-b-2 transition-all uppercase tracking-widest flex items-center", 
                   !isPreview ? "text-primary border-primary" : "text-muted-foreground border-transparent hover:text-primary/70"
                 )}
               >
                 Draft
               </button>
               <button 
                 onClick={() => setIsPreview(true)} 
                 className={cn(
                   "text-sm font-bold h-12 border-b-2 transition-all uppercase tracking-widest flex items-center", 
                   isPreview ? "text-primary border-primary" : "text-muted-foreground border-transparent hover:text-primary/70"
                 )}
               >
                 Preview
               </button>
             </div>
             <div className="flex items-center gap-4 text-[10px] md:text-xs text-muted-foreground font-black uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><FileText className="h-3 w-3 text-slate-300" /> {metrics.wordCount} words</span>
                <span className="flex items-center gap-1.5"><Search className="h-3 w-3 text-slate-300" /> {metrics.keywordDensity}% density</span>
             </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-6 md:p-12 max-w-3xl mx-auto min-h-full">
              {isGenerating ? (
                <div className="h-[400px] flex flex-col items-center justify-center space-y-6">
                  <div className="relative">
                    <Sparkles className="h-12 w-12 text-primary animate-pulse" />
                    <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-ping" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary animate-pulse">Forging High-Value Assets</p>
                    <p className="text-xs text-muted-foreground">Synthesizing E.E.A.T principles...</p>
                  </div>
                </div>
              ) : isPreview ? (
                <div className="prose prose-slate max-w-none prose-headings:font-black prose-p:leading-relaxed prose-h1:text-4xl">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                </div>
              ) : (
                <Textarea 
                  ref={textareaRef}
                  className="w-full min-h-[400px] border-none resize-none p-0 text-lg leading-relaxed focus-visible:ring-0 bg-transparent placeholder:text-slate-200 overflow-hidden"
                  placeholder="Start engineering your content or use the forge sidebar to generate a draft..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              )}
              {/* Add extra padding at bottom to ensure no cutoff */}
              <div className="h-24" />
            </div>
          </ScrollArea>
        </main>

        <aside className="hidden xl:flex w-96 border-l bg-white flex-col shrink-0">
          <SeoPanel 
            metrics={metrics} 
            suggestions={suggestions} 
            plagiarismReport={plagiarismReport}
            isLoading={isAnalyzing || isCheckingPlagiarism} 
            content={content}
          />
        </aside>
      </div>

      <ExportDialog 
        open={isExportOpen} 
        onOpenChange={setIsExportOpen} 
        content={content} 
        title={title || topic} 
      />
    </div>
  );
}