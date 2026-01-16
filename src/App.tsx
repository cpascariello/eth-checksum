import { useState, useEffect } from 'react';
import { DecorativeSquares } from './components/DecorativeSquares';
import { ChecksumForm } from './components/ChecksumForm';
import { SettingsPanel } from './components/SettingsPanel';

function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX - window.innerWidth / 2) / window.innerWidth;
      const y = (e.clientY - window.innerHeight / 2) / window.innerHeight;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col">
      <SettingsPanel />

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="relative max-w-xl w-full">
          <DecorativeSquares mousePos={mousePos} />
          <ChecksumForm />
        </div>
      </main>

      <footer className="py-6 text-center">
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Hosted on{' '}
          <a
            href="https://aleph.cloud"
            target="_blank"
            rel="noreferrer noopener"
            className="underline hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
          >
            Aleph Cloud
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
