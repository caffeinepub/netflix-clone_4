import { Link } from '@tanstack/react-router';
import { Search, Home, Heart, Bookmark, Upload } from 'lucide-react';
import LoginButton from './LoginButton';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2">
                <div className="text-2xl font-bold bg-gradient-to-r from-[oklch(0.65_0.25_25)] to-[oklch(0.75_0.20_50)] bg-clip-text text-transparent">
                  Saanufox
                </div>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  to="/"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Browse
                </Link>
                <Link
                  to="/search"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Search
                </Link>
                {isAuthenticated && (
                  <>
                    <Link
                      to="/favorites"
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                    >
                      <Heart className="w-4 h-4" />
                      Favorites
                    </Link>
                    <Link
                      to="/watchlist"
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                    >
                      <Bookmark className="w-4 h-4" />
                      Watchlist
                    </Link>
                    <Link
                      to="/admin/upload"
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Upload
                    </Link>
                  </>
                )}
              </nav>
            </div>
            <LoginButton />
          </div>
        </div>
      </header>

      <main className="min-h-[calc(100vh-140px)]">{children}</main>

      <footer className="border-t border-border/40 bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Saanufox. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              Built with <Heart className="w-3 h-3 text-[oklch(0.65_0.25_25)] fill-current" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-[oklch(0.65_0.25_25)] transition-colors font-medium"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
