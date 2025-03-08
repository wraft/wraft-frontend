import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import remarkHtml from "remark-html";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import remarkGfm from "remark-gfm"; // Add this for table support
import rehypeRaw from "rehype-raw";
import { unified } from "unified";
import { u } from "unist-builder";
import type { Element } from "hast";
import type { Transformer } from "unified";

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
          div(h, node: Element) {
            if (
              Array.isArray(node.properties.className) &&
              node.properties.className.includes("prosekit-page-break")
            ) {
              return u("text", "\\newpage");
            }
            return h.all(node);
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

const pageBreakTransformer = (): Transformer => {
  return (tree: any) => {
    const visit = (node: any) => {
      if (node.type === "text" && node.value === "\\newpage") {
        node.type = "html";
        node.value = '<div style="page-break-after: always;"></div>';
      }
      if (node.children) {
        node.children.forEach(visit);
      }
      return node;
    };
    return visit(tree);
  };
};

export function htmlFromMarkdown(markdown: string): string {
  const processor = unified()
    .use(remarkParse)
    .use(pageBreakTransformer)
    .use(remarkHtml, { sanitize: false });

  return processor.processSync(markdown).toString();
}
