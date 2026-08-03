import React, { Component, ErrorInfo, ReactNode } from 'react';
import { VizuErrorFallback } from './VizuErrorFallback';

export interface ErrorBoundaryProps {
  children?: ReactNode;
  fallback?: ReactNode | ((props: { error?: Error; reset: () => void }) => ReactNode);
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: undefined,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an unhandled rendering error:', error, errorInfo);
  }

  public resetError = (): void => {
    this.setState({ hasError: false, error: undefined });
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback({ error: this.state.error, reset: this.resetError });
      }
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return <VizuErrorFallback error={this.state.error} reset={this.resetError} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
