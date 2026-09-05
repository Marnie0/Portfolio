import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

/**
 * Renders article markdown.
 *
 * Intentionally has no 'use client': it is a shared component, so the public
 * article page renders it on the server with no client JavaScript, while the
 * admin preview — which is a client component — bundles the same code.
 *
 * `rehype-raw` is deliberately NOT enabled, so embedded HTML in an article is
 * escaped rather than executed. Everything needed (headings, images, code,
 * tables, task lists) is covered by markdown and GFM.
 */
export function Markdown({ content }: { content: string }) {
  return (
    <div className="article-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
