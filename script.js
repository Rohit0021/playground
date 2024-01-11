const url = "http://localhost:3000";

const editorBox = document.querySelector("#editorBox");
const outputContainer = document.querySelector("#outputContainer");
const resizeBar = document.querySelector("#resizeBar");
const headBox = document.querySelector("#headBox");
const run = document.querySelector("#run");
const output = document.querySelector("#output");
const loadingDots = loadingBox.querySelectorAll(".fa-circle");

const editor = ace.edit(editorBox);

editor.session.setMode('ace/mode/c_cpp');
editor.getSession().setTabSize(2);
editor.getSession().setUseSoftTabs(true);
editor.setTheme('ace/theme/xcode');

const defaultCodes = {
  c: `#include <stdio.h>\n#include <stdlib.h>\n\nvoid main (int argc, char** const argv) {\n  \n}`
}

editor.setValue(defaultCodes.c);
editor.selection.clearSelection();

class User {
  constructor() {
    const uid = localStorage.getItem("_playground-UID");
    this.id = uid ? uid : this.new();
    localStorage.setItem("_playground-UID", this.id);
  }
  new() {
    function generateRandomUID(n) {
      let uid = '';
      const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      for (let i = 0; i < n; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        uid += characters.charAt(randomIndex);
      }
      return uid;
    }
    return generateRandomUID(16);
  }
}

class ResizableContainer {
  constructor(container, resizeBar) {
    this.container = container;
    this.resizeBar = resizeBar;
    this.temp = {
      val: false
    }
    this.setup();
  }

  setup() {
    const resizeBar = this.resizeBar;
    const container = this.container;

    const temp = this.temp;

    resizeBar.addEventListener('touchstart', handleTouchStart);
    resizeBar.addEventListener('touchmove', handleTouchMove);
    resizeBar.addEventListener('touchend', handleTouchEnd);

    function handleTouchStart(event) {
      temp.val = true;
    }

    function handleTouchMove(event) {
      if (!temp.val) return;

      const wh = window.innerHeight;
      const cur = event.touches[0].pageY;

      const x = wh - cur;

      if (x > wh || x < 20) {
        temp.val = false;
        return;
      }

      container.style.height = `${x}px`;
    }

    function handleTouchEnd(event) {
      temp.val = false;
    }
  }
}

new ResizableContainer(outputContainer, resizeBar);

const user = new User();

function makeItHTML(text) {
  return text.replaceAll("\n", "<br/>").replaceAll("\t", "&#160 &#160 ");
}

let currentLanguage = "c";

run.addEventListener("click", () => {
  const value = JSON.stringify(editor.getValue());

  fetch(url + "/run", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: user.id,
      code: value,
      lang: currentLanguage
    })
  }).then(r => r.json()).then(data => {

    const p1 = document.createElement("p");
    p1.style.color = "red";
    p1.innerHTML = makeItHTML(data.stderr[0]);
    output.innerHTML = "";
    output.append(p1);

    const p2 = document.createElement("p");
    p2.style.color = "black";
    p2.innerHTML += makeItHTML(data.stdout[0]);
    output.append(p2);

    for (dotIndex in loadingDots) {
      loadingDots[dotIndex].style.animation = "";
    }

  }).catch(err => {
    for (dotIndex in loadingDots) {
      loadingDots[dotIndex].style.animation = "";
    }
  });

  for (dotIndex in loadingDots) {
    if (dotIndex % 2 === 0) {
      loadingDots[dotIndex].style.animation = "blink 600ms infinite reverse";
    } else {
      loadingDots[dotIndex].style.animation = "blink 600ms infinite";
    }
  }

});

fetch(url + "/get", {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    id: user.id,
    lang: currentLanguage
  })
}).then(r => r.json()).then(data => {

  const content = data.content;
  if (content !== "") {
    editor.setValue(content);
    editor.selection.clearSelection();
  }

}).catch(err => null);
