const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/', async(req, res) => {
    try {
        // pagination
        const limit = req.query.limit === undefined ? 20 : Number(req.query.limit);
        const offset = req.query.offset === undefined ? 0 : Number(req.query.offset);

        // validate pagination
        if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
            return res.status(400).json({
                error: 'limit must be an integer between 1 and 100',
            });
        }

        if (!Number.isInteger(offset) || offset < 0) {
            return res.status(400).json({
                error: 'offset must be an integer greater than or equal to 0',
            });
        }

        // validate filters
        const { city, zipcode, minPrice, maxPrice, beds, baths } = req.query;

        if (city !== undefined && city.trim() === '') {
            return res.status(400).json({
                error: 'city must be a non-empty string',
            });
        }

        if (zipcode !== undefined && zipcode.trim() === '') {
            return res.status(400).json({
                error: 'zipcode must be a non-empty string',
            });
        }

        if (minPrice !== undefined && Number.isNaN(Number(minPrice))) {
            return res.status(400).json({
                error: 'minPrice must be a valid number',
            });
        }

        if (maxPrice !== undefined && Number.isNaN(Number(maxPrice))) {
            return res.status(400).json({
                error: 'maxPrice must be a valid number',
            });
        }

        if (beds !== undefined && Number.isNaN(Number(beds))) {
            return res.status(400).json({
                error: 'beds must be a valid number',
            });
        }

        if (baths !== undefined && Number.isNaN(Number(baths))) {
            return res.status(400).json({
                error: 'baths must be a valid number',
            });
        }


        // build base query for the data and total count
        let dataSql = 'SELECT * FROM rets_property';
        let countSql = 'SELECT COUNT(*) AS total FROM rets_property';

        const conditions = [];
        const values = [];

        // add filters
        if (city) {
            conditions.push('LOWER(TRIM(L_City)) = LOWER(TRIM(?))');
            values.push(city);
        }

        if (zipcode) {
            conditions.push('L_Zip = ?');
            values.push(zipcode);
        }

        if (minPrice !== undefined) {
            conditions.push('L_SystemPrice >= ?');
            values.push(Number(minPrice));
        }

        if (maxPrice !== undefined) {
            conditions.push('L_SystemPrice <= ?');
            values.push(Number(maxPrice));
        }

        if (beds !== undefined) {
            conditions.push('L_Keyword2 >= ?');
            values.push(Number(beds));
        }

        if (baths !== undefined) {
            conditions.push('LM_Dec_3 >= ?');
            values.push(Number(baths));
        }

        // concatenate sql parameters to make data, count sql query
        if (conditions.length > 0) {
            const whereClause = ' WHERE ' + conditions.join(' AND ');
            dataSql += whereClause;
            countSql += whereClause;
        }

        // get total count
        const [countRows] = await pool.query(countSql, values);
        const total = countRows[0].total;

        // add pagination to data sql query and get data
        dataSql += ' ORDER BY id LIMIT ? OFFSET ?';
        const dataValues = [...values, limit, offset];
        const [rows] = await pool.query(dataSql, dataValues);

        res.json({
            total,
            limit,
            offset,
            results: rows,
        });
    } catch (error) {
        console.error('Error fetching properties:', error.message);
        res.status(500).json({ error: 'Failed to fetch properties' });
    }
});

module.exports = router;
