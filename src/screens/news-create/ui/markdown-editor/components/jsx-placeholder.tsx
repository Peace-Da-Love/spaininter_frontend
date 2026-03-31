"use client";

import type { JsxEditorProps } from '@mdxeditor/editor';
import { useNestedEditorContext } from '@mdxeditor/editor';
import { useContext } from 'react';
import { useTranslations } from 'next-intl';
import { MarkdownEditorContext } from '../view';
import { YouTube } from './youtube';
import { TikTok } from './tiktok';

export function JsxPlaceholder({ mdastNode, descriptor }: JsxEditorProps) {
  useNestedEditorContext();
  const editor = useContext(MarkdownEditorContext);
  const t = useTranslations('Pages.NewsCreate');

  const attributes = mdastNode.attributes || [];
  const idProp = attributes.find(
    attr => attr.type === 'mdxJsxAttribute' && attr.name === 'id'
  );
  const urlProp = attributes.find(
    attr => attr.type === 'mdxJsxAttribute' && attr.name === 'url'
  );

  const isYouTube = descriptor.name === 'YouTube';
  const isTikTok = descriptor.name === 'TikTok';

  const id =
    idProp && idProp.type === 'mdxJsxAttribute' && typeof idProp.value === 'string'
      ? idProp.value
      : '';
  const url =
    urlProp && urlProp.type === 'mdxJsxAttribute' && typeof urlProp.value === 'string'
      ? urlProp.value
      : '';

  const removeSelf = () => {
    try {
      if (!editor) return;
      const markdown = editor.getMarkdown() ?? '';

      const makeTagRegexp = (
        name: string,
        attrName: string,
        attrValue: string | undefined
      ) => {
        const safeVal = (attrValue ?? '').replace(
          /[-/\\^$*+?.()|[\]{}]/g,
          '\\$&'
        );
        if (safeVal) {
          return new RegExp(
            `<${name}\\b[^>]*${attrName}\\s*=\\s*["']${safeVal}["'][^>]*>(?:\\s*</${name}>)?|<${name}\\b[^>]*${attrName}\\s*=\\s*["']${safeVal}["'][^>]*\\/?>`,
            'i'
          );
        }
        return new RegExp(
          `<${name}\\b[^>]*>(?:\\s*</${name}>)?|<${name}\\b[^>]*\\/?>`,
          'i'
        );
      };

      const nodeName = descriptor?.name ?? '';
      const attrName = nodeName === 'YouTube' ? 'id' : 'url';
      const attrValue = nodeName === 'YouTube' ? id : url;

      const start = (mdastNode as any)?.position?.start?.offset;
      const end = (mdastNode as any)?.position?.end?.offset;

      if (
        typeof start === 'number' &&
        typeof end === 'number' &&
        end > start &&
        start >= 0 &&
        end <= markdown.length
      ) {
        const slice = markdown.slice(start, end);
        const posRegexp = makeTagRegexp(nodeName, attrName, attrValue);
        if (posRegexp.test(slice)) {
          let next = markdown.slice(0, start) + markdown.slice(end);
          next = next.replace(/\n{3,}/g, '\n\n');
          editor.setMarkdown(next);
          editor.focus();
          return;
        }
      }

      const globalRegexp = makeTagRegexp(nodeName, attrName, attrValue);
      const allMatches: { index: number; match: string }[] = [];
      let m: RegExpExecArray | null;
      const g = new RegExp(globalRegexp.source, 'ig');
      while ((m = g.exec(markdown)) !== null) {
        allMatches.push({ index: m.index, match: m[0] });
        if (g.lastIndex === m.index) g.lastIndex++;
      }

      if (allMatches.length === 0) {
        return;
      }

      let chosen = allMatches[0];
      if (typeof start === 'number') {
        let best = allMatches[0];
        let bestDist = Math.abs(allMatches[0].index - start);
        for (const it of allMatches) {
          const d = Math.abs(it.index - start);
          if (d < bestDist) {
            best = it;
            bestDist = d;
          }
        }
        chosen = best;
      }

      const before = markdown.slice(0, chosen.index);
      const after = markdown.slice(chosen.index + chosen.match.length);
      let next = before + after;
      next = next.replace(/\n{3,}/g, '\n\n');
      next = next.replace(/^\s*\n/, '');
      next = next.replace(/\n\s*$/, '');

      editor.setMarkdown(next);
      editor.focus();
    } catch {
      // ignore
    }
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = event => {
    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();
      removeSelf();
    }
  };

  const content = isYouTube && id ? (
    <YouTube id={id} />
  ) : isTikTok && url ? (
    <TikTok url={url} />
  ) : (
    <div
      style={{
        border: '1px dashed #d1d5db',
        borderRadius: 8,
        background: '#fafafa',
        color: '#6b7280',
        padding: 12,
        textAlign: 'center'
      }}
    >
      {descriptor.name}
    </div>
  );

  return (
    <div
      tabIndex={0}
      contentEditable={false}
      onKeyDown={onKeyDown}
      style={{ position: 'relative', outline: 'none' }}
    >
      <button
        type="button"
        onClick={removeSelf}
        title={t('markdownRemove')}
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          background: 'rgba(0,0,0,0.6)',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          padding: '2px 6px',
          cursor: 'pointer',
          lineHeight: 1
        }}
      >
        ×
      </button>
      {content}
    </div>
  );
}
