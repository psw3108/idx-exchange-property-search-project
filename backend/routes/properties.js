const express = require('express');
const pool = require('../db');
const router = express.Router();

// Paginated, filterable endpoint
router.get('/', async (req, res) => {
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
        let { city, zipcode, minPrice, maxPrice, beds, baths } = req.query;

        // guard against ?city=a&city=b -> array, and non-string input
        if (city !== undefined && typeof city !== 'string') {
            return res.status(400).json({ error: 'city must be a single string value' });
        }
        if (zipcode !== undefined && typeof zipcode !== 'string') {
            return res.status(400).json({ error: 'zipcode must be a single string value' });
        }

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

        // Number('') === 0, not NaN, so explicitly reject empty strings first
        const isBlank = (v) => v !== undefined && String(v).trim() === '';

        if (minPrice !== undefined && (isBlank(minPrice) || Number.isNaN(Number(minPrice)))) {
            return res.status(400).json({
                error: 'minPrice must be a valid number',
            });
        }

        if (maxPrice !== undefined && (isBlank(maxPrice) || Number.isNaN(Number(maxPrice)))) {
            return res.status(400).json({
                error: 'maxPrice must be a valid number',
            });
        }

        if (beds !== undefined && (isBlank(beds) || Number.isNaN(Number(beds)))) {
            return res.status(400).json({
                error: 'beds must be a valid number',
            });
        }

        if (baths !== undefined && (isBlank(baths) || Number.isNaN(Number(baths)))) {
            return res.status(400).json({
                error: 'baths must be a valid number',
            });
        }

        // Dynamic Sorting with Allowlist Validation
        const sortByParam = req.query.sortBy;     
        const sortOrderParam = req.query.sortOrder; 

        const allowedColumns = {
            price: 'L_SystemPrice',
            dateListed: 'ListingContractDate',
            sqft: 'LM_Int2_3',
            beds: 'L_Keyword2'
        };

        // validate sort parameters
        if (sortByParam !== undefined && !allowedColumns[sortByParam]) {
            return res.status(400).json({
                error: 'Invalid sort value',
            });
        }

        if (sortOrderParam !== undefined && !['ASC', 'DESC'].includes(String(sortOrderParam).toUpperCase())) {
            return res.status(400).json({
                error: 'Invalid sort order',
            });
        }

        // Map parameter to valid column
        const sortBy = allowedColumns[sortByParam] || 'id';
        const sortOrder = sortOrderParam ? String(sortOrderParam).toUpperCase() : 'ASC';


        // build base query for the data and total count
        // TODO: replace SELECT * with only the columns the frontend actually needs to cut down on I/O and network transfer.
        let dataSql = 'SELECT * FROM rets_property';
        let countSql = 'SELECT COUNT(*) AS total FROM rets_property';

        const conditions = [];
        const values = [];

        // add filters
        if (city) {
            conditions.push('L_City = ?');
            values.push(city.trim());
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
            conditions.push('L_Keyword2 = ?');
            values.push(Number(beds));
        }

        if (baths !== undefined) {
            conditions.push('LM_Dec_3 = ?');
            values.push(Number(baths));
        }

        // concatenate sql parameters to make data, count sql query
        if (conditions.length > 0) {
            const whereClause = ' WHERE ' + conditions.join(' AND ');
            dataSql += whereClause;
            countSql += whereClause;
        }

        // concatenate sorting
        dataSql += ` ORDER BY ${sortBy} ${sortOrder}, id ASC`;

        // concatenate pagination
        dataSql += ' LIMIT ? OFFSET ?';
        const dataValues = [...values, limit, offset];

        // run count + data queries concurrently
        const [[countRows], [rows]] = await Promise.all([
            pool.query(countSql, values),
            pool.query(dataSql, dataValues),
        ]);

        const total = countRows[0].total;

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

// Open houses by property ID endpoint
router.get('/:id/openhouses', async (req, res) => {
    const { id } = req.params;

    // validate ID
    if (!Number.isInteger(Number(id)) || Number(id) <= 0 || Number(id) > 2147483647) {
        return res.status(400).json({
            error: 'id must be a positive integer within valid range',
        });
    }

    try {
        // get only the listing ID column
        const [rows] = await pool.query(
            'SELECT L_ListingID FROM rets_property WHERE id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                error: `Property with id ${id} not found`,
            });
        }

        const listingId = rows[0].L_ListingID;

        // get open houses for this listing
        const [openHouses] = await pool.query(
            'SELECT * FROM rets_openhouse WHERE L_ListingID = ? ORDER BY OpenHouseDate, OH_StartTime',
            [listingId]
        );

        res.json(openHouses);
    } catch (err) {
        console.error('Error fetching open houses:', err);
        res.status(500).json({
            error: 'Error fetching open houses',
        });
    }
});

// Property by ID endpoint
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0 || Number(id) > 2147483647) {
        return res.status(400).json({
            error: 'id must be a positive integer within valid range',
        });
    }

    try {
        const [rows] = await pool.query(
            'SELECT * FROM rets_property WHERE id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                error: `Property with id ${id} not found`,
            });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error('Error fetching property by id:', err);
        res.status(500).json({
            error: 'Error fetching property',
        });
    }
});

module.exports = router;