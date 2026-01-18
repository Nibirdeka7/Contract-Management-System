import express from 'express';
import {
  createContract,
  getContracts,
  getContract,
  updateContractFields,
  updateContractStatus,
  getNextAvailableStatuses
} from '../controllers/contract.controller.js';

const router = express.Router();

router.route('/')
  .post(createContract)
  .get(getContracts);

router.route('/:id')
  .get(getContract);

router.route('/:id/fields')
  .put(updateContractFields);

router.route('/:id/status')
  .put(updateContractStatus);

router.route('/:id/next-statuses')
  .get(getNextAvailableStatuses);

export default router;