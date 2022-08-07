const footer = '  <footer class="footer"><p>This project was created by <a href="https://github.com/MartinsitoBritoDiaz">Martinsito</a> ©</p></footer>'

const loadStyle = () => {
	var cssId = 'myCss'  // you could encode the css path itself to generate id..
	if (!document.getElementById(cssId))
	{
		var head  = document.getElementsByTagName('head')[0]
		var link  = document.createElement('link')
		link.rel  = 'stylesheet'
		link.href = './style.css'
		head.appendChild(link)
	}
}

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
	
	${footer}
	`
	const body = document.getElementsByTagName('body')[0]
	body.innerHTML = template
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
					<input name="password" type="password"/>
				</div>
				<button class="button" type="submit">Send</button> 
			</form>
			<a href="#" class="button" id="login" type="submit">Log In</a>
			<div class="error" id="error"></div>
		</div>
		
		${footer}
		`	
	const body = document.getElementsByTagName('body')[0]
	body.innerHTML = template
}

const loadLoginTemplate = () => {
	const template = `
		<div class="card">
			<h1>Login</h1>
			<form id="login-form">
				<div class="name">
					<label>Email</label>
					<input name="email" />
				</div>
				<div class="type">
					<label>Password</label>
					<input name="password" type="password"/>
				</div>
				<button class="button" type="submit">Send</button> 
			</form>
			<a href="#" class="button" id="register" type="submit">Register?</a>
			<div class="error" id="error"></div>
		</div>

		
		${footer}
		`	
	const body = document.getElementsByTagName('body')[0]
	body.innerHTML = template
}

const checkLogin = () => localStorage.getItem('jwt')


const getAnimals = async () => {
	const response = await fetch('/animals', {
		headers: {
			Authorization: localStorage.getItem('jwt'),
		}
	})
	const animals = await response.json()
	const template = animal => `
		<li>
			${animal.name} ${animal.type} <button class="button bg-red" data-id="${animal._id}">Delete</button>
		</li>
	`

	const animalList = document.getElementById('animal-list')
	animalList.innerHTML = animals.map(animal => template(animal)).join('')
	
	animals.forEach(animal => {
		animalNode = document.querySelector(`[data-id="${animal._id}"]`)
		animalNode.onclick = async e => {
			await fetch(`/animals/${animal._id}`, {
				method: 'DELETE',
				headers: {
					Authorization: localStorage.getItem('jwt')
				}
			})
			animalNode.parentNode.remove()
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
				'Content-Type': 'application/json',
				Authorization: localStorage.getItem('jwt'),
			}
		})
		animalForm.reset()
		getAnimals()
	}
}

const animalsPage = () => {
	loadInitialTemplate()
	addFormListener()
  	getAnimals()
}

const authListener = action => () => {
	const form = document.getElementById(`${action}-form`)
	form.onsubmit = async (e) => {
		e.preventDefault()

		const formData = new FormData(form)
		const data = Object.fromEntries(formData.entries())

		const response = await fetch(`./${action}`, {
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
			localStorage.setItem('jwt', `Bearer ${responseData}`)
			animalsPage()
		}
	}
}

const addRegisterListener = authListener('register')

const gotoRegisterListener = () => {
	const gotoRegister = document.getElementById('register')

	gotoRegister.onclick = (e) => {
		e.preventDefault()
		registerPage()
	}
}

const addLoginListener = authListener('login')

const gotoLoginListener = () => {
	const gotoLogin = document.getElementById('login')
	
	gotoLogin.onclick = (e) => {
		e.preventDefault()
		loginPage()
	}
}

const registerPage = () => {
	console.log('Register Page')
	loadRegisterTemplate()
	addRegisterListener()
  	gotoLoginListener()
}

const loginPage = () => {
	loadLoginTemplate()
	addLoginListener()
	gotoRegisterListener()
}

window.onload = () => {
	loadStyle()

	const isLoggedIn = checkLogin()

	if(isLoggedIn){
		animalsPage()
	}else{
		loginPage()
	}
}
