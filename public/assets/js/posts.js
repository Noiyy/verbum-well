const navbar = document.getElementById("scrollSpyNav");
if (navbar) window.onscroll = () => stickyScrollspyHandler();

const epochSecToDateString = (epochS) => {
	const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
	const dateCreatedMs = epochS*1000;
	const date = new Date(dateCreatedMs);
	const formattedDate = date.toLocaleDateString("sk-SK", dateOptions);
	return formattedDate;
};

function stickyScrollspyHandler() {
    if (!navbar) return;
    const sticky = navbar.offsetTop;
	if (window.scrollY >= sticky) {
		navbar.classList.add("sticky")
	} else {
		navbar.classList.remove("sticky");
	}
}

const addCommentForm = document.getElementById("addCommentForm");
if (addCommentForm) addCommentForm.addEventListener("submit", (event) => { doAddComment(event); });

const doAddComment = async (event) => {
	event.preventDefault();
	const postId = +addCommentForm.dataset.postId;
	const data = {
		newComment: addCommentForm.newComment.value,
	};

	try {
		const response = await fetch(`/post/${postId}/addComment`, {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
			}
		});
		if (response.ok) {
			addCommentForm.newComment.value = null;
			const btn = document.getElementById("addCommentCollapseBtn");
			btn.click();

			console.log("load comments???");
			loadComments();
		} else {
			console.log("a", erorr.message);
		}
	} catch (err) {
		console.log("doAddComment", err.message);
	}
}

const loadComments = async () => {
	const postId = addCommentForm.dataset.postId;
	try {
		const response = await fetch(`/post/${postId}/getComments`);
		if (response.ok) {
			const respData = await response.json();

			const postResponse = await fetch(`/post/${postId}/getInfoAJAX`);
			if (postResponse.ok) {
				const postRespData = await postResponse.json();
				addNewCommentElement(respData[respData.length-1], postRespData);
			}
		}
	} catch (err) {
		console.log(err.message);
	}
}

const addNewCommentElement = (comment, post) => {
  const newCommentElement = document.createElement("div");
  newCommentElement.className = "comment d-flex";
  newCommentElement.id = `comment-${comment.id}`;

  newCommentElement.innerHTML = `
	<div class="comment-user-img">
		<a href="/user/${comment.userId}" class="a-plain imgLink">
			<div class="imgCont">
				${comment.userAvatarLocation ? `
					<img src="${process.env.SERVER_URL}:${process.env.SERVER_PORT}/${comment.userAvatarLocation}" alt="user-avatar" class="u-img">
				` : `
					<img src="/assets/img/userAvatarDefault.png" alt="user-avatar" class="u-img">
				`}
				${comment.userHasPremium ? `
					<div class="premium-icon-cont d-flex justify-content-center align-items-center"><img class="user-premium-icon smaller" src="/assets/img/icons/star.svg" alt="premium"></div>
				` : ``}
			</div>
		</a>
	</div>
	<div class="comment-content">
		<div class="comment-header d-flex justify-content-between align-items-center">
			<div class="comment-h-left d-flex align-items-center">
				<a href="/user/${comment.userId}>" class="a-plain italic comment-userName"><h4 class="heading gradient"> ${comment.userName} </h4></a>
				<div class="circle-divider-xs"></div>
				<p class="poppins-thin-italic" style="font-size: 16px;"> ${epochSecToDateString(comment.dateCreatedS)} </p>
				${post.userId == comment.userId ? `
					<div class="circle-divider-xs"></div>
					<span class="badge rounded-pill primary-badge">Author</span>
				` : ``}
				${comment.userIsAdmin ? `
					<div class="circle-divider-xs"></div>
					<span class="badge text-bg-danger">Admin</span>
				` : ``}
			</div>
			<div class="comment-h-right d-flex align-items-center">
				<div class="comment-btns-action d-flex align-items-center">
					${comment.userId == post.authUser.id || post.authUser.isAdmin ? `
					<button class="btn btn-secondary btn-icon">
						<img src="/assets/img/icons/edit.svg" alt="edit">
					</button>
					<form action="/post/${post.id}/deleteComment/${comment.id}" method="POST">
						<button class="btn btn-secondary btn-icon" type="submit">
							<img src="/assets/img/icons/delete.svg" alt="delete">
						</button>
					</form>
					` : ``}
				</div>
				<div class="d-flex comment-likes align-items-center">
					${comment.likeCount}
					<a class="a-plain" role="button"><img src="/assets/img/icons/like.svg" alt="like"></a>
				</div>
			</div>
			
		</div>
		<div class="comment-body">
			<p> ${comment.content} </p>
		</div>
	</div>
  	`;

  	const commentsWrapper = document.querySelector(".comments-wrapper");
  	commentsWrapper.insertBefore(newCommentElement, commentsWrapper.firstChild);

	const commentsCountElements = document.querySelectorAll(".commentsCount");
	commentsCountElements.forEach(el => el.textContent = +el.textContent+1);
};

