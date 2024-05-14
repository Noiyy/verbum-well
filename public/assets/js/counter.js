const numberCounts = document.querySelectorAll('.numberCount');
const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5 // Trigger when 50% of the element is in the viewport
};

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const countValue = target.getAttribute('data-count');
            target.style.setProperty('--num', countValue);
        }
    });
}, options);

numberCounts.forEach(numberCount => {
    observer.observe(numberCount);
});