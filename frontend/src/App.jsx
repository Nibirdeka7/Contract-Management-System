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
                
                <h1 className="text-2xl font-bold text-gray-900"> <span className="text-red-900 text-2xl font-bold">Contract</span> Management System</h1>
              </div>
              <nav className="flex items-center space-x-4">
                <Button variant="ghost" asChild>
                  <Link to="/">Dashboard</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/blueprints">Blueprints</Link>
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

        
      </div>
    </Router>
  );
}

export default App;