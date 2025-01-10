import asyncHandler from "express-async-handler";
import prisma from "../../prisma/client.js";


/**
 * @openapi
 * /api/menus/{menuID}:
 *   get:
 *     tags:
 *       - Menus
 *     summary: Retrieve a specific menu item by its ID.
 *     description: Fetch a menu item using its unique ID.
 *     parameters:
 *       - in: path
 *         name: menuID
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the menu item.
 *     responses:
 *       200:
 *         description: Menu item retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "menu-id-123"
 *                     name:
 *                       type: string
 *                       example: "Grilled Chicken"
 *                     price:
 *                       type: number
 *                       example: 12.99
 *                     description:
 *                       type: string
 *                       example: "A delicious grilled chicken served with sides."
 *                     category_id:
 *                       type: string
 *                       example: "category-id-123"
 *                 message:
 *                   type: string
 *                   example: "Menu with menu-id-123 retrieved successfully."
 *       404:
 *         description: Menu item not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Menu with id menu-id-123 not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */


export const getMenuByID = asyncHandler(async(req,res)=>{

    const {menuID} =req.params;
    

    const menu = await prisma.menu.findUnique({
        where:{
            id:menuID
        },
        include:{
            menu_option:true
            
        }
    })


    if(!menu){
        res.status(404)
        throw new Error(`Menu with id ${menuID} not found`)
    }

    res.status(200).json({
        error:false,
        data:menu,
        message:`Menu with ${menuID} retrieved successfully`
    })

})