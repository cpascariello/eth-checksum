import { useState, useCallback } from 'react';
import { utils } from 'ethers5';
const { getAddress } = utils;
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
    <Card className="relative z-10 shadow-xl bg-white dark:bg-neutral-950">
      <CardHeader>
        <CardTitle className="text-2xl font-jetbrains-mono font-extrabold text-neutral-700 dark:text-neutral-400 text-center">
          ETH Address Checksummer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <label htmlFor="eth-address" className="sr-only">
          Ethereum Address
        </label>
        <Input
          id="eth-address"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleChecksum}
          placeholder="0x..."
          className={cn(
            "h-12",
            error && "border-red-500 bg-red-100/50 dark:bg-red-900/30 text-red-600 dark:text-red-400 focus-visible:ring-red-400/60 dark:focus-visible:ring-red-800/60"
          )}
        />

        <Button
          onClick={handleChecksum}
          disabled={!inputValue.trim()}
          className="w-full h-12 font-jetbrains-mono font-extrabold"
        >
          Checksum
        </Button>

        {checksummed && (
          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-3">
                <p className="font-mono text-sm text-green-600 dark:text-green-300">
                  {checksummed}
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCopy}
                  className="bg-green-100 dark:bg-green-800 hover:bg-green-200 dark:hover:bg-green-700 text-green-600 dark:text-green-300"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
