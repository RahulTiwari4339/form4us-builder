export async function uploadImage(file) {
  const res = await fetch(
    `/api/upload?filename=${encodeURIComponent(file.name)}`,
    {
      method: "POST",
      body: file,
    }
  );

  if (!res.ok) {
    throw new Error("Upload failed");
  }

  const data = await res.json();
  return data.url; // 👈 public.blob.vercel-storage.com URL
}
