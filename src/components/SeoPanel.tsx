import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  CheckCircle2, 
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
  ArrowRight
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
    if (score >= 50) return 'text-blue-500';
    return 'text-rose-500';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 50) return 'bg-primary';
    return 'bg-rose-500';
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-emerald-600 bg-emerald-50';
      case 'Medium': return 'text-amber-600 bg-amber-50';
      case 'High': return 'text-rose-600 bg-rose-50 border-rose-100';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b bg-slate-50/50">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Forge Intelligence</h2>
        
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Visibility Score</span>
            <Badge variant="outline" className={`text-[10px] border-none font-bold ${getScoreColor(metrics.score)} bg-opacity-10`}>
              {metrics.score >= 80 ? 'Highly Visible' : metrics.score >= 50 ? 'Developing' : 'Low Visibility'}
            </Badge>
          </div>
          
          <div className="flex items-end gap-3 justify-center py-2">
            <span className={`text-5xl font-black tracking-tighter ${getScoreColor(metrics.score)}`}>
              {metrics.score}
            </span>
            <span className="text-slate-300 font-bold mb-1">/ 100</span>
          </div>

          <div className="space-y-2">
            <Progress value={metrics.score} className={`h-1.5 ${getProgressColor(metrics.score)}`} />
            <div className="flex justify-between text-[9px] font-bold text-slate-400">
              <span>TRADITIONAL</span>
              <span>G.E.O READY</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="px-5 py-4 flex items-center justify-between">
           <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Intelligence Modules</h3>
           {isLoading && <div className="animate-spin h-3 w-3 border-2 border-primary border-t-transparent rounded-full"></div>}
        </div>
        
        <ScrollArea className="flex-1">
          <div className="px-5 pb-8 space-y-6">
            <div className="grid grid-cols-2 gap-2">
              <MetricBox label="Word Count" value={metrics.wordCount} icon={<Type className="h-3 w-3" />} />
              <MetricBox label="AI Citability" value={`${metrics.keywordDensity}%`} icon={<Search className="h-3 w-3" />} />
              <MetricBox label="Logic Flow" value={metrics.headingCount} icon={<BarChart3 className="h-3 w-3" />} />
              <MetricBox label="Reading Grade" value={metrics.readability} icon={<TrendingUp className="h-3 w-3" />} />
            </div>

            {plagiarismReport && (
              <div className={cn(
                "space-y-3 pt-4 border-t border-slate-100 p-3 rounded-xl transition-all",
                plagiarismReport.riskLevel === 'High' && "bg-rose-50/50 border border-rose-100"
              )}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className={cn("h-3.5 w-3.5", plagiarismReport.riskLevel === 'High' ? "text-rose-600" : "text-slate-900")} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Originality Report</span>
                  </div>
                  <Badge className={cn("text-[9px] border", getRiskColor(plagiarismReport.riskLevel))}>
                    {plagiarismReport.riskLevel} Risk
                  </Badge>
                </div>
                <div className="p-3 rounded-lg bg-white/50 border border-slate-100 text-[11px] leading-relaxed text-slate-600 shadow-sm">
                  {plagiarismReport.analysis}
                </div>
                {plagiarismReport.findings.length > 0 && (
                  <div className="space-y-2">
                    {plagiarismReport.findings.map((finding, idx) => (
                      <div key={idx} className="p-3 rounded-lg border border-amber-100 bg-white/80 space-y-2 shadow-sm">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-3 w-3 mt-0.5 text-amber-500 shrink-0" />
                          <p className="text-[10px] italic font-medium text-slate-700">"{finding.segment}"</p>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-normal">{finding.reason}</p>
                        <div className="flex items-start gap-2 pt-2 border-t border-amber-50/50">
                          <HelpCircle className="h-3 w-3 mt-0.5 text-emerald-500 shrink-0" />
                          <p className="text-[10px] font-bold text-emerald-700">{finding.suggestion}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {suggestions ? (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-3.5 w-3.5 text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">AI Forge Insight</span>
                  </div>
                  <p className="text-xs leading-relaxed font-medium">
                    {suggestions.overallAssessment}
                  </p>
                </div>

                <Accordion type="multiple" className="w-full">
                  <SuggestionGroup 
                    title="G.E.O Strategy (AI Search)" 
                    items={suggestions.suggestions.gEO} 
                    icon={<BrainCircuit className="h-3.5 w-3.5 text-primary" />} 
                    value="geo"
                  />
                  <SuggestionGroup 
                    title="E.E.A.T Credibility" 
                    items={suggestions.suggestions.eEAT} 
                    icon={<Sparkles className="h-3.5 w-3.5 text-accent" />} 
                    value="eeat"
                  />
                  <SuggestionGroup 
                    title="Semantic Keywords" 
                    items={suggestions.suggestions.keywordDensity} 
                    icon={<Search className="h-3.5 w-3.5 text-blue-500" />} 
                    value="keywords"
                  />
                  <SuggestionGroup 
                    title="Authority Links" 
                    items={[...suggestions.suggestions.internalLinking, ...suggestions.suggestions.externalLinking]} 
                    icon={<LinkIcon className="h-3.5 w-3.5 text-slate-400" />} 
                    value="links"
                  />
                </Accordion>
              </div>
            ) : !isLoading && content.length > 50 ? (
               <div className="py-12 text-center space-y-3 opacity-50">
                  <BarChart3 className="h-8 w-8 mx-auto text-slate-200" />
                  <p className="text-xs font-medium text-slate-400">Analyzing G.E.O metrics...</p>
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
    <div className="p-3 rounded-xl border border-slate-100 bg-white shadow-sm hover:border-primary/20 transition-colors">
      <div className="flex items-center gap-1.5 text-slate-400 mb-1">
        {icon}
        <span className="text-[9px] uppercase font-bold tracking-tighter">{label}</span>
      </div>
      <div className="text-xs font-black text-slate-700">{value}</div>
    </div>
  );
}

function SuggestionGroup({ title, items, icon, value }: { title: string; items: string[]; icon: React.ReactNode; value: string }) {
  if (!items || items.length === 0) return null;
  return (
    <AccordionItem value={value} className="border-b-0 mb-3 overflow-hidden">
      <AccordionTrigger className="hover:no-underline py-2 text-[11px] font-bold bg-slate-50/80 px-4 rounded-xl transition-all hover:bg-slate-100">
        <div className="flex items-center gap-2">
          {icon}
          {title}
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-3 px-2">
        <ul className="space-y-3">
          {items.map((item, idx) => (
            <li key={idx} className="flex gap-2.5 text-[11px] text-slate-600 leading-normal">
              <Sparkles className="h-3 w-3 mt-0.5 text-primary shrink-0 opacity-50" />
              {item}
            </li>
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  );
}
