import asyncHandler from "express-async-handler";
import prisma from "../../prisma/client.js";

/**
 * @openapi
 * /api/categories/get:
 *   post:
 *     tags:
 *       - Categories
 *     summary: Get all categories with pagination, filtering, and sorting.
 *     description: Retrieve a paginated list of categories, allowing optional filtering by `name` and sorting by `name` or `id`.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of items to retrieve per page.
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           description: Fields to sort by, formatted as `field:order` (e.g., `name:asc` or `id:desc`). Multiple sorts can be comma-separated.
 *       - in: body
 *         name: filters
 *         description: Filters for retrieving categories. Currently, only `name` is supported.
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               example: "Electronics"
 *     responses:
 *       200:
 *         description: Successfully retrieved categories.
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
 *                         example: "category-id-123"
 *                       name:
 *                         type: string
 *                         example: "Electronics"
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                       example: 25
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: Invalid request parameters.
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
 *                   example: "Invalid query parameters."
 *       500:
 *         description: Internal server error.
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
 *                   example: "Internal server error."
 */

export const getAllCategory = asyncHandler(async(req,res)=>{

const {page= 1,limit=10,sort}= req.query;
const pageNumber= parseInt(page)||1
const limitNumber= parseInt(limit)||10
const skip= (pageNumber-1)*limitNumber

    const allowedFilters = ["name"]
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


      const categories = await prisma.category.findMany({
        where: filters,
        skip,
        take: limitNumber,
        orderBy,
      });

      const totalItems = await prisma.category.count({
        where: filters,
      });
  
      const totalPages = Math.ceil(totalItems / limitNumber);
  
      res.status(200).json({
        success: true,
        data: categories,
        pagination: {
          totalItems,
          totalPages,
          currentPage: pageNumber,
        },
      });


})