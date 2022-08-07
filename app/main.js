
const loadInitialTemplate = () => {
	const template = `
	<div class="card">
		<h1>Animals</h1>
			<form id="animal-form">
			<div class="name">
				<label>Name</label>
				<input name="name" />
			</div>
			<div class="type">
				<label>Type</label>
				<input name="type" />
			</div>
			<button class="button" type="submit">Send</button>
			</form>
			<h3>List of animals</h3>
			<ul id="animal-list"></ul>
	</div>
	`
	const body = document.getElementsByTagName('body')[0]
	body.innerHTML = template
}

const getAnimals = async () => {
	const response = await fetch('/animals')
	const animals = await response.json()
	const template = animal => `
		<li>
			${animal.name} ${animal.type} <button data-id="${animal._id}">Eliminar</button>
		</li>
	`

	const animalList = document.getElementById('animal-list')
	animalList.innerHTML = animals.map(animal => template(animal)).join('')
	animals.forEach(animal => {
		animalNode = document.querySelector(`[data-id="${animal._id}"]`)
		animalNode.onclick = async e => {
			await fetch(`/animals/${animal._id}`, {
				method: 'DELETE',
			})
			animalNode.parentNode.remove()
			alert('Eliminado con éxito')
		}
	})
}

const addFormListener = () => {
	const animalForm = document.getElementById('animal-form')
	animalForm.onsubmit = async (e) => {
		e.preventDefault()
		const formData = new FormData(animalForm)
		const data = Object.fromEntries(formData.entries())
		await fetch('/animals', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json'
			}
		})
		animalForm.reset()
		getAnimals()
	}
}

const checkLogin = () => localStorage.getItem('jwt');

const animalsPage = () => {
	loadInitialTemplate()
	addFormListener()
  	getAnimals()
}

const loadRegisterTemplate = () => {
	const template = `
		<div class="card">
			<h1>Register</h1>
			<form id="register-form">
				<div class="name">
					<label>Email</label>
					<input name="email" />
				</div>
				<div class="type">
					<label>Password</label>
					<input name="password" />
				</div>
				<button class="button" type="submit">Send</button> 
			</form>
			<a href="#" class="button" id="register" type="submit">Log In</a>
			<div class="error" id="error"></div>
		</div>
		`	
	const body = document.getElementsByTagName('body')[0];
	body.innerHTML = template;
}

const addRegisterListener = () => {
	const registerForm = document.getElementById('register-form')
	registerForm.onsubmit = async (e) => {
		e.preventDefault()

		const formData = new FormData(registerForm)
		const data = Object.fromEntries(formData)
		const response = await fetch('./register', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
			}
		})

		const responseData = await response.text()

		if(response.status >= 300){
			const errorNode = document.getElementById('error')
			errorNode.innerHTML = responseData
		}else{
			console.log(responseData)
		}
	}
}
const gotoLoginListener = () => {}


const registerPage = () => {
	console.log('Register Page')
	loadRegisterTemplate()
	addRegisterListener()
  	gotoLoginListener()
}

const loginPage = () => {
	loadLoginTemplate()
	addLoginListener()
	gotoRegisterrListener()
}

const loadLoginTemplate = () => {
	const template = `
		<div class="card">
			<h1>Login</h1>
			<form id="login-form">
				<div class="name">
					<label>Email</label>
					<input name="name" />
				</div>
				<div class="type">
					<label>Password</label>
					<input name="text" />
				</div>
				<button class="button" type="submit">Send</button> 
			</form>
			<a href="#" class="button" id="register" type="submit">Register?</a>
			<div class="error" id="error"></div>
		</div>
		`	
	const body = document.getElementsByTagName('body')[0];
	body.innerHTML = template;
}

const gotoRegisterrListener = () => {
	const gotoRegister = document.getElementById('register')

	gotoRegister.onclick = (e) => {
		e.preventDefault()

		registerPage()
	}
}

const addLoginListener = () => {
	const loginForm = document.getElementById('login-form')
	loginForm.onsubmit = async (e) => {
		e.preventDefault()

		const formData = new FormData(loginForm)
		const data = Object.fromEntries(formData)
		const response = await fetch('./login', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
			}
		})

		const responseData = await response.text()

		if(response.status >= 300){
			const errorNode = document.getElementById('error')
			errorNode.innerHTML = responseData
		}else{
			console.log(responseData)
		}
	}
}

const loadStyle = () => {
	var cssId = 'myCss';  // you could encode the css path itself to generate id..
	if (!document.getElementById(cssId))
	{
		var head  = document.getElementsByTagName('head')[0];
		var link  = document.createElement('link');
		link.rel  = 'stylesheet';
		link.href = './style.css';
		head.appendChild(link);
	}
}


window.onload = () => {
	loadStyle()

	const isLoggedIn = checkLogin();

	if(isLoggedIn){
		animalsPage();
	}else{
		loginPage()
	}
}
