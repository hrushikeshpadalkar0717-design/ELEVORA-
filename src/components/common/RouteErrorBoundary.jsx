import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

/**
 * Error boundary for lazy-loaded route chunk failures (e.g. temporary offline state,
 * stale cache after a new deployment). Provides a user-friendly retry mechanism.
 */
export class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Route lazy loading error caught by boundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center p-6 w-full">
          <div className="max-w-md w-full p-6 sm:p-8 rounded-2xl bg-white border border-rose-200/80 shadow-sm text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto mb-4 text-rose-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">
              Unable to load this section
            </h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              We encountered a network delay loading this view or an update was recently deployed. Please reload to fetch the latest version.
            </p>
            <div className="flex justify-center">
              <Button
                variant="primary"
                size="sm"
                icon={RotateCcw}
                onClick={this.handleRetry}
              >
                Reload Section
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
