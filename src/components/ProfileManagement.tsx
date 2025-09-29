import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Camera,
  Save,
  Shield,
  Key,
  Bell,
  Smartphone,
  Globe,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  bio: string;
  avatar: string;
  role: string;
  schoolId: string;
  emergencyContact: string;
  language: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

const mockProfile: ProfileData = {
  name: 'Sarah Johnson',
  email: 'sarah.johnson@email.com',
  phone: '+91 98765 43210',
  address: '123 Main Street, City, State - 123456',
  dateOfBirth: '1985-03-15',
  bio: 'Parent of Emily Johnson (Grade 5A). Active member of the parent community and volunteer for school events.',
  avatar: '',
  role: 'Parent',
  schoolId: 'SMS2024',
  emergencyContact: '+91 98765 43211',
  language: 'English',
  notifications: {
    email: true,
    sms: true,
    push: false
  }
};

export const ProfileManagement = () => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<ProfileData>(mockProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleSave = () => {
    toast.success('Profile updated successfully');
    setIsEditing(false);
  };

  const handlePasswordChange = () => {
    if (passwords.new !== passwords.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwords.new.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    toast.success('Password changed successfully');
    setPasswords({ current: '', new: '', confirm: '' });
    setShowPasswordChange(false);
  };

  const handleAvatarUpload = () => {
    toast.success('Avatar uploaded successfully');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="shadow-sm hover:shadow-md transition-shadow">
          <User className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-background to-background-secondary">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-2xl text-foreground">Profile Management</DialogTitle>
          <DialogDescription>
            Manage your personal information, security settings, and preferences
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-muted/50">
              <TabsTrigger value="profile">Profile Info</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
            </TabsList>

            {/* Profile Information Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-foreground">Personal Information</CardTitle>
                      <CardDescription>Update your personal details and contact information</CardDescription>
                    </div>
                    <Button
                      variant={isEditing ? "default" : "outline"}
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      ) : (
                        <>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24 ring-2 ring-primary/20 ring-offset-2">
                        <AvatarImage src={profile.avatar} alt={profile.name} />
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary text-xl font-semibold">
                          {profile.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                          onClick={handleAvatarUpload}
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-foreground">{profile.name}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{profile.role}</Badge>
                        <Badge variant="outline">{profile.schoolId}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{profile.email}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Profile Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-foreground font-medium">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-muted/50' : ''}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground font-medium">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                          disabled={!isEditing}
                          className={`pl-10 ${!isEditing ? 'bg-muted/50' : ''}`}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-foreground font-medium">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                          disabled={!isEditing}
                          className={`pl-10 ${!isEditing ? 'bg-muted/50' : ''}`}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergency" className="text-foreground font-medium">Emergency Contact</Label>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="emergency"
                          type="tel"
                          value={profile.emergencyContact}
                          onChange={(e) => setProfile(prev => ({ ...prev, emergencyContact: e.target.value }))}
                          disabled={!isEditing}
                          className={`pl-10 ${!isEditing ? 'bg-muted/50' : ''}`}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dob" className="text-foreground font-medium">Date of Birth</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="dob"
                          type="date"
                          value={profile.dateOfBirth}
                          onChange={(e) => setProfile(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                          disabled={!isEditing}
                          className={`pl-10 ${!isEditing ? 'bg-muted/50' : ''}`}
                        />
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address" className="text-foreground font-medium">Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="address"
                          value={profile.address}
                          onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                          disabled={!isEditing}
                          className={`pl-10 ${!isEditing ? 'bg-muted/50' : ''}`}
                        />
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="bio" className="text-foreground font-medium">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                        disabled={!isEditing}
                        className={`min-h-[100px] ${!isEditing ? 'bg-muted/50' : ''}`}
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-3">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSave}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-primary" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>Manage your account security and authentication methods</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Password Change */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-foreground">Password</h4>
                        <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setShowPasswordChange(!showPasswordChange)}
                      >
                        <Key className="h-4 w-4 mr-2" />
                        Change Password
                      </Button>
                    </div>

                    {showPasswordChange && (
                      <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border/50">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            value={passwords.current}
                            onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={passwords.new}
                            onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={passwords.confirm}
                            onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                          />
                        </div>
                        <div className="flex justify-end space-x-3">
                          <Button variant="outline" onClick={() => setShowPasswordChange(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handlePasswordChange}>
                            Update Password
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Two Factor Authentication */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-foreground">Two-Factor Authentication</h4>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                      <Button variant="outline" disabled>
                        <Shield className="h-4 w-4 mr-2" />
                        Enable 2FA
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Login Sessions */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Active Sessions</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
                        <div>
                          <p className="font-medium text-foreground">Current Session</p>
                          <p className="text-sm text-muted-foreground">Chrome on Windows • India • Now</p>
                        </div>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-foreground">Preferences</CardTitle>
                  <CardDescription>Customize your experience and notification settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Language Settings */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      Language & Region
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="language">Display Language</Label>
                        <select
                          id="language"
                          value={profile.language}
                          onChange={(e) => setProfile(prev => ({ ...prev, language: e.target.value }))}
                          className="w-full h-10 px-3 bg-background border border-border rounded-md text-foreground"
                        >
                          <option value="English">English</option>
                          <option value="Hindi">हिंदी</option>
                          <option value="Kannada">ಕನ್ನಡ</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Notification Preferences */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground flex items-center">
                      <Bell className="h-4 w-4 mr-2" />
                      Notification Preferences
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">Email Notifications</p>
                          <p className="text-sm text-muted-foreground">Receive updates via email</p>
                        </div>
                        <Button
                          variant={profile.notifications.email ? "default" : "outline"}
                          size="sm"
                          onClick={() => setProfile(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, email: !prev.notifications.email }
                          }))}
                        >
                          {profile.notifications.email ? 'Enabled' : 'Disabled'}
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">SMS Notifications</p>
                          <p className="text-sm text-muted-foreground">Receive updates via SMS</p>
                        </div>
                        <Button
                          variant={profile.notifications.sms ? "default" : "outline"}
                          size="sm"
                          onClick={() => setProfile(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, sms: !prev.notifications.sms }
                          }))}
                        >
                          {profile.notifications.sms ? 'Enabled' : 'Disabled'}
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">Push Notifications</p>
                          <p className="text-sm text-muted-foreground">Receive browser notifications</p>
                        </div>
                        <Button
                          variant={profile.notifications.push ? "default" : "outline"}
                          size="sm"
                          onClick={() => setProfile(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, push: !prev.notifications.push }
                          }))}
                        >
                          {profile.notifications.push ? 'Enabled' : 'Disabled'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy" className="space-y-6">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <Eye className="h-5 w-5 mr-2 text-primary" />
                    Privacy Settings
                  </CardTitle>
                  <CardDescription>Control who can see your information and activity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Profile Visibility</p>
                        <p className="text-sm text-muted-foreground">Control who can view your profile information</p>
                      </div>
                      <select className="h-10 px-3 bg-background border border-border rounded-md text-foreground">
                        <option>School Community</option>
                        <option>Teachers Only</option>
                        <option>Private</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Contact Information</p>
                        <p className="text-sm text-muted-foreground">Allow others to see your contact details</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Activity Status</p>
                        <p className="text-sm text-muted-foreground">Show when you're active on the platform</p>
                      </div>
                      <Button variant="default" size="sm">
                        Enabled
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};