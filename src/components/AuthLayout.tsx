import React, { useState, useEffect } from 'react';
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
    title: 'roles.parent',
    description: 'roles.parentDesc',
    icon: Users,
    color: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    path: '/'
  },
  {
    id: 'teacher',
    title: 'roles.teacher',
    description: 'roles.teacherDesc',
    icon: GraduationCap,
    color: 'bg-gradient-to-br from-emerald-500 to-teal-500',
    path: '/teacher'
  },
  {
    id: 'admin',
    title: 'roles.admin',
    description: 'roles.adminDesc',
    icon: Shield,
    color: 'bg-gradient-to-br from-purple-500 to-violet-500',
    path: '/admin'
  },
  {
    id: 'staff',
    title: 'roles.staff',
    description: 'roles.staffDesc',
    icon: DollarSign,
    color: 'bg-gradient-to-br from-orange-500 to-red-500',
    path: '/finance'
  },
  {
    id: 'driver',
    title: 'roles.driver',
    description: 'roles.driverDesc',
    icon: Car,
    color: 'bg-gradient-to-br from-green-500 to-emerald-500',
    path: '/driver'
  }
];

const AuthLayout = () => {
  const { t } = useTranslation();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    setShowModal(true);
    // Prevent background scrolling
    document.body.classList.add('modal-open');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRole(null);
    setEmail('');
    setPassword('');
    setFullName('');
    setAuthMode('login');
    setShowPassword(false);
    // Restore background scrolling
    document.body.classList.remove('modal-open');
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  const handleAuth = async () => {
    if (loading) return;

    try {
      setLoading(true);

      // Validate inputs
      const emailValidation = emailSchema.safeParse(email.trim());
      if (!emailValidation.success) {
        toast.error(emailValidation.error.issues[0].message);
        return;
      }

      if (authMode === 'signup') {
        if (!fullName.trim()) {
          toast.error('Full name is required');
          return;
        }

        const authValidation = authSchema.safeParse({ email: email.trim(), password });
        if (!authValidation.success) {
          toast.error(authValidation.error.issues[0].message);
          return;
        }

        // Sign up
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: fullName,
              role: selectedRole || 'parent'
            }
          }
        });

        if (signUpError) {
          if (signUpError.message.includes('already registered')) {
            toast.error('An account with this email already exists. Please try logging in instead.');
          } else {
            toast.error(signUpError.message);
          }
          return;
        }

        toast.success('Account created! Please check your email to verify your account.');
        handleCloseModal();
      } else {
        // Login
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (signInError) {
          if (signInError.message.includes('Invalid login credentials')) {
            toast.error('Invalid email or password. Please check your credentials and try again.');
          } else {
            toast.error(signInError.message);
          }
          return;
        }

        toast.success('Login successful! Welcome back.');
        handleCloseModal();
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Building className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">School Connect</h1>
              <p className="text-xs text-muted-foreground">Management System</p>
            </div>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('welcome.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('welcome.subtitle')}
            </p>
          </div>

          {/* Role Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {roles.map((role) => {
              const IconComponent = role.icon;
              return (
                <Card 
                  key={role.id}
                  className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-2 hover:border-primary/50 bg-card/80 backdrop-blur-sm"
                  onClick={() => handleRoleSelect(role.id)}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${role.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{t(role.title)}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{t(role.description)}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>

      {/* FIXED: Full-Screen Modal Dialog - Completely Custom Implementation */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md mx-auto bg-card rounded-lg shadow-2xl border border-border overflow-hidden max-h-[90vh] flex flex-col">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </button>

            {/* Modal Header */}
            <div className="p-6 pb-4 text-center border-b border-border">
              {selectedRole && (
                  <>
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${roles.find(r => r.id === selectedRole)?.color} flex items-center justify-center`}>
                      {React.createElement(roles.find(r => r.id === selectedRole)?.icon || Users, {
                        className: "h-8 w-8 text-white"
                      })}
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      {t(roles.find(r => r.id === selectedRole)?.title || 'roles.parent')}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      {t('auth.enterCredentials')}
                    </p>
                  </>
                )}
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as 'login' | 'signup')} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login" className="text-sm">{t('auth.login')}</TabsTrigger>
                    <TabsTrigger value="signup" className="text-sm">{t('auth.signup')}</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login" className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                          {t('auth.email')}
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder={t('auth.email')}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-11"
                          disabled={loading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium">
                          {t('auth.password')}
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder={t('auth.password')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-11 pr-10"
                            disabled={loading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="signup" className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-sm font-medium">
                          {t('auth.fullName')}
                        </Label>
                        <Input
                          id="fullName"
                          type="text"
                          placeholder={t('auth.fullName')}
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="h-11"
                          disabled={loading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signupEmail" className="text-sm font-medium">
                          {t('auth.email')}
                        </Label>
                        <Input
                          id="signupEmail"
                          type="email"
                          placeholder={t('auth.email')}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-11"
                          disabled={loading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signupPassword" className="text-sm font-medium">
                          {t('auth.password')}
                        </Label>
                        <div className="relative">
                          <Input
                            id="signupPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder={t('auth.password')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-11 pr-10"
                            disabled={loading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Action Buttons */}
                <div className="space-y-4 mt-6">
                  <Button 
                    onClick={handleAuth} 
                    className="w-full h-11 text-sm font-medium"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                        <span>{t('auth.pleaseWait')}</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <KeyRound className="h-4 w-4" />
                        <span>{authMode === 'login' ? t('auth.login') : t('auth.createAccount')}</span>
                      </div>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full h-11 text-sm"
                    disabled={loading}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    {t('auth.loginWithOTP')}
                  </Button>

                  <div className="text-center">
                    <Button
                      variant="link"
                      className="text-sm text-primary hover:underline p-0"
                    >
                      {t('auth.forgotPassword')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { AuthLayout };
export default AuthLayout;