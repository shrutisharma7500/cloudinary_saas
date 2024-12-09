"use client";

import React, { useState, useEffect, useRef } from "react";
import { CldImage } from "next-cloudinary";

const socialFormats = {
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
  "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
  "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
  "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },
};

type SocialFormat = keyof typeof socialFormats;

export default function SocialShare() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>(
    "Instagram Square (1:1)"
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (uploadedImage) {
      setIsTransforming(true);
    }
  }, [selectedFormat, uploadedImage]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload image");

      const data = await response.json();
      setUploadedImage(data.publicId);
    } catch (error) {
      console.log(error);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    if (!imageRef.current) return;

    fetch(imageRef.current.src)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${selectedFormat.replace(/\s+/g, "_").toLowerCase()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      });
  };

  return (
    <div className="w-full min-h-screen bg-[#0f172a]">
      <div className="container mx-auto px-4 py-10 sm:px-8 lg:px-16 max-w-5xl">
        <h1 className="text-white text-3xl mb-10 font-bold px-6 py-3 bg-gradient-to-b from-[#190d2e] to-[#4a208a] shadow-[0px_0px_12px_#8c45ff] rounded-lg hover:bg-gradient-to-t">
          SOCIAL MEDIA IMAGE CREATOR
        </h1>

        <div className="bg-[#c084fc] rounded-xl shadow-lg p-8 space-y-6">
          <h2 className="text-2xl font-extrabold text-gray-800">Upload Your Image</h2>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="file"
              onChange={handleFileUpload}
              className="file-input file-input-bordered file-input-primary w-full max-w-md"
            />
            {isUploading && <span className="loading loading-spinner loading-lg text-blue-500"></span>}
          </div>

          {uploadedImage && (
            <>
              <div>
                <h2 className="text-xl font-semibold text-gray-700">Select Social Media Format</h2>
                <select
                  className="select select-bordered w-full max-w-md mt-4"
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value as SocialFormat)}
                >
                  {Object.keys(socialFormats).map((format) => (
                    <option key={format} value={format}>
                      {format}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-700">Preview:</h3>
                <div className="relative flex justify-center items-center bg-gray-50 p-6 rounded-lg border">
                  {isTransforming && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-10">
                      <span className="loading loading-spinner loading-lg text-white"></span>
                    </div>
                  )}
                  <CldImage
                    width={socialFormats[selectedFormat].width}
                    height={socialFormats[selectedFormat].height}
                    src={uploadedImage}
                    sizes="100vw"
                    alt="transformed image"
                    crop="fill"
                    aspectRatio={socialFormats[selectedFormat].aspectRatio}
                    gravity="auto"
                    ref={imageRef}
                    onLoad={() => setIsTransforming(false)}
                    className="rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  className="btn btn-gradient px-6 py-3 text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:bg-gradient-to-l rounded-lg shadow-md"
                  onClick={handleDownload}
                >
                  Download for {selectedFormat}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
