export function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 p-4 md:flex-row md:gap-10">
      <div className="flex w-full max-w-md justify-center md:max-w-2xl">
        <img
          className="h-auto max-h-56 w-full max-w-xs object-contain md:max-h-120 md:max-w-md lg:max-w-md"
          src="src/assets/login.png"
          alt="Login image"
        />
      </div>
      <div className="flex w-full max-w-md items-center justify-center">
        {children}
      </div>
    </div>
  );
}
