import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { User, Mail, Phone, GraduationCap, ArrowRight, CheckCircle } from 'lucide-react';

interface RegisterPageProps {
  onRegister: (data: any) => Promise<boolean>;
  onSwitchToLogin: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export function RegisterPage({ onRegister, onSwitchToLogin, isLoading = false, error }: RegisterPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    education: '',
    region: '',
  });
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (error) {
      setLocalError('Failed to sign in with Google. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalLoading(true);
    setLocalError(null);

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      setLocalLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters long');
      setLocalLoading(false);
      return;
    }
    
    try {
      const success = await onRegister(formData);
      if (!success) {
        setLocalError('Registration failed. Please try again.');
      }
    } catch (err) {
      setLocalError('An error occurred during registration. Please try again.');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleInputChange = (field: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const benefits = [
    "Free coding bootcamp training",
    "Industry-recognized certifications", 
    "Job placement assistance",
    "Access to cutting-edge technology",
    "Networking with tech professionals",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex">
      {/* Left side with image and program info */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1635775017492-1eb935a082a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9ncmFtbWluZyUyMGNvZGluZyUyMGNvbXB1dGVyfGVufDF8fHx8MTc1ODQ2Mjk1OHww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Programming background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 via-purple-800/80 to-transparent" />
        
        <div className="relative z-10 p-12 flex flex-col justify-center text-white max-w-2xl">
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-4">
                The One Million Coders<br />
                <span className="text-yellow-400">Program - Ghana</span>
              </h1>
              
              <p className="text-xl opacity-90 leading-relaxed">
                Empowering Ghanaian youth with coding skills for the future.
              </p>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-yellow-400">
                Are you ready to unlock your digital potential?
              </h3>
              
              <p className="text-lg opacity-90 leading-relaxed">
                The Ghana government's One Million Coders initiative is empowering Ghanaians 
                with the skills of the future. Whether you're a student, professional, or 
                simply curious, this program offers a pathway to a brighter future.
              </p>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Program Benefits:</h4>
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="opacity-90">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button className="text-yellow-400 hover:text-yellow-300 font-medium flex items-center space-x-2 transition-colors group">
              <span>Click to read Application process</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Right side with registration form */}
      <div className="w-full lg:w-2/5 p-6 lg:p-12 flex flex-col justify-center">
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center space-y-2 pb-8">
              <h2 className="text-2xl font-bold text-gray-900">Join the Program</h2>
              <p className="text-muted-foreground">
                Register for the One Million Coders initiative
              </p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Message */}
                {(error || localError) && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error || localError}</p>
                  </div>
                )}
                
                {/* Full Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name')(e.target.value)}
                      placeholder="Enter your full name"
                      required
                      className="pl-10 h-12 bg-white border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email')(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="pl-10 h-12 bg-white border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password')(e.target.value)}
                      placeholder="Create a password"
                      required
                      className="h-12 bg-white border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword')(e.target.value)}
                      placeholder="Confirm your password"
                      required
                      className="h-12 bg-white border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone')(e.target.value)}
                      placeholder="Enter your phone number"
                      className="pl-10 h-12 bg-white border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Education Level */}
                <div className="space-y-2">
                  <label htmlFor="education" className="text-sm font-medium text-gray-700">
                    Education Level
                  </label>
                  <Select value={formData.education} onValueChange={handleInputChange('education')}>
                    <SelectTrigger className="h-12 bg-white border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                      <SelectValue placeholder="Select your education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="secondary">Secondary School</SelectItem>
                      <SelectItem value="tertiary">Tertiary Education</SelectItem>
                      <SelectItem value="university">University Graduate</SelectItem>
                      <SelectItem value="postgraduate">Postgraduate</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Region */}
                <div className="space-y-2">
                  <label htmlFor="region" className="text-sm font-medium text-gray-700">
                    Region
                  </label>
                  <Select value={formData.region} onValueChange={handleInputChange('region')}>
                    <SelectTrigger className="h-12 bg-white border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                      <SelectValue placeholder="Select your region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="greater-accra">Greater Accra</SelectItem>
                      <SelectItem value="ashanti">Ashanti</SelectItem>
                      <SelectItem value="western">Western</SelectItem>
                      <SelectItem value="central">Central</SelectItem>
                      <SelectItem value="eastern">Eastern</SelectItem>
                      <SelectItem value="volta">Volta</SelectItem>
                      <SelectItem value="northern">Northern</SelectItem>
                      <SelectItem value="upper-east">Upper East</SelectItem>
                      <SelectItem value="upper-west">Upper West</SelectItem>
                      <SelectItem value="brong-ahafo">Brong Ahafo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Register Button */}
                <Button
                  type="submit"
                  disabled={isLoading || localLoading}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                >
                  {(isLoading || localLoading) ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Registering...</span>
                    </div>
                  ) : (
                    'Register Now'
                  )}
                </Button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>

                {/* Google Sign-In Button */}
                <Button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading || localLoading}
                  className="w-full h-12 bg-white hover:bg-gray-50 text-gray-900 font-medium rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </div>
                </Button>

                {/* Switch to Login */}
                <div className="text-center pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={onSwitchToLogin}
                      className="text-purple-600 hover:text-purple-800 font-medium transition-colors"
                    >
                      Login here
                    </button>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}