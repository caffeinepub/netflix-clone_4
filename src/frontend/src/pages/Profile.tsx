import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Key, Loader2 } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function Profile() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading } = useGetCallerUserProfile();
  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 bg-black min-h-screen">
        <div className="max-w-md mx-auto text-center">
          <User className="w-16 h-16 mx-auto mb-4 text-white/60" />
          <h2 className="text-2xl font-bold mb-2 text-white">Login Required</h2>
          <p className="text-white/60 mb-6">
            Please log in to view your profile.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 bg-black min-h-screen">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-netflix-red mb-4" />
          <p className="text-white/60">Loading profile...</p>
        </div>
      </div>
    );
  }

  const principal = identity.getPrincipal().toString();

  return (
    <div className="container mx-auto px-4 py-8 bg-black min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-white">My Profile</h1>

        <div className="space-y-6">
          <Card className="bg-card/50 backdrop-blur border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
              <CardDescription className="text-white/60">Your account details and information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-white/60">Name</label>
                <p className="text-lg font-semibold mt-1 text-white">
                  {userProfile?.name || 'Not set'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-white/60 flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  Internet Identity Principal
                </label>
                <p className="text-sm font-mono mt-1 break-all bg-white/5 p-3 rounded-md text-white/80">
                  {principal}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Link to="/settings">
              <Button className="bg-netflix-red hover:bg-netflix-red/90 text-white">Edit Profile</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
