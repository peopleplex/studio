'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { 
  Sparkles, 
  FileText, 
  Search,
  Hammer,
  Eraser,
  Building2,
  Copy,
  Eye,
  PenLine,
  BarChart4,
  Menu,
  ShieldCheck,
  Zap,
  Layout,
  Info
} from 'lucide-react';
import { generateSeoDraftArticle } from '@/ai/flows/generate-seo-draft-article-flow';
import { getSeoOptimizationSuggestions, type GetSeoOptimizationSuggestionsOutput } from '@/ai/flows/get-seo-optimization-suggestions';
import { checkPlagiarism, type CheckPlagiarismOutput } from '@/ai/flows/check-plagiarism-flow';
import { calculateSeoMetrics, type SeoMetrics } from '@/lib/seo-utils';
import { SeoPanel } from '@/components/SeoPanel';

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
  const [metrics, setMetrics] = useState<SeoMetrics>({
    score: 0,
    wordCount: 0,
    keywordDensity: 0,
    headingCount: 0,
    readability: 'Poor',
  });
  
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

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC] overflow-hidden">
      <header className="h-16 border-b bg-white flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary rounded-md p-1.5 transition-transform group-hover:scale-105">
              <Hammer className="h-5 w-5 text-white" />
            </div>
            <span className="font-extrabold tracking-tight text-primary text-lg">RankForge AI</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-bold text-primary border-b-2 border-primary pb-1">Editor</Link>
            <Link href="/docs" className="text-sm font-bold text-slate-500 hover:text-primary transition-colors">Methodology</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Input 
            placeholder="Draft Title..." 
            className="border-none p-0 h-auto text-sm font-bold focus-visible:ring-0 bg-transparent w-[200px] text-right"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Separator orientation="vertical" className="h-4 mx-2" />
          <Button variant="ghost" size="icon" onClick={handleCopy} title="Copy Content">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={clearEditor} title="Clear Editor" className="text-rose-500 hover:text-rose-600 hover:bg-rose-50">
            <Eraser className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden lg:flex w-[400px] border-r bg-white flex-col shrink-0">
          <Tabs defaultValue="parameters" className="w-full flex flex-col h-full overflow-hidden">
            <TabsList className="grid w-full grid-cols-2 rounded-none bg-slate-50 border-b h-12">
              <TabsTrigger value="parameters" className="text-xs font-bold uppercase tracking-widest">Forge Setup</TabsTrigger>
              <TabsTrigger value="ai" className="text-xs font-bold uppercase tracking-widest">AI Foundry</TabsTrigger>
            </TabsList>

            <TabsContent value="parameters" className="flex-1 overflow-hidden m-0 p-6">
              <ScrollArea className="h-full">
                <div className="space-y-6 pb-6">
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Core Identity</h3>
                    <div className="space-y-2">
                      <Label htmlFor="topic">Topic</Label>
                      <Input id="topic" placeholder="e.g. Benefits of SEO" value={topic} onChange={(e) => setTopic(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input id="companyName" placeholder="Organization Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyOverview">Company Overview</Label>
                      <Textarea id="companyOverview" placeholder="Describe your brand or organization..." value={companyDescription} onChange={(e) => setCompanyDescription(e.target.value)} className="min-h-[80px]" />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Context & E.E.A.T</h3>
                    <div className="space-y-2">
                      <Label htmlFor="uniqueInsights">Unique Insights / Data</Label>
                      <Textarea id="uniqueInsights" placeholder="Any specific facts or expertise to include?" value={uniqueInsights} onChange={(e) => setUniqueInsights(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="audience">Target Audience</Label>
                      <Input id="audience" placeholder="e.g. Tech Entrepreneurs" value={audienceInsights} onChange={(e) => setAudienceInsights(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="objective">Core Objective</Label>
                      <Input id="objective" placeholder="What is the goal of this article?" value={coreObjective} onChange={(e) => setCoreObjective(e.target.value)} />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Optimization</h3>
                    <div className="space-y-2">
                      <Label htmlFor="keywords">Target Keywords (comma separated)</Label>
                      <Textarea id="keywords" placeholder="seo, ai content, geo" value={keywords} onChange={(e) => setKeywords(e.target.value)} />
                    </div>
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
              </ScrollArea>
            </TabsContent>

            <TabsContent value="ai" className="flex-1 overflow-hidden m-0 p-6 space-y-4">
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Foundry Actions</span>
                </div>
                <Button onClick={() => handleGenerate('article')} disabled={isGenerating} className="w-full">FORGE ARTICLE</Button>
                <Button variant="outline" onClick={() => handleGenerate('outline')} disabled={isGenerating} className="w-full">FORGE OUTLINE</Button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart4 className="h-4 w-4 text-slate-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Analytics</span>
                </div>
                <Button onClick={handleAnalyze} disabled={isAnalyzing || content.length < 50} variant="outline" className="w-full text-accent border-accent hover:bg-accent hover:text-white">UPDATE INTELLIGENCE</Button>
                <Button onClick={handleCheckPlagiarism} disabled={isCheckingPlagiarism || content.length < 50} variant="outline" className="w-full">CHECK ORIGINALITY</Button>
              </div>
            </TabsContent>
          </Tabs>
        </aside>

        <main className="flex-1 bg-slate-50 relative flex flex-col">
          <div className="h-12 border-b bg-white flex items-center justify-between px-6 shrink-0">
             <div className="flex items-center gap-4">
               <button onClick={() => setIsPreview(false)} className={cn("text-[10px] font-black uppercase tracking-widest pb-3 mt-3", !isPreview ? "text-primary border-b-2 border-primary" : "text-slate-400")}>Edit</button>
               <button onClick={() => setIsPreview(true)} className={cn("text-[10px] font-black uppercase tracking-widest pb-3 mt-3", isPreview ? "text-primary border-b-2 border-primary" : "text-slate-400")}>Preview</button>
             </div>
             <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><FileText className="h-3 w-3" /> {metrics.wordCount} WORDS</span>
                <span className="flex items-center gap-1.5"><Search className="h-3 w-3" /> {metrics.keywordDensity}% DENSITY</span>
             </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-8 lg:p-12 max-w-4xl mx-auto">
              {isGenerating ? (
                <div className="h-[400px] flex flex-col items-center justify-center space-y-4">
                  <Sparkles className="h-10 w-10 text-primary animate-pulse" />
                  <p className="text-sm font-bold text-slate-400 animate-pulse uppercase tracking-widest">Forging Content...</p>
                </div>
              ) : isPreview ? (
                <div className="prose prose-slate max-w-none prose-headings:font-headline prose-h1:text-3xl prose-h1:font-black">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                </div>
              ) : (
                <Textarea 
                  className="w-full min-h-[600px] border-none resize-none p-0 text-lg leading-relaxed focus-visible:ring-0 bg-transparent font-body"
                  placeholder="Start writing or forge from the foundry..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              )}
            </div>
          </ScrollArea>
        </main>

        <aside className="hidden xl:flex w-[400px] border-l bg-white flex-col shrink-0">
          <SeoPanel 
            metrics={metrics} 
            suggestions={suggestions} 
            plagiarismReport={plagiarismReport}
            isLoading={isAnalyzing || isCheckingPlagiarism} 
            content={content}
          />
        </aside>
      </div>
    </div>
  );
}
