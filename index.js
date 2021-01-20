let axios = require("axios").default;
var readline = require("readline");

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function runTests(addr) {
  if (addr[addr.length - 1] == '/') {
    addr = addr.slice(0, addr.length - 1)
  }
  console.log("Testing addTodo");
  await axios.post(addr, {
    done: false,
    text: "Test 1",
  });
  console.log("Testing getTodo");
  let response = await axios.get(addr);
  console.log("Got ", response.data);
  let arr = response.data;
  let todo = arr[0];
  if (todo.done == false && todo.text == "Test 1") {
    console.log("added todo matches original, success!");
  } else {
    console.error("Test failed, added todo doesn't match the sent one!");
  }
  console.log("Testing getSingleTodo");
  response = await axios.get(addr + "/" + todo.id);
  console.log("Got", response.data);
  if (response.data.done == false && response.data.text == "Test 1") {
    console.log("getSingleTodo works!");
  } else {
    console.error("getSingleTodo does not work");
  }
  console.log("Testing editTodo");
  await axios.put(addr + "/" + todo.id, {
    done: true,
    text: "Test 2",
  });
  response = await axios.get(addr + "/" + todo.id);
  if (response.data.done == true && response.data.text == "Test 2") {
    console.log("editTodo works!");
  } else {
    console.error("editTodo does not work");
  }
  console.log("Testing deleteTodo");
  await axios.delete(addr + "/" + todo.id);
  console.log("Now you should get a 404 error");
  axios.get(addr + "/" + todo.id).catch((_) => {
    console.log("we got the error, so deleteTodo works. Probably");
  });
}

rl.question("Enter api (in format of 'http://localhost:3000/api/tasks'): ", (addr) =>
  runTests(addr).catch((_) => console.log("Test failed"))
);
