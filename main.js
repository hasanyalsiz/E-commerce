const categoryList = document.querySelector('.categories');
const productList = document.querySelector('.products');
const openBtn = document.getElementById('open-btn');
const closeBtn = document.getElementById('close-btn');
const modal = document.getElementById('modal-wrapper');
const modalInfo = document.getElementById('modal-info');
const modalList = document.querySelector('.modal-list');
const card = document.querySelector('.card');
const usersList = document.querySelector('.container');


document.addEventListener('DOMContentLoaded', () => {
  //CALLBACK > İçerisinde başka fonksiyon çalıştıran fonksiyon
  fetchCategories();
  fetchProducts();
  fetchUsers();
});



function fetchCategories() {
  fetch('https://api.escuelajs.co/api/v1/categories')
    // GELEN VERİYİ İŞLEME
    .then((response) => response.json())
    // OLUŞAN DATAYI FOREACH İLE HER BİR OBJE İÇİN FONKSİYON ÇALIŞTIRMA
    .then((data) =>
      data.slice(0, 5).forEach((category) => {
        // GELEN HERBİR OBJE İÇİN dıv oluşturma
        const categoryDıv = document.createElement('div');
        // Dive class ekleme
        categoryDıv.classList.add('category');
        // Divin içeriğini değiştirme
        categoryDıv.innerHTML = `
           <img src="${category.image}"/>
           <span>${category.name}</span>
        `;
        if (category.name === "Ropa Nueva") {
          return;
        }
        // Oluşan categoryi htmldeki listeye atma
        categoryList.appendChild(categoryDıv);
      })
    )
    
    .catch((err) => console.log(err));
}


// ÜRÜNLERİ ÇEKME
function fetchProducts() {
  // apı YE İSTEK ATMA
  fetch('https://api.escuelajs.co/api/v1/products/') //endpoint
    // İstek başarılı olursa veriyi işle
    .then((res) => res.json())
    // işlenen veriyi al ve ekrana bas
    .then((data) =>
      data.slice(0, 24).forEach((product) => {
        // DİV oluştur
        const productDıv = document.createElement('div');
        productDıv.classList.add('product');
        // içeiriği değiştir
        productDıv.innerHTML = `
          <img src="${product.images[0]}" />
            <p class="product-title">${product.title}</p>
            <p class="product-category">${product.category.name}</p>
            <div class="product-action">
              <p>${product.price} ₺</p>
              <button onclick="sepeteEkle({id:'${product.id}',name:'${product.title}',price:'${product.price}',image:'${product.images[0]}',amount:1})">Sepete Ekle</button>
            </div>
          </div>
        `;
        // htmle göndericez
        productList.appendChild(productDıv);
      })
    )
    // hata olursa devreye gir
    .catch();
}

function fetchUsers(){
  fetch('https://api.escuelajs.co/api/v1/users')
    // GELEN VERİYİ İŞLEME
    .then((resp) => resp.json())
    // OLUŞAN DATAYI FOREACH İLE HER BİR OBJE İÇİN FONKSİYON ÇALIŞTIRMA
    .then((data) =>
      data.slice(0, 3).forEach((user) => {
        // GELEN HERBİR OBJE İÇİN dıv oluşturma
        const usersDiv = document.createElement('div');
        // Dive class ekleme
        usersDiv.classList.add('user');
        // Divin içeriğini değiştirme
        usersDiv.innerHTML = `
        <div class="card">
        <img src="${user.avatar}" alt="Person" class="card__image">
        <p class="card__name">${user.name}</p>
        <div class="grid-container">
    
          <div class="grid-child-posts">
            156 Post
          </div>
    
          <div class="grid-child-followers">
            1012 Likes
          </div>
    
        </div>
        <ul class="social-icons">
          <li><a href="#"><i class="fa-brands fa-instagram"></i></a></li>
          <li><a href="#"><i class="fa-brands fa-twitter"></i></a></li>
          <li><a href="#"><i class="fa-brands fa-linkedin"></i></a></li>
          <li><a href="#"><i class="fa-brands fa-github"></i></a></li>
        </ul>
        <button class="btn draw-border">Follow</button>
        <button class="btn draw-border">Message:${user.email}</button>
    
      </div>
        `;
        
        // Oluşan categoryi htmldeki listeye atma
        usersList.appendChild(usersDiv);
      })
    )
    
    .catch((err) => console.log(err));
}
// Butonlara tıklanma olayını izliyoruz

let basket = [];
var toplam = 0;

const addList = () => {
  basket.forEach((product) => {
    const listItem = document.createElement('div');
    listItem.classList.add('list-item');
    listItem.innerHTML = `
                  <div>
                      <img src="${product.image}" alt="">
                  </div>              
                  <h2>${product.name}</h2>
                  <h2>${product.price}</h2>
                  <p>Miktar: ${product.amount}</p>
                  <button id="del" onclick="deleteFrom({id:'${product.id}',price:'${product.price}',amount:'${product.amount}'})">Del</button>
  `;
    modalList.appendChild(listItem);

    toplam += Number(product.price) * Number(product.amount);
  });
};

// SEPETTEN SİL
const deleteFrom = (param) => {
  basket = basket.filter((i) => i.id != param.id);
  toplam -= Number(param.price) * param.amount;
  modalInfo.innerText = toplam;
};
modalList.addEventListener('click', (e) => {
  if (e.target.id === 'del') {
    e.target.parentElement.remove();
  }
});

openBtn.addEventListener('click', () => {
  toggleModal();
  addList();
  modalInfo.innerText = toplam;
});

closeBtn.addEventListener('click', () => {
  toggleModal();
  modalList.innerHTML = ' ';
  toplam = 0;
  
});

// Eğer dışarıya tıklanırsa da kapat
// modal.addEventListener('click', (e) => {
//   if (e.target.id !== 'modal') {
//     modal.classList.remove('active');
//     modalList.innerHTML = ' ';
//   }
// });

// eğer tıklanırsa class eklenip çıkarılıyor
function toggleModal() {
  modal.classList.toggle('active');
}

//! SEPETE EKLEME İŞLEMİ

function sepeteEkle(product) {
  const findItem = basket.find((eleman) => eleman.id === product.id);

  if (findItem) {
    findItem.amount += 1;
  } else {
    basket.push(product);
  }
  // Update the basket count in the "Sepet" button
  const basketCount = document.getElementById('basket-count');
  basketCount.innerText = basket.length;
}
