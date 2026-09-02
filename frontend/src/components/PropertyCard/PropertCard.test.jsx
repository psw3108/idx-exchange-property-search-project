import { render, screen } from '@testing-library/react';
import PropertyCard from './PropertyCard';

const mockProperty = {
  id: 123,
  L_Photos: '["photo1.jpg", "photo2.jpg"]',
  L_SystemPrice: 750000,
  L_Keyword2: 3,
  LM_Dec_3: 2.5,
  LM_Int2_3: 1800,
  L_Address: '123 Main St',
  L_City: 'Irvine',
  L_State: 'CA',
  L_Zip: '92612',
};

describe('PropertyCard', () => {
  test('renders property data', () => {
    render(<PropertyCard property={mockProperty} />);

    expect(screen.getByText('$750,000')).toBeInTheDocument();
    expect(screen.getByText('3 bds')).toBeInTheDocument();
    expect(screen.getByText('2.5 ba')).toBeInTheDocument();
    expect(screen.getByText('1,800 sqft')).toBeInTheDocument();
    expect(screen.getByText('123 Main St')).toBeInTheDocument();
    expect(screen.getByText('Irvine, CA, 92612')).toBeInTheDocument();
  });

  test('renders N/A when property price is missing', () => {
  const propertyWithoutPrice = {
    ...mockProperty,
    L_SystemPrice: null,
  };

  render(<PropertyCard property={propertyWithoutPrice} />);

  expect(screen.getByText('$N/A')).toBeInTheDocument();
});
});