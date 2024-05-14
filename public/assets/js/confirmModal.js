const confirmModalForm = document.getElementById("confirmModal-form");
if (confirmModalForm) confirmModalForm.addEventListener("submit", (event) => modalConfirmedHandler(event));

const modalConfirmedHandler = async (event) => {
    event.preventDefault();
    const actionType = confirmModalForm.dataset.actionType;

    switch (actionType) {
        case "deleteComment":
            const postId = +confirmModalForm.dataset.postId;
            const commentId = +confirmModalForm.dataset.commentId;

            console.log("will delete comment", postId, commentId);
            const deletedComment = await doDeleteComment(event, commentId, postId);
            console.log("did it delete?", deletedComment);
            if (deletedComment) {
                hideModal("confirm-modal");
            } else {
                console.log("Failed to delete comment!");
            }
            break;
    }
}