"use client";

import Image from "next/image";

// Components
import FileUpload from "@/components/file-upload/file-upload";

export default function Home() {
  return <FileUpload onFileSelect={(file) => console.log(file)} />;
}
