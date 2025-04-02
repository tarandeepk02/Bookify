// using IIFE
(() => {

    const setCopyrightYear = () => {
        document.querySelector('footer>kbd>span').innerHTML = new Date().getFullYear()
    }
    /**----------------------------------------------------
    Utility functions
    -----------------------------------------------------*/
    const getBlobData = async (url) => {
        const response = await fetch(url)
        const imageBlob = await response.blob()
        return imageBlob
    }
    const getJsonData = async (url) => {
        try {
            console.info('getJsonData', url)
            const response = await fetch(url)
            console.info(response)
            const data = await response.json()
            return data
        } catch (err) {
            console.error(err)
        }
    }

    /**----------------------------------------------------
    Utility functions
    -----------------------------------------------------*/
    const getPosts = () => {
        console.info("Getting posts")
        fetch('/posts')
            .then(response => response.json())
            .then(posts => displayPosts(posts))
            .catch(err => console.error(err))
    }
    const displayPosts = async () => {
        const posts = await getJsonData('/posts')
        if (posts.length > 0) {
            console.info("Posts:", posts)
            console.info("Displaying posts")
            let header = document.querySelector('#header')
            let thead = document.querySelector('thead')
            let tbody = document.querySelector('tbody')
            const keys = Object.keys(posts)
            let columns = Object.keys(posts[0])
            let tr = document.createElement('tr')
            tr.setAttribute('class', 'text-center h3')
            columns.push(' ')
            columns.forEach(column => {
                let th = document.createElement('th')
                th.textContent = column === "Message" ? "Message Snippet" : column
                th.textContent = column === "_id" ? "#" : column
                tr.appendChild(th)
            })
            thead.appendChild(tr)

            for (let i = 0; i < posts.length; i++) {
                console.info(`i=${i}`, posts[i])
                let tr = document.createElement('tr')
                let rows = []
                columns.forEach(column => {
                    rows.push(document.createElement('td'))
                })
               
                for (let j = 0; j < rows.length; ++j) {
                    if (j== 0) rows[j].innerHTML = `<kbd>${i+1}</kbd>`
                    else if (j === rows.length - 1) {
                        let details  = document.createElement('button')
                        details.setAttribute('class','btn btn-outline-warning')
                        details.innerHTML = 'View Post Details'
                        rows[j].appendChild(details)
                        details.onclick = () => displayPostDetails(posts[i][columns[0]])
                    }
                    else if (columns[j] === "Message") rows[j].innerHTML = `${posts[i][columns[j]].slice(0, 10)} ...`
                    else rows[j].innerHTML = posts[i][columns[j]]
                    //console.info(j, rows[j].innerHTML)
                    tr.appendChild(rows[j])
                }
                tbody.appendChild(tr)
            }
        } else {
            console.info(`Posts collection is empty`)
        }
    }
    const displayDetails = () => {
        document.querySelector('#post').style.display = 'block'
        document.querySelector('#posts').style.display = 'none'
    }
    const displayPostDetails = async (id) => {
        //console.info(`Getting post with id <<${id}>>`)
        const post = await getJsonData(`/post/${id}`)
        let details = Object.keys(post.post)
        console.info(post.post)
        details.forEach(key => key.toLowerCase())
        console.info(`Details: ${details}`)
        
        details.forEach( key => {
            let element = document.querySelector(`input#${key}`)
            if(element) element.value = post.post[key]
            else document.querySelector(`#${key}`).innerHTML = post.post[key]
        })
        displayDetails()         
    }
    


    window.onload = () => {
        setCopyrightYear()
        document.querySelector('#post').style.display = 'none'
        document.querySelector('#posts').style.display = 'block'
        displayPosts()
        //getGeolocation()

    }
})()
