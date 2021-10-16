//node server which will handle socket io connection

const io = require("socket.io")(8000, {
  cors: {
    origin: "*",
  },
});

const users = {};

// Start listening for events after connection is established
io.on("connection", (socket) => {
  //runs when new user joins and let others know
  socket.on("new-user-joined", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });
  // brodcast message to everyone other than self
  socket.on("send", (message) => {
    socket.broadcast.emit("recieve", {
      message: message,
      name: users[socket.id],
    });
  });
  // when user disconnects , let everyone know ...disconnect is predefiened
  socket.on("disconnect", () => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });
});
