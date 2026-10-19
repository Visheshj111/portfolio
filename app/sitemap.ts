import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://portfolio-ashen-asasphi-67.vercel.app", priority: 1 }, { url: "https://portfolio-ashen-asasphi-67.vercel.app/privacy", priority: .3 }];
}
