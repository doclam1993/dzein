'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-[#07090e] text-white flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-extrabold mb-2 text-rose-400">Une erreur critique s&apos;est produite</h2>
          <p className="text-slate-400 text-xs mb-6 max-w-md">
            L&apos;application a rencontré une erreur majeure.
          </p>
          <button
            onClick={() => reset()}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors"
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
