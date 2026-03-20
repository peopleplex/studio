'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Hammer, 
  ArrowLeft, 
  Sparkles, 
  Zap, 
  BarChart4, 
  ShieldCheck, 
  Search, 
  Target, 
  CheckCircle2,
  HelpCircle,
  FileSearch,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary rounded-md p-1.5">
              <Hammer className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-primary">RankForge AI</span>
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Editor</Link>
            <Link href="/docs" className="text-primary border-b-2 border-primary pb-1">Documentation</Link>
          </nav>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Editor
          </Link>
        </Button>
      </header>

      <main className="max-w-4xl mx-auto py-12 px-6 space-y-12">
        <section className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight">How RankForge AI Works</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            RankForge AI is a specialized content engineering platform designed for the era of Generative Search. 
            We combine traditional SEO pillars with modern AI-visibility principles.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Traditional SEO
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>We analyze keyword density, heading structure, and word count to satisfy legacy web crawlers like Googlebot.</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Optimal Density: 1.5% - 3.0%</li>
                <li>Clear H1-H3 Hierarchy</li>
                <li>Minimum Authority Length: 800+ words</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                G.E.O Framework
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>Generative Engine Optimization ensures your content is quoted and cited as a primary source by models like Gemini and SearchGPT.</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>High Summarizability</li>
                <li>Fact-dense statements</li>
                <li>Logical data extraction points</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Understanding Your Scores</h2>
          <div className="space-y-4">
            <div className="p-6 bg-white border rounded-lg flex gap-4">
              <div className="bg-emerald-100 p-3 rounded-full h-fit">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold">Visibility Score (80+)</h3>
                <p className="text-sm text-muted-foreground">This is your "Asset Quality" indicator. Scores above 80 mean your content has a high probability of both ranking on Page 1 and being cited in AI answers.</p>
              </div>
            </div>

            <div className="p-6 bg-white border rounded-lg flex gap-4">
              <div className="bg-blue-100 p-3 rounded-full h-fit">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold">Originality Risk</h3>
                <p className="text-sm text-muted-foreground">"High" risk means the content sounds too generic or matches common AI templates. "Low" risk content is unique, specific, and contains data points that AI can't easily replicate.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-primary/5 p-8 rounded-2xl border border-primary/10">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Pro Tip: E.E.A.T</h2>
          </div>
          <p className="text-sm leading-relaxed">
            The secret to a 100/100 score is the <strong>Unique Insights</strong> field. 
            By providing facts, personal expertise, or company-specific data that isn't in the public AI training set, 
            you create "Information Gain"—the single strongest signal for modern search engines.
          </p>
        </section>
      </main>
    </div>
  );
}