export function AdaptiveGradientBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 animate-[gradient-float_16s_ease-in-out_infinite] overflow-hidden bg-[radial-gradient(circle_at_20%_20%,rgba(110,195,244,0.35),transparent_32%),radial-gradient(circle_at_80%_30%,rgba(92,76,133,0.32),transparent_34%),radial-gradient(circle_at_50%_90%,rgba(49,58,185,0.28),transparent_38%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(110,195,244,0.20),transparent_32%),radial-gradient(circle_at_80%_30%,rgba(92,76,133,0.28),transparent_34%),radial-gradient(circle_at_50%_90%,rgba(49,58,185,0.24),transparent_38%)]"
    />
  );
}
