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
  BrainCircuit, 
  Lightbulb,
  CheckCircle2,
  Info,
  BookOpen,
  Terminal,
  HelpCircle,
  FileSearch,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-body pb-20">
      {/* Navigation Header */}
      <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary rounded-md p-1.5 transition-transform group-hover:scale-105">
              <Hammer className="h-5 w-5 text-white" />
            </div>
            <span className="font-extrabold tracking-tight text-primary text-lg">RankForge AI</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <Link href="/" className="hover:text-primary transition-colors">Editor</Link>
            <Link href="/docs" className="text-primary">Methodology</Link>
          </nav>
        </div>
        <Button asChild variant="outline" size="sm" className="hidden sm:flex border-primary text-primary hover:bg-primary/5">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Editor
          </Link>
        </Button>
      </header>

      <main className="max-w-5xl mx-auto py-16 px-6">
        {/* Hero Section */}
        <section className="space-y-6 mb-20 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mx-auto sm:mx-0">
            <BookOpen className="h-3 w-3" /> Technical Documentation & Theory
          </div>
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter text-slate-900 leading-[1.1]">
            Content Engineering for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Generative Era</span>
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed max-w-3xl">
            RankForge AI bridges the gap between traditional search algorithms and the new wave of Large Language Model (LLM) search engines. 
          </p>
        </section>

        <div className="grid gap-20">
          {/* Methodology: The Hybrid Approach */}
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="bg-slate-900 p-2 rounded-lg">
                <Terminal className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-3xl font-black tracking-tight">The Hybrid Methodology</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-none shadow-xl shadow-slate-200/50 bg-white p-2">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Search className="h-5 w-5 text-blue-500" />
                    Traditional SEO Pillar
                  </CardTitle>
                  <CardDescription>Optimized for Google's legacy web-crawlers.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-slate-600">
                  <p>Our engine audits standard signals that still determine 70% of rankings today:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" /> <strong>Keyword Density:</strong> Maintaining a 1-3% saturation to signal topical relevance without stuffing.</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" /> <strong>H-Tag Hierarchy:</strong> Logical nesting of H1-H4 for clear DOM parsing.</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" /> <strong>Content Depth:</strong> Monitoring word counts to ensure "Thin Content" penalties are avoided.</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl shadow-slate-200/50 bg-slate-900 text-white p-2">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <BrainCircuit className="h-5 w-5 text-primary" />
                    G.E.O Framework
                  </CardTitle>
                  <CardDescription className="text-slate-400">Optimized for Gemini, SearchGPT, and Perplexity.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-slate-300">
                  <p>Generative Engine Optimization focuses on "Summarizability" and "Citability":</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2"><Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" /> <strong>Source Citability:</strong> Using definitive claims and data points that AI models prefer to quote.</li>
                    <li className="flex items-start gap-2"><Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" /> <strong>Semantic Connectivity:</strong> Building clusters of related concepts rather than just keyword matching.</li>
                    <li className="flex items-start gap-2"><Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" /> <strong>Logic Flow:</strong> Ensuring the AI can extract a "Featured Snippet" easily.</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Scoring Tiers */}
          <section className="space-y-8">
             <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-3xl font-black tracking-tight">Scoring Benchmarks</h2>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                <div className="text-4xl font-black text-emerald-500">90+</div>
                <h3 className="font-bold">Elite Asset</h3>
                <p className="text-xs text-slate-500 leading-relaxed">Perfectly balanced. High probability of Page 1 rankings and being featured as a primary AI citation.</p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                <div className="text-4xl font-black text-primary">70+</div>
                <h3 className="font-bold">Competitive</h3>
                <p className="text-xs text-slate-500 leading-relaxed">Strong foundation. Usually requires more "Unique Insights" or better internal link signals to cross the elite threshold.</p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                <div className="text-4xl font-black text-rose-500">40-</div>
                <h3 className="font-bold">Needs Refinement</h3>
                <p className="text-xs text-slate-500 leading-relaxed">Content is either too generic or lacks clear keyword focus. Likely to be ignored by modern search engines.</p>
              </div>
            </div>
          </section>

          {/* E.E.A.T Deep Dive */}
          <section className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-xl shadow-slate-200/40 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest">
                <ShieldCheck className="h-3 w-3" /> The Trust Factor
              </div>
              <h2 className="text-4xl font-black tracking-tight">Why E.E.A.T Matters</h2>
              <p className="text-slate-500 leading-relaxed">
                Experience, Expertise, Authoritativeness, and Trustworthiness. Google has explicitly stated that AI-generated content is fine, <strong>only if it provides unique value</strong>. 
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <Lightbulb className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold">The "Unique Insights" Field</p>
                    <p className="text-xs text-slate-500">Always fill this out in the Editor. It forces the AI to integrate facts it wasn't trained on, creating "Information Gain" which is a massive ranking signal.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
               <div className="absolute -inset-4 bg-primary/5 blur-3xl rounded-full" />
               <div className="relative p-8 rounded-3xl border-2 border-dashed border-slate-200 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center"><Check className="h-4 w-4 text-white" /></div>
                    <span className="text-sm font-bold">Originality Check passed</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center"><Check className="h-4 w-4 text-white" /></div>
                    <span className="text-sm font-bold">Expert data points identified</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center"><Check className="h-4 w-4 text-white" /></div>
                    <span className="text-sm font-bold">No "AI Tropes" detected</span>
                  </div>
               </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="bg-slate-100 p-2 rounded-lg">
                <HelpCircle className="h-5 w-5 text-slate-500" />
              </div>
              <h2 className="text-3xl font-black tracking-tight">Frequently Asked Questions</h2>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="border rounded-2xl bg-white px-6">
                <AccordionTrigger className="text-sm font-bold py-6">Is this content safe from AI detection penalties?</AccordionTrigger>
                <AccordionContent className="text-slate-500 pb-6">
                  Google does not penalize AI content; it penalizes "helpful-less" content. By using our Forge with Unique Insights, you create content that sounds human because it contains information not found in standard training data. Our Originality Guard specifically audits for repetitive linguistic patterns that trigger AI detectors.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border rounded-2xl bg-white px-6">
                <AccordionTrigger className="text-sm font-bold py-6">What is the optimal AI Citability score?</AccordionTrigger>
                <AccordionContent className="text-slate-500 pb-6">
                  Aim for a "Density" score between 1.5% and 3.0%. This tells SearchGPT and Gemini that your article is focused on the core topic without being "spammy." High density mixed with good Logic Flow scores leads to better chances of being cited in the "Sources" section of an AI answer.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border rounded-2xl bg-white px-6">
                <AccordionTrigger className="text-sm font-bold py-6">How do I improve my Visibility Score?</AccordionTrigger>
                <AccordionContent className="text-slate-500 pb-6">
                  The fastest way is to follow the suggestions in the Intelligence Modules. Adding more H2/H3 headings, reaching the target word count, and including the target keywords in the first paragraph are the highest impact changes you can make.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </div>

        <Separator className="my-24" />

        <footer className="text-center space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tight">Ready to Forge?</h2>
            <p className="text-slate-400 font-medium">Your next ranking content is just a few parameters away.</p>
          </div>
          <Button asChild className="rounded-full px-10 py-7 h-auto text-xl font-bold shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1">
            <Link href="/">Open the Forge Editor</Link>
          </Button>
        </footer>
      </main>
    </div>
  );
}
