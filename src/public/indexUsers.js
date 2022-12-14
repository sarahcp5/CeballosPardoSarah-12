const loginForm = document.getElementById('loginForm');

$("#loginForm").submit(async(e) => {
  e.preventDefault();
  let data = new FormData(loginForm);
  let obj = {};
  data.forEach((value, key) => obj[key] = value);
  fetch('login', {
    method: 'POST',
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(result => result.json()).then(json => {
    if(json.status === 'OK') {
      window.location.href = "http://localhost:8080/api";
    }
  })
  .catch(error => console.log(error));
});

const formUser = document.getElementById('registerForm');

$("#registerForm").submit(async(e) => {
    e.preventDefault();
    let data = new FormData(formUser);
    let obj = {};

    data.forEach((value,key) => obj[key] = value);
    fetch ('api/sessions/register', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            "Content-Type":"application/json"
        }
    }).then(result => result.json()).then(json => {
      if(!json.status) {
        window.location.href = "http://localhost:8080/login";
      }
    });
});

$("#logout").submit(async(e) => {
  e.preventDefault();
  console.log("acacac")
  fetch('logout')
  .then(res => res.json()).then(json => console.log(json))
  .catch(error => console.log(error));
});



// const currentButton = document.getElementById('current');

// currentButton.addEventListener('click', async() => {
//   fetch('current')
//   .then(res => res.json()).then(json => console.log(json))
//   .catch(error => console.log(error));
// });

// const logoutButton = document.getElementById('logout');

// logoutButton.addEventListener('click', async() => {
//   fetch('logout')
//   .then(res => res.json()).then(json => console.log(json))
//   .catch(error => console.log(error));
// });

const socket = io.connect();
let products = [];

socket.on('messages', data => {
    render(data);
});

socket.on('products', data => {
    renderTable(data.products);
});

function render(data) {
    if(data.compr != undefined) {
        $("#compr").append(`(Comprensi??n ` + `${data.compr}` + `%)`);
    }

   data.forEach((elem) => {
        $("#messages").append(`
            <div> 
                <strong class="text-primary">${elem.author.email}</strong>
                <em class="text-brown">[${elem.date}]: </em> 
                <em class="fst-italic text-success">${elem.text}</em>
                <em><img src="${elem.author.avatar}" width="40px"></em>
            </div>
        `)
    });
}

async function renderTable(productsData) {
    const response = await fetch("/tableProducts.handlebars");
    const source = await response.text();
    const template = Handlebars.compile(source);
    const context = { products: productsData };
    let html = template(context);
    $("#tableProducts").empty();
    $("#tableProducts").append(html);
}

$("#formChat").submit((e) => {
    e.preventDefault();
    const menssage = {
        author: {
            email: $('#email').val(),
            nombre: $('#nombre').val(),
            apellido: $('#apellido').val(),
            edad: $('#edad').val(),
            alias: $('#alias').val(),
            avatar: $('#avatar').val() 
        },
        date: new Date().toLocaleString(),
        text: $('#message').val()
    };

    socket.emit('new-message', menssage);
    emptyInput('#message');
});

$("#formProduct").submit(async(e) => {
    e.preventDefault();
    const product = {
        title: $('#title').val(),
        price: $('#price').val(),
        thumbnail: $('#thumbnail').val(),
    };
    
    await socket.emit('new-product', product);
    emptyInput('#title');
    emptyInput('#price');
    emptyInput('#thumbnail');
});

function emptyInput(value) {
    $(value).val("");
}

$("#logout").click(async(e) => {
    e.preventDefault();
    console.log("acacac")
    fetch('logout')
    // .then(res => res.json()).then(json => console.log(json))
    // .catch(error => console.log(error));
});

async function renderTable(productsData) {
  const response = await fetch("/tableProducts.handlebars");
  const source = await response.text();
  const template = Handlebars.compile(source);
  const context = { products: productsData };
  let html = template(context);
  $("#tableProducts").empty();
  $("#tableProducts").append(html);
}