const createElemWithText = (element = "p", text = "", className) => {
  const newElement = document.createElement(element);
  newElement.textContent = text;
  if (className) newElement.classList.add(className);
  return newElement;
};

const createSelectOptions = (users) => {
  if (!users) return;
  const options = [];
  let option;
  users.forEach((user) => {
    option = document.createElement("option");
    option.value = user.id;
    option.textContent = user.name;
    options.push(option);
  });
  return options;
};

const toggleCommentSection = (postId) => {
  if (!postId) return;
  const section = document.querySelector(`section[data-post-id = "${postId}"]`);
  if (section) {
    section.classList.toggle("hide");
  }
  return section;
};

const toggleCommentButton = (postId) => {
  if (!postId) return;
  const button = document.querySelector(`button[data-post-id = "${postId}"]`);
  if (button)
    button.textContent === "Hide Comments"
      ? (button.textContent = "Show Comments")
      : (button.textContent = "Hide Comments");
  return button;
};

const deleteChildElements = (parentElement) => {
  if (!parentElement?.tagName) return;
  let child = parentElement.lastElementChild;
  while (child) {
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;
  }
  return parentElement;
};

const addButtonListeners = () => {
  const main = document.querySelector("main");
  const buttons = main.querySelectorAll("button");
  if (buttons) {
    buttons.forEach((button) => {
      const postId = button.dataset.postId;
      button.addEventListener(
        "click",
        function (event) {
          toggleComments(event, postId);
        },
        false
      );
    });
  }
  return buttons;
};

const removeButtonListeners = () => {
  const main = document.querySelector("main");
  const buttons = main.querySelectorAll("button");
  if (buttons) {
    buttons.forEach((button) => {
      const postId = button.dataset.postId;
      button.removeEventListener(
        "click",
        function (e) {
          toggleComments(e, postId);
        },
        false
      );
    });
  }
  return buttons;
};

const createComments = (comments) => {
  if (!comments) return;
  const fragment = document.createDocumentFragment();
  comments.forEach((comment) => {
    const article = document.createElement("article");
    const h3 = createElemWithText("h3", comment.name);
    const bodyPara = createElemWithText("p", comment.body);
    const emailPara = createElemWithText("p", `From: ${comment.email}`);
    article.append(h3, bodyPara, emailPara);
    fragment.append(article);
  });
  return fragment;
};

const populateSelectMenu = (users) => {
  if (!users) return;
  const selectMenu = document.querySelector("#selectMenu");
  const optionElements = createSelectOptions(users);
  optionElements.forEach((option) => {
    selectMenu.append(option);
  });
  return selectMenu;
};

const getUsers = async () => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const users = await response.json();
    return users;
  } catch (e) {
    console.error(e);
  }
};

const getUserPosts = async (userId) => {
  if (!userId) return;
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
    );
    const userPosts = await response.json();
    return userPosts;
  } catch (e) {
    console.error(e);
  }
};

const getUser = async (userId) => {
  if (!userId) return;
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users/${userId}`
    );
    const user = await response.json();
    return user;
  } catch (e) {
    console.error(e);
  }
};

const getPostComments = async (postId) => {
  if (!postId) return;
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
    );
    const comments = await response.json();
    return comments;
  } catch (e) {
    console.error(e);
  }
};

const displayComments = async (postId) => {
  if (!postId) return;
  const section = document.createElement("section");
  section.dataset.postId = postId;
  section.classList.add("hide", "comments");
  const comments = await getPostComments(postId);
  const fragment = createComments(comments);
  section.append(fragment);
  return section;
};

const createPosts = async (posts) => {
  if (!posts) return;
  const fragment = document.createDocumentFragment();
  for (const post of posts) {
    const article = document.createElement("article");
    const postTitle = document.createElement("h2");
    postTitle.textContent = post.title;
    const postBody = document.createElement("p");
    postBody.textContent = post.body;
    const postId = document.createElement("p");
    postId.textContent = `Post ID: ${post.id}`;
    const author = await getUser(post.userId);
    const authorName = document.createElement("p");
    authorName.textContent = `Author: ${author.name} with ${author.company.name}`;
    const catchPhrase = document.createElement("p");
    catchPhrase.textContent = `${author.company.catchPhrase}`;
    const button = document.createElement("button");
    button.textContent = "Show Comments";
    button.dataset.postId = post.id;
    const section = await displayComments(post.id);
    article.append(
      postTitle,
      postBody,
      postId,
      authorName,
      catchPhrase,
      button,
      section
    );
    fragment.append(article);
  }
  return fragment;
};

const displayPosts = async (posts) => {
  const main = document.querySelector("main");
  const element = (await createPosts(posts))
    ? await createPosts(posts)
    : createElemWithText(
        "p",
        "Select an Employee to display their posts.",
        "default-text"
      );
  main.append(element);
  return element;
};

const toggleComments = (event, postId) => {
  if (!event || !postId) return;
  event.target.listener = true;
  const section = toggleCommentSection(postId);
  const button = toggleCommentButton(postId);
  const array = [section, button];
  return array;
};

const refreshPosts = async (posts) => {
  if (!posts) return;
  const removeButtons = removeButtonListeners();
  const main = document.querySelector("main");
  deleteChildElements(main);
  const fragment = await displayPosts(posts);
  const addButtons = addButtonListeners();
  const array = [removeButtons, main, fragment, addButtons];
  return array;
};

const selectMenuChangeEventHandler = async (e) => {
  if (!e) return;
  const selectMenu = document.getElementById("selectMenu");
  selectMenu.disabled = true;
  const userId = e?.target?.value || 1;
  const posts = await getUserPosts(userId);
  const refreshPostsArray = await refreshPosts(posts);
  selectMenu.disabled = false;
  const array = [userId, posts, refreshPostsArray];
  return array;
};

const initPage = async () => {
  const users = await getUsers();
  const select = populateSelectMenu(users);
  const array = [users, select];
  return array;
};

const initApp = async () => {
  await initPage();
  const selectMenu = document.getElementById("selectMenu");
  selectMenu.addEventListener("change", selectMenuChangeEventHandler, false);
};

document.addEventListener("DOMContentLoaded", initApp);
