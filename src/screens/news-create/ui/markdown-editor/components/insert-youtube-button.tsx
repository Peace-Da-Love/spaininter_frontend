"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/src/shared/components/ui';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/src/shared/components/ui/dialog';
import { Input } from '@/src/shared/components/ui/input';

type Props = {
  editorRef?: React.RefObject<{ insertMarkdown: (markdown: string) => void } | null>;
};

export function InsertYouTubeButton({ editorRef }: Props) {
  const t = useTranslations('Pages.NewsCreate');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  const handleClose = () => {
    setOpen(false);
    setValue('');
  };

  const handleInsert = () => {
    const raw = value.trim();
    if (!raw || !editorRef?.current) return;

    let extractedId = raw;
    const urlPattern = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/;
    const match = raw.match(urlPattern);
    if (match) extractedId = match[1];

    editorRef.current.insertMarkdown(`<YouTube id="${extractedId}" />`);
    handleClose();
  };

  return (
    <>
      <button
        type="button"
        className="toolbar-button"
        onClick={() => setOpen(true)}
      >
        {t('markdownYouTubeButton')}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('markdownInsertYouTube')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input
              value={value}
              onChange={event => setValue(event.target.value)}
              placeholder={t('markdownYouTubePlaceholder')}
            />
            <p className="text-sm text-slate-500">
              {t('markdownYouTubeHelper')}
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={handleClose}>
              {t('markdownCancel')}
            </Button>
            <Button type="button" variant="primary" onClick={handleInsert}>
              {t('markdownInsert')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
