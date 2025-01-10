import asyncHandler from "express-async-handler";
import prisma from "../../prisma/client.js";

/**
 * @swagger
 * /api/menu-options/{menuOptionID}:
 *   get:
 *     summary: Retrieve a single menu option
 *     description: Fetches details of a specific menu option by its ID.
 *     tags:
 *       - Menu Options
 *     parameters:
 *       - in: path
 *         name: menuOptionID
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the menu option to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved the menu option.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: Details of the requested menu option.
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Unique ID of the menu option.
 *                     name:
 *                       type: string
 *                       description: Name of the menu option.
 *                     description:
 *                       type: string
 *                       description: Description of the menu option.
 *                     price:
 *                       type: number
 *                       format: float
 *                       description: Price of the menu option.
 *                     category_id:
 *                       type: string
 *                       description: The category ID the menu option belongs to.
 *                 message:
 *                   type: string
 *                   example: Menu option with id {menuOptionID} fetched successfully
 *       404:
 *         description: Menu option not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Menu option {menuOptionID} not found
 */


export const getSingleMenuOption = asyncHandler(async(req,res)=>{
    const {menuOptionID} = req.params;


    const menuOption = await prisma.menuOption.findUnique({
        where:{
            id:menuOptionID,
        }
    })
      if(!menuOption){
        throw new Error(`Menu option ${menuOptionID} not found`)
      }

      res.status(200).json({
        success: true,
        data:menuOption,
        message: `Menu option with id ${menuOptionID} fetched successfully`,
      })

})