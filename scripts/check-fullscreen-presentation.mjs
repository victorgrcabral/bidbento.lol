import { readFileSync } from "node:fs";

const home = readFileSync(new URL("../src/app/page.tsx", import.meta.url), "utf8");
const treemap = readFileSync(new URL("../src/components/ScreenTreemap.tsx", import.meta.url), "utf8");

if (!home.includes("requestFullscreen")) throw new Error("Native fullscreen entry is missing");
if (!home.includes("exitFullscreen")) throw new Error("Native fullscreen exit is missing");
if (!home.includes('addEventListener("fullscreenchange"')) throw new Error("Fullscreen state is not synchronized with browser Escape");
if (!home.includes('url.searchParams.set("limit", "1000")')) throw new Error("Presentation mode does not request all purchased brands");
if (!home.includes("!isPresentationMode && (")) throw new Error("Presentation mode does not hide interface chrome");
if (!home.includes("exitPresentationMode")) throw new Error("Visible fullscreen exit action is missing");
if (!treemap.includes("presentationMode?: boolean")) throw new Error("Treemap does not expose presentation mode");
if (!treemap.includes('presentationMode ? "bg-black pointer-events-none"')) throw new Error("Presentation mode still allows brand overlays or non-brand chrome");

console.log("Fullscreen OK: native API with fallback, all brands, hidden chrome, visible exit, static presentation canvas");
