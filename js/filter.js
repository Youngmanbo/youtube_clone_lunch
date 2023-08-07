let currentFilterIndex = 0;
const filtersPerPage = 5;

function showFilters() {
    const filterButtons = document.querySelectorAll('.filters');
    filterButtons.forEach((button, index) => {
        if (index >= currentFilterIndex && index < currentFilterIndex + filtersPerPage) {
            button.classList.remove('hidden');
            setTimeout(() => {
                button.style.transform = 'translateX(0)';
            }, index * 1);
        } else {
            button.classList.add('hidden');
            button.style.transform = 'translateX(-30px)';
        }
    });
}
function showNextFilters() {
    const totalFilters = document.querySelectorAll('.filters').length;
    if (currentFilterIndex + filtersPerPage < totalFilters) {
        currentFilterIndex += filtersPerPage;
        showFilters();
    }
}

function showPreviousFilters() {
    if (currentFilterIndex - filtersPerPage >= 0) {
        currentFilterIndex -= filtersPerPage;
        showFilters();
    }
}

showFilters();