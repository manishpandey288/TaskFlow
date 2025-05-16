import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const { user, signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn();
    } catch (err) {
      setError('Failed to sign in. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link
            to="/signup"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-sm text-red-600 rounded-md p-4">
              {error}
            </div>
          )}

          <div className="mt-6">
            <Button
              fullWidth
              onClick={handleGoogleSignIn}
              isLoading={isLoading}
              className="flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 4.85714C13.7252 4.85714 15.2386 5.46071 16.4364 6.59464L19.8449 3.18464C17.7435 1.21429 15.0668 0 12 0C7.39322 0 3.39535 2.59018 1.33333 6.36161L5.17332 9.39286C6.21579 6.74107 8.87157 4.85714 12 4.85714Z"
                  fill="#EA4335"
                />
                <path
                  d="M23.54 12.2754C23.54 11.4002 23.4668 10.5607 23.3315 9.75537H12V14.2554H18.6048C18.3175 15.7884 17.4452 17.0777 16.1268 17.9384L19.8333 20.893C22.0743 18.8232 23.54 15.8277 23.54 12.2754Z"
                  fill="#4285F4"
                />
                <path
                  d="M5.17336 14.6071C4.91647 13.8973 4.77695 13.1339 4.77695 12.3482C4.77695 11.5625 4.91647 10.7991 5.15868 10.0893L1.31869 7.05804C0.477679 8.66964 0 10.4634 0 12.3482C0 14.233 0.477679 16.0268 1.31869 17.6384L5.17336 14.6071Z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 24C15.0668 24 17.7435 22.875 19.8333 20.8929L16.1268 17.9383C15.0843 18.65 13.6883 19.1429 12 19.1429C8.87157 19.1429 6.21579 17.2589 5.17332 14.607L1.33333 17.6383C3.39535 21.4098 7.39322 24 12 24Z"
                  fill="#34A853"
                />
              </svg>
              Sign in with Google
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};