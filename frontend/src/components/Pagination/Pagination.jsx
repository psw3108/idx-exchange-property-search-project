import './Pagination.css';

function Pagination({ currentPage, totalPages, onPageChange }) {
    // page array
    let pageNumbers = [];

    if (totalPages <= 7) {
        // display all pages
        pageNumbers = Array.from(
            { length: totalPages },
            (_, index) => index + 1
        );
    } else if (currentPage <= 4) {
        // current page is near front
        pageNumbers = [1, 2, 3, 4, 5, '...', totalPages];
    } else if (currentPage >= totalPages - 3) {
        // current page is near end
        pageNumbers = [
            1,
            '...',
            totalPages - 4,
            totalPages - 3,
            totalPages - 2,
            totalPages - 1,
            totalPages,
        ];
    } else {
        // current page is in middle
        pageNumbers = [
            1,
            '...',
            currentPage - 2,
            currentPage - 1,
            currentPage,
            currentPage + 1,
            currentPage + 2,
            '...',
            totalPages,
        ];
    }

    return (
        <nav className="pagination" aria-label="Property pagination">
            {/* Previous Button */}
            <button 
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
            > 
                Previous
            </button>

            {/* Page Numbers */}
            {pageNumbers.map((number, index) => {
            if (number === '...') {
                return <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>;
            }

            return (
                <button
                    key={number}
                    onClick={() => onPageChange(number)}
                    className={number === currentPage ? 'current-page' : ''}
                    disabled={number === currentPage}
                >
                    {number}
                </button>
                );
            })}

            {/* Next Button */}
            <button 
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
            > 
                Next
            </button>
        </nav>
    );
}

export default Pagination;