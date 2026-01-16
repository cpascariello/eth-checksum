import { useSettingsStore } from '../store/settings';
import { ColorPicker } from './ColorPicker';
import { ThemeToggle } from './ThemeToggle';

export function SettingsPanel() {
  const { isSettingsPanelOpen, toggleSettingsPanel } = useSettingsStore();

  return (
    <aside
      className={`
        fixed top-0 right-0 h-full z-40
        w-[400px] bg-white dark:bg-neutral-900
        border-l border-neutral-200 dark:border-neutral-800
        shadow-lg
        transform transition-transform duration-300 ease-in-out
        ${isSettingsPanelOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
    >
      {/* Toggle Button - positioned at left edge of panel */}
      <button
        onClick={toggleSettingsPanel}
        className="absolute top-5 -left-12 z-50 p-2 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors"
        aria-label={isSettingsPanelOpen ? 'Close settings' : 'Open settings'}
        aria-expanded={isSettingsPanelOpen}
      >
        {isSettingsPanelOpen ? (
          <svg
            className="w-4 h-4 text-neutral-700 dark:text-neutral-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-4 h-4 text-neutral-700 dark:text-neutral-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        )}
      </button>

      {/* Theme Toggle - top right of panel */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="p-6 pt-16">
        <h2 className="text-lg font-semibold mb-6 text-neutral-800 dark:text-neutral-100">
          Settings
        </h2>

        {/* Color Section */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-3">
            Square Color
          </h3>
          <ColorPicker />
        </div>
      </div>
    </aside>
  );
}
