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

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function ColorDropdowns() {
  const { settings, updateSetting } = useSettingsStore();
  const { squareColorFamily, squareColorStep } = settings;

  const selectedHex = TAILWIND_COLORS[squareColorFamily][squareColorStep];

  return (
    <div className="space-y-4">
      <div
        className="h-8 rounded border border-border"
        style={{ backgroundColor: selectedHex }}
      />

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
    </div>
  );
}
