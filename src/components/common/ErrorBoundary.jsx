import React from 'react';
import Button from '../ui/Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      message: '',
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message: error?.message || 'Something went wrong while rendering this page.',
    };
  }

  componentDidCatch(error, errorInfo) {
    // Keep diagnostics in console for debugging while showing a recoverable UI to users.
    console.error('UI render error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen bg-dark-bg-primary text-dark-text-primary flex items-center justify-center p-6">
          <div className="w-full max-w-xl rounded-xl border border-dark-border bg-dark-surface-elevated p-6 sm:p-8 shadow-xl">
            <h1 className="text-2xl font-bold text-dark-text-primary">We hit a UI error</h1>
            <p className="mt-3 text-dark-text-secondary">
              The page failed to render correctly. Reload to recover. If this keeps happening, reconnect your wallet and try again.
            </p>
            <div className="mt-4 rounded-lg border border-dark-border-light bg-dark-surface-primary p-3">
              <p className="text-sm text-dark-text-tertiary">Error details</p>
              <p className="mt-1 break-words text-sm text-red-300">{this.state.message}</p>
            </div>
            <div className="mt-6 flex gap-3">
              <Button onClick={this.handleReload}>Reload</Button>
              <Button variant="outline" onClick={() => this.setState({ hasError: false, message: '' })}>
                Try Again
              </Button>
            </div>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
