const BASE_URL = "https://user-list.alphacamp.io"
const INDEX_URL = BASE_URL + "/api/v1/users"
const SHOW_URL = BASE_URL + "/api/v1/users/"

const dataPanel = document.querySelector('#data-panel')
const friends = []

function renderFriendList(data) {
  let friendListHTML = ""
  data.forEach(friend => {
    friendListHTML += `
      <div class="col-sm-1">
        <div class="mb-2 mt-0 ms-0">
          <div class="card">
            <img src=${friend.avatar} class="card-img-top selfie"
              alt="friend-selfie" type="button" class="btn btn-primary" data-bs-toggle="modal"
              data-bs-target="#friendDetailsModal" data-id=${friend.id}>
          </div>
            <div class="card-footer">
              <p class="friendNameSurname" type="button" data-id=${friend.id}>${friend.name} ${friend.surname}</p>
            </div>
        </div>
      </div>
    `
  });
  dataPanel.innerHTML = friendListHTML
}

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

function favoriteFriendList(id) {


}


// 這裡有一部份去做test
dataPanel.addEventListener('click', function triggerFriendModal(event) {
  if (event.target.matches('.selfie')) {
    uniqueFriendModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.friendNameSurname')) {
    favoriteFriendList(Number(event.target.dataset.id))
  }
})


axios.get(INDEX_URL).then(response => {
  friends.push(...response.data.results)
  renderFriendList(friends)
})
  .catch((err) => {
    console.log(err)
  })

// above TEST 

