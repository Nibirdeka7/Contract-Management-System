import { useEffect, useState } from 'react';
import { useBlueprintStore } from '../stores/blueprintStore.js';
import { Button } from '../components/common/Button.jsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';
import { ErrorAlert } from '../components/common/ErrorAlert.jsx';

export const BlueprintPage = () => {
  const { 
    blueprints, 
    loading, 
    error, 
    fetchBlueprints, 
    createBlueprint,
    clearError 
  } = useBlueprintStore();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBlueprint, setNewBlueprint] = useState({
    name: '',
    fields: [{ type: 'text', label: '', position: { x: 0, y: 0 } }]
  });

  useEffect(() => {
    fetchBlueprints();
  }, []);

  const handleAddField = () => {
    setNewBlueprint({
      ...newBlueprint,
      fields: [
        ...newBlueprint.fields,
        { type: 'text', label: '', position: { x: 0, y: newBlueprint.fields.length * 50 } }
      ]
    });
  };

  const handleRemoveField = (index) => {
    const updatedFields = newBlueprint.fields.filter((_, i) => i !== index);
    setNewBlueprint({
      ...newBlueprint,
      fields: updatedFields
    });
  };

  const handleFieldChange = (index, field, value) => {
    const updatedFields = [...newBlueprint.fields];
    updatedFields[index] = {
      ...updatedFields[index],
      [field]: value
    };
    setNewBlueprint({
      ...newBlueprint,
      fields: updatedFields
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    if (!newBlueprint.name.trim()) {
      alert('Blueprint name is required');
      return;
    }
    
    for (const field of newBlueprint.fields) {
      if (!field.label.trim()) {
        alert('All fields must have a label');
        return;
      }
    }
    
    try {
      await createBlueprint(newBlueprint);
      setNewBlueprint({
        name: '',
        fields: [{ type: 'text', label: '', position: { x: 0, y: 0 } }]
      });
      setShowCreateForm(false);
    } catch (error) {
      // Error handled by store
    }
  };

  if (loading && blueprints.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Blueprints</h1>
        <p className="text-gray-600 mt-1">
          Reusable contract templates with customizable fields.
        </p>
      </div>

      {error && <ErrorAlert error={error} onDismiss={clearError} />}

      <div className="mb-6">
        <Button onClick={() => setShowCreateForm(true)}>
          Create New Blueprint
        </Button>
      </div>

      {/* Blueprint List */}
      <div className="bg-white rounded border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Available Blueprints</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {/* FIXED: Add null check for blueprints */}
          {Array.isArray(blueprints) && blueprints.map((blueprint) => (
            <div key={blueprint?._id || Math.random()} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  {/* FIXED: Add null check for blueprint.name */}
                  <h3 className="font-medium text-gray-900">{blueprint?.name || 'Unnamed Blueprint'}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {blueprint?.fields?.length || 0} field(s) • 
                    Created: {blueprint?.createdAt ? new Date(blueprint.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  ID: {blueprint?._id?.substring(0, 8) || 'N/A'}...
                </div>
              </div>
              
              <div className="mt-3">
                <div className="text-sm font-medium text-gray-700 mb-1">Fields:</div>
                <div className="flex flex-wrap gap-2">
                  {/* FIXED: Add null check for blueprint.fields */}
                  {blueprint?.fields?.map((field, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                    >
                      {field?.label || 'Unlabeled'} ({field?.type || 'text'})
                    </span>
                  )) || []}
                </div>
              </div>
            </div>
          ))}
        </div>

        {(!Array.isArray(blueprints) || blueprints.length === 0) && !loading && (
          <div className="text-center py-8 text-gray-500">
            No blueprints found. Create your first blueprint.
          </div>
        )}
      </div>

      {/* Create Blueprint Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Create New Blueprint</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Blueprint Name *
                </label>
                <input
                  type="text"
                  value={newBlueprint.name}
                  onChange={(e) => setNewBlueprint({...newBlueprint, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Non-Disclosure Agreement"
                  required
                />
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Fields *
                  </label>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleAddField}
                    className="text-sm"
                  >
                    Add Field
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {newBlueprint.fields.map((field, index) => (
                    <div key={index} className="border border-gray-200 rounded p-4">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-sm font-medium text-gray-700">
                          Field {index + 1}
                        </span>
                        {newBlueprint.fields.length > 1 && (
                          <Button
                            type="button"
                            variant="danger"
                            onClick={() => handleRemoveField(index)}
                            className="text-xs px-2 py-1"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Label *
                          </label>
                          <input
                            type="text"
                            value={field.label}
                            onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Company Name"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Type *
                          </label>
                          <select
                            value={field.type}
                            onChange={(e) => handleFieldChange(index, 'type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="text">Text</option>
                            <option value="date">Date</option>
                            <option value="checkbox">Checkbox</option>
                            <option value="signature">Signature (checkbox)</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="mt-3 text-xs text-gray-500">
                        Position: X: {field.position.x}, Y: {field.position.y}
                        (Positions are automatically assigned)
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                >
                  Create Blueprint
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlueprintPage;