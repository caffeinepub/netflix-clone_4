import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import Browse from './pages/Browse';
import Watch from './pages/Watch';
import Search from './pages/Search';
import Category from './pages/Category';
import Favorites from './pages/Favorites';
import Watchlist from './pages/Watchlist';
import AdminUpload from './pages/AdminUpload';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import ProfileSetupModal from './components/ProfileSetupModal';

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Layout>
        <Outlet />
      </Layout>
      <ProfileSetupModal />
      <Toaster />
    </>
  ),
});

const browseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Browse,
});

const watchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/watch/$videoId',
  component: Watch,
});

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/search',
  component: Search,
});

const categoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/category/$categoryName',
  component: Category,
});

const favoritesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/favorites',
  component: Favorites,
});

const watchlistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/watchlist',
  component: Watchlist,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: Profile,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: Settings,
});

const adminUploadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/upload',
  component: AdminUpload,
});

const analyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/analytics',
  component: Analytics,
});

const routeTree = rootRoute.addChildren([
  browseRoute,
  watchRoute,
  searchRoute,
  categoryRoute,
  favoritesRoute,
  watchlistRoute,
  profileRoute,
  settingsRoute,
  adminUploadRoute,
  analyticsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
