const VALID_TRANSITIONS = {
  CREATED: ['APPROVED', 'REVOKED'],
  APPROVED: ['SENT'],
  SENT: ['SIGNED', 'REVOKED'],
  SIGNED: ['LOCKED'],
  LOCKED: [],
  REVOKED: [] 
};

/**
 * Check if a status transition is valid
 * @param {string} currentStatus - Current status of the contract
 * @param {string} newStatus - Desired new status
 * @returns {Object} { isValid: boolean, message: string }
 */
export const validateTransition = (currentStatus, newStatus) => {
  if (currentStatus === newStatus) {
    return {
      isValid: false,
      message: `Contract is already in status: ${currentStatus}`
    };
  }

  const allowedTransitions = VALID_TRANSITIONS[currentStatus];
  
  if (!allowedTransitions) {
    return {
      isValid: false,
      message: `Invalid current status: ${currentStatus}`
    };
  }

  if (!allowedTransitions.includes(newStatus)) {
    const allowedStr = allowedTransitions.length > 0 
      ? `Allowed: ${allowedTransitions.join(', ')}` 
      : 'No transitions allowed';
    
    return {
      isValid: false,
      message: `Cannot transition from ${currentStatus} to ${newStatus}. ${allowedStr}`
    };
  }

  return {
    isValid: true,
    message: `Valid transition: ${currentStatus} → ${newStatus}`
  };
};

/**
 * Check if a contract can be modified based on its status
 * @param {string} status - Contract status
 * @returns {boolean} True if contract can be modified
 */
export const canModifyContract = (status) => {
  const immutableStatuses = ['LOCKED', 'REVOKED'];
  return !immutableStatuses.includes(status);
};

/**
 * Get all valid next statuses for a given current status
 * @param {string} currentStatus - Current status
 * @returns {string[]} Array of valid next statuses
 */
export const getNextStatuses = (currentStatus) => {
  return VALID_TRANSITIONS[currentStatus] || [];
};

/**
 * Check if a contract can be deleted (optional - not in requirements but good practice)
 * @param {string} status - Contract status
 * @returns {boolean} True if contract can be deleted
 */
export const canDeleteContract = (status) => {
  const protectedStatuses = ['SENT', 'SIGNED', 'LOCKED'];
  return !protectedStatuses.includes(status);
};

export const TRANSITION_MAP = VALID_TRANSITIONS;