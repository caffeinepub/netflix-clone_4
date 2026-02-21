import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useUpdateUserProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings as SettingsIcon, User, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading } = useGetCallerUserProfile();
  const updateProfile = useUpdateUserProfile();
  const [name, setName] = useState('');
  const isAuthenticated = !!identity;

  useEffect(() => {
    if (userProfile?.name) {
      setName(userProfile.name);
    }
  }, [userProfile]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 bg-black min-h-screen">
        <div className="max-w-md mx-auto text-center">
          <SettingsIcon className="w-16 h-16 mx-auto mb-4 text-white/60" />
          <h2 className="text-2xl font-bold mb-2 text-white">Login Required</h2>
          <p className="text-white/60 mb-6">
            Please log in to access settings.
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
          <p className="text-white/60">Loading settings...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    try {
      await updateProfile.mutateAsync({ name: name.trim() });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-black min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-white">Settings</h1>

        <Card className="bg-card/50 backdrop-blur border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <User className="w-5 h-5" />
              Profile Settings
            </CardTitle>
            <CardDescription className="text-white/60">Update your profile information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="bg-background/50 border-white/20 text-white"
                  disabled={updateProfile.isPending}
                />
                <p className="text-sm text-white/60">
                  This is the name that will be displayed across the platform.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="submit"
                  disabled={updateProfile.isPending || !name.trim()}
                  className="gap-2 bg-netflix-red hover:bg-netflix-red/90 text-white"
                >
                  {updateProfile.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
