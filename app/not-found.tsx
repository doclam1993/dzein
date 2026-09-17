import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-extrabold mb-2 text-indigo-400">404 - Page Non Trouvée</h1>
      <p className="text-slate-400 text-sm mb-6 max-w-md">
        La page que vous recherchez n&apos;existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors"
      >
        Retourner au Studio
      </Link>
    </div>
  );
}
