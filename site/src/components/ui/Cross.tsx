export default function Cross({ className = "", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <path d="M14.5 3h11v11.5H37v11H25.5V37h-11V25.5H3v-11h11.5z" fill={color} />
    </svg>
  );
}
