import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useContractStore } from '../stores/contractStore.js';
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select.jsx';
import { Alert, AlertDescription } from '../components/ui/alert.jsx';
import { formatDate } from '../utils/formatters.js';

export const ContractDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    currentContract, 
    loading, 
    error, 
    fetchContract, 
    updateContractFields,
    updateContractStatus,
    fetchNextStatuses,
    clearError,
    clearCurrentContract
  } = useContractStore();
  
  const [fieldValues, setFieldValues] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [nextStatuses, setNextStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      fetchContract(id);
      loadNextStatuses(id);
    }
    
    // Cleanup when leaving page
    return () => {
      clearCurrentContract();
    };
  }, [id]);

  useEffect(() => {
    if (currentContract) {
      setFieldValues(currentContract.fieldValues || []);
      setSelectedStatus(currentContract.status);
    }
  }, [currentContract]);

  const loadNextStatuses = async (contractId) => {
    try {
      const result = await useContractStore.getState().fetchNextStatuses(contractId);
      setNextStatuses(result || []);
    } catch (error) {
      console.error('Error loading next statuses:', error);
    }
  };

  const handleFieldChange = (index, value) => {
    const updatedValues = [...fieldValues];
    updatedValues[index] = {
      ...updatedValues[index],
      value: value
    };
    setFieldValues(updatedValues);
  };

  const handleSaveFields = async () => {
    if (!currentContract) return;
    
    setIsSaving(true);
    try {
      await updateContractFields(currentContract._id, fieldValues);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving fields:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!currentContract || !selectedStatus) return;
    
    if (selectedStatus === currentContract.status) {
      alert('Contract is already in this status');
      return;
    }

    if (!window.confirm(`Are you sure you want to change status to ${selectedStatus}?`)) {
      return;
    }

    setStatusUpdating(true);
    try {
      await updateContractStatus(currentContract._id, selectedStatus);
      await loadNextStatuses(currentContract._id);
      alert('Status updated successfully!');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status: ' + (error.message || 'Unknown error'));
    } finally {
      setStatusUpdating(false);
    }
  };

  const getStatusVariant = (status) => {
    switch(status) {
      case 'CREATED': return 'outline';
      case 'APPROVED': return 'secondary';
      case 'SENT': return 'default';
      case 'SIGNED': return 'default';
      case 'LOCKED': return 'default';
      case 'REVOKED': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'CREATED': return 'text-blue-600 bg-blue-50';
      case 'APPROVED': return 'text-green-600 bg-green-50';
      case 'SENT': return 'text-yellow-600 bg-yellow-50';
      case 'SIGNED': return 'text-purple-600 bg-purple-50';
      case 'LOCKED': return 'text-gray-600 bg-gray-50';
      case 'REVOKED': return 'text-red-600 bg-red-50';
      default: return '';
    }
  };

  const canEdit = currentContract && 
    !['LOCKED', 'REVOKED'].includes(currentContract.status);

  if (loading && !currentContract) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading contract details...</p>
        </div>
      </div>
    );
  }

  if (error && !currentContract) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/')} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  if (!currentContract) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">Contract not found</h3>
              <p className="mt-1 text-gray-600">The contract you're looking for doesn't exist.</p>
              <Button onClick={() => navigate('/')} className="mt-4">
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="outline" asChild className="mb-4">
          <Link to="/">
            ← Back to Dashboard
          </Link>
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{currentContract.name}</h1>
            <p className="text-gray-600 mt-1">
              Blueprint: <span className="font-medium">{currentContract.blueprintName}</span>
            </p>
            <div className="mt-2 text-sm text-gray-500">
              Created: {formatDate(currentContract.createdAt)}
              {currentContract.updatedAt !== currentContract.createdAt && 
                ` • Updated: ${formatDate(currentContract.updatedAt)}`
              }
            </div>
          </div>
          <Badge variant={getStatusVariant(currentContract.status)} className={getStatusColor(currentContract.status)}>
            {currentContract.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Contract Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contract Fields</CardTitle>
              <CardDescription>
                {isEditing ? 'Edit contract field values' : 'View contract field values'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!canEdit && (
                <Alert className="mb-4">
                  <AlertDescription>
                    This contract is {currentContract.status.toLowerCase()} and cannot be edited.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                {fieldValues.map((field, index) => (
                  <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label} <span className="text-xs text-gray-500">({field.type})</span>
                    </Label>
                    
                    {isEditing && canEdit ? (
                      <>
                        {field.type === 'text' && (
                          <Input
                            value={field.value || ''}
                            onChange={(e) => handleFieldChange(index, e.target.value)}
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                          />
                        )}
                        
                        {field.type === 'date' && (
                          <Input
                            type="date"
                            value={field.value || ''}
                            onChange={(e) => handleFieldChange(index, e.target.value)}
                          />
                        )}
                        
                        {(field.type === 'checkbox' || field.type === 'signature') && (
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`field-${index}`}
                              checked={field.value || false}
                              onChange={(e) => handleFieldChange(index, e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <Label htmlFor={`field-${index}`} className="text-sm text-gray-700">
                              {field.value ? (field.type === 'signature' ? 'Signed' : 'Checked') : (field.type === 'signature' ? 'Not signed' : 'Unchecked')}
                            </Label>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-gray-900">
                        {field.type === 'checkbox' || field.type === 'signature' ? (
                          <Badge variant={field.value ? "default" : "outline"} className={field.value ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                            {field.value ? (field.type === 'signature' ? '✓ Signed' : '✓ Checked') : (field.type === 'signature' ? '✗ Not signed' : '✗ Unchecked')}
                          </Badge>
                        ) : (
                          <div className="p-2 bg-gray-50 rounded border">
                            {field.value || <span className="text-gray-400 italic">Not set</span>}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {fieldValues.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No fields defined for this contract.
                </div>
              )}

              {canEdit && (
                <div className="flex justify-end space-x-2 mt-6">
                  {isEditing ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setFieldValues(currentContract.fieldValues || []);
                        }}
                        disabled={isSaving}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveFields}
                        disabled={isSaving}
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>
                      Edit Fields
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Status & Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status Management</CardTitle>
              <CardDescription>
                Update contract lifecycle status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Status
                  </Label>
                  <div className="p-2 bg-gray-50 rounded border">
                    <Badge variant={getStatusVariant(currentContract.status)} className={getStatusColor(currentContract.status)}>
                      {currentContract.status}
                    </Badge>
                  </div>
                </div>

                {nextStatuses.length > 0 ? (
                  <div>
                    <Label htmlFor="new-status" className="block text-sm font-medium text-gray-700 mb-1">
                      Update to New Status
                    </Label>
                    <Select 
                      value={selectedStatus} 
                      onValueChange={setSelectedStatus}
                      disabled={statusUpdating}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select new status" />
                      </SelectTrigger>
                      <SelectContent>
                        {nextStatuses.map(status => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <div className="mt-4">
                      <Button 
                        onClick={handleStatusUpdate}
                        disabled={!selectedStatus || selectedStatus === currentContract.status || statusUpdating}
                        className="w-full"
                      >
                        {statusUpdating ? 'Updating...' : 'Update Status'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Alert>
                    <AlertDescription>
                      No further status transitions available for a {currentContract.status.toLowerCase()} contract.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Lifecycle Rules</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Created → Approved → Sent → Signed → Locked</li>
                    <li>• Created → Revoked</li>
                    <li>• Sent → Revoked</li>
                    <li>• Locked contracts are immutable</li>
                    <li>• Revoked contracts cannot move forward</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  View Timeline
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Share Contract
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContractDetailPage;