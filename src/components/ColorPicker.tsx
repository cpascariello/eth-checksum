import { useSettingsStore } from '../store/settings';
import { COLORS, COLOR_VALUES } from '../types';

export function ColorPicker() {
  const { settings, updateSetting } = useSettingsStore();
  const { squareColor } = settings;

  return (
    <div className="fixed top-6 right-14 z-50 flex gap-1 flex-wrap max-w-64 justify-end items-center">
      {COLORS.map((color) => (
        <button
          key={color}
          onClick={() => updateSetting('squareColor', color)}
          className={`w-6 h-6 rounded-full transition-transform ${squareColor === color ? 'ring-2 ring-white dark:ring-neutral-800' : 'hover:opacity-80'}`}
          style={{ backgroundColor: COLOR_VALUES[color].picker }}
          aria-label={`Set square color to ${color}`}
        />
      ))}
    </div>
  );
}
