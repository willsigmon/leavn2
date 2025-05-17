import { useAuth } from '../lib/auth';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Bell, Shield, Smartphone, Sun, Moon } from 'lucide-react';

export default function Settings() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    navigate('/login');
    return null;
  }

  return (
    <div className="container max-w-5xl py-8 px-4 md:px-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/profile')} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Button>
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
        </TabsList>

        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how Leavn looks and feels on your device.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Theme preference</Label>
                    <p className="text-sm text-muted-foreground">
                      Choose between light and dark theme.
                    </p>
                  </div>
                  <div className="flex items-center border rounded-lg">
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Sun className="h-4 w-4" />
                      <span>Light</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Moon className="h-4 w-4" />
                      <span>Dark</span>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Font size</Label>
                    <p className="text-sm text-muted-foreground">
                      Adjust the size of text when reading the Bible.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">A-</Button>
                    <div className="w-[100px] h-1 bg-muted rounded-full">
                      <div className="w-1/2 h-1 bg-primary rounded-full"></div>
                    </div>
                    <Button variant="outline" size="sm">A+</Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Verse numbering</Label>
                    <p className="text-sm text-muted-foreground">
                      Show or hide verse numbers in the text.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications from Leavn.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Daily reading reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a reminder to complete your daily reading.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Weekly summaries</Label>
                    <p className="text-sm text-muted-foreground">
                      Get a summary of your study activity each week.
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">New features and updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Stay informed about new Leavn features and improvements.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account and privacy preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email address</Label>
                    <p className="text-sm text-muted-foreground">
                      {user?.email || 'No email provided'}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">Change</Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Data privacy</Label>
                    <p className="text-sm text-muted-foreground">
                      Control how your personal data is used and stored.
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Shield className="h-4 w-4 mr-2" />
                    Privacy settings
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Deactivate account</Label>
                    <p className="text-sm text-muted-foreground">
                      Temporarily disable your account.
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/10">
                    Deactivate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Devices Tab */}
        <TabsContent value="devices">
          <Card>
            <CardHeader>
              <CardTitle>Connected Devices</CardTitle>
              <CardDescription>
                Manage devices where you're logged into Leavn.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Smartphone className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium">Current browser</p>
                      <p className="text-sm text-muted-foreground">Last active: Just now</p>
                    </div>
                  </div>
                  <div className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                    Current
                  </div>
                </div>
              </div>

              <Button className="w-full mt-4">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}