const express = require("express");
const router = express.Router();

const dbHandler = require("../util/dbHandler");

router.get("/posts", async (req, res) => {
	try {
		const posts = await dbHandler.getPosts();
		// console.log("posty:",posts);

		res.render("posts", {posts});
	} catch (error) {
		console.log(error.message);
	}
});

router.get("/post/:id", async (req, res) => {
	const postId = req.params.id;
	try {
		const [post]= await dbHandler.getPostDetail(postId);
		// get all post contents into one array and sort them by their position
		post.contents = [
			...post.headings.map(heading => ({ ...heading, type: "heading"})),
			...post.subHeadings.map(subHeading => ({ ...subHeading, type: "subHeading"})),
			...post.paragraphs.map(paragraph => ({ ...paragraph, type: "paragraph"})),
			...post.images.map(image => ({ ...image, type: "image"})),
			...post.linebreaks.map(linebreak => ({ ...linebreak, type: "linebreak"}))
		]
		.sort((a, b) => a.pos - b.pos)
		.filter((item, index) => item.pos === index);

		// sort comments by newest
		post.comments.sort((a, b) => b.dateCreatedS - a.dateCreatedS);

		// console.log("post detail:", post);

		res.render("post", {post});
	} catch (error) {
		console.log(error.message);
        return res.status(500).render("statuses/500");
	}
});

router.get("/write", (req, res) => {
	if (!req.session.user) return res.status(401).render("statuses/401");
	res.render("write");
});

router.post("/post/:postId/addComment", async (req, res) => {
	if (!res.locals.authUser) return res.status(401).json({success: false, message: "Not authenticated"});
	const postId = req.params.postId;
	const userId = res.locals.authUser.id;
	try {
		const { newComment } = req.body;
		const dateCreated = Math.round(new Date().getTime()/1000);

		if (!newComment || newComment.length < 1) return res.status(400).json({success: false, message: "Empty comment!"})

		await dbHandler.addComment([userId, postId, newComment, dateCreated]);
		console.log("success adding comment!");
		res.json({success: true});
	} catch (err) {
		console.log(err.message);
    	return res.status(500).send({ error: err.message });
	}
});

router.post("/deleteComment/:commentId", async (req, res) => {
	const commentId = req.params.commentId;
	try {
		await dbHandler.deleteCommentById(commentId);
		console.log("deleted comment successfully!");
		res.json({success: true});
	} catch (err) {
		console.log(err.message);
    	return res.status(500).send({ success: false, error: err.message });
	}
});

router.get("/post/:postId/getComments", async (req, res) => {
	const postId = req.params.postId;
	try {
	  const records = await dbHandler.getPostComments(postId);
	  return res.json(records);
	} catch (error) {
	  console.log(error.message);
	  return res.status(500).send({ error: error.message });
	}
});

router.get("/post/:postId/getInfoAJAX", async (req, res) => {
	const postId = req.params.postId;
	try {
		const [post] = await dbHandler.getPostBy("id", postId);
		post.authUser = res.locals.authUser;
		return res.json(post);
	} catch (err) {
		return res.status(500).send({ error: err.message });
	}
});

router.post("/editComment/:commentId", async (req, res) => {
	const commentId = req.params.commentId;
	const { newContent } = req.body;

	try {
		await dbHandler.updateComment(newContent, commentId);
		console.log("updated comment successfully!");
		res.json({success: true});
	} catch (err) {
		console.log(err.message);
    	return res.status(500).send({success: false, error: err.message });
	}
});

router.post("/createPost", async (req, res) => {
	const { postTitle, headings, subHeadings, paragraphs, images, linebreaks } = req.body;
	console.log("subHeadings:",subHeadings);
	const authorId = res.locals.authUser.id;
	const dateCreatedS = Math.round(new Date().getTime()/1000);
	console.log("authorId", authorId, "date", dateCreatedS);

	try {
		const postId = await dbHandler.createPost([postTitle, authorId, dateCreatedS]);
		console.log("POST ID????????", postId);
		if (headings.length > 0) {
			await Promise.all(headings.map(async (heading) => {
				await dbHandler.createHeading([heading.content, postId, heading.pos]);
			} ));
		}
		// if (subHeadings.length > 0) {
		// 	await Promise.all(subHeadings.map(async (subHeading) => {
		// 		await dbHandler.createSubHeading([subHeading.content, postId, subHeading.headingId, subHeading.pos]);
		// 	} ));
		// }
		if (paragraphs.length > 0) {
			await Promise.all(paragraphs.map(async (paragraph) => {
				await dbHandler.createParagraph([paragraph.content, postId, paragraph.pos]);
			} ));
		}
		if (linebreaks.length > 0) {
			await Promise.all(linebreaks.map(async (linebreak) => {
				await dbHandler.createLinebreak([postId, linebreak.pos]);
			} ));
		}
		

		res.json({success: true});
	} catch (err) {
		console.log(err.message);
    	return res.status(500).send({ error: err.message });
	}
});

router.post("/getNewCommentElement", async (req, res) => {
	const { comment, post } = req.body;

	return res.json(`
		<div class="comment-user-img">
			<a href="/user/${comment.userId}" class="a-plain imgLink">
				<div class="imgCont">
					${comment.userAvatarLocation ? `
						<img src="${process.env.SERVER_URL}/${comment.userAvatarLocation}" alt="user-avatar" class="u-img">
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
						<button class="btn btn-secondary btn-icon" onclick="editComment(event)" data-comment-id="${comment.id}">
							<img src="/assets/img/icons/edit.svg" alt="edit">
						</button>
						<button class="btn btn-secondary btn-icon" data-post-id="${post.id}" data-comment-id="${comment.id}"
							data-modal-body-text="You are about to delete a comment" data-modal-action-type="deleteComment"
							onclick="showConfirmModal(event)">
							<img src="/assets/img/icons/delete.svg" alt="delete">
						</button>
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
  	`);
});

module.exports = router;
