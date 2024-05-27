const BASE_URL = "https://user-list.alphacamp.io"
const INDEX_URL = BASE_URL + "/api/v1/users"
const SHOW_URL = BASE_URL + "/api/v1/users/"

const pageDisplayNumber = 24
const friends = []
let filterFriends = []

const dataPanel = document.querySelector('#data-panel')
const pagination = document.querySelector('#paginator')
const submitButton = document.querySelector('#submitButton')
const friendNameKey = document.querySelector('#friendNameKey')
const home = document.querySelector('#home')
const navbar = document.querySelector('nav')
// const friendName = document.querySelector('.modal-title')
const friendPicture = document.querySelector('.friendPicture')
const modalFooter = document.querySelector('.modal-footer')
const introText = document.querySelector('.introtext')
const modalHeader = document.querySelector('.modal-header')
const offcanvasBody = document.querySelector('.offcanvas-body')
const favoriteList = document.querySelector('.favoriteList')



// 渲染初始資料畫面
function renderFriendList(Data) {
  const bestFriendsListID = JSON.parse(localStorage.getItem('favoriteFriendsID')) || []
  let friendListHTML = ""
  Data.forEach((friend) => {

    if (bestFriendsListID.includes(friend.id)) {
      friendListHTML += `
      <div class="col-6 col-sm-2">
        <div class="mb-2 mt-0 ms-0">
          <div class="card mb-1">
          <i class="fa-solid fa-heart fa-2xl favorite-icon" id="favorite-${friend.id}" style="color: #de1212;"></i>
            <img src=${friend.avatar} class="selfie img-fluid border border-secondary"
              alt="friend-selfie" type="button" class="btn" data-bs-toggle="modal"
              data-bs-target="#friendDetailsModal" data-id=${friend.id}>
          </div>
          <div class="card-footer">
            <p class="friendNameSurname text-center border border-secondary" style="background-color: #e3f2fd;" data-id=${friend.id}>${friend.name} ${friend.surname}</p>
          </div>
        </div>
      </div>
    `
    } else if (!bestFriendsListID.includes(friend.id)) {
      friendListHTML += `
      <div class="col-6 col-sm-2">
        <div class="mb-2 mt-0 ms-0">
          <div class="card mb-1">
          <i class="fa-solid fa-heart fa-2xl favorite-icon d-none" id="favorite-${friend.id}" style="color: #de1212;"></i>
            <img src=${friend.avatar} class="selfie img-fluid border border-secondary"
              alt="friend-selfie" type="button" class="btn" data-bs-toggle="modal"
              data-bs-target="#friendDetailsModal" data-id=${friend.id}>
          </div>
          <div class="card-footer">
            <p class="friendNameSurname text-center border border-secondary" style="background-color: #e3f2fd;" data-id=${friend.id}>${friend.name} ${friend.surname}</p>
          </div>
        </div>
      </div>
    `
    }
  });
  dataPanel.innerHTML = friendListHTML
}


// 渲染查詢或初始狀態每一頁的呈現資料
function renderEachPage(pageNumber) {
  const data = filterFriends.length ? filterFriends : friends
  // 註記，這裡記得用length當作存在東西，根據導流的資料是有查詢的，還是沒查詢的分野
  const currentPage = pageNumber
  const dataStart = (currentPage - 1) * pageDisplayNumber
  const dataEnd = currentPage * pageDisplayNumber
  const dataToDisplay = data.slice(dataStart, dataEnd)

  renderFriendList(dataToDisplay)
}


