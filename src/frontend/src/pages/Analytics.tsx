import { BarChart3, Users, Loader2 } from 'lucide-react';
import { useGetUserCount } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import LoginButton from '../components/LoginButton';

export default function Analytics() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: userCount, isLoading, error } = useGetUserCount();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Authentication Required</CardTitle>
            <CardDescription className="text-zinc-400">
              Please login to view analytics
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <LoginButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-8 h-8 text-netflix-red" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">Analytics</h1>
          </div>
          <p className="text-zinc-400">Platform statistics and insights</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6 bg-red-950/50 border-red-900">
            <AlertDescription className="text-red-200">
              {error instanceof Error ? error.message : 'Failed to load analytics data'}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-netflix-red/20 to-netflix-red/5 border-netflix-red/30 hover:border-netflix-red/50 transition-all">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-netflix-red" />
                Total Registered Users
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Users who have created profiles
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center gap-2 text-zinc-400">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : (
                <div className="text-5xl font-bold text-white">
                  {userCount !== undefined ? Number(userCount).toLocaleString() : '0'}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all">
            <CardHeader>
              <CardTitle className="text-lg text-white">Coming Soon</CardTitle>
              <CardDescription className="text-zinc-400">
                More analytics features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-zinc-600">
                --
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all">
            <CardHeader>
              <CardTitle className="text-lg text-white">Coming Soon</CardTitle>
              <CardDescription className="text-zinc-400">
                More analytics features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-zinc-600">
                --
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
