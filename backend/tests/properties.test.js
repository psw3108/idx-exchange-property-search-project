const request = require('supertest');

jest.mock('../db', () => ({
  query: jest.fn(),
}));

const pool = require('../db');
const app = require('../app');

describe('Property API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =========================================================
  // GET /api/properties
  // =========================================================

  describe('GET /api/properties', () => {
    const mockProperties = [
      {
        id: 1,
        L_ListingID: 'LIST001',
        L_Address: '123 Main St',
        L_City: 'Irvine',
        L_State: 'CA',
        L_Zip: '92612',
        L_SystemPrice: 750000,
        L_Keyword2: 3,
        LM_Dec_3: 2,
        LM_Int2_3: 1800,
      },
      {
        id: 2,
        L_ListingID: 'LIST002',
        L_Address: '456 Oak St',
        L_City: 'Irvine',
        L_State: 'CA',
        L_Zip: '92618',
        L_SystemPrice: 900000,
        L_Keyword2: 4,
        LM_Dec_3: 3,
        LM_Int2_3: 2200,
      },
    ];

    test('returns properties successfully', async () => {
      // Promise.all runs:
      // 1. count query
      // 2. data query
      pool.query
        .mockResolvedValueOnce([[{ total: 2 }]])
        .mockResolvedValueOnce([mockProperties]);

      const response = await request(app)
        .get('/api/properties');

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        total: 2,
        limit: 20,
        offset: 0,
        results: mockProperties,
      });
    });

    test('supports pagination', async () => {
      pool.query
        .mockResolvedValueOnce([[{ total: 2 }]])
        .mockResolvedValueOnce([[mockProperties[1]]]);

      const response = await request(app)
        .get('/api/properties?limit=1&offset=1');

      expect(response.status).toBe(200);
      expect(response.body.limit).toBe(1);
      expect(response.body.offset).toBe(1);
      expect(response.body.results).toHaveLength(1);

      // Data query is the second pool.query call.
      expect(pool.query.mock.calls[1][1]).toEqual([1, 1]);
    });

    test('filters by city', async () => {
      pool.query
        .mockResolvedValueOnce([[{ total: 2 }]])
        .mockResolvedValueOnce([mockProperties]);

      const response = await request(app)
        .get('/api/properties?city=Irvine');

      expect(response.status).toBe(200);

      const dataCall = pool.query.mock.calls[1];

      expect(dataCall[0]).toContain('L_City = ?');
      expect(dataCall[1]).toContain('Irvine');
    });

    test('filters by zipcode', async () => {
      pool.query
        .mockResolvedValueOnce([[{ total: 1 }]])
        .mockResolvedValueOnce([[mockProperties[0]]]);

      const response = await request(app)
        .get('/api/properties?zipcode=92612');

      expect(response.status).toBe(200);

      const dataCall = pool.query.mock.calls[1];

      expect(dataCall[0]).toContain('L_Zip = ?');
      expect(dataCall[1]).toContain('92612');
    });

    test('filters by minimum price', async () => {
      pool.query
        .mockResolvedValueOnce([[{ total: 2 }]])
        .mockResolvedValueOnce([mockProperties]);

      const response = await request(app)
        .get('/api/properties?minPrice=500000');

      expect(response.status).toBe(200);

      const dataCall = pool.query.mock.calls[1];

      expect(dataCall[0]).toContain('L_SystemPrice >= ?');
      expect(dataCall[1]).toContain(500000);
    });

    test('filters by maximum price', async () => {
      pool.query
        .mockResolvedValueOnce([[{ total: 2 }]])
        .mockResolvedValueOnce([mockProperties]);

      const response = await request(app)
        .get('/api/properties?maxPrice=1000000');

      expect(response.status).toBe(200);

      const dataCall = pool.query.mock.calls[1];

      expect(dataCall[0]).toContain('L_SystemPrice <= ?');
      expect(dataCall[1]).toContain(1000000);
    });

    test('filters by beds', async () => {
      pool.query
        .mockResolvedValueOnce([[{ total: 2 }]])
        .mockResolvedValueOnce([mockProperties]);

      const response = await request(app)
        .get('/api/properties?beds=3');

      expect(response.status).toBe(200);

      const dataCall = pool.query.mock.calls[1];

      expect(dataCall[0]).toContain('L_Keyword2 = ?');
      expect(dataCall[1]).toContain(3);
    });

    test('filters by baths', async () => {
      pool.query
        .mockResolvedValueOnce([[{ total: 2 }]])
        .mockResolvedValueOnce([mockProperties]);

      const response = await request(app)
        .get('/api/properties?baths=2');

      expect(response.status).toBe(200);

      const dataCall = pool.query.mock.calls[1];

      expect(dataCall[0]).toContain('LM_Dec_3 = ?');
      expect(dataCall[1]).toContain(2);
    });

    test.each([
      ['/api/properties?limit=0'],
      ['/api/properties?limit=101'],
      ['/api/properties?limit=abc'],
      ['/api/properties?offset=-1'],
      ['/api/properties?offset=abc'],
      ['/api/properties?city='],
      ['/api/properties?zipcode='],
      ['/api/properties?minPrice=abc'],
      ['/api/properties?maxPrice=abc'],
      ['/api/properties?beds=abc'],
      ['/api/properties?baths=abc'],
      ['/api/properties?sortBy=invalid'],
      ['/api/properties?sortOrder=INVALID'],
    ])('returns 400 for invalid input: %s', async (url) => {
      const response = await request(app).get(url);

      expect(response.status).toBe(400);
    });
  });

  // =========================================================
  // GET /api/properties/:id
  // =========================================================

  describe('GET /api/properties/:id', () => {
    const mockProperty = {
      id: 1,
      L_ListingID: 'LIST001',
      L_Address: '123 Main St',
      L_City: 'Irvine',
      L_State: 'CA',
      L_Zip: '92612',
      L_SystemPrice: 750000,
      L_Keyword2: 3,
      LM_Dec_3: 2,
      LM_Int2_3: 1800,
    };

    test('returns a property successfully', async () => {
      pool.query.mockResolvedValueOnce([[mockProperty]]);

      const response = await request(app)
        .get('/api/properties/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProperty);

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM rets_property WHERE id = ?',
        ['1']
      );
    });

    test('returns 404 when property does not exist', async () => {
      pool.query.mockResolvedValueOnce([[]]);

      const response = await request(app)
        .get('/api/properties/999999');

      expect(response.status).toBe(404);

      expect(response.body).toEqual({
        error: 'Property with id 999999 not found',
      });
    });

    test.each([
      '/api/properties/abc',
      '/api/properties/0',
      '/api/properties/-1',
      '/api/properties/2147483648',
    ])('returns 400 for invalid property ID: %s', async (url) => {
      const response = await request(app).get(url);

      expect(response.status).toBe(400);
    });
  });

  // =========================================================
  // GET /api/properties/:id/openhouses
  // =========================================================

  describe('GET /api/properties/:id/openhouses', () => {
    const mockOpenHouses = [
      {
        L_ListingID: 'LIST001',
        OpenHouseDate: '2026-09-10',
        OH_StartTime: '10:00:00',
        OH_EndTime: '13:00:00',
      },
    ];

    test('returns open houses successfully', async () => {
      pool.query
        .mockResolvedValueOnce([
          [{ L_ListingID: 'LIST001' }],
        ])
        .mockResolvedValueOnce([
          mockOpenHouses,
        ]);

      const response = await request(app)
        .get('/api/properties/1/openhouses');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockOpenHouses);

      expect(pool.query).toHaveBeenNthCalledWith(
        1,
        'SELECT L_ListingID FROM rets_property WHERE id = ?',
        ['1']
      );

      expect(pool.query).toHaveBeenNthCalledWith(
        2,
        'SELECT * FROM rets_openhouse WHERE L_ListingID = ? ORDER BY OpenHouseDate, OH_StartTime',
        ['LIST001']
      );
    });

    test('returns empty results when property has no open houses', async () => {
      pool.query
        .mockResolvedValueOnce([
          [{ L_ListingID: 'LIST001' }],
        ])
        .mockResolvedValueOnce([[]]);

      const response = await request(app)
        .get('/api/properties/1/openhouses');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    test('returns 404 when property does not exist', async () => {
      pool.query.mockResolvedValueOnce([[]]);

      const response = await request(app)
        .get('/api/properties/999999/openhouses');

      expect(response.status).toBe(404);

      expect(response.body).toEqual({
        error: 'Property with id 999999 not found',
      });
    });
  });
});