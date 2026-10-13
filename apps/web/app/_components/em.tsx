export function Em({ children }: { children: React.ReactNode }) {
  return (
    <em className="font-serif font-medium tracking-[-0.025em] text-primary italic">
      {children}
    </em>
  );
}
