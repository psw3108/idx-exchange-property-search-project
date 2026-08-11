import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PropertyFilters from './PropertyFilters';

describe('PropertyFilters', () => {
  // test 1
  test('renders all six filter controls', () => {
    render(<PropertyFilters onApply={jest.fn()} />);

    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/zip code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/min price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/max price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/beds/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/baths/i)).toBeInTheDocument();
  });

  // test 2
  test('submits multiple filter values through the form', async () => {
    const user = userEvent.setup();
    const mockonApply = jest.fn();

    render(<PropertyFilters onApply={mockonApply} />);

    await user.type(screen.getByLabelText(/city/i), 'Irvine');
    await user.type(screen.getByLabelText(/zip code/i), '92612');
    await user.type(screen.getByLabelText(/min price/i), '500000');
    await user.type(screen.getByLabelText(/max price/i), '1000000');

    await user.selectOptions(screen.getByLabelText(/beds/i), '3');
    await user.selectOptions(screen.getByLabelText(/baths/i), '2');

    await user.click(
      screen.getByRole('button', { name: /^search$/i }),
    );

    expect(mockonApply).toHaveBeenCalledTimes(1);

    expect(mockonApply).toHaveBeenCalledWith({
      city: 'Irvine',
      zipcode: '92612',
      minPrice: '500000',
      maxPrice: '1000000',
      beds: '3',
      baths: '2',
    });
  });

  // test 3
  test('clear resets all controls and passes empty filters', async () => {
    const user = userEvent.setup();
    const mockonApply = jest.fn();

    render(<PropertyFilters onApply={mockonApply} />);

    const cityInput = screen.getByLabelText(/city/i);
    const zipcodeInput = screen.getByLabelText(/zip code/i);
    const minPriceInput = screen.getByLabelText(/min price/i);
    const maxPriceInput = screen.getByLabelText(/max price/i);
    const bedsSelect = screen.getByLabelText(/beds/i);
    const bathsSelect = screen.getByLabelText(/baths/i);

    await user.type(cityInput, 'Irvine');
    await user.type(zipcodeInput, '92612');
    await user.type(minPriceInput, '500000');
    await user.type(maxPriceInput, '1000000');
    await user.selectOptions(bedsSelect, '3');
    await user.selectOptions(bathsSelect, '2');

    await user.click(
      screen.getByRole('button', { name: /^clear$/i }),
    );

    expect(cityInput).toHaveValue('');
    expect(zipcodeInput).toHaveValue('');
    expect(minPriceInput).toHaveValue(null);
    expect(maxPriceInput).toHaveValue(null);
    expect(bedsSelect).toHaveValue('');
    expect(bathsSelect).toHaveValue('');

    expect(mockonApply).toHaveBeenCalledTimes(1);

    expect(mockonApply).toHaveBeenCalledWith({
      city: '',
      zipcode: '',
      minPrice: '',
      maxPrice: '',
      beds: '',
      baths: '',
    });
  });
});