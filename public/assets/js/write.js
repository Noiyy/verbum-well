const clearWriteItems = () => {
    console.log("clear");
    const writeContent = document.querySelector(".write-content");
    writeContent.innerHTML = "";
};

const writeForm = document.getElementById("writeForm");
writeForm.addEventListener("submit", (event) => doCreatePost(event));

const createOptionEl = (type) => {
    const writeContent = document.querySelector(".write-content");
    const optionEl = document.createElement("div");
    optionEl.className = "d-flex write-container flex-column";

    switch (type) {
        case "heading":
            optionEl.classList.add("heading");
            optionEl.innerHTML = `
                <div class="write-input-wrapper heading">
                    <div class="d-flex write-type-info align-items-center">
                        <div class="d-flex img-cont justify-content-center align-items-center">
                            <img src="/assets/img/icons/heading.svg">
                        </div>
                        Heading
                    </div>
                    <div class="d-flex write-btn-options align-items-center">
                        <button class="btn btn-secondary btn-icon" onclick="clearOption(event)">
                            <img src="/assets/img/icons/refresh.svg" alt="clear">
                        </button>
                        <button class="btn btn-secondary btn-icon" onclick="deleteOption(event)">
                            <img src="/assets/img/icons/delete.svg" alt="delete">
                        </button>
                    </div>
            
                    <textarea form="writeForm" type="text" class="form-control" placeholder="..." name="content" required></textarea>
                </div>
            `;
            break;
        case "subHeading":
            optionEl.classList.add("subHeading");
            optionEl.innerHTML = `
                <div class="write-input-wrapper heading">
                    <div class="d-flex write-type-info align-items-center">
                        <div class="d-flex img-cont justify-content-center align-items-center">
                            <img src="./assets/img/icons/subheading.svg">
                        </div>
                        Subheading
                    </div>
                    <div class="d-flex write-btn-options align-items-center">
                        <button class="btn btn-secondary btn-icon" onclick="clearOption(event)">
                            <img src="./assets/img/icons/refresh.svg" alt="clear">
                        </button>
                        <button class="btn btn-secondary btn-icon" onclick="deleteOption(event)">
                            <img src="./assets/img/icons/delete.svg" alt="delete">
                        </button>
                    </div>
            
                    <textarea form="writeForm" type="text" class="form-control" placeholder="..." name="content" required></textarea>
                </div>
            `;
            break;
        case "paragraph":
            optionEl.classList.add("paragraph");
            optionEl.innerHTML = `
                <div class="write-input-wrapper heading">
                    <div class="d-flex write-type-info align-items-center">
                        <div class="d-flex img-cont justify-content-center align-items-center">
                            <img src="./assets/img/icons/paragraph.svg">
                        </div>
                        Paragraph
                    </div>
                    <div class="d-flex write-btn-options align-items-center">
                        <button class="btn btn-secondary btn-icon" onclick="clearOption(event)">
                            <img src="./assets/img/icons/refresh.svg" alt="clear">
                        </button>
                        <button class="btn btn-secondary btn-icon" onclick="deleteOption(event)">
                            <img src="./assets/img/icons/delete.svg" alt="delete">
                        </button>
                    </div>
            
                    <textarea form="writeForm" type="text" class="form-control" placeholder="..." name="content" required></textarea>
                </div>
            `;
            break;
        case "image":
            optionEl.classList.add("image");
            optionEl.innerHTML = `
                <div class="write-input-wrapper heading">
                    <div class="d-flex write-type-info align-items-center">
                        <div class="d-flex img-cont justify-content-center align-items-center">
                            <img src="./assets/img/icons/image.svg">
                        </div>
                        Image
                    </div>
                    <div class="d-flex write-btn-options align-items-center">
                        <button class="btn btn-secondary btn-icon" onclick="clearOption(event)">
                            <img src="./assets/img/icons/refresh.svg" alt="clear">
                        </button>
                        <button class="btn btn-secondary btn-icon" onclick="deleteOption(event)">
                            <img src="./assets/img/icons/delete.svg" alt="delete">
                        </button>
                    </div>
            
                    <div class="file-input-options">
                        <input form="writeForm" type="file" accept="image/*" class="form-control" name="imgLocation" required>
            
                        <div class="d-flex img-form-group-cont">
                            <div class="form-group flex-grow-1">
                                <label for="imgAlt">Image alt</label>
                                <input form="writeForm" type="text" class="form-control" name="imgAlt">
                            </div>
                            <div class="form-group flex-grow-1">
                                <label for="creditName">Credit name</label>
                                <input form="writeForm" type="text" class="form-control" name="creditName">
                            </div>
                        </div>
            
                        <div class="d-flex img-form-group-cont">
                            <div class="form-group flex-grow-1">
                                <label for="creditLink">Credit link</label>
                                <input form="writeForm" type="text" class="form-control" name="creditLink">
                            </div>
                        </div>
                    </div>
                    <div class="file-view-cont d-flex justify-content-center align-items-center">
                        <img src="./assets/img/pg_semestralka-2-s.jpg" alt="uploadedImg">
                    </div>
                </div>
            `;
            break;
        case "linebreak":
            optionEl.classList.add("linebreak");
            optionEl.innerHTML = `
                <div class="write-input-wrapper heading d-flex justify-content-center">
                    <div class="d-flex write-type-info align-items-center">
                        <div class="d-flex img-cont justify-content-center align-items-center">
                            <img src="./assets/img/icons/linebreak.svg">
                        </div>
                        Linebreak
                    </div>
                    <div class="d-flex write-btn-options align-items-center">
                        <button class="btn btn-secondary btn-icon" onclick="deleteOption(event)">
                            <img src="./assets/img/icons/delete.svg" alt="delete">
                        </button>
                    </div>
            
                    <div class="d-flex line-break-separator"></div>
                </div>
            `;
            break;
    }
    writeContent.appendChild(optionEl);
};

