import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: "https://portfolio-ashen-asasphi-67.vercel.app/sitemap.xml" };
}
