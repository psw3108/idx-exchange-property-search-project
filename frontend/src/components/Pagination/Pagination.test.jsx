import { fireEvent, render, screen } from '@testing-library/react';
import Pagination from './Pagination';

describe('Pagination', () => {
  test('renders the first page correctly', () => {
    const handlePageChange = jest.fn();

    render(
      <Pagination
        currentPage={1}
        totalPages={24}
        onPageChange={handlePageChange}
      />
    );

    // Previous should be disabled on page 1.
    expect(
      screen.getByRole('button', { name: 'Previous' })
    ).toBeDisabled();

    // Next should still be usable.
    expect(
      screen.getByRole('button', { name: 'Next' })
    ).not.toBeDisabled();

    // Page 1 should be visually marked as current.
    expect(
      screen.getByRole('button', { name: '1' })
    ).toHaveClass('current-page');

    // Near the beginning, pages 1 through 5 and the last page appear.
    expect(
      screen.getByRole('button', { name: '5' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: '24' })
    ).toBeInTheDocument();

    // Only the right ellipsis should appear.
    expect(screen.getAllByText('...')).toHaveLength(1);
  });

  test('renders the last page correctly', () => {
    const handlePageChange = jest.fn();

    render(
      <Pagination
        currentPage={24}
        totalPages={24}
        onPageChange={handlePageChange}
      />
    );

    // Next should be disabled on the last page.
    expect(
      screen.getByRole('button', { name: 'Next' })
    ).toBeDisabled();

    // Previous should still be usable.
    expect(
      screen.getByRole('button', { name: 'Previous' })
    ).not.toBeDisabled();

    // Page 24 should be visually marked as current.
    expect(
      screen.getByRole('button', { name: '24' })
    ).toHaveClass('current-page');

    // Near the end, pages 20 through 24 should appear.
    expect(
      screen.getByRole('button', { name: '20' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: '23' })
    ).toBeInTheDocument();

    // Only the left ellipsis should appear.
    expect(screen.getAllByText('...')).toHaveLength(1);
  });

  test('renders surrounding page numbers on a middle page', () => {
    const handlePageChange = jest.fn();

    render(
      <Pagination
        currentPage={12}
        totalPages={24}
        onPageChange={handlePageChange}
      />
    );

    // The middle case should display:
    // 1 ... 10 11 12 13 14 ... 24
    expect(
      screen.getByRole('button', { name: '1' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: '10' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: '11' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: '12' })
    ).toHaveClass('current-page');

    expect(
      screen.getByRole('button', { name: '13' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: '14' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: '24' })
    ).toBeInTheDocument();

    // Distant page numbers should be omitted.
    expect(
      screen.queryByRole('button', { name: '9' })
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole('button', { name: '15' })
    ).not.toBeInTheDocument();
  });

  test('calls onPageChange with the clicked page number', () => {
    const handlePageChange = jest.fn();

    render(
      <Pagination
        currentPage={1}
        totalPages={24}
        onPageChange={handlePageChange}
      />
    );

    fireEvent.click(
      screen.getByRole('button', { name: '4' })
    );

    expect(handlePageChange).toHaveBeenCalledTimes(1);
    expect(handlePageChange).toHaveBeenCalledWith(4);
  });

  test('calls onPageChange when Previous and Next are clicked', () => {
    const handlePageChange = jest.fn();

    render(
      <Pagination
        currentPage={12}
        totalPages={24}
        onPageChange={handlePageChange}
      />
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Previous' })
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Next' })
    );

    expect(handlePageChange).toHaveBeenNthCalledWith(1, 11);
    expect(handlePageChange).toHaveBeenNthCalledWith(2, 13);
  });

  test('renders two ellipses when the current page is in the middle', () => {
    const handlePageChange = jest.fn();

    render(
      <Pagination
        currentPage={12}
        totalPages={24}
        onPageChange={handlePageChange}
      />
    );

    expect(screen.getAllByText('...')).toHaveLength(2);
  });

  test('shows all page numbers without ellipses for small page counts', () => {
    const handlePageChange = jest.fn();

    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={handlePageChange}
      />
    );

    for (let page = 1; page <= 5; page += 1) {
      expect(
        screen.getByRole('button', {
          name: String(page),
        })
      ).toBeInTheDocument();
    }

    expect(screen.queryByText('...')).not.toBeInTheDocument();
  });

  test('does not render the first or last page more than once near the end', () => {
    const handlePageChange = jest.fn();

    render(
      <Pagination
        currentPage={21}
        totalPages={24}
        onPageChange={handlePageChange}
      />
    );

    // Debug challenge.
    expect(
      screen.getAllByRole('button', { name: '1' })
    ).toHaveLength(1);

    expect(
      screen.getAllByRole('button', { name: '24' })
    ).toHaveLength(1);
  });
});