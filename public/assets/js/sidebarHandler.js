const toggleBtn = document.getElementById("menuToggleBtn");
const sidebarMenu = document.getElementById('sidebar-menu');

const authModal = document.getElementById("auth-modal");

toggleBtn.addEventListener('click', () => {
    toggleBtn.classList.add('animate');

    toggleBtn.classList.toggle('animateMenuBtn');
    if (sidebarMenu.classList.contains("open")) {
        sidebarMenu.classList.remove('open');

        document.body.style.paddingRight = '0';
        document.body.classList.remove("openedSidebar");
        toggleBtn.src = "/assets/img/icons/menu-icon.svg";
    } else {
        sidebarMenu.classList.toggle('open');

        const scrollbarWidth = getScrollbarWidth();
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        document.body.classList.add("openedSidebar");
        toggleBtn.src = "/assets/img/icons/menu-icon-close-dark.svg";
    }
});

document.addEventListener('click', (event) => {
    if (authModal && authModal.style.display == "flex") return;
    const isClickInsideSidebar = sidebarMenu.contains(event.target);
    const isClickOnToggleBtn = toggleBtn.contains(event.target);
  
    if (!isClickInsideSidebar && !isClickOnToggleBtn && sidebarMenu.classList.contains('open')) {
        sidebarMenu.classList.remove('open');
        toggleBtn.classList.toggle('animateMenuBtn');

        document.body.classList.toggle("openedSidebar");
        if (document.body.classList.contains("openedSidebar")) { // opened
            const scrollbarWidth = getScrollbarWidth();
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        } else { // closed
            document.body.style.paddingRight = '0';
        }
        toggleBtn.src = "/assets/img/icons/menu-icon.svg";
    }
});

function getScrollbarWidth() {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.width = '100px';
    outer.style.msOverflowStyle = 'scrollbar';
    document.body.appendChild(outer);
    const widthNoScroll = outer.offsetWidth;
    outer.style.overflow = 'scroll';
    const inner = document.createElement('div');
    inner.style.width = '100%';
    outer.appendChild(inner);
    const widthWithScroll = inner.offsetWidth;
    outer.parentNode.removeChild(outer);
    return widthNoScroll - widthWithScroll;
}