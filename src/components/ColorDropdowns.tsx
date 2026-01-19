import { useSettingsStore } from '@/store/settings';
import {
  TAILWIND_COLOR_FAMILIES,
  TAILWIND_COLOR_STEPS,
  TAILWIND_COLORS,
  type TailwindColorFamily,
  type TailwindColorStep,
} from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dices, Shuffle } from 'lucide-react';

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function ColorDropdowns() {
  const { settings, updateSetting, randomizeColors, randomizeSingleColor } = useSettingsStore();
  const { squareColorFamily, squareColorStep, randomColors } = settings;

  const selectedHex = TAILWIND_COLORS[squareColorFamily][squareColorStep];
  const hasRandomColors = randomColors.length > 0;

  return (
    <div className="space-y-4">
      {hasRandomColors ? (
        <div className="h-8 rounded border border-border overflow-hidden flex">
          {randomColors.slice(0, 20).map((color, i) => (
            <div
              key={i}
              className="flex-1 h-full"
              style={{ backgroundColor: TAILWIND_COLORS[color.family][color.step] }}
            />
          ))}
        </div>
      ) : (
        <div
          className="h-8 rounded border border-border"
          style={{ backgroundColor: selectedHex }}
        />
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-thin">Color Family</label>
          <Select
            value={squareColorFamily}
            onValueChange={(v) => updateSetting('squareColorFamily', v as TailwindColorFamily)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TAILWIND_COLOR_FAMILIES.map((family) => (
                <SelectItem key={family} value={family}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-sm border border-border"
                      style={{ backgroundColor: TAILWIND_COLORS[family][500] }}
                    />
                    {capitalize(family)}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-thin">Color Shade</label>
          <Select
            value={String(squareColorStep)}
            onValueChange={(v) => updateSetting('squareColorStep', Number(v) as TailwindColorStep)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TAILWIND_COLOR_STEPS.map((step) => (
                <SelectItem key={step} value={String(step)}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-sm border border-border"
                      style={{ backgroundColor: TAILWIND_COLORS[squareColorFamily][step] }}
                    />
                    {step}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border-t border-border my-6" />

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={randomizeSingleColor}
        >
          <Dices className="w-4 h-4 mr-2" />
          Random Color
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={randomizeColors}
        >
          <Shuffle className="w-4 h-4 mr-2" />
          Randomize Each
        </Button>
      </div>
    </div>
  );
}
