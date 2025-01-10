import asyncHandler from "express-async-handler";
import validator from "../../services/validationService.js";
import prisma from "../../prisma/client.js";


/**
 * @openapi
 * /api/menu-options:
 *   post:
 *     tags:
 *       - Menu Options
 *     summary: Create a menu option for a specific menu.
 *     description: Adds a new menu option to an existing menu. The menu must exist, and the request must include all required fields.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Extra Cheese"
 *               max_selection:
 *                 type: integer
 *                 example: 3
 *               required:
 *                 type: boolean
 *                 example: true
 *               menu_id:
 *                 type: string
 *                 example: "menu-id-123"
 *               multiple_selection:
 *                 type: boolean
 *                 example: false
 *             required:
 *               - name
 *               - max_selection
 *               - required
 *               - menu_id
 *               - multiple_selection
 *     responses:
 *       200:
 *         description: Menu option created successfully.
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
 *                       example: "menu-option-id-456"
 *                     name:
 *                       type: string
 *                       example: "Extra Cheese"
 *                     max_selection:
 *                       type: integer
 *                       example: 3
 *                     multiple_selection:
 *                       type: boolean
 *                       example: false
 *                     required:
 *                       type: boolean
 *                       example: true
 *                     menu_id:
 *                       type: string
 *                       example: "menu-id-123"
 *                     user_id:
 *                       type: string
 *                       example: "user-id-789"
 *                 message:
 *                   type: string
 *                   example: "Menu option created successfully."
 *       403:
 *         description: Validation error or unauthorized access.
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
 *                   example: "Validation failed."
 *       404:
 *         description: Menu not found.
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
 *                   example: "No menu found."
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


export const createMenuOptions = asyncHandler(async(req,res)=>{

    const validation = await validator.validateObject({
        name :"string|required",
        max_selection :"integer|required",
        required :"boolean",
        menu_id :"string|required",
        multiple_selection : "boolean|required"

    },{...req.body})

    if(validation.error){
        res.status(403).json(validation);
        return;
    }
    const {name,max_selection,required,menu_id,multiple_selection} = req.body;
    const user_id = req?.user?.id


    const menu = await prisma.menu.findUnique({
        where:{
            id:menu_id,
            
        }
    })

    if(!menu){
        throw new Error ("No menu found")
    }

    // check if multiple selection is false then max-selection cannot be greater than one
    if(!multiple_selection && max_selection > 1){
        throw new Error('Maxselection cannot be greater than one')

    }
    if(multiple_selection && max_selection < 1){
        throw new Error('Maxselection cannot be less than one')
    }

    const menuOption = await prisma.menuOption.create({
        data:{
            name,
            max_selection,
            multiple_selection,
            required,
            menu_id,
            user_id
        }

    })


    res.status(200).json({
        error:false,
        data:menuOption,
        message:"Menu option created successfully"
    })
 
})