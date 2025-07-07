
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (!error) {
          // Success message is handled by the useAuth hook
        }
      } else {
        const { error } = await signIn(email, password);
        if (!error) {
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    console.log('Google sign in not implemented yet');
    // Would implement Google OAuth with Supabase
  };

  const handleFacebookSignIn = () => {
    console.log('Facebook sign in not implemented yet');
    // Would implement Facebook OAuth with Supabase
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
            disabled={loading}
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
            disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-pet-primary hover:bg-pet-primary/90 rounded-2xl"
              disabled={loading}
            >
              {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </Button>
          </form>

          <div className="text-center">
            <Button
              variant="link"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-pet-primary"
              disabled={loading}
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
