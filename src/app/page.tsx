import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Edit3, Target, Globe, BookOpen, Rocket, ArrowRight, Zap, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary rounded-lg p-1.5">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-primary">RankForge AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/editor">
              <Button variant="ghost">My Projects</Button>
            </Link>
            <Link href="/editor">
              <Button>New Article</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-12 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium animate-in fade-in slide-in-from-bottom-2 duration-500">
              <Zap className="h-4 w-4" />
              Next-Gen SEO Optimization
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-tight text-foreground">
              Forge Content That <span className="text-primary italic">Ranks</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
              RankForge AI leverages advanced E.E.A.T and G.E.O principles to generate, analyze, and optimize your content for modern search engines.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/editor">
                <Button size="lg" className="px-8 h-12 text-md gap-2">
                  Start Writing <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="px-8 h-12 text-md">
                See Features
              </Button>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative bg-white border rounded-2xl p-8 shadow-2xl overflow-hidden">
              <div className="flex items-center gap-4 border-b pb-6 mb-6">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-semibold">SEO Real-time Score</div>
                  <div className="text-2xl font-bold text-accent">98 / 100</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-2 w-3/4 bg-slate-100 rounded-full"></div>
                <div className="h-2 w-full bg-slate-100 rounded-full"></div>
                <div className="h-2 w-1/2 bg-slate-100 rounded-full"></div>
                <div className="h-2 w-5/6 bg-slate-100 rounded-full"></div>
              </div>
              <div className="mt-8 pt-6 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Optimization Engine</span>
                  <Badge variant="secondary" className="bg-accent/10 text-accent">Active</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-accent" />
                    E.E.A.T Principles Applied
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Globe className="h-4 w-4 text-primary" />
                    G.E.O Localization Matched
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-white/80">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Rocket className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>AI Content Gen</CardTitle>
              <CardDescription>
                Generate outlines and drafts infused with expertise, authority, and trust.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-white/80">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-accent" />
              </div>
              <CardTitle>Rank Math Scoring</CardTitle>
              <CardDescription>
                Real-time SEO scoring provides immediate feedback as you write and edit.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-white/80">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>E.E.A.T & G.E.O</CardTitle>
              <CardDescription>
                Intelligent tools specifically designed for Google's newest ranking factors.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-bold text-primary">RankForge AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built for professional content creators who demand results.
          </p>
          <div className="mt-8 flex justify-center gap-6">
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Terms</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Privacy</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Twitter</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
