const BASE_URL = "https://user-list.alphacamp.io"
const INDEX_URL = BASE_URL + "/api/v1/users"
const SHOW_URL = BASE_URL + "/api/v1/users/"

const friends = []
let filterFriends = []
const pageDisplayNumber = 24

const dataPanel = document.querySelector('#data-panel')
const pagination = document.querySelector('#paginator')
const submitButton = document.querySelector('#submitButton')
const friendNameKey = document.querySelector('#friendNameKey')
const home = document.querySelector('#home')
const navbar = document.querySelector('nav')

// 渲染朋友資料畫面
function renderFriendList(Data) {
  let friendListHTML = ""
  Data.forEach((friend) => {
    friendListHTML += `
      <div class="col-sm-2">
        <div class="mb-2 mt-0 ms-0">
          <div class="card mb-1">
            <img src=${friend.avatar} class="selfie img-fluid border border-secondary"
              alt="friend-selfie" type="button" class="btn btn-primary" data-bs-toggle="modal"
              data-bs-target="#friendDetailsModal" data-id=${friend.id}>
          </div>
          <div class="card-footer">
            <p class="friendNameSurname text-center border border-secondary" type="button" style="background-color: #e3f2fd;" data-id=${friend.id}>${friend.name} ${friend.surname}</p>
          </div>
        </div>
      </div>
    `
  });
  dataPanel.innerHTML = friendListHTML
}

//朋友介紹模塊
function uniqueFriendModal(id) {
  const friendName = document.querySelector('.modal-title')
  const email = document.querySelector('.email')
  const gender = document.querySelector('.gender')
  const age = document.querySelector('.age')
  const region = document.querySelector('.region')
  const birthday = document.querySelector('.birthday')
  const friendPicture = document.querySelector('.friendPicture')

  axios.get(SHOW_URL + id).then(response => {
    const friendObject = response.data
    friendName.innerText = `${friendObject.name} ${friendObject.surname}`
    email.innerText = "Email: " + friendObject.email
    gender.innerText = "Gender: " + friendObject.gender
    age.innerText = "Age: " + friendObject.age
    region.innerText = "Region: " + friendObject.region
    birthday.innerText = "Birthday: " + friendObject.birthday
    friendPicture.innerHTML = `
      <img src=${friendObject.avatar} alt="selfie" class="modalSelfie">
    `
  })
}

//分頁器要有多少頁，以及一些格式設定
function pageQuantity(amount) {
  const allPageNum = Math.ceil(amount / pageDisplayNumber)
  let paginatorHTML = ''

  for (let page = 1; page <= allPageNum; page++) {
    paginatorHTML += `
      <li class="page-item"><a class="page-link pageNum text-black" href="#">${page}</a></li>
    `
  }
  pagination.innerHTML = paginatorHTML
}


function pageNumActive(event) {
  const target = event.target
  const pageNum = document.querySelectorAll('.pageNum')
  pageNum.forEach((num) => {
    num.classList.remove('active', 'text-white')
    num.classList.add('text-black')
  })
  target.classList.remove('text-black')
  target.classList.add('active', 'text-white')
}


//渲染每一頁的呈現資料
function renderEachPage(pageNumber) {
  const data = filterFriends.length ? filterFriends : friends
  // 註記，這裡記得用length當作存在東西，根據導流的資料是有查詢的，還是沒查詢的分野

  const currentPage = pageNumber
  const dataStart = (currentPage - 1) * pageDisplayNumber
  const dataEnd = currentPage * pageDisplayNumber
  const dataToDisplay = data.slice(dataStart, dataEnd)

  renderFriendList(dataToDisplay)
}



// 提交查詢事件
submitButton.addEventListener('submit', function onSubmitClicked(event) {
  event.preventDefault()
  const keyWord = friendNameKey.value.trim().toLowerCase()

  filterFriends = friends.filter((friend) => friend.name.toLowerCase().includes(keyWord) || friend.surname.toLowerCase().includes(keyWord))

  if (filterFriends.length === 0) {
    return alert('No matches for ' + keyWord)
  }

  pageQuantity(filterFriends.length)
  renderEachPage(1) // 查詢結果第一頁的東西
})


// 點擊大頭貼事件，觸發跳出介紹框框
dataPanel.addEventListener('click', function triggerFriendModal(event) {
  if (event.target.matches('.selfie')) {
    uniqueFriendModal(Number(event.target.dataset.id))
  }
})

// 點擊分頁數字觸發事件
pagination.addEventListener('click', function onPanelClicked(event) {
  event.preventDefault()
  if (event.target.matches('.pageNum')) {
    renderEachPage(Number(event.target.innerText))
    pageNumActive(event)
  }
})

// 點home或主頁大標題回預設畫面第一頁
navbar.addEventListener('click', function onNavClicked(event) {
  if (!event.target.matches('.favoriteBtn')) {
    window.location.reload()
  }
})


// Call Friend API
axios.get(INDEX_URL).then(response => {
  friends.push(...response.data.results)

  pageQuantity(friends.length)
  renderEachPage(1)
})
  .catch((err) => {
    console.log(err)
  })
