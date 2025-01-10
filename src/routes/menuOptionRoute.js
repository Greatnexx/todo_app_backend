import express from 'express';
import { createMenuOptions } from '../controllers/MenuOptions.controller/createMenuOption.controller.js';
import { protect } from '../middleware/authMiddleware.js';
import { getAllMenuOptions } from '../controllers/MenuOptions.controller/getAllMenuOptions.controller.js';
import { getSingleMenuOption } from '../controllers/MenuOptions.controller/getSingleMenuOption.controller.js';
import { updateMenuOption } from '../controllers/MenuOptions.controller/updateMenuOption.controller.js';
const router = express.Router();


router.post('/',protect,createMenuOptions)
router.post('/get',getAllMenuOptions)
router.get('/:menuOptionID',getSingleMenuOption)
router.put('/:id',protect,updateMenuOption)


export default router;