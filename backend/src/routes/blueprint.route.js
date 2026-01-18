import express from 'express';
import {
  createBlueprint,
  getBlueprints,
  getBlueprint
} from '../controllers/blueprint.controller.js';

const router = express.Router();

router.route('/')
  .post(createBlueprint)
  .get(getBlueprints);

router.route('/:id')
  .get(getBlueprint);

export default router;