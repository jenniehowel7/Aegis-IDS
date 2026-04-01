'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-provider';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Moon, Sun, ArrowRight, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Loader } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, session } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'register' || tab === 'login') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const [loginForm, setLoginForm] = useState({
    identifier: '',
    password: '',
  });

  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    role: 'Individual',
    password: '',
    confirm_password: '',
  });

  if (session) {
    router.push('/dashboard');
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await api.auth.login(loginForm.identifier, loginForm.password);
      login(user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (registerForm.password !== registerForm.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    if (registerForm.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      const user = await api.auth.register({
        username: registerForm.username,
        email: registerForm.email,
        role: registerForm.role,
        password: registerForm.password,
      });
      login(user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -right-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl dark:bg-blue-500/5"></div>
        <div className="absolute -bottom-1/4 -left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl dark:bg-cyan-500/5"></div>
      </div>

      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => router.push('/landing')}
            className="flex items-center gap-2 group"
          >
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 group-hover:shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient">Aegis IDS</span>
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5 text-slate-600" />
            ) : (
              <Sun className="h-5 w-5 text-slate-300" />
            )}
          </button>
        </div>

        <Card className="border-0 shadow-2xl dark:shadow-2xl dark:shadow-blue-500/10 bg-white/95 dark:bg-slate-900/80 backdrop-blur-xl">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl">
              {activeTab === 'login' ? 'Welcome Back' : 'Join Aegis IDS'}
            </CardTitle>
            <CardDescription className="text-base mt-2">
              {activeTab === 'login'
                ? 'Sign in to access your security dashboard'
                : 'Create an account to get started with enterprise threat detection'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  {error && (
                    <Alert variant="destructive" className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2 animate-fade-in-up">
                    <Label htmlFor="identifier" className="text-sm font-medium">
                      Username or Email
                    </Label>
                    <Input
                      id="identifier"
                      type="text"
                      placeholder="john_doe or john@example.com"
                      value={loginForm.identifier}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, identifier: e.target.value })
                      }
                      required
                      disabled={isLoading}
                      className="h-11 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '50ms' }}>
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, password: e.target.value })
                      }
                      required
                      disabled={isLoading}
                      className="h-11 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold button-glow animate-fade-in-up"
                    style={{ animationDelay: '100ms' }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                    <p className="font-semibold text-sm text-blue-900 dark:text-blue-300 mb-3">
                      Demo Credentials
                    </p>
                    <div className="space-y-1 text-xs text-blue-800 dark:text-blue-400">
                      <p className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3" />
                        <span><strong>individual_user</strong> / Aegis2026!</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3" />
                        <span><strong>company_user</strong> / Aegis2026!</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3" />
                        <span><strong>admin_user</strong> / Aegis2026!</span>
                      </p>
                    </div>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  {error && (
                    <Alert variant="destructive" className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2 animate-fade-in-up">
                    <Label htmlFor="username" className="text-sm font-medium">
                      Username
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="john_doe"
                      value={registerForm.username}
                      onChange={(e) =>
                        setRegisterForm({ ...registerForm, username: e.target.value })
                      }
                      required
                      disabled={isLoading}
                      className="h-11 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '50ms' }}>
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={registerForm.email}
                      onChange={(e) =>
                        setRegisterForm({ ...registerForm, email: e.target.value })
                      }
                      required
                      disabled={isLoading}
                      className="h-11 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <Label htmlFor="role" className="text-sm font-medium">
                      Account Type
                    </Label>
                    <Select
                      value={registerForm.role}
                      onValueChange={(value) =>
                        setRegisterForm({ ...registerForm, role: value })
                      }
                      disabled={isLoading}
                    >
                      <SelectTrigger className="h-11 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Individual">Individual</SelectItem>
                        <SelectItem value="Company">Company</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                    <Label htmlFor="reg-password" className="text-sm font-medium">
                      Password
                    </Label>
                    <Input
                      id="reg-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerForm.password}
                      onChange={(e) =>
                        setRegisterForm({ ...registerForm, password: e.target.value })
                      }
                      required
                      disabled={isLoading}
                      className="h-11 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    <Label htmlFor="confirm-password" className="text-sm font-medium">
                      Confirm Password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerForm.confirm_password}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          confirm_password: e.target.value,
                        })
                      }
                      required
                      disabled={isLoading}
                      className="h-11 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold button-glow animate-fade-in-up"
                    style={{ animationDelay: '250ms' }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
              <p>
                {activeTab === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  onClick={() => setActiveTab(activeTab === 'login' ? 'register' : 'login')}
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
                >
                  {activeTab === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>
            By continuing, you agree to our{' '}
            <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
