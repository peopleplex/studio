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
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-body">
      {/* Navigation Header */}
      <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary rounded-md p-1.5">
              <Hammer className="h-5 w-5 text-white" />
            </div>
            <span className="font-extrabold tracking-tight text-primary text-lg">RankForge AI</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-500 uppercase tracking-wider">
            <Link href="/" className="hover:text-primary transition-colors">Editor</Link>
            <Link href="/docs" className="text-primary border-b-2 border-primary pb-1">Documentation</Link>
          </nav>
        </div>
        <Button asChild variant="outline" size="sm" className="hidden sm:flex border-primary text-primary hover:bg-primary/5">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Forge
          </Link>
        </Button>
      </header>

      <main className="max-w-4xl mx-auto py-12 px-6">
        <section className="space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
            <Info className="h-3 w-3" /> User Guide & Methodology
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
            Forging Content for the <span className="text-primary">Next Era of Search</span>
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed max-w-2xl">
            RankForge AI isn't just a writer; it's a Content Engineer. We help you satisfy both the Google web-crawlers and the new wave of Search AIs.
          </p>
        </section>

        <Separator className="my-12" />

        <div className="grid gap-12">
          {/* Section: How it Works */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Zap className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">How the Forge Works</h2>
            </div>
            <Card className="border-none shadow-sm bg-white overflow-hidden">
              <CardContent className="p-8 space-y-4">
                <p className="text-slate-600 leading-relaxed">
                  Unlike traditional tools that generate text and then ask you to "scan" it later, RankForge uses <strong>Single-Pass Intelligence</strong>.
                </p>
                <div className="grid sm:grid-cols-3 gap-4 pt-4">
                  <div className="p-4 rounded-xl bg-slate-50 space-y-2">
                    <div className="font-bold text-primary text-sm uppercase">1. Parameters</div>
                    <p className="text-xs text-slate-500">You provide keywords, audience, and unique data points.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 space-y-2">
                    <div className="font-bold text-primary text-sm uppercase">2. Synthesis</div>
                    <p className="text-xs text-slate-500">The AI constructs the article while simultaneously auditing its own SEO density.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 space-y-2">
                    <div className="font-bold text-primary text-sm uppercase">3. Output</div>
                    <p className="text-xs text-slate-500">You receive a high-quality article and an instant SEO visibility report.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section: Score Analysis */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <BarChart4 className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-bold">Understanding the Visibility Score</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <Card className="border border-slate-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-bold uppercase text-slate-400">Traditional SEO Pillar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Keyword Density (1-3%)
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Heading Structure (H1-H3)
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Optimal Word Count
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-slate-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-bold uppercase text-slate-400">G.E.O & AI Citability</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <Sparkles className="h-4 w-4 text-primary" /> Source Citability Logic
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <Sparkles className="h-4 w-4 text-primary" /> Definitive Claims Detection
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <Sparkles className="h-4 w-4 text-primary" /> AI Summary Preparedness
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Section: Benchmarking */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Target className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Benchmarking: What is "Good"?</h2>
            </div>
            <div className="bg-slate-900 rounded-2xl p-8 text-white">
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 font-black">90+</div>
                  <div>
                    <h3 className="font-bold text-emerald-400">Elite / Highly Visible</h3>
                    <p className="text-sm text-slate-400">Content is perfectly optimized for page-one rankings and is highly likely to be cited by SearchGPT and Google SGE.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shrink-0 font-black">70+</div>
                  <div>
                    <h3 className="font-bold text-primary">Competitive / Developing</h3>
                    <p className="text-sm text-slate-400">Good foundation, but may need more "Unique Insights" or better heading distribution to satisfy AI citability rules.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-rose-500 flex items-center justify-center shrink-0 font-black">&lt;50</div>
                  <div>
                    <h3 className="font-bold text-rose-400">Low Visibility</h3>
                    <p className="text-sm text-slate-400">Content is either too short, too generic, or lacks keyword focus. High risk of being ignored by modern search engines.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Plagiarism & Originality */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-emerald-600" />
              <h2 className="text-2xl font-bold">Plagiarism & Originality Guard</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              We don't just check for copies; we check for <strong>predictability</strong>. Search engines now penalize "Low E.E.A.T" content that sounds like a generic AI template. Our guard flags linguistic patterns that make you sound unoriginal.
            </p>
            <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50 flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-sm text-emerald-800 italic">
                <strong>Pro Tip:</strong> Fill out the "Unique Insights" field in the Forge Setup. This forces the AI to use facts it hasn't seen in its training data, resulting in a much lower Originality Risk score.
              </p>
            </div>
          </section>
        </div>

        <Separator className="my-16" />

        <footer className="text-center space-y-4">
          <p className="text-slate-400 font-medium">Ready to dominate the rankings?</p>
          <Button asChild className="rounded-full px-8 py-6 h-auto text-lg font-bold shadow-lg hover:shadow-primary/25 transition-all">
            <Link href="/">Launch the Editor</Link>
          </Button>
        </footer>
      </main>
    </div>
  );
}
