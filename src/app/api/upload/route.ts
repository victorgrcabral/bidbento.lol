import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    // Validate mime type
    const validMimes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif"];
    if (!validMimes.includes(file.type)) {
      return NextResponse.json(
        { error: "Formato de arquivo inválido. Permitido apenas JPEG, PNG, WEBP, SVG ou GIF." },
        { status: 400 }
      );
    }

    // Max 4MB
    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Arquivo muito grande. O tamanho máximo permitido é 4MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save directory in public/uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Generate unique safe filename
    const extension = file.name.split(".").pop() || "png";
    const filename = `logo_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${extension}`;
    const filepath = path.join(uploadDir, filename);

    await writeFile(filepath, buffer);

    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({ url: publicUrl, filename });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Erro ao processar upload da imagem" }, { status: 500 });
  }
}
