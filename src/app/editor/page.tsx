'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Save, Download, ChevronLeft, Send, Trash2, ListChecks, Type, FileText } from 'lucide-react';
import { generateSeoDraftArticle } from '@/ai/flows/generate-seo-draft-article-flow';
import { getSeoOptimizationSuggestions, type GetSeoOptimizationSuggestionsOutput } from '@/ai/flows/get-seo-optimization-suggestions';
import { calculateSeoMetrics, type SeoMetrics } from '@/lib/seo-utils';
import { SeoPanel } from '@/components/SeoPanel';
import { ExportDialog } from '@/components/ExportDialog';
import Link from 'next/link';

export default function EditorPage() {
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
      if (content.length > 200) {
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
    }, 2000);

    return () => clearTimeout(timer);
  }, [content, keywords, audience, location]);

  const handleGenerate = async (format: 'article' | 'outline') => {
    if (!topic || !keywords) {
      toast({
        variant: 'destructive',
        title: 'Missing information',
        description: 'Please provide a topic and at least one keyword.',
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
      // Try to extract title from markdown
      const titleMatch = result.content.match(/^# (.*)/);
      if (titleMatch) setTitle(titleMatch[1]);
      else setTitle(topic);
      
      toast({
        title: 'Generation Complete',
        description: `Successfully generated an SEO-optimized ${format}.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate content. Please try again.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Editor Header */}
      <header className="h-16 border-b bg-white flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="h-6 w-px bg-border hidden sm:block"></div>
          <div className="flex flex-col">
            <Input 
              placeholder="Untitled Article" 
              className="border-none p-0 h-auto text-lg font-bold focus-visible:ring-0 w-full min-w-[200px]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
              <span className="text-accent flex items-center gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse"></div>
                Live Editing
              </span>
              <span>&bull;</span>
              <span>Draft</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="hidden sm:flex gap-2" onClick={() => toast({ title: 'Saved', description: 'Your progress is stored in memory.' })}>
            <Save className="h-4 w-4" /> Save
          </Button>
          <Button size="sm" className="gap-2" onClick={() => setExportOpen(true)}>
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - AI Tools */}
        <aside className="w-[380px] border-r bg-white flex flex-col shrink-0 hidden lg:flex">
          <Tabs defaultValue="generate" className="w-full flex flex-col flex-1">
            <div className="px-6 py-4 border-b">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="generate">AI Content</TabsTrigger>
                <TabsTrigger value="parameters">Setup</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="generate" className="flex-1 overflow-hidden m-0">
              <ScrollArea className="h-full px-6 py-6">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Quick Forge</h3>
                    <div className="grid grid-cols-1 gap-3">
                      <Button 
                        onClick={() => handleGenerate('article')} 
                        disabled={isGenerating} 
                        className="w-full h-12 gap-2 bg-primary hover:bg-primary/90"
                      >
                        {isGenerating ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div> : <Sparkles className="h-4 w-4" />}
                        Generate Full Article
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => handleGenerate('outline')} 
                        disabled={isGenerating} 
                        className="w-full h-12 gap-2"
                      >
                        {isGenerating ? <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div> : <ListChecks className="h-4 w-4" />}
                        Generate Outline Only
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 space-y-3">
                    <div className="flex items-center gap-2 text-accent font-bold text-sm">
                      <ShieldCheck className="h-4 w-4" />
                      E.E.A.T Engine
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Our AI will prioritize expertise, authoritativeness, and trust by citing potential expert views and providing structured data insights.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">SEO Quick Checks</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 rounded-lg border text-sm bg-white">
                        <span className="flex items-center gap-2"><Target className="h-4 w-4 text-primary" /> Topic match</span>
                        <Badge variant="secondary" className="bg-accent/10 text-accent">Good</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg border text-sm bg-white">
                        <span className="flex items-center gap-2"><Search className="h-4 w-4 text-primary" /> Keywords</span>
                        <Badge variant="secondary" className={keywordList.length > 0 ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}>
                          {keywordList.length > 0 ? "Targeted" : "None"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="parameters" className="flex-1 overflow-hidden m-0">
              <ScrollArea className="h-full px-6 py-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="topic">Main Topic / H1</Label>
                    <Input 
                      id="topic" 
                      placeholder="e.g. Benefits of Sustainable Farming" 
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="keywords">Target Keywords (comma separated)</Label>
                    <Textarea 
                      id="keywords" 
                      placeholder="e.g. sustainable, organic, farming practices" 
                      className="min-h-[80px]"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="audience">Target Audience</Label>
                    <Input 
                      id="audience" 
                      placeholder="e.g. Eco-conscious home gardeners" 
                      value={audience}
                      onChange={(e) => setAudience(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Geographic Focus (G.E.O)</Label>
                    <Input 
                      id="location" 
                      placeholder="e.g. Seattle, Washington" 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </aside>

        {/* Center - Rich Text Editor */}
        <main className="flex-1 bg-white relative flex flex-col">
          <div className="flex-1 max-w-4xl mx-auto w-full flex flex-col pt-12 px-12">
            {content.length === 0 && !isGenerating && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-60">
                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center border-2 border-dashed border-slate-200">
                  <Edit3 className="h-10 w-10 text-slate-400" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Start Forging Your Content</h2>
                  <p className="max-w-xs mx-auto">Use the AI tools on the left to generate a draft or start typing here manually.</p>
                </div>
              </div>
            )}

            {isGenerating && (
              <div className="flex flex-col items-center justify-center h-full space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 animate-ping h-full w-full rounded-full bg-primary/20"></div>
                  <div className="relative bg-white p-4 rounded-full border shadow-xl">
                    <Sparkles className="h-12 w-12 text-primary animate-pulse" />
                  </div>
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold">Forging Your Content...</h2>
                  <p className="text-muted-foreground animate-pulse">Applying E.E.A.T and G.E.O principles</p>
                </div>
              </div>
            )}

            {!isGenerating && content.length > 0 && (
              <div className="flex-1 flex flex-col animate-in fade-in duration-700">
                <Textarea 
                  className="flex-1 border-none resize-none p-0 text-lg leading-relaxed focus-visible:ring-0 min-h-[60vh] scrollbar-hide"
                  placeholder="Write your story..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            )}
          </div>
          
          <div className="h-12 bg-white border-t px-6 flex items-center justify-between shrink-0">
             <div className="flex gap-4 text-xs font-medium text-muted-foreground">
               <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> {metrics.wordCount} words</span>
               <span className="flex items-center gap-1"><Type className="h-3 w-3" /> {metrics.headingCount} sections</span>
             </div>
             <div className="text-xs text-muted-foreground flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                Cloud Synced
             </div>
          </div>
        </main>

        {/* Right Sidebar - SEO Analysis */}
        <aside className="w-[340px] border-l bg-slate-50/50 flex flex-col shrink-0 hidden xl:flex">
          <SeoPanel 
            metrics={metrics} 
            suggestions={suggestions} 
            isLoading={isAnalyzing} 
          />
        </aside>
      </div>

      <ExportDialog 
        open={exportOpen} 
        onOpenChange={setExportOpen} 
        content={content} 
        title={title || topic} 
      />
    </div>
  );
}

function ShieldCheck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
