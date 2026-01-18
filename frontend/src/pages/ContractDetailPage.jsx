import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContractStore } from '../stores/contractStore.js';
import { Button } from '../components/common/Button.jsx';
import { StatusBadge } from '../components/common/StatusBadge.jsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';
import { ErrorAlert } from '../components/common/ErrorAlert.jsx';
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
    clearError,
    clearCurrentContract
  } = useContractStore();
  
  const [fieldValues, setFieldValues] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id) {
      fetchContract(id);
    }
    
    // Cleanup when leaving page
    return () => {
      clearCurrentContract();
    };
  }, [id]);

  useEffect(() => {
    if (currentContract) {
      setFieldValues(currentContract.fieldValues || []);
    }
  }, [currentContract]);

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
      // Error handled by store
    } finally {
      setIsSaving(false);
    }
  };

  const canEdit = currentContract && 
    !['LOCKED', 'REVOKED'].includes(currentContract.status);

  if (loading && !currentContract) {
    return <LoadingSpinner />;
  }

  if (error && !currentContract) {
    return <ErrorAlert error={error} onDismiss={clearError} />;
  }

  if (!currentContract) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Contract not found</p>
        <Button 
          onClick={() => navigate('/')}
          className="mt-4"
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button 
          variant="secondary"
          onClick={() => navigate('/')}
          className="mb-4"
        >
          ← Back to Dashboard
        </Button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {currentContract.name}
            </h1>
            <p className="text-gray-600 mt-1">
              Blueprint: {currentContract.blueprintName}
            </p>
          </div>
          <StatusBadge status={currentContract.status} />
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          Created: {formatDate(currentContract.createdAt)}
          {currentContract.updatedAt !== currentContract.createdAt && 
            ` • Updated: ${formatDate(currentContract.updatedAt)}`
          }
        </div>
      </div>

      {error && <ErrorAlert error={error} onDismiss={clearError} />}

      <div className="bg-white rounded border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Contract Fields</h2>
          
          {canEdit && (
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="secondary"
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
        </div>

        {!canEdit && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-4">
            This contract is {currentContract.status.toLowerCase()} and cannot be edited.
          </div>
        )}

        <div className="space-y-4">
          {fieldValues.map((field, index) => (
            <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label} <span className="text-xs text-gray-500">({field.type})</span>
              </label>
              
              {isEditing && canEdit ? (
                <>
                  {field.type === 'text' && (
                    <input
                      type="text"
                      value={field.value || ''}
                      onChange={(e) => handleFieldChange(index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                  
                  {field.type === 'date' && (
                    <input
                      type="date"
                      value={field.value || ''}
                      onChange={(e) => handleFieldChange(index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                  
                  {field.type === 'checkbox' && (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={field.value || false}
                        onChange={(e) => handleFieldChange(index, e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-gray-700">
                        {field.value ? 'Checked' : 'Unchecked'}
                      </span>
                    </div>
                  )}
                  
                  {field.type === 'signature' && (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={field.value || false}
                        onChange={(e) => handleFieldChange(index, e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-gray-700">
                        {field.value ? 'Signed' : 'Not signed'}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-gray-900">
                  {field.type === 'checkbox' || field.type === 'signature' ? (
                    <span className={`px-2 py-1 rounded text-sm ${field.value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {field.value ? (field.type === 'signature' ? 'Signed' : 'Checked') : (field.type === 'signature' ? 'Not signed' : 'Unchecked')}
                    </span>
                  ) : (
                    <span>{field.value || <span className="text-gray-400 italic">Not set</span>}</span>
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
      </div>
    </div>
  );
};

export default ContractDetailPage;