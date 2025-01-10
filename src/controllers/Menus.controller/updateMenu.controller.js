import asyncHandler from "express-async-handler";
import prisma from "../../prisma/client.js";

/**
 * @openapi
 * /api/menus/{id}:
 *   put:
 *     summary: Update a menu item
 *     description: Updates a menu item for the authenticated user. Only allowed fields can be updated.
 *     tags:
 *       - Menus
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the menu item to be updated.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the menu item.
 *               description:
 *                 type: string
 *                 description: The description of the menu item.
 *               price:
 *                 type: number
 *                 format: float
 *                 description: The price of the menu item.
 *               category_id:
 *                 type: string
 *                 description: The ID of the category the menu item belongs to.
 *             example:
 *               name: Grilled Chicken Sandwich
 *               description: A tasty grilled chicken sandwich.
 *               price: 8.99
 *               category_id: "12345"
 *     responses:
 *       200:
 *         description: Menu item updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   description: The updated menu item details.
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Menu updated successfully
 *       400:
 *         description: Invalid request body or no valid fields provided for update.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Invalid request body
 *       403:
 *         description: Forbidden. User is not permitted to update the menu item.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: You are not permitted to update this menu
 *       404:
 *         description: Menu item not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Menu not found for {id}
 */




export const updateMenu = asyncHandler(async(req,res)=>{
    const {id}=  req.params;
    const user_id = req?.user?.id;

    const allowedUpdates = ['name', 'description', 'price', 'category_id']

    if(!Object.keys(req?.body).length ){
        res.status(400)
        throw new Error(ErrorCode.INVALID_REQUEST_BODY)
       }

       const data ={}
       for (const  key of allowedUpdates){
        if(req?.body?.hasOwnProperty(key)){
          data[key] = req.body[key]
        }
       }

       if(!Object.keys(data).length ){
        res.status(400)
        throw new Error(ErrorCode.INVALID_REQUEST_BODY)
       }


    const menu = await prisma.menu.findUnique({
        where:{
            id
        }
    })

    if(!menu){
        res.status(404)
        throw new Error(`Menu not found for ${id}`)
    }

    if(menu.user_id !== user_id){
        res.status(403)
        throw new Error('You are not permitted to delete this menu')
    }

    const updateMenu = await prisma.menu.update({
        where:{
            id
        },
        data:data
    })

    res.status(200).json({
        success: true,
        data: updateMenu,  
        error: false, 
        message: "Menu updated  successfully"
    })

})