import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetUserCount, useIsCallerAdmin } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Loader2, ShieldAlert } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export default function Analytics() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const { data: userCount, isLoading: isCountLoading, error } = useGetUserCount();

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 bg-black min-h-screen">
        <div className="max-w-md mx-auto text-center">
          <Users className="w-16 h-16 mx-auto mb-4 text-white/60" />
          <h2 className="text-2xl font-bold mb-2 text-white">Login Required</h2>
          <p className="text-white/60 mb-6">
            Please log in to view analytics.
          </p>
        </div>
      </div>
    );
  }

  if (isAdminLoading) {
    return (
      <div className="container mx-auto px-4 py-16 bg-black min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-netflix-red" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16 bg-black min-h-screen">
        <div className="max-w-md mx-auto text-center">
          <ShieldAlert className="w-16 h-16 mx-auto mb-4 text-netflix-red" />
          <h2 className="text-2xl font-bold mb-2 text-white">Access Denied</h2>
          <p className="text-white/60 mb-6">
            You do not have permission to access analytics. Only administrators can view this page.
          </p>
          <Link to="/">
            <Button className="bg-netflix-red hover:bg-netflix-red/90">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 bg-black min-h-screen">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2 text-white">Error Loading Analytics</h2>
          <p className="text-white/60">
            {error instanceof Error ? error.message : 'Failed to load user count'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 bg-black min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-white">Analytics Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-gradient-to-br from-netflix-red/20 to-netflix-red/5 border-netflix-red/30 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">
                Total Registered Users
              </CardTitle>
              <Users className="h-5 w-5 text-netflix-red" />
            </CardHeader>
            <CardContent>
              {isCountLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-netflix-red" />
                </div>
              ) : (
                <>
                  <div className="text-3xl font-bold text-white">
                    {userCount !== undefined ? Number(userCount).toLocaleString() : '0'}
                  </div>
                  <p className="text-xs text-white/60 mt-1">
                    Users with profiles
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
