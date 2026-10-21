import { ImageResponse } from "next/og";

export const alt = "Vishesh Jangid — Full-stack developer in Pune, India";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function SocialImage() {
  return new ImageResponse(<div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", background: "#10120f", color: "#f0f1e8", padding: "58px 70px", fontFamily: "sans-serif" }}><div style={{ display: "flex", justifyContent: "space-between", fontSize: 19, color: "#a0a397" }}><span>FULL-STACK DEVELOPER</span><span>PUNE, INDIA ↗</span></div><div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}><div style={{ display: "flex", flexDirection: "column", fontSize: 122, letterSpacing: -7, lineHeight: .95 }}><span>Vishesh</span><div style={{ display: "flex" }}>Jangid<span style={{ color: "#c3e89d" }}>.</span></div></div><div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 220, height: 220, background: "#c3e89d", color: "#182410", borderRadius: 25, fontSize: 100, letterSpacing: -9 }}>vj.</div></div><div style={{ display: "flex", justifyContent: "space-between", paddingTop: 24, borderTop: "1px solid #35412c", fontSize: 20, color: "#b2bba8" }}><span>Good interfaces. Even better under the hood.</span><span>github.com/Visheshj111</span></div></div>, size);
}
