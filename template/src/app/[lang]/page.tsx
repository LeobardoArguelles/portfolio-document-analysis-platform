"use client";

import Image from "next/image";

// Components
import FileUpload from "@/components/FileUpload";

export default function Home() {
  return <FileUpload onFileSelect={(file) => console.log(file)} />;
}
