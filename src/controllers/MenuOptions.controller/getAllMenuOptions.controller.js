import asyncHandler from "express-async-handler";
import prisma from "../../prisma/client.js";

/**
* @openapi
* /api/menu-options/get:
*   post:
*     tags:
*       - Menu Options
*     summary: Get all menu options with optional filtering, sorting, and pagination.
*     security: []
*     parameters:
*       - in: query
*         name: sort
*         schema:
*           type: array
*           items:
*             type: string
*             example: name:asc
*           description: |
*             Sort menu options by multiple fields. Each sort field should be in the format field:order, where field can be id, name, is_active, created_at, or updated_at, and order can be asc or desc.
*             Multiple sort fields can be specified by repeating the sort parameter, e.g., ?sort=name:asc&sort=id:desc.
*       - in: query
*         name: page
*         schema:
*           type: integer
*           default: 1
*         description: Page number for pagination
*       - in: query
*         name: limit
*         schema:
*           type: integer
*           default: 10
*         description: Number of items per page
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               menu_id:
*                 type: string
*                 description: Filter by menu ID
*               name:
*                 type: string
*                 description: Filter by menu option name
*               is_active:
*                 type: boolean
*                 description: Filter by active status
*     responses:
*       200:
*         description: List of menu options retrieved successfully.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 success:
*                   type: boolean
*                   example: true
*                 data:
*                   type: array
*                   items:
*                     type: object
*                     properties:
*                       id:
*                         type: string
*                       name:
*                         type: string
*                       is_active:
*                         type: boolean
*                       menu_id:
*                         type: string
*                 pagination:
*                   type: object
*                   properties:
*                     totalItems:
*                       type: integer
*                     totalPages:
*                       type: integer
*                     currentPage:
*                       type: integer
*       401:
*         description: Unauthorized - User needs to be authenticated.
*       404:
*         description: Not found - No menu options found.
*       500:
*         description: Internal server error - Unable to retrieve menu options.
*/




export const getAllMenuOptions = asyncHandler(async(req,res)=>{
    const {page=1,limit=10,sort}= req.query;
    const pageNumber = parseInt(page)|| 1
    const limitNumber = parseInt(limit) || 10
    const skip = (pageNumber - 1) * limitNumber


    const allowedFilters = ["name"," menu_id","multiple_selection","max_selection"]
    const filters = {}
    for (const filter of allowedFilters) {
        if (req.body?.[filter] !== undefined) {
          filters[filter] = req.body[filter];
        }
      }


      const allowedSorts = ["name","id"];
      const orderBy = []

      if (sort) {
        const sortFields = Array.isArray(sort) ? sort : [sort];
        for (const field of sortFields) {
          const [sortField, sortOrder] = field.split(":");
          if (allowedSorts.includes(sortField)) {
            orderBy.push({
              [sortField]: ["asc", "desc"].includes(sortOrder) ? sortOrder : "asc",
            });
          }
        }
      }


      const menuOption = await prisma.menuOption.findMany({
        where: filters,
        skip,
        take: limitNumber,
        orderBy,
      });

      const totalItems = await prisma.menuOption.count({
        where: filters,
      });
  
      const totalPages = Math.ceil(totalItems / limitNumber);
  
      res.status(200).json({
        success: true,
        data: menuOption,
        pagination: {
          totalItems,
          totalPages,
          currentPage: pageNumber,
        },
      });


})