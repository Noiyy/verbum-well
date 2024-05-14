const db = require("../data/database");

// ######################
// GET ALL
// ######################
const getUsers = async () => {
    const [records] = await db.query(`
        SELECT * FROM users;
    `);
    return records;
};
const getPosts = async () => {
    const [records] = await db.query(`
        SELECT posts.*,
            users.name as authorName from posts
        INNER JOIN users ON users.id = posts.userId;
    `);
    const posts = await Promise.all(records.map(async (post) => ({
        ...post,
        previewContent: await getPostPreviewContent(post.id)
    }) ));

    return posts;
};
const getComments = async () => {
    const [records] = await db.query(`
        SELECT comments.*,
            users.name AS userName, users.isAdmin AS userIsAdmin, users.hasPremium AS userHasPremium, users.avatarLocation AS userAvatarLocation 
        FROM comments
        INNER JOIN users ON users.id = comments.userId
    `);
    return records;
};

// ######################
// GET SPECIFIC
// ######################
const getUserById = async (userId) => {
    const query = `
        SELECT * from users WHERE id = ?
    `;
    const [records] = await db.query(query, [userId]);
    return records;
}

const getUserByEmail = async (userId) => {
    const query = `
        SELECT * from users WHERE email = ?
    `;
    const [records] = await db.query(query, [userId]);
    return records;
}

const getUserDetail = async (userId) => {
    const userQuery = `
        SELECT * from users WHERE id = ?
    `;
    const [userRecords] = await db.query(userQuery, [userId]);

    const userPostsQuery = `
        SELECT posts.title, posts.dateCreatedS, posts.id
        FROM posts WHERE userId = ?
    `;
    let [userPostsRecords] = await db.query(userPostsQuery, [userId]);
    userPostsRecords = await Promise.all(userPostsRecords.map(async (post) => ({
        ...post,
        previewContent: await getPostPreviewContent(post.id)
    }) ));

    const userCommentsQuery = `
        SELECT comments.content, comments.dateCreatedS, comments.likeCount, comments.postId, comments.id
        FROM comments WHERE userId = ?
    `;
    const [userCommentsRecords] = await db.query(userCommentsQuery, [userId]);

    return userRecords.map((user => ({
        ...user,
        posts: [...userPostsRecords],
        comments: [...userCommentsRecords],
    }) ));
};

const getPostBy = async (col, value) => {
    const query = `
        SELECT * from posts WHERE ${col} = ?
      `;
    const [records] = await db.query(query, [value]);

    return records;
};

const getCommentBy = async (col, value) => {
    const query = `
        SELECT * from comments WHERE ${col} = ?
      `;
    const [records] = await db.query(query, [value]);
    return records;
};

const getPostDetail = async (postId) => {
    const postsQuery = `
        SELECT posts.*, 
            users.name AS authorName, users.isAdmin AS authorIsAdmin, users.hasPremium AS authorHasPremium, users.avatarLocation AS authorAvatarLocation
        FROM posts
        INNER JOIN users ON users.id = posts.userId
        WHERE posts.id = ?;
    `;
    const [postRecords] = await db.query(postsQuery, [postId]);

    // comments
    const commentsQuery = `
        SELECT comments.id, comments.likeCount, comments.dateCreatedS, comments.content, comments.userId,
            users.name AS userName, users.isAdmin AS userIsAdmin, users.hasPremium AS userHasPremium, users.avatarLocation AS userAvatarLocation
        FROM comments
        INNER JOIN posts ON posts.id = comments.postId
        INNER JOIN users ON users.id = comments.userId
        WHERE postId = ?;
    `;
    const [commentsRecords] = await db.query(commentsQuery, [postId]);

    // headings
    const headingsQuery = `
        SELECT headings.id, headings.content, headings.pos
        FROM headings
        INNER JOIN posts ON posts.id = headings.postId
        WHERE postId = ?;
    `;
    const [headingsRecords] = await db.query(headingsQuery, [postId]);

    // subheadings
    const subHeadingsQuery = `
        SELECT subHeadings.id, subHeadings.content, subHeadings.pos, subHeadings.headingId
        FROM subHeadings
        INNER JOIN posts ON posts.id = subHeadings.postId
        WHERE postId = ?;
    `;
    const [subHeadingsRecords] = await db.query(subHeadingsQuery, [postId]);

    // paragraphs
    const paragraphsQuery = `
        SELECT paragraphs.id, paragraphs.content, paragraphs.pos
        FROM paragraphs
        INNER JOIN posts ON posts.id = paragraphs.postId
        WHERE postId = ?;
    `;
    const [paragraphsRecords] = await db.query(paragraphsQuery, [postId]);

    // images
    const imagesQuery = `
        SELECT images.id, images.imgLocation, images.imgAlt, images.creditName, images.creditLink, images.pos
        FROM images
        INNER JOIN posts ON posts.id = images.postId
        WHERE postId = ?;
    `;
    const [imagesRecords] = await db.query(imagesQuery, [postId]);

    // linebreaks
    const linebreaksQuery = `
        SELECT linebreaks.id, linebreaks.pos
        FROM linebreaks
        INNER JOIN posts ON posts.id = linebreaks.postId
        WHERE postId = ?;
    `;
    const [linebreaksRecords] = await db.query(linebreaksQuery, [postId]);

    return postRecords.map((post => ({
        ...post,
        comments: [...commentsRecords],
        headings: [...headingsRecords],
        subHeadings: [...subHeadingsRecords],
        paragraphs: [...paragraphsRecords],
        images: [...imagesRecords],
        linebreaks: [...linebreaksRecords],
    }) ));
};

