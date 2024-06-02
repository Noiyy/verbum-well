const changeToAuthForm = (toSignUp) => {
    const authModal = document.getElementById("auth-modal");
    const authModalContent = authModal.querySelector(".auth-modal-content");
    const authModalHeading = authModal.querySelector("h3");

    if (toSignUp) { // change to register (signUp)
        authModalHeading.textContent = "Sign Up";
        authModalContent.innerHTML = `
            <form id="signUpForm">
                <div class="mb-3">
                    <label for="name" class="form-label">Name</label>
                    <input type="text" class="form-control" id="name" name="name" required>
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label">E-mail</label>
                    <input type="email" class="form-control" id="email" name="email" required>
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" class="form-control" id="password" name="password" required>
                </div>
                <div class="mb-3">
                    <label for="passwordRepeat" class="form-label">Password Repeat</label>
                    <input type="password" class="form-control" id="passwordRepeat" name="passwordRepeat" required>
                </div>
                <div class="form-submit d-flex justify-content-center">
                    <button id="authSubmitBtn" class="btn btn-primary" onclick="(event) => doAuth(event, false)">
                        Sign Up
                    </button>
                </div>
            </form>
            <p class="other-option d-flex flex-column align-items-center text-center">
                Already have an account? <a onclick="changeToAuthForm(false)" class="text-center "> Sign in </a>
            </p>
        `;

        const signUpForm = document.getElementById("signUpForm");
        signUpForm.addEventListener("submit", (event) => doAuth(event, true));
    } else { // change to login (signIn)
        authModalHeading.textContent = "Sign In";
        authModalContent.innerHTML = `
        <form id="signInForm">
            <div class="mb-3">
                <label for="email" class="form-label">E-mail</label>
                <input type="email" class="form-control" id="email" name="email" required>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" name="password" required>
            </div>
            <div class="form-submit d-flex justify-content-center">
                <button id="authSubmitBtn" class="btn btn-primary" onclick="(event) => doAuth(event, true)">
                    Sign In
                </button>
            </div>
        </form>
        <p class="other-option d-flex flex-column align-items-center text-center">
            Don't have an account yet? <a onclick="changeToAuthForm(true)" class="text-center "> Sign up </a>
        </p>
        `;
        
        const signInForm = document.getElementById("signInForm");
        signInForm.addEventListener("submit", (event) => doAuth(event, false));
    }
};

const signInForm = document.getElementById("signInForm");
signInForm.addEventListener("submit", (event) => doAuth(event, false));

const doAuth = async (event, toSignUp) => {
    event.preventDefault();
    const form = event.target;

    if (toSignUp) {
        // register
        const data = {
            name: form.name.value,
            email: form.email.value,
            password: form.password.value,
            passwordRepeat: form.passwordRepeat.value
        }
        console.log(data);
        try {
            const responseData = await fetch(`/signUp`, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const response = await responseData.json();
            if (response.success) {
                console.log("signUp success!");
                toasts.showSuccess("Registered successfully! Please, login.")
                changeToAuthForm(false);
            } else {
                toasts.showError(response.message);
                console.log("a", erorr.message);
            }
        } catch (error) {
            console.log("b", error.message);
        }
    } else {
        // login
        const data = {
            email: form.email.value,
            password: form.password.value
        }
        console.log(data);
        try {
            const responseData = await fetch(`/signIn`, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const response = await responseData.json();
            if (response.success) {
                console.log("signIn success!");
                location.reload();
            } else {
                toasts.showError(response.message);
                console.log("a", erorr.message);
            }
        } catch (error) {
            console.log("b", error.message);
        }
    }
};

const doLogout = async () => {
    try {
        const response = await fetch(`/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (response.ok) {
            console.log("successfuly logged out!");
            console.log(location.pathname);
            if (location.pathname == "/") location.reload();
            else location.href = "/";
        } else {
            console.log("a", erorr.message);
        }
    } catch (error) {
        console.log("b", error.message);
    }
};