"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main className="flex min-h-dvh items-center justify-center px-4 text-center">
          <div>
            <h1 className="text-2xl font-semibold">
              The application could not load
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Check the connection and try again.
            </p>
            <button
              type="button"
              className="mt-6 min-h-11 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
              onClick={reset}
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
