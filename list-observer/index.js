function generatorFn() {
  return {
    id: 1,
    first_name: "Imanshu",
    last_name: "Rathore",
    gende: "Male",
  };
}

function createData(len) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = Array(len).fill(generatorFn());
      resolve(data);
    }, 2000);
  });
}

function createObserver(root, callback) {
  const config = {
    root,
    threshold: 0.5,
    margin: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback();
      }
    });
  }, config);

  return observer;
}

function createRows(parent, len) {
  createData(len).then((res) => {
    [...res].forEach((row) => {
      let div = document.createElement("div");
      div.classList.add("row");

      Object.keys(row).forEach((key) => {
        let span = document.createElement("span");
        span.innerText = row[key];
        div.appendChild(span);
      });
      parent.appendChild(div);
    });
  });
}

function virtualList() {
  const container = document.createElement("div");
  container.setAttribute("id", "container");

  const header = document.createElement("div");
  header.classList.add("header");

  Object.keys(generatorFn()).forEach((key) => {
    let span = document.createElement("span");
    span.innerText = key;
    header.appendChild(span);
  });

  container.appendChild(header);

  const content = document.createElement("div");
  content.setAttribute("id", "content");

  const list = document.createElement("div");
  list.setAttribute("id", "list");

  const divObs = document.createElement("div");
  divObs.setAttribute("id", "observer");

  const observer = createObserver(content, function () {
    divObs.innerText = "loading...";
    createRows(list, 20);
  });
  observer.observe(divObs);

  content.appendChild(list);
  content.appendChild(divObs);
  container.appendChild(content);

  return container;
}

const list = virtualList();
document.getElementById("app").appendChild(list);
