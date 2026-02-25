export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="container mx-auto max-w-screen-xl px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground">
          © {currentYear} Personal Portfolio. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
