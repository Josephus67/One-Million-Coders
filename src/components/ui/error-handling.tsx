"use client";

import { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Error Boundary Component
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  retry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error!, this.retry);
      }
      return <ErrorFallback error={this.state.error!} retry={this.retry} />;
    }

    return this.props.children;
  }
}

// Default Error Fallback
export function ErrorFallback({ 
  error, 
  retry, 
  showDetails = false 
}: { 
  error: Error; 
  retry: () => void; 
  showDetails?: boolean;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Oops! Something went wrong
          </CardTitle>
          <CardDescription>
            We encountered an unexpected error. Don't worry, our team has been notified.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {showDetails && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm font-mono">
                {error.message}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={retry} className="flex-1">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/'} className="flex-1">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Network Error Component
export function NetworkError({ retry }: { retry: () => void }) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Connection Problem
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        We're having trouble connecting to our servers. Please check your internet connection.
      </p>
      <Button onClick={retry}>
        <RefreshCw className="w-4 h-4 mr-2" />
        Try Again
      </Button>
    </div>
  );
}

// Not Found Error
export function NotFoundError({ 
  title = "Page Not Found", 
  message = "The page you're looking for doesn't exist or has been moved.",
  showBackButton = true 
}: { 
  title?: string; 
  message?: string;
  showBackButton?: boolean;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <Card className="max-w-lg w-full text-center">
        <CardHeader>
          <div className="mx-auto text-8xl font-bold text-gray-300 dark:text-gray-600 mb-4">
            404
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </CardTitle>
          <CardDescription className="text-lg">
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {showBackButton && (
              <Button variant="outline" onClick={() => window.history.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            )}
            <Button onClick={() => window.location.href = '/'}>
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Unauthorized Error
export function UnauthorizedError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <Card className="max-w-lg w-full text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Access Denied
          </CardTitle>
          <CardDescription>
            You don't have permission to access this resource. Please sign in or contact support.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => window.location.href = '/auth/login'}>
              Sign In
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Empty State Component
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

// Inline Error Alert
export function InlineError({ 
  message, 
  retry, 
  variant = "destructive" 
}: { 
  message: string; 
  retry?: () => void;
  variant?: "default" | "destructive";
}) {
  return (
    <Alert variant={variant} className="my-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>{message}</span>
        {retry && (
          <Button variant="ghost" size="sm" onClick={retry} className="ml-2">
            <RefreshCw className="w-4 h-4" />
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}