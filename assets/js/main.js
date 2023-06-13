document.getElementById('today').innerHTML = getToday();
document.getElementById('random-score').innerHTML = getRandomScore();
document.getElementById('random-block-execution').innerHTML =
	getRandomBlockExecusion();

let errorInputEmail = document.getElementById('message-error-email');
let errorInputPhone = document.getElementById('message-error-phone');
let errorInputName = document.getElementById('message-error-name');

const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', submitData);

function submitData(e) {
	e.preventDefault();
	let nameInput = document.getElementById('nameInput').value;
	let emailInput = document.getElementById('emailInput').value;
	let phoneInput = document.getElementById('phoneNumberInput').value;
	let acceptInput = document.getElementById('accept').checked;

	if (nameInput.trim() === '') {
		errorInputName.innerText = 'Vui lòng nhập họ và tên!';
		errorInputName.style.display = 'block';
		return;
	}

	if (emailInput.trim() === '') {
		errorInputEmail.innerText = 'Vui lòng nhập email!';
		errorInputEmail.style.display = 'block';
		return;
	}

	if (phoneInput.trim() === '') {
		errorInputPhone.innerText = 'Vui lòng nhập số điện thoại!';
		errorInputPhone.style.display = 'block';
		return;
	}

	if (!validateEmail(emailInput)) {
		errorInputEmail.innerText = 'Vui lòng nhập email hợp lệ!';
		errorInputEmail.style.display = 'block';
		return;
	}

	if (!validatePhoneNumber(phoneInput)) {
		errorInputPhone.innerText = 'Vui lòng nhập số điện thoại hợp lệ!';
		errorInputPhone.style.display = 'block';
		return;
	}

	const userData = {
		name: nameInput.trim(),
		email: emailInput.trim(),
		phone: phoneInput.trim(),
		date: new Date().toISOString(),
	};

	e.currentTarget.submit();
}

function validateEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

function validatePhoneNumber(phone) {
	const phoneRegex = /^0\d{9}$/;
	return phoneRegex.test(phone);
}

function getRandomBlockExecusion() {
	var options = ['A', 'B', 'C', 'D'];
	var blockExecution =
		options[Math.floor(Math.random() * options.length)];

	return blockExecution;
}

function getToday() {
	const date = new Date();
	var day = date.getDate();
	var month = date.getMonth() + 1;
	var year = date.getFullYear();
	var formattedDay = day.toString().padStart(2, '0');
	var formattedMonth = month.toString().padStart(2, '0');

	let today = formattedDay + '-' + formattedMonth + '-' + year;

	return today;
}

function getRandomScore() {
	let randomNumber = Math.floor(Math.random() * (22 - 12 + 1)) + 12;
	return randomNumber;
}

$(function () {
	animateElement('random-score', 'zoom-in-out');
	animateElement('random-block-execution', 'blink');
});

function animateElement(elementId, animationClass) {
	$('#' + elementId).addClass(animationClass);
}

$(function() {
	animateElement('random-score', 'zoom-in-out');
	animateElement('random-block-execution', 'blink');
	setInterval(changeValues, 3000);
  });
  
  function changeValues() {
	document.getElementById('random-score').innerHTML = getRandomScore();
	document.getElementById('random-block-execution').innerHTML = getRandomBlockExecusion();
  }
  
  function getRandomBlockExecusion() {
	var options = ['A', 'B', 'C', 'D'];
	var blockExecution = options[Math.floor(Math.random() * options.length)];
	return blockExecution;
  }
  
  function getRandomScore() {
	let randomNumber = Math.floor(Math.random() * (22 - 12 + 1)) + 12;
	return randomNumber;
  }
  