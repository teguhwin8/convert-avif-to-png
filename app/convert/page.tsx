"use client";

import { useState } from "react";

export default function ConvertAvifToPng() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setDownloadLink(null); // Reset download link on new upload
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

    setLoading(false);

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadLink(url);
    } else {
      console.error("Conversion failed");
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
      {downloadLink && (
        <div className="mt-4">
          <a
            href={downloadLink}
            download="converted.png"
            className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Download PNG
          </a>
        </div>
      )}
    </div>
  );
}
