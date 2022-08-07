let socket = io();

function scrollToBottom() {
  let messages = document.querySelector("#messages").lastElementChild;
  messages.scrollIntoView({ behavior: "smooth" });
}

socket.on("connect", () => {
  let searchQuery = window.location.search.substring(1);
  let params = JSON.parse(
    '{"' +
      decodeURI(searchQuery)
        .replace(/&/g, '","')
        .replace(/\+/g, " ")
        .replace(/=/g, '":"') +
      '"}'
  );
  socket.emit("join", params, function (err) {
    //send to server
    if (err) {
      alert(err);
      window.location.href = "/";
    } else {
      console.log("upppp");
    }
  });
  console.log("connected to server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

socket.on("newMessage", (message) => {
  const formattedTime = moment(message.createdAt).format("LT");
  const template = document.querySelector("#message-template").innerHTML;
  const html = Mustache.render(template, {
    from: message.from,
    text: message.text,
    createdAt: formattedTime
  });
  const div = document.createElement("div");
  div.innerHTML = html;
  document.querySelector("#messages").appendChild(div);
  scrollToBottom();

  // const formattedTime = moment(message.createdAt).format("LT");
  // console.log("newMessage", message);
  // let li = document.createElement("li");
  // li.innerText = `${message.from} ${formattedTime}:${message.text}`;
  // document.querySelector("body").appendChild(li);
});
socket.on("newLocationMessage", (message) => {
  const formattedTime = moment(message.createdAt).format("LT");
  const template = document.querySelector(
    "#location-message-template"
  ).innerHTML;
  const html = Mustache.render(template, {
    from: message.from,
    text: message.text,
    url: message.url
  });
  const div = document.createElement("div");
  div.innerHTML = html;
  document.querySelector("#messages").appendChild(div);
  scrollToBottom();
  // console.log("newLocationMessage", message);
  // let li = document.createElement("li");
  // let a = document.createElement("a");
  // li.innerText = `${message.from} ${formattedTime}:`;
  // a.setAttribute("target", "_blank");
  // a.setAttribute("href", message.url);
  // a.innerText = "My current Location";
  // li.appendChild(a);
  // document.querySelector("body").appendChild(li);
});

document.querySelector("#submit-btn").addEventListener("click", function (e) {
  e.preventDefault();

  socket.emit(
    "createMessage",
    {
      from: "User",
      text: document.querySelector('input[name="message"]').value
    },
    function () {}
  );
});
document
  .querySelector("#send-location")
  .addEventListener("click", function (e) {
    if (!navigator.geolocation) {
      return alert("Geolcation not supported by your browser.");
    }

    navigator.geolocation.getCurrentPosition(
      function (position) {
        socket.emit("createLocation", {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      function () {
        alert("Unable to fetch location");
      }
    );
    e.preventDefault();
  });
