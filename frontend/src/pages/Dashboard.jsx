import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { useContractStore } from '../stores/contractStore';
import { formatDate } from '../utils/formatters';

// Install tabs if not installed: npx shadcn-ui@latest add tabs

export const Dashboard = () => {
  const { 
    contracts, 
    loading, 
    fetchContracts 
  } = useContractStore();

  useEffect(() => {
    fetchContracts();
  }, []);

  const getStatusVariant = (status) => {
    switch(status) {
      case 'CREATED': return 'outline';
      case 'APPROVED': return 'secondary';
      case 'SENT': return 'warning';
      case 'SIGNED': return 'success';
      case 'LOCKED': return 'default';
      case 'REVOKED': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'CREATED': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'APPROVED': return 'text-green-600 bg-green-50 border-green-200';
      case 'SENT': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'SIGNED': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'LOCKED': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'REVOKED': return 'text-red-600 bg-red-50 border-red-200';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading contracts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contract Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage your contracts, track status, and monitor lifecycle transitions
          </p>
        </div>
        <Button className="gap-2">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Contract
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {contracts.filter(c => ['CREATED', 'APPROVED', 'SENT'].includes(c.status)).length}
            </div>
            <p className="text-sm text-gray-600 mt-1">Ready for action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {contracts.filter(c => ['CREATED', 'APPROVED'].includes(c.status)).length}
            </div>
            <p className="text-sm text-gray-600 mt-1">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {contracts.filter(c => ['SIGNED', 'LOCKED'].includes(c.status)).length}
            </div>
            <p className="text-sm text-gray-600 mt-1">Signed and locked</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Contracts</CardTitle>
          <CardDescription>
            View, manage, and track all your contracts in one place
          </CardDescription>
        </CardHeader>
        <CardContent>
          {contracts.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-24 w-24 text-gray-300">
                <svg className="h-full w-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No contracts yet</h3>
              <p className="mt-1 text-gray-600">Get started by creating your first contract</p>
              <Button className="mt-4">Create Contract</Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contract Name</TableHead>
                    <TableHead>Blueprint</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contracts.map((contract) => (
                    <TableRow key={contract._id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-md bg-blue-100 flex items-center justify-center">
                            <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <span>{contract.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">{contract.blueprintName}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(contract.status)} className={getStatusColor(contract.status)}>
                          {contract.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">{formatDate(contract.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm">View</Button>
                          {!['LOCKED', 'REVOKED'].includes(contract.status) && (
                            <Button size="sm">Update</Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;