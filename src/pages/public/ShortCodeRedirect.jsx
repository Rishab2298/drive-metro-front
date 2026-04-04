import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5004';

export default function ShortCodeRedirect() {
  const { shortCode } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    async function resolveShortCode() {
      try {
        const response = await fetch(`${API_URL}/api/s/${shortCode}`);
        if (!response.ok) {
          setError("Scorecard not found");
          return;
        }
        const data = await response.json();
        navigate(`/scorecard/${data.id}`, { replace: true });
      } catch (err) {
        setError("Failed to load scorecard");
      }
    }

    if (shortCode) {
      resolveShortCode();
    }
  }, [shortCode, navigate]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
            {error}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            The scorecard link may be invalid or expired.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="w-10 h-10 border-3 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );
}
