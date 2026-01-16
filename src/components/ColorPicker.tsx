import { useSettingsStore } from '../store/settings';
import { COLORS, COLOR_VALUES } from '../types';

export function ColorPicker() {
  const { settings, updateSetting } = useSettingsStore();
  const { squareColor } = settings;

  return (
    <div className="flex gap-2 flex-wrap">
      {COLORS.map((color) => (
        <button
          key={color}
          onClick={() => updateSetting('squareColor', color)}
          className={`w-6 h-6 rounded-full transition-all duration-200 ${
            squareColor === color
              ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-neutral-900 ring-neutral-400 dark:ring-neutral-500 scale-110'
              : 'hover:scale-105'
          }`}
          style={{ backgroundColor: COLOR_VALUES[color].picker }}
          aria-label={`Set square color to ${color}`}
          aria-pressed={squareColor === color}
        />
      ))}
    </div>
  );
}
