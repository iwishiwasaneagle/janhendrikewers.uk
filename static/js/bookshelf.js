function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getInitials(fullName) {
  const allNames = fullName.trim().split(' ');
  const initials = allNames.reduce((acc, curr, index) => {
    if (index === 0 || index === allNames.length - 1) {
      acc = `${acc}${curr.charAt(0).toUpperCase()}`;
    }
    return acc;
  }, '');
  return initials;
}

let spines = Object.values(document.getElementsByClassName("spine"));
let spinesauthors = Object.values(document.getElementsByClassName("spine-author"));
let covers = Object.values(document.getElementsByClassName("cover"));
let tops = Object.values(document.getElementsByClassName("top"));

let availablePatterns = ["argyle", "tartan"]; // we could probably get these programatically
let availableColours = [
  "maroon",
  "darkgreen",
  "darkolivegreen",
  "brown",
  "saddlebrown",
  "sienna",
  "midnightblue",
];



// assign a random height, pattern and colour to each book
spines.map(function (s, i) {
  let randomHeight = getRandomInt(220, 290);
  s.style.height = `${randomHeight}px`;
  s.style.top = `${280 - randomHeight}px`;

  let randomPattern = randomChoice(availablePatterns);
  s.style.backgroundImage = `var(--${randomPattern})`;

  let randomColor = randomChoice(availableColours);
  s.style.backgroundColor = randomColor;

  covers[i].style.height = `${randomHeight}px`;
  covers[i].style.top = `${280 - randomHeight}px`;

  spinesauthors[i].innerText = getInitials(spinesauthors[i].innerText);

  tops[i].style.top = `${280 - randomHeight}px`;
});


// lazy load the book covers on hover
let books = Object.values(document.getElementsByClassName("book"));
books.map(function (b, i) {
  b.onmouseover = function () {
    let covers = b.getElementsByClassName("cover");
    Array.from(covers).map(function (c, i) {
      c.style.backgroundImage = "url(" + c.getAttribute("img") + ")";
    }
    )
  };
});