import express from 'express';
import { createMenu } from '../controllers/Menus.controller/createMenu.controller.js';
import { protect } from '../middleware/authMiddleware.js';
import { getAllMenus } from '../controllers/Menus.controller/getAllMenus.controller.js';
import { getMenuByID } from '../controllers/Menus.controller/getSingleMenu.controller.js';
import { deleteMenu } from '../controllers/Menus.controller/deleteMenu.controller.js';
import { updateMenu } from '../controllers/Menus.controller/updateMenu.controller.js';
const router = express.Router();


router.post("/",protect,createMenu)
router.post("/get",getAllMenus)
router.get("/:menuID",getMenuByID)
router.delete("/:id",protect,deleteMenu)
router.put("/:id",protect,updateMenu)


export default router