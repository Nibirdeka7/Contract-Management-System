import Blueprint from '../models/Blueprint.js';


export const createBlueprint = async (req, res, next) => {
  try {
    const { name, fields } = req.body;
    if (!name || !fields || !Array.isArray(fields)) {
      return res.status(400).json({
        success: false,
        error: 'Name and fields array are required'
      });
    }
    const validFieldTypes = ['text', 'date', 'signature', 'checkbox'];
    for (const field of fields) {
      if (!validFieldTypes.includes(field.type)) {
        return res.status(400).json({
          success: false,
          error: `Invalid field type: ${field.type}. Must be one of: ${validFieldTypes.join(', ')}`
        });
      }
    }
    const blueprint = await Blueprint.create({
      name,
      fields
    });

    res.status(201).json({
      success: true,
      data: blueprint
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Blueprint with this name already exists'
      });
    }
    next(error);
  }
};

export const getBlueprints = async (req, res, next) => {
  try {
    const blueprints = await Blueprint.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: blueprints.length,
      data: blueprints
    });
  } catch (error) {
    next(error);
  }
};

export const getBlueprint = async (req, res, next) => {
  try {
    const blueprint = await Blueprint.findById(req.params.id);

    if (!blueprint) {
      return res.status(404).json({
        success: false,
        error: 'Blueprint not found'
      });
    }

    res.status(200).json({
      success: true,
      data: blueprint
    });
  } catch (error) {
    next(error);
  }
};