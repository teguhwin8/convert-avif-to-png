import { NextResponse } from "next/server";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as Blob;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const avifImage = Buffer.from(arrayBuffer);

    // Konversi AVIF ke PNG menggunakan sharp
    const pngBuffer = await sharp(avifImage).png().toBuffer();

    // Generate unique filename
    const fileName = `${uuidv4()}.png`;
    const outputPath = path.join(process.cwd(), "public", fileName);
    fs.writeFileSync(outputPath, pngBuffer);

    return NextResponse.json({
      message: "Konversi berhasil",
      outputPath: `/${fileName}`,
    });
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengonversi gambar" },
      { status: 500 }
    );
  }
}
