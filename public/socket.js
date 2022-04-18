console.log('oke')
localStorage.setItem('urlApi', 'https://api-tasks-u4boz.ondigitalocean.app')
// console.log(process.env.VUE_APP_URL_API);
socket = io(window.localStorage.getItem('urlApi'),{
extraHeaders: {
  Authorization: `Bearer ${window.localStorage.getItem('accessToken')}`
}
})

// socket.emit('create',function(){
//   //
// })
// socket.emit('update',function(){
//   //
// })
// socket.emit('patched',function(){
//   //
// })

  socket.emit('create', 'authentication', {
    strategy: 'local',
    email: 'lina@gmail.com',
    password: '12345678'
  }, function(error, authResult) {
    // console.log(authResult);
    // authResult will be {"accessToken": "your token", "user": user }
    // You can now send authenticated messages to the server
  });
  socket.emit('update', 'authentication', {
    strategy: 'local',
    email: 'lina@gmail.com',
    password: '12345678'
  }, function(error, authResult) {
    // console.log(authResult);
    // authResult will be {"accessToken": "your token", "user": user }
    // You can now send authenticated messages to the server
  });
  socket.emit('patch', 'authentication', {
    strategy: 'local',
    email: 'lina@gmail.com',
    password: '12345678'
  }, function(error, authResult) {
    // console.log(authResult);
    // authResult will be {"accessToken": "your token", "user": user }
    // You can now send authenticated messages to the server
  });