const deleteCommentForms = document.querySelectorAll(".deleteCommentForm");
if (deleteCommentForms.length > 0) {
	deleteCommentForms.forEach(form => {
		form.addEventListener("submit", (event) => { doDeleteComment(event, form.dataset.commentId, form.dataset.postId); });
	});
} 

const doDeleteComment = async (event, commentId, postId) => {
	event.preventDefault();

	try {
		const response = await fetch(`/post/${postId}/deleteComment/${commentId}`, {
			method: "POST",
			body: JSON.stringify({}),
			headers: {
				"Content-Type": "application/json",
			}
		});
		if (response.ok) {
			console.log("deleted comment???");
			return deleteCommentElement(commentId);
		} else {
			console.log("???");
		}
	} catch (err) {
		console.log("doRemoveComment", err.message);
	}
}

const deleteCommentElement = (commentId) => {
	const commentElement = document.getElementById(`comment-${commentId}`);
	commentElement.remove();
	const commentsCountElements = document.querySelectorAll(".commentsCount");
	commentsCountElements.forEach(el => el.textContent = el.textContent-1);

	console.log("removed comment element");
	return true;
};

const editComment = (event) => {
	const btn = event.target.classList.contains("btn") ? event.target : event.target.parentNode;
	const commentId = +btn.dataset.commentId;

	const comment = document.getElementById(`comment-${commentId}`);
	const commentBody = comment.querySelector(".comment-body");
	const commentContent = commentBody.querySelector("p").textContent.trim();
	console.log("cC:", commentContent);

	commentBody.innerHTML = `
		<form id="editComment-${commentId}-form" class="d-flex flex-column" style="gap: 8px;">
			<textarea class="form-control" id="newContent" name="newContent" rows="5"></textarea>
			<div class="d-flex" style="gap: 16px;">
				<button class="btn btn-primary" type="submit">Edit</button>
				<button class="btn btn-secondary" id="cancelEdit-comment-${commentId}-btn" type="button">Cancel</button>
			</div>
		</form>
	`;
	const textArea = commentBody.querySelector(".form-control");
	textArea.value = commentContent;

	const form = document.getElementById(`editComment-${commentId}-form`);
	form.addEventListener("submit", (event) => doEditComment(event, commentId, commentBody))

	const cancelBtn = document.getElementById(`cancelEdit-comment-${commentId}-btn`);
	cancelBtn.addEventListener("click", () => cancelEditComment(commentBody, commentContent));
};

const cancelEditComment = (commentBody, commentContent) => {
	commentBody.innerHTML = `<p> ${commentContent} </p>`;
}

const doEditComment = async (event, commentId, commentBody) => {
	event.preventDefault();
	const newContent = event.target.newContent.value;
	
	try {
		const response = await fetch(`/editComment/${commentId}`, {
			method: "POST",
			body: JSON.stringify({newContent}),
			headers: {
				"Content-Type": "application/json",
			}
		});
		if (response.ok) {
			console.log("edited comment???");
			cancelEditComment(commentBody, newContent);
		} else {
			console.log("??????");
		}
	} catch (err) {
		console.log("doEditComment", err.message);
	}
}