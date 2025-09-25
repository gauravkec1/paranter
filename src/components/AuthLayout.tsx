import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { supabase } from '@/integrations/supabase/client';
import { authSchema, emailSchema } from '@/lib/validation';
import { z } from 'zod';
import { 
  Users, 
  GraduationCap, 
  DollarSign, 
  Car,
  Shield,
  Phone,
  Mail,
  KeyRound,
  Building,
  Eye,
  EyeOff,
  X
} from 'lucide-react';
import { toast } from 'sonner';

const roles = [
  {
    id: 'parent',
    title: 'Parent Portal',
    description: 'Track student progress, fees, and communicate with teachers',
    icon: Users,
    color: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    path: '/'
  },
  {
    id: 'teacher',
    title: 'Teacher Portal',
    description: 'Manage classes, assignments, and student assessments',
    icon: GraduationCap,
    color: 'bg-gradient-to-br from-emerald-500 to-teal-500',
    path: '/teacher'
  },
  {
    id: 'admin',
    title: 'Admin Portal',
    description: 'Complete school administration and management',
    icon: Shield,
    color: 'bg-gradient-to-br from-purple-500 to-violet-500',
    path: '/admin'
  },
  {
    id: 'staff',
    title: 'Finance Portal',
    description: 'Financial management, fees, and accounting',
    icon: DollarSign,
    color: 'bg-gradient-to-br from-orange-500 to-amber-500',
    path: '/finance'
  },
  {
    id: 'driver',
    title: 'Driver Portal',
    description: 'Transport management and route tracking',
    icon: Car,
    color: 'bg-gradient-to-br from-green-500 to-lime-500',
    path: '/driver'
  }
];

export const AuthLayout = () => {
  const { t } = useTranslation();
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    setShowLoginModal(true);
    setFormData({ email: '', password: '', fullName: '' });
    setIsSignup(false);
    setShowPassword(false);
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
    setSelectedRole('');
    setFormData({ email: '', password: '', fullName: '' });
    setIsSignup(false);
    setShowPassword(false);
  };

  const handleAuth = async () => {
    if (!selectedRole) {
      toast.error('Please select your role');
      return;
    }

    // Validate input using Zod schema
    try {
      if (isSignup && formData.fullName.trim().length < 1) {
        toast.error('Please enter your full name');
        return;
      }

      // Validate email format
      emailSchema.parse(formData.email);
      
      // Validate full auth data
      authSchema.parse({
        email: formData.email,
        password: formData.password
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.issues[0];
        toast.error(firstError.message);
        return;
      }
    }

    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email: formData.email.trim(),
          password: formData.password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: formData.fullName.trim(),
              role: selectedRole
            }
          }
        });

        if (error) {
          // Provide user-friendly error messages
          const friendlyMessage = error.message.includes('already registered')
            ? "This email is already registered. Please try logging in instead."
            : error.message.includes('Password')
            ? "Password does not meet security requirements. Please use a stronger password."
            : "Unable to create account. Please try again.";
          toast.error(friendlyMessage);
        } else {
          toast.success('Account created! Please check your email for verification.');
          setShowLoginModal(false);
          setFormData({ email: '', password: '', fullName: '' });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email.trim(),
          password: formData.password
        });

        if (error) {
          // Provide generic error message for security
          const friendlyMessage = error.message.includes('Invalid login credentials')
            ? "Invalid email or password. Please try again."
            : "Unable to log in. Please try again.";
          toast.error(friendlyMessage);
        } else {
          toast.success('Login successful!');
          setShowLoginModal(false);
          setFormData({ email: '', password: '', fullName: '' });
        }
      }
    } catch (error) {
      // Don't log sensitive error details for security
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-muted/20">
      {/* Header */}
      <header className="p-6 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-primary to-primary-glow rounded-xl shadow-lg">
            <Building className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              School Connect
            </h1>
            <p className="text-sm text-muted-foreground">Secure Portal Access</p>
          </div>
        </div>
        <LanguageSwitcher />
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Role Selection */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Select Your Portal
            </h2>
            <p className="text-lg text-muted-foreground">
              Choose your portal to access the school management system
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
            {roles.map((role, index) => (
              <Card
                key={role.id}
                className="cursor-pointer transition-opacity duration-150 border hover:shadow-lg border-border hover:border-primary/50 bg-card"
                onClick={() => handleRoleSelect(role.id)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-lg ${role.color} flex items-center justify-center`}>
                    <role.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-medium text-foreground mb-1 text-sm">{role.title}</h3>
                  <p className="text-xs text-muted-foreground">{role.description}</p>
                  <div className="mt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs h-7"
                    >
                      Access
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Login Modal */}
          <Dialog open={showLoginModal} onOpenChange={handleCloseModal}>
            <DialogContent className="sm:max-w-md bg-gradient-to-br from-card to-background/80 backdrop-blur-xl border-0 shadow-2xl animate-scale-in">
              <DialogHeader className="text-center space-y-4">
                
                <div className={`w-20 h-20 mx-auto rounded-xl ${roles.find(r => r.id === selectedRole)?.color} flex items-center justify-center shadow-lg`}>
                  {(() => {
                    const role = roles.find(r => r.id === selectedRole);
                    if (role?.icon) {
                      const IconComponent = role.icon;
                      return <IconComponent className="h-10 w-10 text-white" />;
                    }
                    return null;
                  })()}
                </div>
                
                <DialogTitle className="text-2xl text-foreground">
                  {roles.find(r => r.id === selectedRole)?.title?.replace('Portal', 'Login')}
                </DialogTitle>
                
                <p className="text-muted-foreground">
                  {isSignup ? 'Create your account' : 'Enter your credentials to access your portal'}
                </p>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                <Tabs value={isSignup ? 'signup' : 'login'} onValueChange={(value) => setIsSignup(value === 'signup')}>
                  <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                    <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Login
                    </TabsTrigger>
                    <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Sign Up
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="login" className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="modal-email" className="text-foreground font-medium">
                        Email / Phone / School ID
                      </Label>
                      <Input
                        id="modal-email"
                        type="text"
                        placeholder="Enter email, phone, or school ID"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="modal-password" className="text-foreground font-medium">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="modal-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          className="h-12 pr-12"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="signup" className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="modal-fullName" className="text-foreground font-medium">
                        Full Name
                      </Label>
                      <Input
                        id="modal-fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="modal-email-signup" className="text-foreground font-medium">
                        Email / Phone / School ID
                      </Label>
                      <Input
                        id="modal-email-signup"
                        type="text"
                        placeholder="Enter email, phone, or school ID"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="modal-password-signup" className="text-foreground font-medium">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="modal-password-signup"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          className="h-12 pr-12"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <Button
                  onClick={handleAuth}
                  disabled={isLoading}
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <KeyRound className="h-5 w-5 mr-2" />
                  {isLoading ? 'Please wait...' : (isSignup ? 'Create Account' : 'Login')}
                </Button>

                <div className="flex flex-col space-y-3">
                  <Button variant="outline" className="w-full h-10">
                    <Phone className="h-4 w-4 mr-2" />
                    Login with OTP
                  </Button>
                  
                  <Button variant="link" className="text-primary hover:text-primary/80 h-auto p-0">
                    Forgot Password?
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};