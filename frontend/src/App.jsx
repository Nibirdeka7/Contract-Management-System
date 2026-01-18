import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import Dashboard from './pages/Dashboard';
import ContractDetailPage from './pages/ContractDetailPage';
import BlueprintPage from './pages/BlueprintPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <header className="border-b bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold">C</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">ContractFlow</h1>
              </div>
              <nav className="flex items-center space-x-4">
                <Button variant="ghost" asChild>
                  <Link to="/">Dashboard</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/blueprints">Blueprints</Link>
                </Button>
                <Button variant="outline" className="gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  New Contract
                </Button>
              </nav>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/contracts/:id" element={<ContractDetailPage />} />
            <Route path="/blueprints" element={<BlueprintPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="border-t bg-white mt-12">
          <div className="container mx-auto px-4 py-6">
            <p className="text-center text-sm text-gray-600">
              Contract Management Platform • Built with Node.js, React & MongoDB
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;