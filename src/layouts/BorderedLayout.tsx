export const BorderedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-auto min-h-screen down-sm:max-w-[calc(100vw-40px)] container lg:max-w-8xl border-x">
      {children}
    </div>
  );
};
