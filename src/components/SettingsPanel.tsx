import { Settings, X, RotateCcw } from 'lucide-react';
import { useSettingsStore } from '@/store/settings';
import { ColorPicker } from './ColorPicker';
import { ThemeToggle } from './ThemeToggle';
import { WalletButton } from './WalletButton';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

export function SettingsPanel() {
  const {
    isSettingsPanelOpen,
    toggleSettingsPanel,
    settings,
    updateSetting,
    resetToDefaults,
  } = useSettingsStore();

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
        className={`fixed top-0 right-0 h-full w-[416px] z-50 transition-transform duration-300 ease-in-out ${
          isSettingsPanelOpen ? 'translate-x-0' : 'translate-x-[416px]'
        }`}
      >
        {/* Toggle Button - positioned to the left of the panel */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSettingsPanel}
          className="absolute top-5 -left-[45px] bg-background border border-border shadow-sm"
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
        <div className="absolute top-4 bottom-4 right-4 w-[400px] rounded-md bg-background border border-border shadow-lg p-6 overflow-y-auto">
          {/* Theme Toggle - top right of panel */}
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>

          <h2 className="pt-8 text-lg font-semibold">Settings</h2>

          <div className="mt-6 space-y-6">
            {/* Wallet section */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Wallet
              </h3>
              <WalletButton />
            </div>

            {/* Square Color section */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Square Color
              </h3>
              <ColorPicker />
            </div>

            {/* Square Settings section */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-4">
                Square Settings
              </h3>
              <div className="space-y-5">
                {/* Square Count */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Square Count</span>
                    <span className="text-muted-foreground tabular-nums">
                      {settings.squareCount}
                    </span>
                  </div>
                  <Slider
                    value={[settings.squareCount]}
                    onValueChange={([value]) => updateSetting('squareCount', value)}
                    min={10}
                    max={100}
                    step={1}
                  />
                </div>

                {/* Square Spacing */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Square Spacing</span>
                    <span className="text-muted-foreground tabular-nums">
                      {settings.squareStep}
                    </span>
                  </div>
                  <Slider
                    value={[settings.squareStep]}
                    onValueChange={([value]) => updateSetting('squareStep', value)}
                    min={1}
                    max={20}
                    step={1}
                  />
                </div>

                {/* Spacing Acceleration */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Spacing Acceleration</span>
                    <span className="text-muted-foreground tabular-nums">
                      {settings.squareStepIncrement.toFixed(2)}
                    </span>
                  </div>
                  <Slider
                    value={[settings.squareStepIncrement]}
                    onValueChange={([value]) => updateSetting('squareStepIncrement', value)}
                    min={0}
                    max={1}
                    step={0.05}
                  />
                </div>

                {/* Rotation */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Rotation</span>
                    <span className="text-muted-foreground tabular-nums">
                      {settings.squareRotation.toFixed(1)}
                    </span>
                  </div>
                  <Slider
                    value={[settings.squareRotation]}
                    onValueChange={([value]) => updateSetting('squareRotation', value)}
                    min={0}
                    max={5}
                    step={0.1}
                  />
                </div>

                {/* Parallax */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Parallax</span>
                    <span className="text-muted-foreground tabular-nums">
                      {settings.parallaxMultiplier.toFixed(1)}
                    </span>
                  </div>
                  <Slider
                    value={[settings.parallaxMultiplier]}
                    onValueChange={([value]) => updateSetting('parallaxMultiplier', value)}
                    min={0}
                    max={10}
                    step={0.5}
                  />
                </div>
              </div>
            </div>

            {/* Reset Button */}
            <div className="pt-2">
              <Button
                variant="outline"
                onClick={resetToDefaults}
                className="w-full"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset to Defaults
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
