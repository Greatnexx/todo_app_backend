import asyncHandler from "express-async-handler"
import prisma from "../../prisma/client.js";


/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete a user by ID
 *     description: Deletes a user by their unique ID. Returns a 404 error if the user does not exist.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the user to delete.
 *     responses:
 *       200:
 *         description: User deleted successfully.
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
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           description: The unique identifier of the deleted user.
 *                         username:
 *                           type: string
 *                           description: The username of the deleted user.
 *                         email:
 *                           type: string
 *                           format: email
 *                           description: The email address of the deleted user.
 *                         first_name:
 *                           type: string
 *                           description: The first name of the deleted user.
 *                         last_name:
 *                           type: string
 *                           description: The last name of the deleted user.
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           description: The date and time the user was created.
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           description: The date and time the user was last updated.
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully."
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to delete user."
 */

export const deleteUser= asyncHandler(async(req,res)=>{
    const {id}= req.params;

    const user = await prisma.user.delete({
        where:{id}
    })
    if(!user){
        throw new Error('User not found')
    }

    res.status(200).json({
        success:true,
        data:user,
        message:'User deleted successfully'
    })
 })





