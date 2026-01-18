import { useEffect, useState } from 'react';
import { useContractStore } from '../../stores/contractStore';
import { useBlueprintStore } from '../../stores/blueprintStore';
import { formatDate } from '../../utils/formatters';
import { StatusBadge } from '../StatusBadge';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export const ContractTable = () => {
  const navigate = useNavigate();
  const { 
    contracts, 
    loading, 
    error, 
    fetchContracts,
    createContract,
    clearError 
  } = useContractStore();

  const { blueprints, fetchBlueprints } = useBlueprintStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newContract, setNewContract] = useState({
    name: '',
    blueprintId: ''
  });

  useEffect(() => {
    fetchContracts();
    fetchBlueprints();
  }, []);

  const handleCreateContract = async () => {
    if (!newContract.name.trim() || !newContract.blueprintId) {
      alert('Please fill all required fields');
      return;
    }

    try {
      await createContract(newContract);
      setNewContract({ name: '', blueprintId: '' });
      setShowCreateModal(false);
    } catch (error) {
      // Error handled by store
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Contracts</CardTitle>
          <CardDescription>Manage and track all contracts</CardDescription>
        </div>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Contract
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Contract</DialogTitle>
              <DialogDescription>
                Create a new contract from an existing blueprint
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Contract Name</Label>
                <Input
                  id="name"
                  value={newContract.name}
                  onChange={(e) => setNewContract({...newContract, name: e.target.value})}
                  placeholder="Enter contract name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="blueprint">Select Blueprint</Label>
                <Select 
                  value={newContract.blueprintId} 
                  onValueChange={(value) => setNewContract({...newContract, blueprintId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a blueprint" />
                  </SelectTrigger>
                  <SelectContent>
                    {blueprints.map(blueprint => (
                      <SelectItem key={blueprint._id} value={blueprint._id}>
                        {blueprint.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
              <Button onClick={handleCreateContract}>Create Contract</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading contracts...</p>
            </div>
          </div>
        ) : contracts.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-300">
              <svg className="h-full w-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No contracts yet</h3>
            <p className="mt-1 text-gray-600">Get started by creating your first contract</p>
            <Button className="mt-4" onClick={() => setShowCreateModal(true)}>Create Contract</Button>
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
                      <StatusBadge status={contract.status} />
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
  );
};