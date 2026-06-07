"use client";

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/src/shared/utils';
import { useTranslations } from 'next-intl';
import { useToast } from '@/src/shared/components/ui/use-toast';

type Props = {
  onFileSelect: (file: File | null) => void;
  error?: boolean;
  message?: string;
};

const MAX_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

export const PosterDropzone = ({ onFileSelect, error, message }: Props) => {
  const t = useTranslations('Pages.NewsCreate');
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  const validateAndSet = (file: File | null) => {
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast({
        title: t('toast.errorTitle'),
        description: t('posterInvalidType')
      });
      return;
    }

    if (file.size > MAX_SIZE) {
      toast({
        title: t('toast.errorTitle'),
        description: t('posterTooLarge')
      });
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleRemove = () => {
    setSelectedFile(null);
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      {!selectedFile && (
        <div>
          <div
            className={cn(
              'flex min-h-[120px] cursor-pointer items-center justify-center rounded-md border-2 border-dashed bg-white px-4 py-6 text-center text-sm text-slate-500',
              error ? 'border-red-500 text-red-500' : 'border-slate-200'
            )}
            onClick={() => inputRef.current?.click()}
            onDragOver={event => {
              event.preventDefault();
            }}
            onDrop={event => {
              event.preventDefault();
              const file = event.dataTransfer.files?.[0] ?? null;
              validateAndSet(file);
            }}
          >
            {t('posterDropTitle')}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={event => {
              const file = event.target.files?.[0] ?? null;
              validateAndSet(file);
            }}
          />
        </div>
      )}

      {selectedFile && previewUrl && (
        <div>
          <p className="mb-2 text-sm font-medium">{t('posterPreviewTitle')}</p>
          <div className="relative inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="preview"
              className="h-[200px] w-[300px] rounded-lg border border-emerald-500 object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute right-2 top-2 rounded-full bg-white/80 p-1 text-slate-700 hover:bg-white"
              title={t('posterRemove')}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {t('posterSelected', {
              name: selectedFile.name,
              size: (selectedFile.size / 1024 / 1024).toFixed(2)
            })}
          </p>
        </div>
      )}

      {message && <div className="mt-2 text-sm text-red-500">{message}</div>}
    </div>
  );
};
