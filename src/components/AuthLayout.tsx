import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
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
  EyeOff
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
    id: 'finance',
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

interface AuthLayoutProps {
  onLogin: (role: string) => void;
}

export const AuthLayout = ({ onLogin }: AuthLayoutProps) => {
  const { t } = useTranslation();
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    schoolId: '',
    otp: ''
  });

  const handleLogin = () => {
    if (!selectedRole) {
      toast.error('Please select your role');
      return;
    }

    if (loginMethod === 'email' && (!formData.email || !formData.password)) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (loginMethod === 'phone' && (!formData.phone || !formData.otp)) {
      toast.error('Please fill in all required fields');
      return;
    }

    toast.success('Login successful!');
    onLogin(selectedRole);
  };

  const sendOTP = () => {
    if (!formData.phone) {
      toast.error('Please enter your phone number');
      return;
    }
    toast.success('OTP sent to your phone number');
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
              {t('auth.loginTitle')}
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
              {t('auth.selectRole')}
            </h2>
            <p className="text-lg text-muted-foreground">
              Choose your portal to access the school management system
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
            {roles.map((role) => (
              <Card
                key={role.id}
                className={`cursor-pointer transition-all duration-300 border-2 hover:shadow-xl hover:scale-105 ${
                  selectedRole === role.id
                    ? 'border-primary shadow-lg ring-2 ring-primary/20'
                    : 'border-border hover:border-primary/50'
                } bg-gradient-to-br from-card to-background/50 backdrop-blur-sm`}
                onClick={() => setSelectedRole(role.id)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-xl ${role.color} flex items-center justify-center shadow-lg`}>
                    <role.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{role.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{role.description}</p>
                  {selectedRole === role.id && (
                    <Badge className="mt-3 bg-primary text-primary-foreground">Selected</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Login Form */}
          {selectedRole && (
            <Card className="max-w-md mx-auto shadow-2xl border-0 bg-gradient-to-br from-card to-background/80 backdrop-blur-xl">
              <CardHeader className="text-center space-y-4">
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
                <CardTitle className="text-2xl text-foreground">
                  {roles.find(r => r.id === selectedRole)?.title}
                </CardTitle>
                <CardDescription className="text-base">
                  {t('auth.enterCredentials')}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <Tabs value={loginMethod} onValueChange={(value) => setLoginMethod(value as 'email' | 'phone')}>
                  <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                    <TabsTrigger value="email" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </TabsTrigger>
                    <TabsTrigger value="phone" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      <Phone className="h-4 w-4 mr-2" />
                      Phone
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="email" className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground font-medium">
                        {t('auth.email')}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@school.edu"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-foreground font-medium">
                        {t('auth.password')}
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
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

                  <TabsContent value="phone" className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-foreground font-medium">
                        {t('auth.phone')}
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="h-12"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={sendOTP}
                        className="flex-shrink-0"
                      >
                        Send OTP
                      </Button>
                      <Input
                        placeholder="Enter OTP"
                        value={formData.otp}
                        onChange={(e) => setFormData(prev => ({ ...prev, otp: e.target.value }))}
                        className="h-10"
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="space-y-2">
                  <Label htmlFor="schoolId" className="text-foreground font-medium">
                    {t('auth.schoolId')}
                  </Label>
                  <Input
                    id="schoolId"
                    placeholder="e.g., SMS2024"
                    value={formData.schoolId}
                    onChange={(e) => setFormData(prev => ({ ...prev, schoolId: e.target.value }))}
                    className="h-12"
                  />
                </div>

                <Button
                  onClick={handleLogin}
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <KeyRound className="h-5 w-5 mr-2" />
                  {t('auth.loginButton')}
                </Button>

                <div className="text-center">
                  <Button variant="link" className="text-primary hover:text-primary/80">
                    {t('auth.forgotPassword')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};