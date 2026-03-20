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
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
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
    setIsPreview(false);
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
        setIsPreview(true);
        
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
          description: `Content and Intelligence forged in one pass.`,
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
      description: 'Content has been copied to your clipboard.',
    });
  };

  const ParameterSection = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <div className="space-y-3 mb-6">
      <div className="flex items-center gap-2">
        <div className="h-1 w-1 rounded-full bg-primary" />
        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</Label>
      </div>
      {children}
    </div>
  );

  const ForgeParameters = () => (
    <div className="p-6 space-y-2 pb-24">
      <ParameterSection label="Core Identity">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="topic" className="text-[11px] font-bold text-slate-500">Main Subject</Label>
            <Input 
              id="topic" 
              placeholder="e.g. Modern Web Architecture" 
              className="bg-white border-slate-200 focus:border-primary shadow-sm h-10 text-sm"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="companyName" className="text-[11px] font-bold text-slate-500">Brand Name</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input 
                id="companyName" 
                placeholder="RankForge Inc." 
                className="bg-white border-slate-200 pl-10 h-10 text-sm"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="companyOverview" className="text-[11px] font-bold text-slate-500">Company Overview</Label>
            <Textarea 
              id="companyOverview" 
              placeholder="Describe what your brand does..." 
              className="bg-white border-slate-200 min-h-[60px] resize-none text-sm"
              value={companyDescription}
              onChange={(e) => setCompanyDescription(e.target.value)}
            />
          </div>
        </div>
      </ParameterSection>

      <ParameterSection label="Context & Data">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="uniqueInsights" className="text-[11px] font-bold text-slate-500">Unique Insights (E.E.A.T)</Label>
            <Textarea 
              id="uniqueInsights" 
              placeholder="Specific data points or expert facts..." 
              className="bg-white border-slate-200 min-h-[100px] resize-none text-sm leading-relaxed"
              value={uniqueInsights}
              onChange={(e) => setUniqueInsights(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="audience" className="text-[11px] font-bold text-slate-500">Target Audience</Label>
            <Input 
              id="audience" 
              placeholder="e.g. CMOs, Content Strategy Leads" 
              className="bg-white border-slate-200 h-10 text-sm"
              value={audienceInsights}
              onChange={(e) => setAudienceInsights(e.target.value)}
            />
          </div>
        </div>
      </ParameterSection>

      <ParameterSection label="Optimization">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="keywords" className="text-[11px] font-bold text-slate-500">Target Keywords</Label>
            <Textarea 
              id="keywords" 
              placeholder="seo content, geo strategy, ai writing..." 
              className="bg-white border-slate-200 min-h-[60px] resize-none text-sm"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold text-slate-500">Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger className="bg-white border-slate-200 h-10 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Conversational">Conversational</SelectItem>
                  <SelectItem value="Authoritative">Authoritative</SelectItem>
                  <SelectItem value="Technical">Technical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold text-slate-500">Word Count</Label>
              <Input 
                type="number"
                className="bg-white border-slate-200 h-10 text-sm"
                value={targetWordCount}
                onChange={(e) => setTargetWordCount(e.target.value)}
              />
            </div>
          </div>
        </div>
      </ParameterSection>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-[#F1F5F9] overflow-hidden text-slate-900 font-body">
      <header className="h-16 border-b bg-white flex items-center justify-between px-6 shrink-0 z-30 shadow-sm">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary rounded-lg p-2 transition-transform group-hover:scale-105 shadow-primary/20 shadow-lg">
              <Hammer className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-slate-900 leading-none">RankForge</span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">AI Studio</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-xs font-black uppercase tracking-widest text-primary border-b-2 border-primary pb-1">Editor</Link>
            <Link href="/docs" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">Methodology</Link>
          </nav>
          
          <div className="h-6 w-px bg-slate-200 hidden lg:block"></div>
          
          <div className="flex flex-col gap-1">
            <Input 
              placeholder="Draft Untitled Article..." 
              className="border-none p-0 h-auto text-sm font-bold focus-visible:ring-0 bg-transparent w-[300px] placeholder:text-slate-300"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center bg-slate-100 rounded-full px-4 py-1.5 gap-4">
             <div className="flex items-center gap-1.5">
                <FileText className="h-3 w-3 text-slate-400" />
                <span className="text-[10px] font-black text-slate-600 uppercase">{metrics.wordCount} WORDS</span>
             </div>
             <div className="h-3 w-px bg-slate-200" />
             <div className="flex items-center gap-1.5">
                <Search className="h-3 w-3 text-slate-400" />
                <span className="text-[10px] font-black text-slate-600 uppercase">{metrics.keywordDensity}% DENSITY</span>
             </div>
          </div>

          <Separator orientation="vertical" className="h-6 mx-2 hidden sm:block" />
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleCopy}
            title="Copy Content"
            className="text-slate-400 hover:text-primary hover:bg-primary/5 transition-all"
          >
            <Copy className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={clearEditor}
            title="Clear Editor"
            className="text-slate-400 hover:text-destructive hover:bg-destructive/5"
          >
            <Eraser className="h-5 w-5" />
          </Button>

          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="border-primary text-primary font-bold h-9">
                  <Menu className="h-4 w-4 mr-2" /> MENU
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[300px]">
                <SheetTitle className="sr-only">RankForge AI Menu</SheetTitle>
                <SheetDescription className="sr-only">Configuration and tools for SEO article forging.</SheetDescription>
                <Tabs defaultValue="parameters" className="h-full flex flex-col">
                   <TabsList className="grid grid-cols-2 rounded-none bg-slate-50 border-b h-14 shrink-0">
                      <TabsTrigger value="parameters" className="text-[10px] font-bold uppercase">Setup</TabsTrigger>
                      <TabsTrigger value="ai" className="text-[10px] font-bold uppercase">Tools</TabsTrigger>
                   </TabsList>
                   <div className="flex-1 overflow-hidden">
                     <ScrollArea className="h-full">
                       <TabsContent value="parameters" className="m-0">
                         <ForgeParameters />
                       </TabsContent>
                       <TabsContent value="ai" className="m-0 p-6 space-y-6">
                          <div className="space-y-3">
                             <Button onClick={() => handleGenerate('article')} disabled={isGenerating} className="w-full h-12 rounded-xl shadow-lg shadow-primary/20">FORGE FULL ARTICLE</Button>
                             <Button variant="outline" onClick={() => handleGenerate('outline')} disabled={isGenerating} className="w-full h-12 rounded-xl">FORGE OUTLINE</Button>
                          </div>
                       </TabsContent>
                     </ScrollArea>
                   </div>
                </Tabs>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Desktop */}
        <aside className="hidden lg:flex w-[380px] border-r bg-white flex-col shrink-0 z-20">
          <Tabs defaultValue="parameters" className="w-full flex flex-col h-full overflow-hidden">
            <div className="h-14 border-b bg-slate-50/50 flex items-center px-4 shrink-0">
              <TabsList className="grid w-full grid-cols-2 bg-slate-200/50 p-1 h-9 rounded-lg">
                <TabsTrigger value="parameters" className="text-[10px] font-bold uppercase tracking-widest">Forge Setup</TabsTrigger>
                <TabsTrigger value="ai" className="text-[10px] font-bold uppercase tracking-widest">AI Tools</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="parameters" className="flex-1 overflow-hidden m-0">
              <ScrollArea className="h-full">
                <ForgeParameters />
              </ScrollArea>
            </TabsContent>

            <TabsContent value="ai" className="flex-1 overflow-hidden m-0">
              <ScrollArea className="h-full">
                <div className="p-8 space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                       <Sparkles className="h-4 w-4 text-primary" />
                       <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Content Foundry</span>
                    </div>
                    <Card className="p-6 border-primary/20 bg-primary/[0.02] rounded-2xl space-y-4">
                       <p className="text-xs text-slate-500 leading-relaxed font-medium">Use your parameters to forge a high-ranking asset in one pass.</p>
                       <Button 
                        onClick={() => handleGenerate('article')} 
                        disabled={isGenerating} 
                        className="w-full h-12 rounded-xl text-xs font-bold shadow-lg shadow-primary/10 transition-all hover:scale-[1.02]"
                       >
                         {isGenerating ? "FORGING ASSET..." : "FORGE FULL ARTICLE"}
                       </Button>
                       <Button 
                        variant="outline" 
                        onClick={() => handleGenerate('outline')} 
                        disabled={isGenerating} 
                        className="w-full h-12 rounded-xl text-xs font-bold border-slate-200 hover:bg-slate-50"
                       >
                         FORGE DETAILED OUTLINE
                       </Button>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                       <BarChart4 className="h-4 w-4 text-accent" />
                       <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Post-Forge Analysis</span>
                    </div>
                    <Card className="p-6 border-slate-200 rounded-2xl space-y-4">
                       <p className="text-xs text-slate-500 leading-relaxed font-medium">Deep-audit your draft for G.E.O and E.E.A.T visibility signals.</p>
                       <Button 
                        onClick={() => handleAnalyze()} 
                        disabled={isAnalyzing || content.length < 50} 
                        variant="outline"
                        className="w-full h-12 rounded-xl text-xs font-bold border-accent text-accent hover:bg-accent/5"
                       >
                         {isAnalyzing ? "ANALYZING SIGNALS..." : "UPDATE SEO INTELLIGENCE"}
                       </Button>
                       <Button 
                        onClick={handleCheckPlagiarism} 
                        disabled={isCheckingPlagiarism || content.length < 50} 
                        variant="outline"
                        className="w-full h-12 rounded-xl text-xs font-bold"
                       >
                         {isCheckingPlagiarism ? "CHECKING GUARD..." : "VERIFY ORIGINALITY"}
                       </Button>
                    </Card>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </aside>

        {/* Editor Area */}
        <main className="flex-1 bg-slate-50 relative flex flex-col p-4 lg:p-10 overflow-hidden items-center">
          <div className="w-full max-w-4xl h-full flex flex-col group">
            {/* Editor Toolbar */}
            <div className="flex items-center justify-between px-6 py-3 bg-white border border-slate-200 border-b-0 rounded-t-2xl shrink-0 transition-colors group-focus-within:border-primary/20">
               <div className="flex items-center gap-3">
                 <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-slate-200 text-slate-400 px-3 py-1">
                   {isPreview ? 'Preview Mode' : 'Editor Active'}
                 </Badge>
                 {isAnalyzing && <div className="animate-pulse h-2 w-2 rounded-full bg-accent" />}
               </div>

               <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                 <button 
                   onClick={() => setIsPreview(false)}
                   className={cn(
                     "flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                     !isPreview ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
                   )}
                 >
                   <PenLine className="h-3.5 w-3.5" /> Edit
                 </button>
                 <button 
                   onClick={() => setIsPreview(true)}
                   className={cn(
                     "flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                     isPreview ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
                   )}
                 >
                   <Eye className="h-3.5 w-3.5" /> View
                 </button>
               </div>
            </div>

            {/* Editor Canvas */}
            <div className="flex-1 bg-white border border-slate-200 rounded-b-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
              <ScrollArea className="flex-1">
                <div className="p-8 lg:p-16 min-h-full flex flex-col">
                  {content.length === 0 && !isGenerating && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
                      <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center border border-slate-100 mb-6 transition-transform hover:rotate-6">
                        <Layout className="h-10 w-10 text-slate-200" />
                      </div>
                      <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Your Canvas is Ready</h2>
                      <p className="text-sm text-slate-400 max-w-xs mx-auto mt-2 leading-relaxed">
                        Set your parameters in the sidebar and forge your content using the AI Tools panel.
                      </p>
                    </div>
                  )}

                  {isGenerating && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-8 py-20">
                      <div className="relative">
                        <div className="absolute inset-0 animate-ping h-full w-full rounded-full bg-primary/10"></div>
                        <div className="relative bg-white p-8 rounded-[2.5rem] border-2 border-primary/5 shadow-2xl">
                          <Sparkles className="h-12 w-12 text-primary animate-pulse" />
                        </div>
                      </div>
                      <div className="text-center space-y-2">
                        <h2 className="text-lg font-black tracking-[0.2em] text-slate-800 uppercase">Forging Artifact</h2>
                        <p className="text-xs font-bold text-slate-400 animate-pulse uppercase tracking-widest">Applying E.E.A.T Logic...</p>
                      </div>
                    </div>
                  )}

                  {!isGenerating && content.length > 0 && (
                    isPreview ? (
                      <div className="prose prose-slate max-w-none prose-headings:font-headline prose-h1:text-4xl prose-h1:font-black prose-p:leading-loose prose-p:text-slate-600">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                      </div>
                    ) : (
                      <Textarea 
                        className="w-full border-none resize-none p-0 text-lg leading-relaxed focus-visible:ring-0 min-h-full font-body placeholder:text-slate-200 text-slate-700"
                        placeholder="Start engineering your content here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                      />
                    )
                  )}
                </div>
              </ScrollArea>
            </div>
            
            <div className="h-12 flex items-center justify-between px-2 shrink-0">
               <div className="flex gap-6">
                 <div className="flex items-center gap-2 group cursor-help">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-emerald-600 transition-colors">Intelligence Active</span>
                 </div>
                 <div className="flex items-center gap-2 group">
                    <Zap className="h-3.5 w-3.5 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Forged</span>
                 </div>
               </div>
               <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><FileText className="h-3 w-3" /> {metrics.wordCount} WORDS</span>
               </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar - Desktop */}
        <aside className="hidden xl:flex w-[420px] border-l bg-white flex-col shrink-0 z-20">
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