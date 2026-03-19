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
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { 
  Sparkles, 
  ListChecks, 
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
  PenLine
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
            geoOptimization: geoOptimization || undefined,
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
  }, [content, keywords, geoOptimization]);

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
    setIsPreview(false); // Ensure editor view during generation
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
      setIsPreview(true); // Automatically switch to Preview mode after completion
      
      const titleMatch = result.content.match(/^# (.*)/);
      if (titleMatch) setTitle(titleMatch[1]);
      else setTitle(topic);
      
      toast({
        title: 'Content Forged',
        description: `Your ${format} is complete. Switched to Preview mode for readability.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Forge Error',
        description: 'Failed to generate content. Please check your connection.',
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

  const handleCopy = () => {
    if (!content) {
      toast({
        variant: 'destructive',
        title: 'Nothing to copy',
        description: 'The editor is empty.',
      });
      return;
    }
    navigator.clipboard.writeText(content);
    toast({
      title: 'Copied!',
      description: 'Content has been copied to your clipboard.',
    });
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
              <span className="flex items-center gap-1.5 text-accent">
                <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse"></div>
                Live Analysis
              </span>
              <span>&bull;</span>
              <span>{metrics.wordCount} words</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={clearEditor} className="text-slate-500 hover:text-destructive transition-colors">
            <Eraser className="h-4 w-4 mr-2" /> Clear
          </Button>
          <div className="h-4 w-px bg-slate-200 mx-2"></div>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200 font-semibold" 
            onClick={handleCopy}
          >
            <Copy className="h-4 w-4 mr-2" /> Copy Content
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Control Panel */}
        <aside className="w-[340px] border-r bg-white flex flex-col shrink-0">
          <Tabs defaultValue="parameters" className="w-full flex flex-col flex-1 overflow-hidden">
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
                      <p className="text-[9px] text-slate-400 italic">Target audience will be discovered by AI based on this topic.</p>
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
                        placeholder="Brief overview of what you do..." 
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
                      <p className="text-[10px] text-slate-400">Separate keywords with commas.</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="geo" className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                        G.E.O Focus 
                        <Info className="h-3 w-3 text-slate-400" />
                      </Label>
                      <div className="relative">
                        <BrainCircuit className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-primary" />
                        <Input 
                          id="geo" 
                          placeholder="SearchGPT, Google SGE, Perplexity..." 
                          className="bg-slate-50/50 pl-8 h-8 text-sm"
                          value={geoOptimization}
                          onChange={(e) => setGeoOptimization(e.target.value)}
                        />
                      </div>
                      <p className="text-[9px] text-slate-400 leading-tight">Optimizing for AI Generative Search Engines (SearchGPT/Google Overview).</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="wordcount" className="text-xs font-bold text-slate-500 uppercase">Number of Words</Label>
                      <div className="relative">
                        <Hash className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                        <Input 
                          id="wordcount" 
                          type="number"
                          placeholder="e.g. 1000" 
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
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Generate content optimized for AI visibility and traditional SEO rankings.
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
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 bg-[#F1F5F9] relative flex flex-col p-6 overflow-hidden">
          <div className="flex-1 max-w-5xl mx-auto w-full bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col relative">
            <div className="h-10 border-b bg-slate-50/50 flex items-center px-4 justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                   <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                   <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                   <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                </div>
                <div className="h-4 w-px bg-slate-200"></div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[9px] bg-slate-200 text-slate-600 border-none font-bold uppercase">
                    {isPreview ? 'Previewing' : 'Markdown'}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                <button 
                  onClick={() => setIsPreview(false)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all",
                    !isPreview ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <PenLine className="h-3 w-3" /> Edit
                </button>
                <button 
                  onClick={() => setIsPreview(true)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all",
                    isPreview ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <Eye className="h-3 w-3" /> Preview
                </button>
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
                    <p className="text-sm text-slate-400 max-w-[260px] mx-auto">Input your parameters to ignite the Content Forge.</p>
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
                  </div>
                </div>
              )}

              {!isGenerating && content.length > 0 && (
                isPreview ? (
                  <div className="prose prose-slate max-w-none prose-headings:font-headline prose-h1:text-4xl prose-h1:font-black prose-h1:tracking-tight prose-h1:text-slate-900 prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-4 prose-p:text-lg prose-p:leading-relaxed prose-p:text-slate-600 prose-strong:text-slate-900 prose-ul:list-disc prose-li:text-slate-600 prose-li:my-2">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                  </div>
                ) : (
                  <Textarea 
                    className="w-full border-none resize-none p-0 text-lg leading-relaxed focus-visible:ring-0 min-h-full font-body scrollbar-hide placeholder:text-slate-200"
                    placeholder="The story begins here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                )
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
                G.E.O Precision Mode Active
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
