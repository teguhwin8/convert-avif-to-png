import { NextResponse } from "next/server";
import sharp from "sharp";

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

    // Kirim file PNG langsung sebagai response
    return new NextResponse(pngBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": 'attachment; filename="converted.png"',
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengonversi gambar" },
      { status: 500 }
    );
  }
}
