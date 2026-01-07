import { useState, useCallback, useEffect } from "react";
import { getAddress } from "ethers";

// Decorative squares configuration
const SQUARE_COUNT = 50;
const SQUARE_STEP = 5; // Base size increment per square (px)
const SQUARE_STEP_INCREMENT = 0.1; // Additional pixels added to each successive gap
const SQUARE_ROTATION = 1; // Degrees of rotation added per square
const PARALLAX_MULTIPLIER = 2; // Intensity of parallax effect per square

function getInitialTheme(): boolean {
  const stored = localStorage.getItem("theme");
  if (stored) return stored === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function App() {
  const [inputValue, setInputValue] = useState("");
  const [checksummed, setChecksummed] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDark, setIsDark] = useState(getInitialTheme);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX - window.innerWidth / 2) / window.innerWidth;
      const y = (e.clientY - window.innerHeight / 2) / window.innerHeight;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleChecksum = useCallback(() => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      setChecksummed(null);
      setError(null);
      return;
    }

    try {
      const result = getAddress(trimmed);
      setChecksummed(result);
      setError(null);
    } catch {
      setChecksummed(null);
      setError("Invalid Ethereum address");
    }
  }, [inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setChecksummed(null);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleChecksum();
    }
  };

  const handleCopy = async () => {
    if (checksummed) {
      await navigator.clipboard.writeText(checksummed);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col">
      <button
        onClick={() => setIsDark(!isDark)}
        className="fixed top-4 right-4 p-2 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors"
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark ? (
          <svg className="w-5 h-5 text-neutral-200" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-neutral-700" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </button>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="relative max-w-xl w-full">
          {/* Decorative squares */}
          {Array.from({ length: SQUARE_COUNT }, (_, i) => (
            <div
              key={i}
              className="absolute border border-neutral-300 dark:border-neutral-700 rounded-xl pointer-events-none"
              style={{
                inset: `-${(i + 1) * SQUARE_STEP + SQUARE_STEP_INCREMENT * ((i + 1) * i) / 2}px`,
                opacity: 1 - (i + 1) / (SQUARE_COUNT + 1),
                transform: `rotate(${mousePos.x * SQUARE_ROTATION * (i + 1)}deg) translate(${mousePos.x * i * PARALLAX_MULTIPLIER}px, ${mousePos.y * i * PARALLAX_MULTIPLIER}px)`,
              }}
            />
          ))}
          <div className="relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-8">
          <h1 className="text-2xl font-normal text-center mb-6">
            ETH Address Checksummer
          </h1>

          <label htmlFor="eth-address" className="sr-only">
            Ethereum Address
          </label>
          <input
            id="eth-address"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleChecksum}
            placeholder="0x..."
            className={`w-full rounded-md px-4 py-3 focus:outline-none focus:ring-2 placeholder-neutral-400 dark:placeholder-neutral-500 border ${
              error
                ? "bg-red-100/50 dark:bg-red-900/30 border-red-500 dark:border-red-500 text-red-600 dark:text-red-400 focus:ring-4 focus:ring-red-400/60 dark:focus:ring-red-800/60"
                : "bg-neutral-50 dark:bg-neutral-800 border-neutral-200/50 dark:border-neutral-700 focus:ring-neutral-100 dark:focus:ring-neutral-600/20 dark:text-white"
            }`}
          />

          <button
            onClick={handleChecksum}
            disabled={!inputValue.trim()}
            className="w-full mt-4 rounded-md px-4 py-3 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border border-neutral-900 dark:border-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Checksum
          </button>

          {checksummed && (
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
              <div className="flex items-start gap-3">
                <p className="font-mono text-sm break-all flex-1 text-green-600 dark:text-green-300">
                  {checksummed}
                </p>
                <button
                  onClick={handleCopy}
                  className="shrink-0 px-3 py-1 text-xs bg-green-100 dark:bg-green-800 hover:bg-green-200 dark:hover:bg-green-700 text-green-600 dark:text-green-300 rounded-lg transition-colors"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          )}

          </div>
        </div>
      </main>

      <footer className="py-6 text-center">
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Hosted on{" "}
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
