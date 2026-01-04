export const BorderedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-auto min-h-screen container lg:max-w-8xl border-x">
      {children}
    </div>
  );
};
