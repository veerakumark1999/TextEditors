import { Stack } from "./stack.js";

document.onkeydown = function (event) {
  if (event.ctrlKey || event.metaKey) {
    event.preventDefault();
  }
};

onload = function () {
  // Get reference to elements
  const textbox = document.getElementById("comment");
  const undo = document.getElementById("undo");
  const redo = document.getElementById("redo"); // Add redo element
  const clear = document.getElementById("clear");
  const temptext = document.getElementById("temptext");

  textbox.value = "";
  let text = "";
  let stack = new Stack();
  let redoStack = new Stack();

  textbox.onclick = function () {
    textbox.selectionStart = textbox.selectionEnd = textbox.value.length;
  };

  clear.onclick = function () {
    stack.clear();
    redoStack.clear(); // Clear the redo stack too
    text = "";
    textbox.value = "";
    temptext.innerHTML = `Navigate history will be shown here !`;
  };

  textbox.oninput = function (event) {
    redoStack.clear();

    switch (event.inputType) {
      case "insertText":
        stack.push(0, event.data);
        temptext.innerHTML = `PUSH${stack.top()}<br>${temptext.innerHTML}`;
        break;
      case "deleteContentBackward":
        stack.push(1, text[text.length - 1]);
        temptext.innerHTML = `POP${stack.top()}<br>${temptext.innerHTML}`;
        break;
    }

    text = textbox.value;
  };

  undo.onclick = function () {
    let operation = stack.pop();
    if (operation[0] !== -1) {
      temptext.innerHTML = "Performing undo operation<br>" + temptext.innerHTML;
      if (operation[0] === 0) {
        let len = operation[1].length;
        textbox.value = textbox.value.substring(0, textbox.value.length - len);
      } else {
        textbox.value += operation[1];
      }
      text = textbox.value;

      redoStack.push(operation[0], operation[1]);
    }
  };

  redo.onclick = function () {
    let operation = redoStack.pop();
    if (operation[0] !== -1) {
      temptext.innerHTML = "Performing redo operation<br>" + temptext.innerHTML;
      if (operation[0] === 0) {
        textbox.value += operation[1];
      } else {
        let len = operation[1].length;
        textbox.value = textbox.value.substring(0, textbox.value.length - len);
      }
      text = textbox.value;

      stack.push(operation[0], operation[1]);
    }
  };
};

const textarea = document.querySelector("textarea"),
  fileNameInput = document.querySelector(".file-name input"),
  selectMenu = document.querySelector(".save-as select"),
  saveBtn = document.querySelector(".save-btn");
selectMenu.addEventListener("change", () => {
  const selectedFormat = selectMenu.options[selectMenu.selectedIndex].text;
  saveBtn.innerText = `Save As ${selectedFormat.split(" ")[0]} File`;
});
saveBtn.addEventListener("click", () => {
  const blob = new Blob([textarea.value], { type: selectMenu.value });
  const fileUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = fileNameInput.value;
  link.href = fileUrl;
  link.click();
});
