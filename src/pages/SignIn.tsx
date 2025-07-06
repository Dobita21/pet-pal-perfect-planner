
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication - in real app would use actual auth
    console.log('Sign in/up with:', { email, password, isSignUp });
    navigate('/');
  };

  const handleGoogleSignIn = () => {
    console.log('Sign in with Google');
    // Mock Google auth - would integrate with actual service
    navigate('/');
  };

  const handleFacebookSignIn = () => {
    console.log('Sign in with Facebook');
    // Mock Facebook auth - would integrate with actual service  
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pet-primary/10 to-pet-secondary/10 flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-6 rounded-3xl pet-card-shadow">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="mr-2 p-2 rounded-2xl"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-pet-primary">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
        </div>

        <div className="space-y-4">
          {/* Social Login Buttons */}
          <Button
            onClick={handleGoogleSignIn}
            variant="outline"
            className="w-full rounded-2xl border-2 hover:bg-gray-50"
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="text-lg">🟢</span>
              <span>Continue with Google</span>
            </div>
          </Button>

          <Button
            onClick={handleFacebookSignIn}
            variant="outline"
            className="w-full rounded-2xl border-2 hover:bg-blue-50"
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="text-lg">🔵</span>
              <span>Continue with Facebook</span>
            </div>
          </Button>

          <div className="flex items-center space-x-4">
            <Separator className="flex-1" />
            <span className="text-sm text-muted-foreground">or</span>
            <Separator className="flex-1" />
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-2xl"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-2xl"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-pet-primary hover:bg-pet-primary/90 rounded-2xl"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          <div className="text-center">
            <Button
              variant="link"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-pet-primary"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SignIn;
