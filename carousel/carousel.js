function createCarousel(height, width, totalImages, panes, delay) {
  const carousel = document.getElementById("carousel");
  carousel.style.height = `${height}px`;
  carousel.style.width = `${width}px`;

  const content = document.createElement("div");
  content.setAttribute("id", "content");

  const contentWidth = Math.floor(width * 0.8);
  content.style.width = `${contentWidth}px`;

  const imgWidth = Math.floor(contentWidth / panes);

  for (let i = 0; i < totalImages; i++) {
    let image = document.createElement("img");
    image.src = "./image.jpeg";
    image.style.width = `${imgWidth}px`;
    image.style.left = `${i * imgWidth}px`;
    content.appendChild(image);
  }

  const btnLeft = document.createElement("div");
  btnLeft.innerText = "left";
  btnLeft.classList.add("button");
  btnLeft.classList.add("left");

  const btnRight = document.createElement("div");
  btnRight.innerText = "right";
  btnRight.classList.add("button");
  btnRight.classList.add("right");

  let scroll = 0;
  let maxScroll = contentWidth * Math.floor(totalImages / panes);

  function setAutoScroll() {
    const scrollId = setInterval(() => {
      if (scroll === maxScroll) {
        scroll = 0;
        content.scrollLeft = scroll;
      } else {
        scroll += contentWidth;
        content.scrollLeft = scroll;
      }
    }, delay * 1000);
    return scrollId;
  }

  let id = setAutoScroll();

  btnLeft.onclick = function () {
    if (scroll !== 0) {
      scroll -= contentWidth;
      content.scrollLeft = scroll;
      clearInterval(id);
      id = setAutoScroll();
    }
  };
  btnRight.onclick = function () {
    if (scroll !== maxScroll) {
      scroll += contentWidth;
      content.scrollLeft = scroll;
      clearInterval(id);
      id = setAutoScroll();
    }
  };

  carousel.appendChild(btnLeft);
  carousel.appendChild(content);
  carousel.appendChild(btnRight);
}

createCarousel(500, 800, 12, 3, 3);
