document.getElementById('today').innerHTML = getToday();
document.getElementById('random-score-1').innerHTML = getRandomScore();
document.getElementById('random-score-2').innerHTML = getRandomScore();
document.getElementById('random-score-3').innerHTML = getRandomScore();
document.getElementById('random-block-execution').innerHTML = getRandomBlockExecusion();

function getRandomScore() {
	let randomNumber = Math.floor(Math.random() * (22 - 12 + 1)) + 12;
	return randomNumber;
}

const randomScore1 = document.getElementById('random-score-1');
const randomScore2 = document.getElementById('random-score-2');
const randomScore3 = document.getElementById('random-score-3');


function runAnimation() {
	let currentIndex = 1;
  
	function changeAnimation() {
	  if (currentIndex === 1) {
		randomScore1.classList.add('animated-element');
		randomScore3.classList.remove('animated-element');
		currentIndex = 2;
	  } else if (currentIndex === 2) {
		randomScore1.classList.remove('animated-element');
		randomScore2.classList.add('animated-element');
		currentIndex = 3;
	  } else if (currentIndex === 3) {
		randomScore2.classList.remove('animated-element');
		randomScore3.classList.add('animated-element');
		currentIndex = 1;
	  }
	}
  
	function updateRandomBlockExecution() {
	  document.getElementById('random-block-execution').innerHTML = getRandomBlockExecusion();
	}
  
	setTimeout(changeAnimation, 2000);
	setInterval(changeAnimation, 2000);
	setInterval(updateRandomBlockExecution, 6000);
  }
  
  randomScore1.classList.add('animated-element');
  runAnimation();


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
	var options = ['A', 'B', 'C', 'D', "A00", "A01", "A02"];
	var blockExecution = options[Math.floor(Math.random() * options.length)];
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


