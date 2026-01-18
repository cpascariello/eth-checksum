import { Settings, X } from 'lucide-react';
import { useSettingsStore } from '@/store/settings';
import { ColorPicker } from './ColorPicker';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';

export function SettingsPanel() {
  const { isSettingsPanelOpen, toggleSettingsPanel } = useSettingsStore();

  return (
    <>
      {/* Backdrop - closes panel when clicking outside */}
      {isSettingsPanelOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={toggleSettingsPanel}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full z-50 transition-transform duration-300 ease-in-out ${
          isSettingsPanelOpen ? 'translate-x-0' : 'translate-x-[400px]'
        }`}
      >
        {/* Toggle Button - positioned to the left of the panel */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSettingsPanel}
          className="absolute top-5 -left-[60px] bg-background border border-border shadow-sm"
          aria-label={isSettingsPanelOpen ? 'Close settings' : 'Open settings'}
          aria-expanded={isSettingsPanelOpen}
        >
          {isSettingsPanelOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Settings className="h-4 w-4" />
          )}
        </Button>

        {/* Panel */}
        <div className="h-full w-[400px] bg-background border-l border-border shadow-lg p-6">
          {/* Theme Toggle - top right of panel */}
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>

          <h2 className="pt-8 text-lg font-semibold">Settings</h2>

          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Square Color
              </h3>
              <ColorPicker />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
