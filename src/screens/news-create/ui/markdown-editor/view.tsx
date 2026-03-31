"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  diffSourcePlugin,
  DiffSourceToggleWrapper,
  headingsPlugin,
  imagePlugin,
  InsertImage,
  InsertThematicBreak,
  InsertTable,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  ListsToggle,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  quotePlugin,
  Separator,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  jsxPlugin,
  type JsxComponentDescriptor
} from '@mdxeditor/editor';
import { useTranslations } from 'next-intl';
import useAuth from '@/src/shared/stores/auth';
import { JsxPlaceholder } from './components/jsx-placeholder';
import { InsertYouTubeButton } from './components/insert-youtube-button';
import { InsertTikTokButton } from './components/insert-tiktok-button';

export const MarkdownEditorContext = createContext<MDXEditorMethods | null>(null);

type Props = {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
};

export const MarkdownEditor = ({ value, onChange, error, helperText }: Props) => {
  const t = useTranslations('Pages.NewsCreate');
  const fetchWithAuth = useAuth(state => state.fetchWithAuth);
  const editorRef = useRef<MDXEditorMethods | null>(null);
  const [editorInstance, setEditorInstance] = useState<MDXEditorMethods | null>(null);

  useEffect(() => {
    if (editorRef.current) setEditorInstance(editorRef.current);
  }, []);

  const extractYouTubeId = (input: string) => {
    const trimmed = input.trim();
    const match = trimmed.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/
    );
    if (match && match[1]) return match[1];

    const matchWatch = trimmed.match(/v=([A-Za-z0-9_-]{6,})/);
    return matchWatch?.[1] ?? trimmed;
  };

  const sanitizeYouTubeTags = (markdown: string) =>
    markdown.replace(
      /<YouTube\s+id=["']([^"']+)["']\s*\/?>(?:\s*<\/YouTube>)?/g,
      (_m, id) => {
        const safeId = extractYouTubeId(id);
        return `<YouTube id="${safeId}" />`;
      }
    );

  const imageUploadHandler = useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetchWithAuth('/api/google-storage/upload-file', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) {
        throw new Error('upload_failed');
      }
      const data = await res.json();
      return data?.data?.url ?? data?.url;
    },
    [fetchWithAuth]
  );

  const plugins = useMemo(
    () => [
      jsxPlugin({
        jsxComponentDescriptors: [
          {
            name: 'YouTube',
            kind: 'text',
            props: [{ name: 'id', type: 'string' }],
            hasChildren: false,
            Editor: JsxPlaceholder
          } as JsxComponentDescriptor,
          {
            name: 'TikTok',
            kind: 'text',
            props: [{ name: 'url', type: 'string' }],
            hasChildren: false,
            Editor: JsxPlaceholder
          } as JsxComponentDescriptor
        ]
      }),
      diffSourcePlugin({ viewMode: 'rich-text' }),
      headingsPlugin(),
      listsPlugin(),
      quotePlugin(),
      linkPlugin(),
      linkDialogPlugin(),
      tablePlugin(),
      thematicBreakPlugin(),
      markdownShortcutPlugin(),
      imagePlugin({ imageUploadHandler }),
      toolbarPlugin({
        toolbarContents: () => (
          <DiffSourceToggleWrapper options={['rich-text', 'source']}>
            <BoldItalicUnderlineToggles />
            <Separator />
            <ListsToggle />
            <Separator />
            <BlockTypeSelect />
            <InsertThematicBreak />
            <Separator />
            <CreateLink />
            <InsertImage />
            <InsertTable />
            <Separator />
            <InsertYouTubeButton editorRef={editorRef} />
            <InsertTikTokButton editorRef={editorRef} />
          </DiffSourceToggleWrapper>
        )
      })
    ],
    [imageUploadHandler]
  );

  const sanitizedMarkdown = sanitizeYouTubeTags(value ?? '');

  return (
    <div
      className={`news-editor rounded-md border ${error ? 'border-red-500' : 'border-slate-200'}`}
    >
      <MarkdownEditorContext.Provider value={editorInstance}>
        <MDXEditor
          markdown={sanitizedMarkdown}
          onChange={md => {
            const sanitized = sanitizeYouTubeTags(md ?? '');
            onChange(sanitized);
          }}
          className="editor"
          plugins={plugins}
          ref={editorRef}
        />
      </MarkdownEditorContext.Provider>
      {error && helperText && (
        <p className="mt-2 text-sm text-red-500">{helperText}</p>
      )}
      {!error && helperText && (
        <p className="mt-2 text-sm text-slate-500">{helperText}</p>
      )}
      {!helperText && (
        <p className="sr-only">{t('markdownLabel')}</p>
      )}
    </div>
  );
};
