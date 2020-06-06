var notes = [];

const getNotes = async () => {
  const res = await fetch("https://my-api-todos.herokuapp.com/todos");
  notes = await res.json();
  postNotes();
  otherStuff();
};

getNotes();

function postNotes() {
  var pagearea = document.querySelector(".note-box");
  pagearea.innerHTML = "";
  var title = document.createElement("div");
  title.className = "title";
  title.innerHTML = `<h1 class="display-3">
          YOUR NOTES
        </h1>
        <hr class="cyan accent-1" />
  `;
  pagearea.appendChild(title);
  notes.sort(function (a, b) {
    return b.priority - a.priority;
  });
  notes.forEach(e => {
    var note = document.createElement("div");
    note.style.transform = `rotate(${randomInteger(-15, 15)}deg)`;
    if (e.priority == "1") note.className = `card red accent-3 text-white`;
    else if (e.priority == "2") note.className = `card yellow accent-1`;
    else if (e.priority == "3") note.className = `card light-green accent-3`;
    note.className += " hoverable z-depth-1";
    note.innerHTML = `
  <div class="card-body">
  <h1 class="hide">${e._id}</h1>
  <h3 class="card-title">${e.title}</h3>
  <pre class="card-text">${e.body}</pre>
  <button class="btn btn-primary float-left edit">Edit</button>
  <button class="btn btn-danger delete"><i class="material-icons">close</i></button>
  </div>
  `;
    pagearea.appendChild(note);
  });
}

function addTodo() {
  var form = document.getElementById("myForm");
  var title = document.getElementById("title").value;
  var body = document.getElementById("contentbody").value;
  var priority = document.getElementById("priority").value;
  axios
    .post("https://my-api-todos.herokuapp.com/todos", {
      title,
      body,
      priority
    })
    .then(res => {
      if (res.status == 201) {
        document.getElementById("title").value = "";
        document.getElementById("contentbody").value = "";
        sendmsg("Note Created", "success");
        getNotes();
      }
    })
    .catch(err => {
      if (err.response.status == 400) {
        sendmsg("Fill All Fields", "danger");
      } else if (err.response.status == 500) {
        sendmsg("There is some Server side error", "danger");
      }
    });
}

function updateTodo(id) {
  var title = document.getElementById("title").value;
  var body = document.getElementById("contentbody").value;
  var priority = document.getElementById("priority").value;
  axios
    .patch(`https://my-api-todos.herokuapp.com/todos?id=${id}`, {
      title,
      body,
      priority
    })
    .then(res => {
      if (res.status == 200) {
        document.getElementById("title").value = "";
        document.getElementById("contentbody").value = "";
        sendmsg("Note Updated", "success");
        subm.style.display = "block";
        updatebtn.className += " hide";
        getNotes();
      }
    })
    .catch(err => {
      if (err.response.status == 400) {
        sendmsg("Fill All Fields", "danger");
      } else if (err.response.status == 500) {
        sendmsg("There is some Server side error", "danger");
      }
    });
}

function deleteTodo(id) {
  axios
    .delete(`https://my-api-todos.herokuapp.com/todos?id=${id}`)
    .then(res => {
      if (res.status == 200) {
        sendmsg("Note Deleted", "success");
        getNotes();
      }
    })
    .catch(err => {
      if (err.response.status == 400) {
        sendmsg("Client Side Error", "danger");
      } else if (err.response.status == 500) {
        sendmsg("There is some Server side error", "danger");
      }
    });
}

var subm = document.getElementById("sub-btn");
var updatebtn = document.getElementById("update");
subm.onclick = addTodo;

function otherStuff() {
  document.querySelectorAll(".delete").forEach(btn => {
    btn.addEventListener("click", e => {
      var id = e.target.parentElement.parentElement.children[0].innerHTML;
      deleteTodo(id);
    });
  });

  var edits = document.querySelectorAll(".edit");
  edits.forEach(element => {
    element.addEventListener("click", e => {
      notes.forEach((note, i) => {
        if (note._id == element.parentElement.firstElementChild.innerHTML) {
          var id = note._id;
          document.getElementById("title").value = note.title;
          document.getElementById("contentbody").value = note.body;
          subm.style.display = "none";
          document.getElementById("update").classList.remove("hide");
          updatebtn.onclick = function () {
            updateTodo(id);
          };
        }
      });
    });
  });
}

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function sendmsg(msg, msgClass) {
  var message = document.createElement("div");
  message.className = `alert alert-${msgClass} m-2`;
  message.innerHTML = `${msg}`;
  var coll = document.querySelector(".addnote");
  coll.insertBefore(message, document.querySelector(".form-container"));
  setTimeout(() => {
    document.querySelector(".alert").remove();
  }, 2000);
}
