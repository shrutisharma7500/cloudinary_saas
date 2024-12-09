'use client'
import React, { useState } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';

function videoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  //max file size is 60mb
  const MAX_FILE_SIZE = 70 * 1024 * 1024;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      alert("file size too large");
      return;
    }
    setIsUploading(true)
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("originalSize", file.size.toString());

    try {
      const response = await axios.post("/api/video-upload", formData)
      // check for 200 response
      router.push("/")
    } catch (error) {
      console.log(error)
      // notification for failure
    } finally {
      setIsUploading(false)
    }


  }



  return (
    <div className=" w-full min-h-screen bg-[#0f172a]">
    <div className="container mx-auto p-4">
    <h1 className=" text-white text-3xl mb-10 font-bold px-6 py-3 bg-gradient-to-b from-[#190d2e] to-[#4a208a] shadow-[0px_0px_12px_#8c45ff] rounded-lg hover:bg-gradient-to-t">
    VIDEO UPLOAD
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text text-white">Title</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text text-white">Description</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="textarea textarea-bordered w-full"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text text-white flex flex-col">Video File</span>
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="file-input file-input-bordered  text-white bg-[#be185d] rounded-md w-80"
                required
              />
            </div>
            <button
              type="submit"
              className=" text-white  mb-10 font-bold px-4 py-1 bg-gradient-to-b from-[#190d2e] to-[#4a208a] shadow-[0px_0px_12px_#8c45ff] rounded-lg hover:bg-gradient-to-t"
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload Video"}
            </button>
          </form>
        </div>
        </div>
      
  );
}

export default videoUpload;
