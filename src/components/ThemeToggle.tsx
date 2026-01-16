import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSettingsStore } from '@/store/settings';

export function ThemeToggle() {
  const { isDark, toggleTheme } = useSettingsStore();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-neutral-400" />
      ) : (
        <Moon className="h-4 w-4 text-neutral-500" />
      )}
    </Button>
  );
}
