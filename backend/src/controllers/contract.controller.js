import Contract from '../models/Contract.js';
import Blueprint from '../models/Blueprint.js';
import { 
  validateTransition, 
  canModifyContract,
  getNextStatuses 
} from '../utils/lifecycleValidator.js';

export const createContract = async (req, res, next) => {
  try {
    const { name, blueprintId } = req.body;

    if (!name || !blueprintId) {
      return res.status(400).json({
        success: false,
        error: 'Name and blueprintId are required'
      });
    }

    
    const blueprint = await Blueprint.findById(blueprintId);
    if (!blueprint) {
      return res.status(404).json({
        success: false,
        error: 'Blueprint not found'
      });
    }

    const fieldValues = blueprint.fields.map(field => ({
      fieldId: field._id,
      type: field.type,
      label: field.label,
      value: null 
    }));

    const contract = await Contract.create({
      name,
      blueprintId: blueprint._id,
      blueprintName: blueprint.name,
      fieldValues,
      status: 'CREATED'
    });

    res.status(201).json({
      success: true,
      data: contract
    });
  } catch (error) {
    next(error);
  }
};


export const getContracts = async (req, res, next) => {
  try {
    const { status, blueprintId } = req.query;
    
    const filter = {};
    if (status) {
      if (status === 'active') {
        filter.status = { $in: ['CREATED', 'APPROVED', 'SENT'] };
      } else if (status === 'pending') {
        filter.status = { $in: ['CREATED', 'APPROVED'] };
      } else if (status === 'signed') {
        filter.status = { $in: ['SIGNED', 'LOCKED'] };
      } else {
        filter.status = status;
      }
    }
    
    if (blueprintId) {
      filter.blueprintId = blueprintId;
    }

    const contracts = await Contract.find(filter)
      .sort({ createdAt: -1 })
      .select('-fieldValues'); // Exclude fieldValues for list view

    res.status(200).json({
      success: true,
      count: contracts.length,
      data: contracts
    });
  } catch (error) {
    next(error);
  }
};


export const getContract = async (req, res, next) => {
  try {
    const contract = await Contract.findById(req.params.id);

    if (!contract) {
      return res.status(404).json({
        success: false,
        error: 'Contract not found'
      });
    }

    res.status(200).json({
      success: true,
      data: contract
    });
  } catch (error) {
    next(error);
  }
};

export const updateContractFields = async (req, res, next) => {
  try {
    const { fieldValues } = req.body;
    
    if (!Array.isArray(fieldValues)) {
      return res.status(400).json({
        success: false,
        error: 'fieldValues must be an array'
      });
    }

    const contract = await Contract.findById(req.params.id);
    
    if (!contract) {
      return res.status(404).json({
        success: false,
        error: 'Contract not found'
      });
    }

    if (!canModifyContract(contract.status)) {
      return res.status(400).json({
        success: false,
        error: `Cannot modify contract in ${contract.status} status`
      });
    }

    contract.fieldValues = fieldValues;
    await contract.save();

    res.status(200).json({
      success: true,
      data: contract
    });
  } catch (error) {
    next(error);
  }
};

export const updateContractStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required'
      });
    }

    const contract = await Contract.findById(req.params.id);
    
    if (!contract) {
      return res.status(404).json({
        success: false,
        error: 'Contract not found'
      });
    }

    const transitionValidation = validateTransition(contract.status, status);
    if (!transitionValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: transitionValidation.message
      });
    }

    contract.status = status;
    await contract.save();

    res.status(200).json({
      success: true,
      data: contract,
      message: `Status updated from ${contract._original?.status || 'previous'} to ${status}`
    });
  } catch (error) {
    next(error);
  }
};

export const getNextAvailableStatuses = async (req, res, next) => {
  try {
    const contract = await Contract.findById(req.params.id);
    
    if (!contract) {
      return res.status(404).json({
        success: false,
        error: 'Contract not found'
      });
    }

    const nextStatuses = getNextStatuses(contract.status);

    res.status(200).json({
      success: true,
      data: {
        currentStatus: contract.status,
        nextStatuses
      }
    });
  } catch (error) {
    next(error);
  }
};