import { Settings, X } from 'lucide-react';
import { useSettingsStore } from '@/store/settings';
import { ColorPicker } from './ColorPicker';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

export function SettingsPanel() {
  const { isSettingsPanelOpen, toggleSettingsPanel } = useSettingsStore();

  return (
    <>
      {/* Toggle Button - always visible at top right */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSettingsPanel}
        className="fixed top-5 right-5 z-50 bg-background border border-border shadow-sm"
        aria-label={isSettingsPanelOpen ? 'Close settings' : 'Open settings'}
        aria-expanded={isSettingsPanelOpen}
      >
        {isSettingsPanelOpen ? (
          <X className="h-4 w-4" />
        ) : (
          <Settings className="h-4 w-4" />
        )}
      </Button>

      <Sheet open={isSettingsPanelOpen} onOpenChange={toggleSettingsPanel}>
        <SheetContent side="right" className="w-[400px] sm:max-w-[400px]">
          {/* Theme Toggle - top right of panel (offset for close button) */}
          <div className="absolute top-4 right-12">
            <ThemeToggle />
          </div>

          <SheetHeader className="pt-8">
            <SheetTitle>Settings</SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Color Section */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Square Color
              </h3>
              <ColorPicker />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
