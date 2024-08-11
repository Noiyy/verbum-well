// Bootstrap popover init
// const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
// const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));

// Page load animation handler
const hideOverlay = () => {
    const pageLoadAnimation = document.querySelector('.page-load-animation');

    const overlayEl = document.querySelector('.page-load-overlay');
    if (overlayEl) {
        document.body.style.overflow = "initial";
        overlayEl.style.opacity = 0;
        overlayEl.addEventListener("transitionend", () => {
            overlayEl.remove();
        });
    }

    pageLoadAnimation.style.display = 'none';
};

window.addEventListener('load', function() {
    const pageLoadAnimation = document.querySelector('.page-load-animation');
    console.log("starting page load", pageLoadAnimation);
    if (!pageLoadAnimation) return;
    pageLoadAnimation.addEventListener('animationend', () => hideOverlay());

    // In case it somehow doesnt react to animationend
    this.setTimeout(() => {
        hideOverlay();
    }, 500);
  });

// Scroll to top btn view handler
const scrollToTopBtn = document.getElementById("scrollToTopBtn");
if (scrollToTopBtn) scrollToTopBtn.addEventListener("click", () => {
    document.querySelector('header').scrollIntoView({ 
        behavior: 'smooth' 
    });
});

const rootElement = document.documentElement;
function handleScroll() {
    const scrollTotal = rootElement.scrollHeight - rootElement.clientHeight;
    const scrollRatio = rootElement.scrollTop / scrollTotal;
    const fullPageHeight = Math.max(
        document.body.scrollHeight, document.body.offsetHeight, 
        document.documentElement.clientHeight, document.documentElement.scrollHeight, 
        document.documentElement.offsetHeight
      );

    if (fullPageHeight > 1500 && scrollRatio > 0.4) scrollToTopBtn.classList.add("active");
    else if ( scrollToTopBtn.classList.contains("active")) scrollToTopBtn.classList.remove("active");
}
document.addEventListener('scroll', handleScroll);
//

// ***
// MODAL handlers
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = "flex";
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = "none";
}

function showConfirmModal(event) {
    const modal = document.getElementById('confirm-modal');
    modal.style.display = "flex";
    const btn = event.target.classList.contains("btn") ? event.target : event.target.parentNode;
    console.log("btn");

    const modalText = modal.querySelector(".modalBody-text");
    modalText.textContent = btn.dataset.modalBodyText;
    
    const form = document.getElementById("confirmModal-form");
    form.dataset.actionType = btn.dataset.modalActionType;
    if (btn.dataset.postId) form.dataset.postId = btn.dataset.postId;
    if (btn.dataset.commentId) form.dataset.commentId = btn.dataset.commentId;
}

window.onclick = (event) => {
    const authModal = document.getElementById("auth-modal");
    if (authModal && event.target == authModal) authModal.style.display = "none";
}
window.onclick = (event) => {
    const userAvatarModal = document.getElementById("userAvatar-modal");
    if (userAvatarModal && event.target == userAvatarModal) userAvatarModal.style.display = "none";
}
window.onclick = (event) => {
    const confirmModal = document.getElementById("confirm-modal");
    if (confirmModal && event.target == confirmModal) confirmModal.style.display = "none";
}
// ***

// posts order btn handler
const postsOrderBtn = document.getElementById("postsOrderBtn");
if (postsOrderBtn) {
    postsOrderBtn.addEventListener('click', (event) => {
        if (postsOrderBtn.dataset.order == "asc") {
            postsOrderBtn.dataset.order = "dsc";
            postsOrderBtn.innerHTML = `
                Dsc.
                <img src="/assets/img/icons/descend.svg">
            `;
        } else {
            postsOrderBtn.dataset.order = "asc";
            postsOrderBtn.innerHTML = `
                Asc.
                <img src="/assets/img/icons/ascend.svg">
            `;
        }
    });
};

// collapse btns
function collapseBtnClickHandlers() {
    const collapseShowBtns = document.querySelectorAll('.collapseShowBtn');
    collapseShowBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.dataset.text == "show") {
                btn.dataset.text = "hide";
                btn.innerHTML = `
                    <img src="/assets/img/icons/chevron-up-dark.svg" class="btn-io-down" alt="hide">
                `;
            } else {
                btn.dataset.text = "show";
                btn.innerHTML = `
                    <img src="/assets/img/icons/chevron-down-dark.svg" class="btn-io-up" alt="show">
                `;
            }
        });
    });
}
collapseBtnClickHandlers();