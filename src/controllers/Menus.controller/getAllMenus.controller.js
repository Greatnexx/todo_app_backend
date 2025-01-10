import asyncHandler from "express-async-handler";
import prisma from "../../prisma/client.js";


/**
 * @openapi
 * /api/menus/get:
 *   post:
 *     tags:
 *       - Menus
 *     summary: Get all menu items for the vendor with optional filtering, sorting, and pagination.
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
 *             Sort menu items by multiple fields. Each sort field should be in the format field:order, where field can be id, price, name, is_active, is_available, created_at, or updated_at, and order can be asc or desc.
 *             Multiple sort fields can be specified by repeating the sort parameter, e.g., ?sort=name:asc&sort=price:desc.
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
 *               category_id:
 *                 type: string
 *                 description: Filter by category ID
 *               vendor_id:
 *                 type: string
 *                 description: Filter by vendor ID
 *               name:
 *                 type: string
 *                 description: Filter by menu item name
 *               is_active:
 *                 type: boolean
 *                 description: Filter by active status of the menu item
 *               is_available:
 *                 type: boolean
 *                 description: Filter by availability status of the menu item
 *     responses:
 *       200:
 *         description: List of menu items retrieved successfully.
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
 *                       description:
 *                         type: string
 *                       price:
 *                         type: integer
 *                       category_id:
 *                         type: string
 *                       vendor_id:
 *                         type: string
 *                       image_url:
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
 *         description: Unauthorized - Vendor needs to be authenticated.
 *       404:
 *         description: Not found - No menus found for the vendor.
 *       500:
 *         description: Internal server error - Unable to retrieve menus.
 */







export const getAllMenus = asyncHandler(async(req,res)=>{

    const {page= 1,limit=10,sort}= req.query;
    const pageNumber= parseInt(page, 10)||1
    const limitNumber= parseInt(limit, 10)||10
    const skip= (pageNumber-1)*limitNumber

    const allowedFilters = ["name","price","category_id",]
    const filters = {}
    for (const filter of allowedFilters) {
        if (req.body?.[filter] !== undefined) {
          filters[filter] = req.body[filter];
        }
      }


      const allowedSorts = ["id", "name", "price"];
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


      const menus = await prisma.menu.findMany({
        where: filters,
        skip,
        take: limitNumber,
        orderBy,
      });

      const totalItems = await prisma.menu.count({
        where: filters,
      });
  
      const totalPages = Math.ceil(totalItems / limitNumber);
  
      res.status(200).json({
        success: true,
        data: menus,
        pagination: {
          totalItems,
          totalPages,
          currentPage: pageNumber,
        },
      });



})