import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import remarkHtml from "remark-html";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import remarkGfm from "remark-gfm"; // Add this for table support
import rehypeRaw from "rehype-raw";
import { unified } from "unified";
import { u } from "unist-builder";

export function markdownFromHTML(html: string): string {
  return (
    unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeRaw)
      // @ts-expect-error - Ignore TypeScript type issues
      .use(rehypeRemark, {
        handlers: {
          img(h, node) {
            const url = node.properties.src || "";
            const alt = node.properties.alt || "";
            const width = node.properties.width || "";
            const height = node.properties.height || "400";

            return u("image", { url, alt, width, height });
          },
        },
      })
      .use(remarkGfm)
      .use(remarkStringify, {
        handlers: {
          image(node) {
            return `![${node.alt}](${node.url}){width=${node.width} height=${node.height || ""}}`;
          },
        },
      })
      .processSync(html)
      .toString()
  );
}

export function htmlFromMarkdown(markdown: string): string {
  return unified()
    .use(remarkParse)
    .use(remarkHtml)
    .processSync(markdown)
    .toString();
}
