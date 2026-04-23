"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import useAuth from '@/src/shared/stores/auth';
import { useToast } from '@/src/shared/components/ui/use-toast';
import {
  Button,
  Select,
  SelectContent,
  SelectItemList,
  SelectTrigger,
  SelectValue
} from '@/src/shared/components/ui';
import { Input } from '@/src/shared/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/src/shared/components/ui/form';
import { LoadingSpinner } from '@/src/shared/components/ui/loading-spinner';
import { cn } from '@/src/shared/utils';
import { createNewsCreateSchema } from './model';
import { CategoryCombobox } from './ui/category-combobox';
import { PosterDropzone } from './ui/poster-dropzone';
import { MarkdownEditor } from './ui/markdown-editor/view';

type Props = {
  locale: string;
};

type Language = {
  language_id: number;
  language_code: string;
};

function normalizeLocale(value: string) {
  return value.toLowerCase().replace('_', '-').split('-')[0];
}

export default function NewsCreateView({ locale }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations('Pages.NewsCreate');
  const accessToken = useAuth(state => state.accessToken);
  const hasHydrated = useAuth(state => state.hasHydrated);
  const fetchWithAuth = useAuth(state => state.fetchWithAuth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguageCode, setSelectedLanguageCode] = useState<string>('');
  const [isLanguageLoading, setIsLanguageLoading] = useState(false);
  const hasManualLanguageSelection = useRef(false);
  const schema = useMemo(() => createNewsCreateSchema(t), [t]);
  const selectedLanguage = useMemo(() => {
    if (!selectedLanguageCode) return null;
    return (
      languages.find(
        lang => normalizeLocale(lang.language_code) === normalizeLocale(selectedLanguageCode)
      ) ?? null
    );
  }, [languages, selectedLanguageCode]);
  const languageId = useMemo(() => {
    return selectedLanguage?.language_id ?? null;
  }, [selectedLanguage]);

  const form = useForm<z.infer<ReturnType<typeof createNewsCreateSchema>>>({
    resolver: zodResolver(schema),
    defaultValues: {
      category_name: '',
      poster_link: '',
      title: '',
      description: '',
      content: ''
    }
  });

  useEffect(() => {
    if (!hasHydrated) return;
    if (!accessToken) {
      router.push(`/${locale}/news`);
    }
  }, [accessToken, hasHydrated, locale, router]);

  useEffect(() => {
    if (!hasHydrated) return;
    const loadLanguages = async () => {
      setIsLanguageLoading(true);
      try {
        const res = await fetch('/site-api/languages');
        if (!res.ok) return;
        const data = await res.json();
        const languages: Language[] = data?.data?.languages ?? data?.languages ?? [];
        setLanguages(languages);
      } catch {
        // ignore
      } finally {
        setIsLanguageLoading(false);
      }
    };

    loadLanguages();
  }, [hasHydrated, locale]);

  useEffect(() => {
    if (languages.length === 0) return;

    const currentSelectionExists = languages.some(
      lang => normalizeLocale(lang.language_code) === normalizeLocale(selectedLanguageCode)
    );

    if (hasManualLanguageSelection.current && currentSelectionExists) {
      return;
    }

    const defaultLanguage =
      languages.find(lang => normalizeLocale(lang.language_code) === normalizeLocale(locale)) ??
      languages[0];

    if (defaultLanguage?.language_code) {
      setSelectedLanguageCode(defaultLanguage.language_code);
    }
  }, [languages, locale, selectedLanguageCode]);


  const onSubmit = async (
    values: z.infer<ReturnType<typeof createNewsCreateSchema>>
  ) => {
    if (!posterFile) {
      form.setError('poster_link', {
        type: 'manual',
        message: t('validation.posterRequired')
      });
      return;
    }

    if (!languageId) {
      toast({
        title: t('toast.errorTitle'),
        description: t('toast.languageErrorDesc')
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('file', posterFile);

      const uploadRes = await fetchWithAuth('/api/google-storage/upload-file', {
        method: 'POST',
        body: formData
      });

      if (!uploadRes.ok) {
        throw new Error('upload_failed');
      }

      const uploadData = await uploadRes.json();
      const posterLink = uploadData?.data?.url ?? uploadData?.url;

      if (!posterLink) {
        throw new Error('upload_failed');
      }

      const hashtagPayload = /^\d+$/.test(values.category_name)
        ? { hashtag_id: Number(values.category_name) }
        : { hashtag_name: values.category_name.toLowerCase() };

      const payload = {
        ...hashtagPayload,
        poster_link: posterLink,
        translations: [
          {
            language_id: languageId,
            title: values.title,
            description: values.description,
            content: values.content
          }
        ]
      };

      const res = await fetchWithAuth('/api/news/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('submit_failed');
      }

      form.reset();
      setPosterFile(null);
      router.push(`/${locale}/news?created=1`);
    } catch {
      toast({
        title: t('toast.errorTitle'),
        description: t('toast.errorDesc')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!hasHydrated || !accessToken) return null;

  return (
    <section className="mx-auto w-full max-w-4xl px-4 pb-12 pt-20 md:px-6 md:pt-8">
      <h1 className="text-2xl font-semibold">{t('title')}</h1>
      <p className="mt-1 text-sm text-slate-500">
        {t('subtitle')}
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-6 space-y-6"
        >
          <FormField
            control={form.control}
            name="category_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('hashtagLabel')}</FormLabel>
                <FormControl>
                  <CategoryCombobox
                    value={field.value}
                    onChange={field.onChange}
                    error={!!form.formState.errors.category_name}
                    maxLength={50}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="poster_link"
            render={() => (
              <FormItem>
                <PosterDropzone
                  error={!!form.formState.errors.poster_link}
                  message={form.formState.errors.poster_link?.message}
                  onFileSelect={file => {
                    setPosterFile(file);
                    if (file) {
                      form.setValue('poster_link', file.name);
                      form.clearErrors('poster_link');
                    } else {
                      form.setValue('poster_link', '');
                    }
                  }}
                />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('titleLabel')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('titlePlaceholder')} maxLength={100} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('descriptionLabel')}</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    rows={3}
                    maxLength={255}
                    placeholder={t('descriptionPlaceholder')}
                    className={cn(
                      'flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300'
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>{t('languageLabel')}</FormLabel>
            <FormControl>
              <Select
                value={selectedLanguageCode}
                onValueChange={value => {
                  hasManualLanguageSelection.current = true;
                  setSelectedLanguageCode(value);
                }}
                disabled={isLanguageLoading || languages.length === 0}
              >
                <SelectTrigger className="rounded-md">
                  <SelectValue
                    placeholder={
                      isLanguageLoading ? t('loadingLanguage') : t('languagePlaceholder')
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {languages.map(lang => (
                    <SelectItemList key={lang.language_id} value={lang.language_code}>
                      {lang.language_code.toUpperCase()}
                    </SelectItemList>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('markdownLabel')}</FormLabel>
                <FormControl>
                  <MarkdownEditor
                    value={field.value}
                    onChange={field.onChange}
                    error={!!form.formState.errors.content}
                    helperText={form.formState.errors.content?.message}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex items-center gap-3">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              className="min-w-[160px]"
            >
              {isSubmitting ? <LoadingSpinner size={20} /> : t('submit')}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}
