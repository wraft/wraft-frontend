import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import remarkHtml from "remark-html";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import remarkGfm from "remark-gfm"; // Add this for table support
import rehypeRaw from "rehype-raw";
import { unified } from "unified";
// import _TurndownService from "turndown";

export function markdownFromHTML(html: string): string {
  return unified()
    .use(rehypeParse)
    .use(rehypeRaw)
    .use(rehypeRemark)
    .use(remarkGfm)
    .use(remarkStringify)
    .processSync(html)
    .toString();
}

export function htmlFromMarkdown(markdown: string): string {
  return unified()
    .use(remarkParse)
    .use(remarkHtml)
    .processSync(markdown)
    .toString();
}
