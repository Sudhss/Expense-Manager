import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            hasError: false, 
            error: null,
            errorInfo: null 
        };
    }

    static getDerivedStateFromError(error) {
        return { 
            hasError: true,
            error: error
        };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({ errorInfo });
    }

    handleReset = () => {
        this.setState({ 
            hasError: false,
            error: null,
            errorInfo: null 
        });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-red-50 to-red-100">
                    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl">
                        <div className="flex flex-col items-center text-center">
                            <div className="p-4 mb-6 bg-red-100 rounded-full">
                                <AlertTriangle className="w-12 h-12 text-red-600" />
                            </div>
                            
                            <h1 className="text-2xl font-bold text-gray-900">
                                Oops! Something went wrong
                            </h1>
                            
                            <p className="mt-2 text-gray-600">
                                {this.state.error?.message || 'An unexpected error occurred'}
                            </p>
                            
                            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                                <details className="w-full mt-4 p-4 text-left text-sm bg-gray-50 rounded-lg overflow-auto max-h-60">
                                    <summary className="font-medium text-gray-700 cursor-pointer">
                                        Error Details
                                    </summary>
                                    <pre className="mt-2 text-red-600 whitespace-pre-wrap">
                                        {this.state.errorInfo.componentStack}
                                    </pre>
                                </details>
                            )}
                            
                            <div className="flex flex-col sm:flex-row gap-3 mt-8 w-full">
                                <button
                                    onClick={this.handleReset}
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Try Again
                                </button>
                                
                                <button
                                    onClick={() => window.location.reload()}
                                    className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium text-gray-700"
                                >
                                    Reload Page
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children; 
    }
}

export default ErrorBoundary;
