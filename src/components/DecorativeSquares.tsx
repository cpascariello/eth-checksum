import { useSettingsStore } from '../store/settings';
import { COLOR_VALUES } from '../types';

interface DecorativeSquaresProps {
  mousePos: { x: number; y: number };
}

export function DecorativeSquares({ mousePos }: DecorativeSquaresProps) {
  const { settings, isDark } = useSettingsStore();
  const { squareCount, squareStep, squareStepIncrement, squareRotation, parallaxMultiplier, squareColor } = settings;

  return (
    <>
      {Array.from({ length: squareCount }, (_, i) => (
        <div
          key={i}
          className="absolute border rounded-xl pointer-events-none"
          style={{
            inset: `-${(i + 1) * squareStep + squareStepIncrement * ((i + 1) * i) / 2}px`,
            opacity: 1 - (i + 1) / (squareCount + 1),
            transform: `rotate(${mousePos.x * squareRotation * (i + 1)}deg) translate(${mousePos.x * i * parallaxMultiplier}px, ${mousePos.y * i * parallaxMultiplier}px)`,
            borderColor: isDark ? COLOR_VALUES[squareColor].dark : COLOR_VALUES[squareColor].light,
          }}
        />
      ))}
    </>
  );
}
