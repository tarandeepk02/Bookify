(()=>{
    const setCopyrightYear = () => {
        document.querySelector('footer>kbd>span').innerHTML = new Date().getFullYear()
    }
    async function postData(url = '', data = {}) {
       
        // Default options are marked with *
        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
    }
    const displayForm = (event) => {
            
        // prevent refreshing the page
        event.preventDefault()
        if (event.srcElement.id === 'register') {
        document.querySelector('#welcome').style.display='none'
        document.querySelector('#registerForm').style.display='block'
        document.querySelector('#loginForm').style.display='none'

       } else {
        document.querySelector('#welcome').style.display='none'
        document.querySelector('#registerForm').style.display='none'
        document.querySelector('#loginForm').style.display='block'
       }
    }
    const register = async (event) => {
        // prevent refreshing the page
        event.preventDefault()
       let email = document.querySelector('#email').value
       let password = document.querySelector('#password').value
       let confirm = document.querySelector('#confirm').value
       if (password === confirm) {
           reply = await fetch('/member',{})
           document.querySelector('#signup-error').innerHTML=`<kbd class=h4>${reply.message}</kbd>`

       } else {
            document.querySelector('#signup-error').innerHTML='<kbd class=h4>Passwords do not match. Re-enter your password</kbd>'
       }
    }
    const login = (event) => {
        // prevent refreshing the page
        event.preventDefault()        
        let email = document.querySelector('#email').value
        let password = document.querySelector('#password').value
        let reply = postData('/signin',{email,password})
    }
    
    const displayWeatherInfo = async (latitude, longitude) => {
        console.log(latitude, longitude)
        console.info("Display weather info")
        const header = document.querySelector('#info')
        const url = `${baseAPI}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
        console.info(url)
        console.info(`latitude:${latitude},longitude:${longitude}`)
        const data = await getJsonData(url)
        header.innerHTML = JSON.stringify(data)

    }
    
    window.onload = () => {
        setCopyrightYear()
        document.querySelector('#registerForm').style.display='none'
        document.querySelector('#loginForm').style.display='none'
        document.querySelector('#register').addEventListener('click',displayForm)
        document.querySelector('#login').addEventListener('click',displayForm)

    }
    
})()