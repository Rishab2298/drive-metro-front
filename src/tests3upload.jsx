import { useState } from "react";
import { useAuth, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

export default function TestS3Upload() {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleUpload = async (file) => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // 1️⃣ Get Clerk token
      const token = await getToken();

      // 2️⃣ Request presigned URL
      const res = await fetch("/api/s3/presign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to get upload URL");
      }

      const { uploadUrl, key } = await res.json();

      // 3️⃣ Upload directly to S3
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type
        },
        body: file
      });

      if (!uploadRes.ok) {
        throw new Error("S3 upload failed");
      }

      setSuccess(`Upload successful: ${key}`);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">DiveMetric Upload</h1>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>

        <SignedIn>
          <div className="border rounded-lg p-6 bg-card shadow-sm">
            <label className="block mb-4 text-sm font-medium">
              Select a file
            </label>

            <input
              type="file"
              accept=".csv,.pdf,.xlsx,.xls"
              disabled={loading}
              onChange={(e) => handleUpload(e.target.files[0])}
              className="block w-full text-sm file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:bg-primary file:text-primary-foreground
                hover:file:bg-primary/90"
            />

            {loading && (
              <p className="mt-4 text-sm text-muted-foreground">
                Uploading…
              </p>
            )}

            {error && (
              <p className="mt-4 text-sm text-red-500">
                {error}
              </p>
            )}

            {success && (
              <p className="mt-4 text-sm text-green-600">
                {success}
              </p>
            )}
          </div>
        </SignedIn>

        <SignedOut>
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Please sign in to upload files</h2>
            <SignInButton mode="modal">
              <button className="px-6 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
                Sign In
              </button>
            </SignInButton>
          </div>
        </SignedOut>
      </div>
    </div>
  );
}
