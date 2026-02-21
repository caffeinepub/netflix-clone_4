import { Link } from '@tanstack/react-router';
import { Search, Home, Heart, Bookmark, Upload, User, Settings, BarChart3 } from 'lucide-react';
import LoginButton from './LoginButton';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black via-black/95 to-transparent backdrop-blur-sm transition-all">
        <div className="container mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2">
                <div className="text-2xl md:text-3xl font-bold text-netflix-red tracking-tight">
                  SAANUFOX
                </div>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  to="/"
                  className="text-sm font-medium text-white/90 hover:text-white transition-colors relative group"
                >
                  Home
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-netflix-red transition-all group-hover:w-full" />
                </Link>
                <Link
                  to="/search"
                  className="text-sm font-medium text-white/90 hover:text-white transition-colors relative group"
                >
                  Search
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-netflix-red transition-all group-hover:w-full" />
                </Link>
                {isAuthenticated && (
                  <>
                    <Link
                      to="/favorites"
                      className="text-sm font-medium text-white/90 hover:text-white transition-colors relative group"
                    >
                      My List
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-netflix-red transition-all group-hover:w-full" />
                    </Link>
                    <Link
                      to="/watchlist"
                      className="text-sm font-medium text-white/90 hover:text-white transition-colors relative group"
                    >
                      Watchlist
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-netflix-red transition-all group-hover:w-full" />
                    </Link>
                    <Link
                      to="/analytics"
                      className="text-sm font-medium text-white/90 hover:text-white transition-colors relative group"
                    >
                      Analytics
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-netflix-red transition-all group-hover:w-full" />
                    </Link>
                  </>
                )}
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/search" className="md:hidden">
                <Search className="w-5 h-5 text-white/90 hover:text-white transition-colors" />
              </Link>
              {isAuthenticated && (
                <div className="flex items-center gap-3">
                  <Link to="/analytics" className="md:hidden">
                    <BarChart3 className="w-5 h-5 text-white/90 hover:text-white transition-colors" />
                  </Link>
                  <Link to="/admin/upload">
                    <Upload className="w-5 h-5 text-white/90 hover:text-white transition-colors" />
                  </Link>
                  <Link to="/profile">
                    <User className="w-5 h-5 text-white/90 hover:text-white transition-colors" />
                  </Link>
                  <Link to="/settings">
                    <Settings className="w-5 h-5 text-white/90 hover:text-white transition-colors" />
                  </Link>
                </div>
              )}
              <LoginButton />
            </div>
          </div>
        </div>
      </header>

      <main className="min-h-screen pt-16">{children}</main>

      <footer className="border-t border-white/10 bg-black">
        <div className="container mx-auto px-4 md:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/60">
              © {new Date().getFullYear()} Saanufox. All rights reserved.
            </p>
            <p className="text-sm text-white/60 flex items-center gap-1">
              Built with <Heart className="w-3 h-3 text-netflix-red fill-current" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-netflix-red transition-colors font-medium"
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
