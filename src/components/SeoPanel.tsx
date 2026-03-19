import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle2, AlertCircle, Info, Sparkles, MapPin, Search, Type, Link as LinkIcon, RefreshCw, Zap } from 'lucide-react';
import type { SeoMetrics } from '@/lib/seo-utils';
import type { GetSeoOptimizationSuggestionsOutput } from '@/ai/flows/get-seo-optimization-suggestions';

interface SeoPanelProps {
  metrics: SeoMetrics;
  suggestions: GetSeoOptimizationSuggestionsOutput | null;
  isLoading: boolean;
}

export function SeoPanel({ metrics, suggestions, isLoading }: SeoPanelProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-blue-500';
    return 'text-destructive';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-accent';
    if (score >= 50) return 'bg-primary';
    return 'bg-destructive';
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            SEO Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-2">
            <div className={`text-4xl font-bold ${getScoreColor(metrics.score)}`}>
              {metrics.score}
            </div>
            <Progress value={metrics.score} className={`h-2 w-full ${getProgressColor(metrics.score)}`} />
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Target a score of 80+ for better rankings.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="flex-1 border-none shadow-sm bg-white/50 backdrop-blur-sm overflow-hidden flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center justify-between">
            Optimization Tools
            {isLoading && <Badge variant="secondary" className="animate-pulse">Analyzing...</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full px-6 pb-6">
            <div className="space-y-6">
              <section>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Live Metrics</h4>
                <div className="grid grid-cols-2 gap-3">
                  <MetricCard label="Words" value={metrics.wordCount} icon={<Type className="h-3 w-3" />} />
                  <MetricCard label="Density" value={`${metrics.keywordDensity}%`} icon={<Search className="h-3 w-3" />} />
                  <MetricCard label="Headings" value={metrics.headingCount} icon={<Info className="h-3 w-3" />} />
                  <MetricCard label="Readability" value={metrics.readability} icon={<CheckCircle2 className="h-3 w-3" />} />
                </div>
              </section>

              {suggestions && (
                <section className="space-y-4">
                  <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                    <h4 className="text-xs font-bold text-blue-700 uppercase mb-2">AI Assessment</h4>
                    <p className="text-sm text-blue-800 leading-relaxed">
                      {suggestions.overallAssessment}
                    </p>
                  </div>

                  <Accordion type="multiple" className="w-full">
                    <SuggestionGroup 
                      title="E.E.A.T Strategy" 
                      items={suggestions.suggestions.eEAT} 
                      icon={<Sparkles className="h-4 w-4 text-primary" />} 
                      value="eeat"
                    />
                    <SuggestionGroup 
                      title="G.E.O Localization" 
                      items={suggestions.suggestions.gEO} 
                      icon={<MapPin className="h-4 w-4 text-accent" />} 
                      value="geo"
                    />
                    <SuggestionGroup 
                      title="Keyword Strategy" 
                      items={suggestions.suggestions.keywordDensity} 
                      icon={<Search className="h-4 w-4 text-blue-500" />} 
                      value="keywords"
                    />
                    <SuggestionGroup 
                      title="Linking & Structure" 
                      items={[...suggestions.suggestions.internalLinking, ...suggestions.suggestions.externalLinking]} 
                      icon={<LinkIcon className="h-4 w-4 text-slate-500" />} 
                      value="links"
                    />
                  </Accordion>
                </section>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="p-2 rounded-md bg-white border border-border shadow-sm">
      <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
        {icon}
        <span className="text-[10px] uppercase font-bold tracking-tight">{label}</span>
      </div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}

function SuggestionGroup({ title, items, icon, value }: { title: string; items: string[]; icon: React.ReactNode; value: string }) {
  if (!items || items.length === 0) return null;
  return (
    <AccordionItem value={value} className="border-b-0 mb-2">
      <AccordionTrigger className="hover:no-underline py-2 text-sm font-medium bg-muted/30 px-3 rounded-md">
        <div className="flex items-center gap-2">
          {icon}
          {title}
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-2 px-1">
        <ul className="space-y-2">
          {items.map((item, idx) => (
            <li key={idx} className="flex gap-2 text-xs text-muted-foreground leading-normal">
              <CheckCircle2 className="h-3 w-3 mt-0.5 text-accent shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  );
}
