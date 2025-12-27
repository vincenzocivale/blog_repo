import { slugifyStr } from "./slugify";
import { SITE } from "@/config";

/**
 * Get full path of a blog post
 * @param id - id of the blog post (aka slug)
 * @param _filePath - the blog post full file location (unused, but kept for compatibility)
 * @param includeBase - whether to include `/posts` in return value
 * @returns blog post path
 */
export function getPath(
  id: string,
  _filePath: string | undefined,
  includeBase = true
) {
  const base = SITE.base === "/" ? "" : SITE.base;
  const postsPath = includeBase ? "/posts" : "";

  // id is like "2025/my-post.md"
  // we want to get "/blog_repo/posts/2025/my-post"
  const slugWithExtension = id;

  // Find the last dot and remove the extension
  const lastDotIndex = slugWithExtension.lastIndexOf('.');
  const slugWithoutExtension = lastDotIndex > -1 ? slugWithExtension.substring(0, lastDotIndex) : slugWithExtension;

  // slugify parts
  const slugParts = slugWithoutExtension.split("/").map(part => slugifyStr(part));

  const finalPath = [base, postsPath, ...slugParts].join("/");

  return finalPath.replace(/\/+/g, "/"); // Prevent multiple slashes
}