const getPostPreviewContent = async (postId) => {
    const query = `
        SELECT id, content, pos
        FROM paragraphs
        WHERE postId = ?
        ORDER BY pos ASC
        LIMIT 1;
    `;
    const [records] = await db.query(query, [postId]);
    return records[0];
};

const getPostComments = async (postId) => {
    const query = `
        SELECT comments.id, comments.likeCount, comments.dateCreatedS, comments.content, comments.userId,
            users.name AS userName, users.isAdmin AS userIsAdmin, users.hasPremium AS userHasPremium, users.avatarLocation AS userAvatarLocation
        FROM comments
        INNER JOIN posts ON posts.id = comments.postId
        INNER JOIN users ON users.id = comments.userId
        WHERE postId = ?
        ORDER BY dateCreatedS ASC;
    `;
    const [records] = await db.query(query, [postId]);
    return records;
};

// ######################
// POST CONTENT GETTERS
// ######################
const getPostHeadings = async (postId) => {
    const [records] = await db.query(`
        SELECT * FROM headings WHERE postId = ?;
    `, postId);
    return records;
};
const getPostSubHeadings = async (postId) => {
    const [records] = await db.query(`
        SELECT * FROM subheadings WHERE postId = ?;
    `, postId);
    return records;
};
const getPostParagraphs = async (postId) => {
    const [records] = await db.query(`
        SELECT * FROM paragraphs WHERE postId = ?;
    `, postId);
    return records;
};
const getPostImages = async (postId) => {
    const [records] = await db.query(`
        SELECT * FROM images WHERE postId = ?;
    `, postId);
    return records;
};
const getPostLinebreaks = async (postId) => {
    const [records] = await db.query(`
        SELECT * FROM linebreaks WHERE postId = ?;
    `, postId);
    return records;
};

// ######################
// CREATES
// ######################
const createUser = async (user) => {
    await db.query(`
        INSERT INTO users
        (name, password, salt, email, dateCreated) VALUES
        (?);`,
      [user]
    );
    return 0;
};

const addComment = async (values) => {
    const query = `INSERT INTO comments (userId, postId, content, dateCreatedS) VALUES (?)`;
    await db.query(query, [values])
};

const createPost = async (post) => {
    const query = `INSERT INTO posts (title, userId, dateCreatedS) VALUES (?)`;
    const result = await db.query(query, [post]);

    const idQuery = `SELECT LAST_INSERT_ID() AS newPostId`;
    const [[{ newPostId }]] = await db.query(idQuery);
    console.log("newPostId:", newPostId);

    return newPostId;
};

const createHeading = async (heading) => {
    const query = `INSERT INTO headings (content, postId, pos) VALUES (?)`;
    await db.query(query, [heading]);
};

const createSubHeading = async (subHeading) => {
    const query = `INSERT INTO subHeadings (content, postId, headingId, pos) VALUES (?)`;
    await db.query(query, [subHeading]);
};

const createParagraph = async (paragraph) => {
    const query = `INSERT INTO paragraphs (content, postId, pos) VALUES (?)`;
    await db.query(query, [paragraph]);
};

const createImage = async (image) => {
    const query = `INSERT INTO images (imgLocation, imgAlt, postId, creditName, creditLink, pos) VALUES (?)`;
    await db.query(query, [image]);
};

const createLinebreak = async (linebreak) => {
    const query = `INSERT INTO linebreaks (postId, pos) VALUES (?)`;
    await db.query(query, [linebreak]);
};

// ######################
// UPDATES
// ######################
const updateUserAvatar = async (filepath, userId) => {
    const query = `
        UPDATE users SET avatarLocation = ? WHERE id = ?
    `;
    await db.query(query, [filepath, userId]);
};

const updateComment = async (content, commentId) => {
    const query = `
        UPDATE comments SET content = ? WHERE id = ?
    `;
    await db.query(query, [content, commentId]);
};

// ######################
// DELETES
// ######################
const deleteCommentById = async (commentId) => {
    await db.query(`DELETE FROM comments WHERE id = ?`, [commentId]);
};


// ######################
// MISCELLANEOUS
// ######################

module.exports = {
    // getters
    getUsers,
    getPosts,
    getComments,

    getUserById,
    getUserByEmail,
    getUserDetail,
    getPostBy,
    getCommentBy,
    getPostDetail,
    getPostPreviewContent,
    getPostComments,

    getPostHeadings,
    getPostSubHeadings,
    getPostParagraphs,
    getPostImages,
    getPostLinebreaks,

    // setters
    createUser,
    addComment,
    createPost,
    createHeading,
    createSubHeading,
    createParagraph,
    createImage,
    createLinebreak,
    
    updateUserAvatar,
    updateComment,

    deleteCommentById,
}