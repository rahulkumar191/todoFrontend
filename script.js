// Declare the API base URL as a constant
const API_BASE_URL = "https://todoserver-anf8.onrender.com/todos";

// Function to handle errors and display an error message
function handleErrors(response) {
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
  
    // Check if the response has a non-empty body
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return null; // Return null if the response doesn't have JSON content
    }
  
    return response.json();
  }
  

// Function to delete a todo item
function deleteTodo(id) {
  fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(handleErrors)
    .then((data) => {
      const itemElement = document.querySelector(`[id="${id}"]`);
      itemElement.remove();
      console.log("Item deleted");
    })
    .catch((error) => {
      console.error("Error deleting todo:", error);
    });
}

// Function to toggle between edit mode and view mode for a todo item
function toggleEditMode(itemElement) {
  const titleInput = itemElement.querySelector(".title");
  const descriptionInput = itemElement.querySelector(".description");
  const editButton = itemElement.querySelector(".edit-todo");

  if (titleInput.readOnly) {
    titleInput.readOnly = false;
    descriptionInput.readOnly = false;
    editButton.innerText = "OK";
    titleInput.classList.remove("edit-enable");
    descriptionInput.classList.remove("edit-enable");
  } else {
    const id = itemElement.id;
    const newTitle = titleInput.value;
    const newDescription = descriptionInput.value;

    fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        title: newTitle,
        description: newDescription,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(handleErrors)
      .then(() => {
        titleInput.readOnly = true;
        descriptionInput.readOnly = true;
        editButton.innerText = "Edit";
        titleInput.classList.add("edit-enable");
        descriptionInput.classList.add("edit-enable");
      })
      .catch((error) => {
        console.error("Error updating todo:", error);
      });
  }
}

// Function to create a new todo item
function addTodo() {
  const titleElement = document.getElementById("titleInput");
  const descriptionElement = document.getElementById("descriptionInput");

  fetch(API_BASE_URL, {
    method: "POST",
    body: JSON.stringify({
      title: titleElement.value,
      description: descriptionElement.value,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(handleErrors)
    .then((data) => {
      console.log(data);
      const items = document.querySelector(".items");
      items.insertAdjacentHTML("afterbegin", createTodoItem(data));
      titleElement.value = "";
      descriptionElement.value = "";
    })
    .catch((error) => {
      console.error("Error adding todo:", error);
    });
}

// Function to retrieve all todos from the server
function getTodos() {
  return fetch(API_BASE_URL)
    .then(handleErrors)
    .catch((error) => {
      console.error("Error fetching todos:", error);
      return [];
    });
}

// Function to create the HTML markup for a todo item
function createTodoItem(todo) {
  return `
    <div class="item" id="${todo.id}">
        <div class="content">
            <input type="text" class="title edit-enable" value="${todo.title}" autocomplete="off" readonly>
            <input type="text" class="description edit-enable" value="${todo.description}" autocomplete="off" readonly>
        </div>
        <div class="buttons">
            <div class="edit-todo" onclick="toggleEditMode(this.parentNode.parentNode)">Edit</div>
            <div class="delete-todo" onclick="deleteTodo(${todo.id})">Delete</div>
        </div>
    </div>
    `;
}

// Function to render all todos
function renderTodos() {
  const items = document.querySelector(".items");
  getTodos()
    .then((todos) => {
      items.innerHTML = todos.map(createTodoItem).reverse().join("");
    })
    .catch((error) => {
      console.error("Error rendering todos:", error);
    });
}

// Call the renderTodos function to initially display the todos
renderTodos();