// 點擊朋友大頭貼跳出的Modal
function uniqueFriendModal(id) {
  const bestFriendsList = JSON.parse(localStorage.getItem('favoriteFriends')) || []
  const selectedFriend = friends.find((friend) => friend.id === id)

  friendPicture.innerHTML = `
      <img src=${selectedFriend.avatar} alt="selfie" class="modalSelfie img-fluid">
    `

  introText.innerHTML = `
    <div>
      <p class="email">Email: ${selectedFriend.email}</p>
      <p class="gender">Gender: ${selectedFriend.gender}</p>
      <p class="age">Age: ${selectedFriend.age}</p>
      <p class="region">Region: ${selectedFriend.region}</p>
      <p class="birthday">Birthday: ${selectedFriend.birthday}</p>
    </div>
  `

  if (bestFriendsList.some((friend) => friend.id === id)) {
    modalHeader.innerHTML = `
      <i class="fa-solid fa-star" style="color: #FFD43B;"> Favorite </i>
      <h5 class="modal-title">${selectedFriend.name} ${selectedFriend.surname}</h5>
    `
  } else {
    modalHeader.innerHTML = `
      <h5 class="modal-title">${selectedFriend.name} ${selectedFriend.surname}</h5>
    `
  }

  if (bestFriendsList.some((friend) => friend.id === id)) {
    modalFooter.innerHTML = `
      <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal" data-id=${selectedFriend.id}>Close</button>
      <button type="button" class="btn btn-remove-favorite btn-outline-danger" data-id=${selectedFriend.id}>Remove from Favorites</button>
    `
  } else if (!bestFriendsList.some((friend) => friend.id === id)) {
    modalFooter.innerHTML = `
      <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal" data-id=${selectedFriend.id}>Close</button>
      <button type="button" class="btn btn-add-favorite btn-outline-info" data-id=${selectedFriend.id}>Add to Favorites</button>
    `
  }
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


// 點擊分頁時，轉換顏色、樣式，醒目
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


// 點擊addToBestFriend新增喜愛作動modal
function addToFavorite(id) {
  const bestFriendsList = JSON.parse(localStorage.getItem('favoriteFriends')) || []
  const bestFriendsListID = JSON.parse(localStorage.getItem('favoriteFriendsID')) || []
  const clickedTriggerFriend = friends.find((friend) => friend.id === id)

  if (bestFriendsList.some(friend => friend.id === id)) {
    return alert('This friend has been added to your favorite friend list')
  }

  bestFriendsList.push(clickedTriggerFriend)
  bestFriendsListID.push(clickedTriggerFriend.id)
  localStorage.setItem('favoriteFriends', JSON.stringify(bestFriendsList))
  localStorage.setItem('favoriteFriendsID', JSON.stringify(bestFriendsListID))

  modalHeader.innerHTML = `
    <i class="fa-solid fa-star" style="color: #FFD43B;"> Favorite </i>
    <h5 class="modal-title">${clickedTriggerFriend.name} ${clickedTriggerFriend.surname}</h5>
  `

  modalFooter.innerHTML = `
    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal" data-id=${clickedTriggerFriend.id}>Close</button>
     <button type="button" class="btn btn-add-favorite btn-info" data-id=${clickedTriggerFriend.id}>Added Completed!</button>
    <button type="button" class="btn btn-remove-favorite btn-outline-danger" data-id=${clickedTriggerFriend.id}>Remove from Favorites</button>
  `
  favoriteCanvaOn()
  document.querySelector(`#favorite-${id}`).classList.remove('d-none')
}


// 點擊remove刪除按鈕後做動modal／重call canva
function removeFromFavorite(id) {
  const bestFriendsList = JSON.parse(localStorage.getItem('favoriteFriends')) || []
  const bestFriendsListID = JSON.parse(localStorage.getItem('favoriteFriendsID')) || []
  const clickedTriggerFriend = friends.find((friend) => friend.id === id)
  const removeIndex = bestFriendsList.findIndex((friend) => friend.id === id)

  if (bestFriendsList.length === 0) {
    return alert('You do not have any best friend!')
  }

  if (bestFriendsList.some(friend => friend.id === id)) {
    bestFriendsList.splice(removeIndex, 1)
    bestFriendsListID.splice(removeIndex, 1)
    localStorage.setItem('favoriteFriends', JSON.stringify(bestFriendsList))
    localStorage.setItem('favoriteFriendsID', JSON.stringify(bestFriendsListID))


    modalHeader.innerHTML = `
      <h5 class="modal-title">${clickedTriggerFriend.name} ${clickedTriggerFriend.surname}</h5>
    `

    modalFooter.innerHTML = `
     <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal" data-id=${clickedTriggerFriend.id}>Close</button>
     <button type="button" class="btn btn-add-favorite btn-outline-info" data-id=${clickedTriggerFriend.id}>Add to Favorites</button>
     <button type="button" class="btn btn-remove-favorite btn-danger" data-id=${clickedTriggerFriend.id}>Removed Completed!</button>
    `
  } else {
    return alert('You have removed this friend!')
  }

  favoriteCanvaOn()
  document.querySelector(`#favorite-${id}`).classList.add('d-none')
}


// 渲染canva的畫面
function favoriteCanvaOn() {
  const bestFriendsList = JSON.parse(localStorage.getItem('favoriteFriends')) || []

  if (bestFriendsList.length === 0) {
    favoriteList.innerHTML = `
    <p class="text-center fs-5" type="button" class="btn-close" data-bs-dismiss="offcanvas">Nothing to see here...</p>
    `
    return
  }

  let CanvaList = ''
  bestFriendsList.forEach((friend) => {
    CanvaList += `
        <div class="row">
          <div class="row col-5 mb-3 mt-0 ms-1">
            <img src=${friend.avatar} class="selfie border border-secondary" alt="friend-selfie" type="button" class="btn"
              data-bs-toggle="modal" data-id=${friend.id} data-bs-target="#friendDetailsModal">
          </div>
          <div class="col-7 ps-3 introtext">
            <p class="name">${friend.name} ${friend.surname}</p>
            <p class="region">Region: ${friend.region}</p>
            <p class="birthday">Birthday: ${friend.birthday}</p>
          </div>
        </div>
        <hr>
    `
  })
  favoriteList.innerHTML = CanvaList
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


// 點擊大頭貼觸發事件
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
  if (event.target.matches('#home') || event.target.matches('.navbar-brand')) {
    window.location.reload()
  } else if (event.target.matches('.favoriteBtn')) {
    favoriteCanvaOn()
  }
})


// 點擊Modal底部區域觸發事件
modalFooter.addEventListener('click', function onModalFootClicked(event) {
  const friendID = Number(event.target.dataset.id)
  if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(friendID)
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(friendID)
  }
})

// 點擊canva的圖片觸發，也會跳出modal
offcanvasBody.addEventListener('click', function onCanvaClicked(event) {
  if (event.target.matches('.selfie')) {
    uniqueFriendModal(Number(event.target.dataset.id))
  }
})


// Call Friend API
axios.get(INDEX_URL).then(response => {
  friends.push(...response.data.results)
  pageQuantity(friends.length)
  renderEachPage(1)
})
  .catch(err => console.log(err))
