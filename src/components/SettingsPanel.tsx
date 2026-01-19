import { useState } from 'react';
import { Settings, X, RotateCcw, ChevronDown } from 'lucide-react';
import { useSettingsStore } from '@/store/settings';
import { ColorDropdowns } from './ColorDropdowns';
import { ThemeToggle } from './ThemeToggle';
import { WalletButton } from './WalletButton';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

const MULTIPLIERS = [1, 2, 5, 10] as const;

interface SliderWithMultipliersProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  baseMax: number;
  step: number;
  formatValue?: (value: number) => string;
}

function SliderWithMultipliers({
  label,
  value,
  onChange,
  min,
  baseMax,
  step,
  formatValue = (v) => String(v),
}: SliderWithMultipliersProps) {
  const [multiplier, setMultiplier] = useState(1);
  const max = baseMax * multiplier;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="font-thin">{label}</span>
        <span className="text-muted-foreground tabular-nums">
          {formatValue(value)}
        </span>
      </div>
      <div className="flex gap-1 mb-4">
        {MULTIPLIERS.map((mult) => (
          <button
            key={mult}
            onClick={() => setMultiplier(mult)}
            className={`px-2 py-0.5 text-xs rounded border transition-colors ${
              multiplier === mult
                ? 'border-neutral-600 bg-accent text-accent-foreground'
                : 'border-border bg-background hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            {mult}x
          </button>
        ))}
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
}

function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-border rounded-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between text-base font-semibold w-full text-left p-4"
      >
        {title}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? '' : '-rotate-90'}`}
        />
      </button>
      <div
        className={`grid transition-all duration-200 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-4 py-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SettingsPanel() {
  const {
    isSettingsPanelOpen,
    toggleSettingsPanel,
    settings,
    updateSetting,
    resetToDefaults,
  } = useSettingsStore();
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    resetToDefaults();
    setResetKey((k) => k + 1);
  };

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
        className={`fixed top-0 right-0 h-full w-[496px] z-50 transition-transform duration-300 ease-in-out ${
          isSettingsPanelOpen ? 'translate-x-0' : 'translate-x-[486px]'
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
        <div className="absolute top-4 bottom-4 right-4 w-[480px] rounded-md bg-background border border-border shadow-lg p-6 overflow-y-auto">
          {/* Top row - Wallet left, Theme right */}
          <div className="flex justify-between items-center mb-12">
            <WalletButton />
            <ThemeToggle />
          </div>

          <div className="space-y-2">
            {/* Square Color section */}
            <CollapsibleSection title="Square Color">
              <ColorDropdowns />
            </CollapsibleSection>

            {/* Square Settings section */}
            <CollapsibleSection title="Square Settings">
              <div className="space-y-12">
                {/* Square Count - full width */}
                <SliderWithMultipliers
                  key={`squareCount-${resetKey}`}
                  label="Square Count"
                  value={settings.squareCount}
                  onChange={(v) => updateSetting('squareCount', v)}
                  min={10}
                  baseMax={100}
                  step={1}
                />

                {/* Spacing row - 2 columns */}
                <div className="grid grid-cols-2 gap-4">
                  <SliderWithMultipliers
                    key={`squareStep-${resetKey}`}
                    label="Square Spacing"
                    value={settings.squareStep}
                    onChange={(v) => updateSetting('squareStep', v)}
                    min={1}
                    baseMax={20}
                    step={1}
                  />

                  <SliderWithMultipliers
                    key={`squareStepIncrement-${resetKey}`}
                    label="Spacing Acceleration"
                    value={settings.squareStepIncrement}
                    onChange={(v) => updateSetting('squareStepIncrement', v)}
                    min={0}
                    baseMax={1}
                    step={0.05}
                    formatValue={(v) => v.toFixed(2)}
                  />
                </div>

                {/* Motion row - 2 columns */}
                <div className="grid grid-cols-2 gap-4">
                  <SliderWithMultipliers
                    key={`squareRotation-${resetKey}`}
                    label="Rotation"
                    value={settings.squareRotation}
                    onChange={(v) => updateSetting('squareRotation', v)}
                    min={0}
                    baseMax={5}
                    step={0.1}
                    formatValue={(v) => v.toFixed(1)}
                  />

                  <SliderWithMultipliers
                    key={`parallaxMultiplier-${resetKey}`}
                    label="Parallax"
                    value={settings.parallaxMultiplier}
                    onChange={(v) => updateSetting('parallaxMultiplier', v)}
                    min={0}
                    baseMax={10}
                    step={0.5}
                    formatValue={(v) => v.toFixed(1)}
                  />
                </div>
              </div>
            </CollapsibleSection>

            {/* Reset Button */}
            <div className="pt-2">
              <Button
                variant="outline"
                onClick={handleReset}
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