const deleteOption = (event) => {
    const btn = event.target.classList.contains("btn") ? event.target : event.target.parentNode;
    const optionEl = btn.parentNode.parentNode.parentNode;
    optionEl.remove();
}

const clearOption = (event) => {
    const btn = event.target.classList.contains("btn") ? event.target : event.target.parentNode;
    const optionEl = btn.parentNode.parentNode.parentNode;
    const classes = optionEl.classList;

    if (classes.contains("heading") || classes.contains("subHeading") || classes.contains("paragraph")) {
        const inputEl = optionEl.querySelector("[name='content']");
        inputEl.value = null;
    } else if (classes.contains("image")) {

    }
};

const findLast = (array, callback) => {
    for (let i = array.length - 1; i >= 0; i--) {
      if (callback(array[i], i, array)) {
        return array[i];
      }
    }
    return undefined;
  };

const setupPostData = (postData) => {
    const writeContent = document.querySelector(".write-content");
    const elements = [...writeContent.children];

    elements.forEach((el, index) => {
        const classes = el.classList;

        // heading
        if (classes.contains("heading")) {
            const input = el.querySelector("[name='content']");
            const heading = {
                content: input.value,
                pos: index
            };
            postData.headings.push(heading);

        // subheading
        } else if (classes.contains("subHeading")) {
            const input = el.querySelector("[name='content']");

            const headingId = findLast(elements.slice(0, index), (el) => el.classList.contains("heading"));
            console.log("sH headingId:",headingId);

            const subHeading = {
                content: input.value,
                headingId: headingId,
                pos: index
            };
            postData.subHeadings.push(subHeading);

        // paragraph
        } else if (classes.contains("paragraph")) {
            const input = el.querySelector("[name='content']");
            const paragraph = {
                content: input.value,
                pos: index
            };
            postData.paragraphs.push(paragraph);

        // image                        TODO
        } else if (classes.contains("image")) {
            const image = {
                imgLocation: "",
                imgAlt: "",
                creditName: "",
                creditLink: "",
                pos: index
            };
            postData.images.push(image);

        // linebreak
        } else if (classes.contains("linebreak")) {
            const linebreak = {
                pos: index
            };
            postData.linebreaks.push(linebreak);
        }
    });
};

const doCreatePost = async (event) => {
    event.preventDefault();
    const postTitleEl = document.getElementById("w_postTitle");
    const postTitle = postTitleEl.value;

    const postData = {
        postTitle,
        headings: [],
        subHeadings: [],
        paragraphs: [],
        images: [],
        linebreaks: [],
    };
    setupPostData(postData);
    console.log("postData:", postData);
    if (postData.headings.length < 1 && postData.paragraphs.length < 1 || !postTitle) return;

    try {
		const response = await fetch(`/createPost`, {
			method: "POST",
			body: JSON.stringify(postData),
			headers: {
				"Content-Type": "application/json",
			}
		});
		if (response.ok) {
			console.log("created post???");
            location.href = "/posts"
		} else {
			console.log("hm?");
		}
	} catch (err) {
		console.log("doCreatePost", err.message);
	}
};