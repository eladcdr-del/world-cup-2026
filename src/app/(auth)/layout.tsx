export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-bl from-blue-950 via-blue-900 to-green-900 px-4 py-8">
      <div className="mb-6 flex flex-col items-center gap-3">
        <div className="flex size-16 items-center justify-center rounded-full bg-white/10 text-4xl backdrop-blur-sm">
          {"\u26BD"}
        </div>
        <h1 className="text-3xl font-bold text-white">
          {"מונדיאל 2026"}
        </h1>
      </div>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
