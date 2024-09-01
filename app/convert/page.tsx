"use client";

import { useState } from "react";
import Image from "next/image";

export default function ConvertAvifToPng() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setConvertedImage(null); // Reset converted image on new upload
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    const response = await fetch("/api/convert", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    setLoading(false);

    if (response.ok) {
      setConvertedImage(result.outputPath);
    } else {
      console.error(result.error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <input
        type="file"
        accept="image/avif"
        onChange={handleFileChange}
        className="mb-4"
      />
      <button
        onClick={handleConvert}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={!selectedFile || loading}
      >
        {loading ? "Converting..." : "Convert AVIF to PNG"}
      </button>
      {loading && <p className="mt-4 text-blue-500">Processing...</p>}
      {convertedImage && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Hasil Konversi:</h3>
          <Image
            src={convertedImage}
            alt="Converted PNG"
            width={400}
            height={400}
          />
          <a
            href={convertedImage}
            download
            className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Download PNG
          </a>
        </div>
      )}
    </div>
  );
}
