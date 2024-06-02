import path from "path";
import fs from "fs";
import { notFound } from "next/navigation";
import matter from "gray-matter";

const contentPath = "src/content";

/**
 * Helper function to read file content
 *
 * @param filePath
 */
const readFile = (filePath: string) => {
  return fs.readFileSync(filePath, "utf-8");
};

/**
 * Helper function to parse front matter
 *
 * @param frontmatter
 */
const parseFrontmatter = (frontmatter: any) => {
  const frontmatterString = JSON.stringify(frontmatter);

  return JSON.parse(frontmatterString);
};

/**
 * Helper function to fetch page list from file.
 *
 * @param filePath
 */
export const getListPage = (filePath: string) => {
  const pageDataPath = path.join(contentPath, filePath);

  if (!fs.existsSync(pageDataPath)) {
    notFound();
  }

  const pageData = readFile(pageDataPath);
  const { content, data: frontmatter } = matter(pageData);

  return {
    frontmatter: parseFrontmatter(frontmatter),
    content,
  };
};
