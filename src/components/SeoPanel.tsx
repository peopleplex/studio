import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Sparkles, 
  MapPin, 
  Search, 
  Type, 
  Link as LinkIcon, 
  Zap, 
  BarChart3, 
  TrendingUp, 
  BrainCircuit, 
  ShieldCheck, 
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  Target,
  FileCheck,
  CheckCircle2
} from 'lucide-react';
import type { SeoMetrics } from '@/lib/seo-utils';
import type { GetSeoOptimizationSuggestionsOutput } from '@/ai/flows/get-seo-optimization-suggestions';
import type { CheckPlagiarismOutput } from '@/ai/flows/check-plagiarism-flow';
import { cn } from '@/lib/utils';

interface SeoPanelProps {
  metrics: SeoMetrics;
  suggestions: GetSeoOptimizationSuggestionsOutput | null;
  plagiarismReport?: CheckPlagiarismOutput | null;
  isLoading: boolean;
  content: string;
}

export function SeoPanel({ metrics, suggestions, plagiarismReport, isLoading, content }: SeoPanelProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 50) return 'text-primary';
    return 'text-rose-500';
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'High': return 'text-rose-600 bg-rose-50 border-rose-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Header Scoring Area */}
      <div className="p-6 border-b bg-slate-50/50 shrink-0">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Asset Visibility Engine</h2>
        
        <div className="relative bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Score</span>
            <Badge variant="outline" className={cn(
              "text-[9px] border-none font-black uppercase tracking-widest px-2 py-0.5",
              metrics.score >= 80 ? 'text-emerald-600 bg-emerald-50' : metrics.score >= 50 ? 'text-primary bg-primary/5' : 'text-rose-600 bg-rose-50'
            )}>
              {metrics.score >= 80 ? 'Elite' : metrics.score >= 50 ? 'Fair' : 'Low'}
            </Badge>
          </div>
          
          <div className="flex items-baseline gap-2 justify-center">
            <span className={`text-6xl font-black tracking-tighter tabular-nums ${getScoreColor(metrics.score)}`}>
              {metrics.score}
            </span>
            <span className="text-slate-300 font-bold text-sm">/ 100</span>
          </div>

          <div className="space-y-2">
            <Progress value={metrics.score} className="h-1.5 rounded-full bg-slate-100" />
            <div className="flex justify-between text-[9px] font-black text-slate-400 tracking-widest uppercase">
              <span>Traditional</span>
              <span>G.E.O Ready</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="px-6 py-4 flex items-center justify-between bg-white sticky top-0 z-10 shrink-0">
           <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Intelligence Modules</h3>
           {isLoading && (
             <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold text-primary animate-pulse uppercase tracking-widest">Auditing...</span>
                <div className="animate-spin h-3 w-3 border-2 border-primary border-t-transparent rounded-full"></div>
             </div>
           )}
        </div>
        
        <ScrollArea className="flex-1">
          <div className="px-6 pb-20 space-y-8">
            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 gap-2">
              <MetricBox label="Word Count" value={metrics.wordCount} icon={<Type className="h-3 w-3" />} />
              <MetricBox label="AI Citability" value={`${metrics.keywordDensity}%`} icon={<Search className="h-3 w-3" />} />
              <MetricBox label="Logic Flow" value={metrics.headingCount} icon={<BarChart3 className="h-3 w-3" />} />
              <MetricBox label="Reading Grade" value={metrics.readability} icon={<TrendingUp className="h-3 w-3" />} />
            </div>

            {/* Plagiarism/Originality Guard */}
            {plagiarismReport && (
              <div className={cn(
                "p-5 rounded-2xl border transition-all duration-300 shadow-sm",
                getRiskColor(plagiarismReport.riskLevel)
              )}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Originality Audit</span>
                  </div>
                  <Badge variant="outline" className="text-[8px] font-black uppercase bg-white border-inherit">
                    {plagiarismReport.riskLevel} Risk
                  </Badge>
                </div>
                <p className="text-[11px] leading-relaxed font-medium mb-4 text-inherit opacity-90">
                  {plagiarismReport.analysis}
                </p>
                {plagiarismReport.findings.length > 0 && (
                  <div className="space-y-2">
                    {plagiarismReport.findings.map((finding, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white/60 border border-inherit/20 space-y-2">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-3 w-3 mt-0.5 text-amber-500 shrink-0" />
                          <p className="text-[10px] italic font-medium text-slate-700">"{finding.segment}"</p>
                        </div>
                        <div className="pl-5 space-y-1">
                          <p className="text-[9px] font-bold text-slate-500">{finding.reason}</p>
                          <div className="flex items-center gap-1.5 pt-1.5 border-t border-slate-100">
                             <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                             <p className="text-[10px] font-black text-emerald-700 uppercase">{finding.suggestion}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SEO Recommendations */}
            {suggestions ? (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-3 w-3 text-primary" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Core Assessment</span>
                  </div>
                  <p className="text-[11px] leading-relaxed font-medium">
                    {suggestions.overallAssessment}
                  </p>
                </div>

                <div className="space-y-1">
                  <SuggestionGroup 
                    title="G.E.O Strategy" 
                    items={suggestions.suggestions.gEO} 
                    icon={<BrainCircuit className="h-4 w-4 text-primary" />} 
                    value="geo"
                  />
                  <SuggestionGroup 
                    title="E.E.A.T Credibility" 
                    items={suggestions.suggestions.eEAT} 
                    icon={<Sparkles className="h-4 w-4 text-accent" />} 
                    value="eeat"
                  />
                  <SuggestionGroup 
                    title="Semantic Keywords" 
                    items={suggestions.suggestions.keywordDensity} 
                    icon={<Search className="h-4 w-4 text-blue-500" />} 
                    value="keywords"
                  />
                  <SuggestionGroup 
                    title="Authority Links" 
                    items={[...suggestions.suggestions.internalLinking, ...suggestions.suggestions.externalLinking]} 
                    icon={<LinkIcon className="h-4 w-4 text-slate-400" />} 
                    value="links"
                  />
                </div>
              </div>
            ) : !isLoading && content.length > 50 ? (
               <div className="py-12 text-center space-y-3 opacity-30">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
                    <BarChart3 className="h-6 w-6 text-slate-300" />
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Ready for Audit</p>
               </div>
            ) : null}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

function MetricBox({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="p-3 rounded-xl border border-slate-100 bg-white shadow-sm hover:border-primary/20 transition-all group overflow-hidden relative">
      <div className="flex items-center gap-1.5 text-slate-400 mb-1">
        {icon}
        <span className="text-[8px] uppercase font-black tracking-widest">{label}</span>
      </div>
      <div className="text-xs font-black text-slate-800 tabular-nums">{value}</div>
    </div>
  );
}

function SuggestionGroup({ title, items, icon, value }: { title: string; items: string[]; icon: React.ReactNode; value: string }) {
  if (!items || items.length === 0) return null;
  return (
    <Accordion type="multiple" className="w-full">
      <AccordionItem value={value} className="border-b-0 mb-2 overflow-hidden">
        <AccordionTrigger className="hover:no-underline py-3 text-[10px] font-black bg-slate-50/50 px-4 rounded-xl transition-all hover:bg-slate-100/80 data-[state=open]:bg-white data-[state=open]:border data-[state=open]:border-slate-100">
          <div className="flex items-center gap-3">
            {icon}
            <span className="uppercase tracking-widest">{title}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-4 px-3">
          <ul className="space-y-3">
            {items.map((item, idx) => (
              <li key={idx} className="flex gap-2 text-[10px] text-slate-600 leading-relaxed font-medium">
                <Sparkles className="h-3 w-3 mt-0.5 text-primary shrink-0 opacity-40" />
                {item}
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}