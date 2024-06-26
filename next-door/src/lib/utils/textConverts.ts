import { marked } from "marked";

export const markdownify = (content: string, div?: boolean) => {
  const markdownContent: any = div
    ? marked.parse(content)
    : marked.parseInline(content);

  return { __html: markdownContent };
};
