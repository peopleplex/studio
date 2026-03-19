import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, FileText, Code } from 'lucide-react';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: string;
  title: string;
}

export function ExportDialog({ open, onOpenChange, content, title }: ExportDialogProps) {
  const downloadFile = (format: 'markdown' | 'html') => {
    const extension = format === 'markdown' ? 'md' : 'html';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Article</DialogTitle>
          <DialogDescription>
            Choose your preferred format for exporting your optimized content.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <Button
            variant="outline"
            className="h-32 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5"
            onClick={() => downloadFile('markdown')}
          >
            <FileText className="h-8 w-8 text-primary" />
            <div className="text-sm font-medium">Markdown</div>
            <div className="text-xs text-muted-foreground">Best for CMS imports</div>
          </Button>
          <Button
            variant="outline"
            className="h-32 flex flex-col items-center justify-center gap-2 hover:border-accent hover:bg-accent/5"
            onClick={() => downloadFile('html')}
          >
            <Code className="h-8 w-8 text-accent" />
            <div className="text-sm font-medium">HTML</div>
            <div className="text-xs text-muted-foreground">Ready for web pages</div>
          </Button>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
