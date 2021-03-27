const postsContainer = document.querySelector('#posts-container');
const baseUrl = 'http://jsonplaceholder.typicode.com/posts';
const loaderContainer = document.querySelector('.loader');
const filterInput = document.querySelector('#filter');

let page = 1;

const getPosts = async () => {
  const response = await fetch(`${baseUrl}?_limit=5&_page=${page}`);
  return response.json();
};

const generateTemplate = (posts) => posts.map(({ id, title, body }) => `
  <div class="post">
    <div class="number">${id}</div>
    <div class="post-info">
      <h2 class="post-title">${title}</h2>
      <p class="post-body">${body}</p>
    </div>
  </div>
`).join('');

const addPostsIntoDOM = async () => {
  const posts = await getPosts();
  const postsTemplate = generateTemplate(posts);

  postsContainer.innerHTML += postsTemplate;
};

const getNextPost = () => {
  // eslint-disable-next-line no-plusplus
  page++;
  setTimeout(() => addPostsIntoDOM(), 600);
};

const removeLoader = () => {
  setTimeout(() => loaderContainer.classList.remove('show'), 300);
};

const showLoader = () => {
  loaderContainer.classList.add('show');
  removeLoader();
  getNextPost();
};

const handleScrollToPageBottom = () => {
  const { clientHeight, scrollHeight, scrollTop } = document.documentElement;
  const almostBottomPage = scrollTop + clientHeight >= scrollHeight - 10;

  if (almostBottomPage) {
    showLoader();
  }
};

const showPostIfMatchInputValue = (inputValue) => (post) => {
  const postTitle = post.querySelector('.post-title').textContent.toLowerCase();
  const postBody = post.querySelector('.post-body').textContent.toLowerCase();

  const postContainInputValue = postTitle.includes(inputValue)
    || postBody.includes(inputValue);

  if (postContainInputValue) {
    // eslint-disable-next-line no-param-reassign
    post.style.display = 'flex';
    return;
  }

  // eslint-disable-next-line no-param-reassign
  post.style.display = 'none';
};

const handleInputValue = (event) => {
  const inputValue = event.target.value.toLowerCase();
  const posts = document.querySelectorAll('.post');

  posts.forEach(showPostIfMatchInputValue(inputValue));
};

addPostsIntoDOM();

window.addEventListener('scroll', handleScrollToPageBottom);

filterInput.addEventListener('input', handleInputValue);
