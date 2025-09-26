import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, X, Users, GraduationCap, Shield, CreditCard, Car, Phone } from 'lucide-react';
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const roles = [
  {
    id: 'parent',
    title: 'roles.parent',
    description: 'roles.parentDesc',
    icon: Users,
    color: 'bg-blue-500'
  },
  {
    id: 'teacher', 
    title: 'roles.teacher',
    description: 'roles.teacherDesc',
    icon: GraduationCap,
    color: 'bg-green-500'
  },
  {
    id: 'admin',
    title: 'roles.admin',
    description: 'roles.adminDesc',
    icon: Shield,
    color: 'bg-purple-500'
  },
  {
    id: 'staff',
    title: 'roles.staff',
    description: 'roles.staffDesc', 
    icon: CreditCard,
    color: 'bg-orange-500'
  },
  {
    id: 'driver',
    title: 'roles.driver',
    description: 'roles.driverDesc',
    icon: Car,
    color: 'bg-red-500'
  }
];

const AuthLayout = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  const { t } = useTranslation();
  const { signIn, signUp } = useAuth();

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    setShowModal(true);
    setActiveTab('login');
    // Reset form
    setEmail('');
    setPassword('');
    setFullName('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRole('');
    setActiveTab('login');
    setLoading(false);
    // Reset form
    setEmail('');
    setPassword('');
    setFullName('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast.error(t('auth.emailRequired'));
      return;
    }

    if (activeTab === 'signup' && !fullName.trim()) {
      toast.error(t('auth.fullNameRequired'));
      return;
    }

    if (password.length < 6) {
      toast.error(t('auth.passwordTooShort'));
      return;
    }

    setLoading(true);

    try {
      if (activeTab === 'login') {
        console.log('🔐 Starting login process...');
        const result = await signIn({ email, password });
        
        if (result.success) {
          console.log('✅ Login successful, auth state will handle redirect');
          toast.success(t('auth.loginSuccessful'));
          handleCloseModal();
          // The AuthProvider will handle the redirect automatically
        } else {
          console.error('❌ Login failed:', result.error);
          setLoading(false);
          toast.error(result.error || t('auth.loginFailed'));
        }
      } else {
        console.log('📝 Starting signup process...');
        const result = await signUp({ 
          email, 
          password, 
          fullName, 
          role: selectedRole as 'parent' | 'teacher' | 'admin' | 'staff' | 'driver'
        });
        
        if (result.success) {
          console.log('✅ Signup successful');
          setLoading(false);
          toast.success(t('auth.accountCreated'));
          setActiveTab('login');
          setPassword('');
          setFullName('');
        } else {
          console.error('❌ Signup failed:', result.error);
          setLoading(false);
          toast.error(result.error || 'Registration failed. Please try again.');
        }
      }
    } catch (error: any) {
      console.error('❌ Auth error:', error);
      setLoading(false);
      toast.error(t('auth.connectionError'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src="/src/assets/paranter-logo.png" alt="Paranter Logo" className="h-10 w-10" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Paranter</h1>
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

      {/* Auth Modal */}
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

            {/* Modal Content */}
            <div className="flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="p-6 pb-4 text-center border-b border-border/50">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
                  {roles.find(r => r.id === selectedRole)?.icon && 
                    React.createElement(roles.find(r => r.id === selectedRole)!.icon, { 
                      className: "h-8 w-8 text-primary" 
                    })
                  }
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {t(roles.find(r => r.id === selectedRole)?.title || 'roles.parent')}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {t('auth.enterCredentials')}
                </p>
              </div>

              {/* Form Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="login">{t('auth.login')}</TabsTrigger>
                      <TabsTrigger value="signup">{t('auth.signup')}</TabsTrigger>
                    </TabsList>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <TabsContent value="login" className="space-y-4 mt-0">
                        <div className="space-y-2">
                          <Label htmlFor="email">{t('auth.email')}</Label>
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            required
                            disabled={loading}
                            className="w-full"
                            autoComplete="email"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="password">{t('auth.password')}</Label>
                          <div className="relative">
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                              disabled={loading}
                              className="w-full pr-10"
                              autoComplete="current-password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full" 
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                              {t('auth.pleaseWait')}
                            </>
                          ) : (
                            t('auth.login')
                          )}
                        </Button>
                      </TabsContent>

                      <TabsContent value="signup" className="space-y-4 mt-0">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">{t('auth.fullName')}</Label>
                          <Input
                            id="fullName"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Your Full Name"
                            required
                            disabled={loading}
                            className="w-full"
                            autoComplete="name"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="signupEmail">{t('auth.email')}</Label>
                          <Input
                            id="signupEmail"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            required
                            disabled={loading}
                            className="w-full"
                            autoComplete="email"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="signupPassword">{t('auth.password')}</Label>
                          <div className="relative">
                            <Input
                              id="signupPassword"
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                              disabled={loading}
                              className="w-full pr-10"
                              autoComplete="new-password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full" 
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                              {t('auth.pleaseWait')}
                            </>
                          ) : (
                            t('auth.createAccount')
                          )}
                        </Button>
                      </TabsContent>

                      {/* Additional Actions */}
                      {activeTab === 'login' && (
                        <div className="space-y-3 pt-4 border-t border-border/50">
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            disabled={loading}
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            {t('auth.loginWithOTP')}
                          </Button>
                          
                          <div className="text-center">
                            <button
                              type="button"
                              className="text-sm text-primary hover:underline"
                              disabled={loading}
                            >
                              {t('auth.forgotPassword')}
                            </button>
                          </div>
                        </div>
                      )}
                    </form>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthLayout;