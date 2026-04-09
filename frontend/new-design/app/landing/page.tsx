'use client';

import { useRouter } from 'next/navigation';
import { useTheme } from '@/lib/theme-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Zap, TrendingUp, ChartBar as BarChart3, Lock, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, ArrowRight, Moon, Sun, Menu } from 'lucide-react';
import { useState } from 'react';

const features = [
  {
    icon: Shield,
    title: 'Real-Time Detection',
    description: 'Advanced ML-powered threat detection with sub-millisecond response times',
  },
  {
    icon: TrendingUp,
    title: 'Live Monitoring',
    description: 'Stream and analyze network traffic with real-time dashboards',
  },
  {
    icon: BarChart3,
    title: 'Analytics Suite',
    description: 'Comprehensive reporting and visualization of security metrics',
  },
  {
    icon: Lock,
    title: 'Enterprise Security',
    description: 'Role-based access control and end-to-end encryption',
  },
  {
    icon: AlertTriangle,
    title: 'Incident Response',
    description: 'Automated incident detection with forensic investigation tools',
  },
  {
    icon: Zap,
    title: 'High Performance',
    description: 'Processes millions of packets per second without degradation',
  },
];

const stats = [
  { value: '99.97%', label: 'System Uptime' },
  { value: '< 12ms', label: 'Detection Latency' },
  { value: '1.2Gbps', label: 'Throughput' },
  { value: '96.3%', label: 'Precision' },
];

export default function LandingPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient">Aegis IDS</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition">
              Features
            </a>
            <a href="#stats" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition">
              Performance
            </a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition">
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5 text-slate-600" />
              ) : (
                <Sun className="h-5 w-5 text-slate-300" />
              )}
            </button>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/auth?tab=login')}
              >
                Login
              </Button>
              <Button
                size="sm"
                onClick={() => router.push('/auth?tab=register')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="relative min-h-[100vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-left">
              <div className="mb-6">
                <div className="inline-block px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    Enterprise Security Platform
                  </span>
                </div>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="text-gradient">Advanced Threat</span>
                <br />
                <span>Detection & Response</span>
              </h1>

              <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl">
                Protect your network with AI-powered intrusion detection. Real-time threat analysis, automated incident response, and comprehensive security intelligence.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => router.push('/auth?tab=register')}
                  className="bg-blue-600 hover:bg-blue-700 text-lg button-glow"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg"
                >
                  View Demo
                </Button>
              </div>

              <div className="mt-12 flex items-center gap-8">
                <div>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">10K+</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Active Users</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">99.97%</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Uptime SLA</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">24/7</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Support</p>
                </div>
              </div>
            </div>

            <div className="animate-fade-in-right hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 rounded-3xl blur-2xl"></div>
                <Card className="relative border-2 border-blue-200 dark:border-blue-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
                  <CardContent className="p-8">
                    <div className="space-y-4">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="h-3 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full opacity-30"
                          style={{ width: `${100 - i * 20}%` }}
                        ></div>
                      ))}
                    </div>
                    <div className="mt-8 grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                        <p className="text-2xl font-bold text-green-600">847K</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Threats Blocked</p>
                      </div>
                      <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
                        <p className="text-2xl font-bold text-orange-600">12</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Open Incidents</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powerful Features for<br />
              <span className="text-gradient">Complete Protection</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Everything you need to detect, investigate, and respond to threats
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="group hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="pt-8">
                    <div className="mb-4 p-3 w-fit rounded-lg bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition">
                      <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section id="stats" className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Enterprise-Grade<br />
              <span className="text-gradient">Performance</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <p className="text-5xl md:text-6xl font-bold text-gradient mb-2">
                  {stat.value}
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Simple, Transparent<br />
              <span className="text-gradient">Pricing</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Starter',
                price: '$299',
                description: 'Perfect for small teams',
                features: [
                  'Up to 100k packets/sec',
                  'Basic threat detection',
                  'Email support',
                  '30-day retention',
                ],
              },
              {
                name: 'Professional',
                price: '$999',
                description: 'For growing organizations',
                features: [
                  'Up to 1M packets/sec',
                  'Advanced AI detection',
                  'Priority support',
                  '1-year retention',
                  'API access',
                ],
                highlighted: true,
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                description: 'Unlimited everything',
                features: [
                  'Unlimited throughput',
                  'Custom AI models',
                  '24/7 dedicated support',
                  'Unlimited retention',
                  'Custom integrations',
                ],
              },
            ].map((plan, index) => (
              <Card
                key={index}
                className={`transition-all duration-300 ${
                  plan.highlighted
                    ? 'ring-2 ring-blue-600 scale-105'
                    : 'hover:shadow-lg'
                }`}
              >
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <p className="text-4xl font-bold text-gradient">
                      {plan.price}
                      {plan.price !== 'Custom' && (
                        <span className="text-lg text-slate-600 dark:text-slate-400">/mo</span>
                      )}
                    </p>
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    variant={plan.highlighted ? 'default' : 'outline'}
                    onClick={() => router.push('/auth?tab=register')}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <Card className="bg-gradient-to-br from-blue-600 to-cyan-500 border-0 text-white overflow-hidden">
            <CardContent className="p-12 md:p-16">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-3">
                    Ready to Secure Your Network?
                  </h2>
                  <p className="text-lg opacity-90 max-w-2xl">
                    Join thousands of organizations protecting their infrastructure with Aegis IDS
                  </p>
                </div>
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-slate-100 whitespace-nowrap"
                  onClick={() => router.push('/auth?tab=register')}
                >
                  Start Free Trial
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="font-bold">Aegis IDS</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Enterprise threat detection and response
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600">Features</a></li>
                <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600">Pricing</a></li>
                <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600">About</a></li>
                <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600">Blog</a></li>
                <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600">Privacy</a></li>
                <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600">Terms</a></li>
                <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600">Cookies</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              &copy; 2024 Aegis IDS. All rights reserved.
            </p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600">Twitter</a>
              <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600">LinkedIn</a>
              <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
