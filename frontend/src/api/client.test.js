import { fetchProperties } from './client';

describe('fetchProperties', () => {
  beforeEach(() => {
    globalThis.fetch = jest.fn();
  });

  // test 1
  test('returns parsed property data after a successful request', async () => {
    const mockData = {
      total: 1,
      limit: 20,
      offset: 0,
      results: [
        {
          id: 1,
          L_Address: '123 Main Street',
          L_City: 'Irvine',
        },
      ],
    };

    globalThis.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      text: jest.fn().mockResolvedValue(JSON.stringify(mockData)),
    });

    const result = await fetchProperties();

    expect(result).toEqual(mockData);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/properties',
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  });

  // test 2
  test('creates query parameters, omits empty values, and keeps a valid zero', async () => {
    globalThis.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      text: jest.fn().mockResolvedValue(
        JSON.stringify({
          total: 0,
          limit: 20,
          offset: 0,
          results: [],
        }),
      ),
    });

    await fetchProperties({
      city: 'Irvine',
      zipcode: '',
      minPrice: null,
      maxPrice: undefined,
      beds: 0,
      baths: '',
    });

    const requestedUrl = globalThis.fetch.mock.calls[0][0];
    const parsedUrl = new URL(requestedUrl, 'http://localhost');

    expect(parsedUrl.pathname).toBe('/api/properties');
    expect(parsedUrl.searchParams.get('city')).toBe('Irvine');
    expect(parsedUrl.searchParams.get('beds')).toBe('0');

    expect(parsedUrl.searchParams.has('zipcode')).toBe(false);
    expect(parsedUrl.searchParams.has('minPrice')).toBe(false);
    expect(parsedUrl.searchParams.has('maxPrice')).toBe(false);
    expect(parsedUrl.searchParams.has('baths')).toBe(false);
  });

  // test 3
  test('throws the server error message when the response is unsuccessful', async () => {
    globalThis.fetch.mockResolvedValue({
      ok: false,
      status: 500,
      text: jest.fn().mockResolvedValue(
        JSON.stringify({
          message: 'Database unavailable',
        }),
      ),
    });

    await expect(fetchProperties()).rejects.toMatchObject({
      message: 'Database unavailable',
      status: 500,
    });
  });
});