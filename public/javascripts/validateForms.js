const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add('right-panel-active');
});

signInButton.addEventListener('click', () => {
	container.classList.remove('right-panel-active');
});

function match(password) {
	var pwd = document.getElementById('pwd').value;
	var c_pwd = document.getElementById('c_pwd').value;
	if (pwd != c_pwd) {
		password.setCustomValidity('Passwords do not match');
	} else {
		password.setCustomValidity('');
	}
}

(function () {
	'use strict';

	// Fetch all the forms we want to apply custom Bootstrap validation styles to
	const forms = document.querySelectorAll('.validated-form');

	// Loop over them and prevent submission
	Array.from(forms).forEach(function (form) {
		form.addEventListener(
			'submit',
			function (event) {
				if (!form.checkValidity()) {
					event.preventDefault();
					event.stopPropagation();
				}

				form.classList.add('was-validated');
			},
			false
		);
	});
})();