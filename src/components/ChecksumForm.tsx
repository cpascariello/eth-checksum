import { useState, useCallback } from 'react';
import { getAddress } from 'ethers';

export function ChecksumForm() {
  const [inputValue, setInputValue] = useState('');
  const [checksummed, setChecksummed] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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
      setError('Invalid Ethereum address');
    }
  }, [inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setChecksummed(null);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
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
    <div className="relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-8">
      <h1 className="text-xl font-thin text-center mb-6">
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
            ? 'bg-red-100/50 dark:bg-red-900/30 border-red-500 dark:border-red-500 text-red-600 dark:text-red-400 focus:ring-4 focus:ring-red-400/60 dark:focus:ring-red-800/60'
            : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200/50 dark:border-neutral-700 focus:ring-neutral-100 dark:focus:ring-neutral-600/20 dark:text-white'
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
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
