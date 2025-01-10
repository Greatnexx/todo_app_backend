import asyncHandler from "express-async-handler";
import prisma from "../../prisma/client.js";
import { ErrorCode } from "../../utils/Error/Error.js";

/** 
 @openapi
 * /api/menu-options/{id}:
 *   put:
 *     tags:
 *       - Menu Options
 *     summary: Update an existing menu option
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the menu option to be updated.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Menu Option Name"
 *               max_selection:
 *                 type: number
 *                 example: 3
 *               required:
 *                 type: boolean
 *                 example: true
 *               multiple_selection:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Menu option updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
*/


export const updateMenuOption =asyncHandler(async(req,res)=>{

    const {id}= req.params;
    const user_id =req?.user?.id

    const menuOption = await prisma.menuOption.findUnique({
        where:{
            id
        },
       
    })

    if(!menuOption){
        return res.status(404).json({message:"Menu Option not found"})
    }

    if(menuOption.user_id !== user_id){
        throw new Error('You are not permitted to update this menu option')

    }

    const updatedMenuOption = await prisma.menuOption.update({
        where:{
            id
        },
        data:req.body
    })

    res.status(200).json({
        success:true,
        data:updatedMenuOption,
        message:`Menu Option for ${id} updated successfully`
    })
 })

