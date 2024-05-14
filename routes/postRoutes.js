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
	if (!res.locals.authUser) return;
	const postId = req.params.postId;
	const userId = res.locals.authUser.id;
	try {
		const { newComment } = req.body;
		const dateCreated = Math.round(new Date().getTime()/1000);

		await dbHandler.addComment([userId, postId, newComment, dateCreated]);
		console.log("success adding comment!");
		res.json({success: true});
	} catch (err) {
		console.log(err.message);
    	return res.status(500).send({ error: error.message });
	}
});

router.post("/post/:postId/deleteComment/:commentId", async (req, res) => {
	const postId = req.params.commentId;
	const commentId = req.params.commentId;
	try {
		await dbHandler.deleteCommentById(commentId);
		console.log("deleted comment successfully!");
		res.json({success: true});
	} catch (err) {
		console.log(err.message);
    	return res.status(500).send({ error: error.message });
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
    	return res.status(500).send({ error: err.message });
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

module.exports = router;
