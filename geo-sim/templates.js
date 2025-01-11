// Paths
const gifsFolder = "assets/gifs/";
const backgroundsFolder = "assets/backgrounds/";
const midiFolder = "assets/midi/";
const assetsFile = "assets/assets.json";

// References
const gifLibrary = document.getElementById("gif-library");
const bgLibrary = document.getElementById("bg-library");
const canvas = document.getElementById("canvas");
const addTextBtn = document.getElementById("add-text");
const addMidiBtn = document.getElementById("add-midi");
const bgColorPicker = document.getElementById("bg-color-picker");
const toolbar = document.getElementById("text-toolbar");
const headingSelector = document.getElementById("heading-selector");
const textColorPicker = document.getElementById("text-color-picker");
const fontSizeSelector = document.getElementById("font-size-selector");
const boldBtn = document.getElementById("bold-btn");
const italicBtn = document.getElementById("italic-btn");
const underlineBtn = document.getElementById("underline-btn");
const templateSelector = document.getElementById("templates");
const loadTemplateBtn = document.getElementById("load-template");

let selectedElement = null;
let placeholderText = null;

// Initialize placeholder
function initializePlaceholder() {
  if (!placeholderText) {
    placeholderText = document.createElement("h3");
    placeholderText.textContent = "Drag your elements here!";
    placeholderText.style.color = "#888";
    placeholderText.style.textAlign = "center";
    placeholderText.style.position = "absolute";
    placeholderText.style.top = "50%";
    placeholderText.style.left = "50%";
    placeholderText.style.transform = "translate(-50%, -50%)";
    placeholderText.style.pointerEvents = "none";
    canvas.appendChild(placeholderText);
  }
}

initializePlaceholder();

// Placeholder visibility
function hidePlaceholder() {
  if (placeholderText) placeholderText.style.display = "none";
}

function showPlaceholder() {
  if (!canvas.querySelector("img, p, audio")) {
    placeholderText.style.display = "block";
  }
}

// Fetch assets dynamically
fetch(assetsFile)
  .then(response => response.json())
  .then(assets => {
    loadAssets("gifs", gifsFolder, gifLibrary, assets.gifs);
    loadAssets("backgrounds", backgroundsFolder, bgLibrary, assets.backgrounds, true);
  });

// Load assets into the toolbox
function loadAssets(type, folder, container, items, isBackground = false) {
  const maxVisible = 3;
  const visibleItems = items.slice(0, maxVisible);

  visibleItems.forEach(item => createAssetElement(type, folder, container, item, isBackground));

  // Add Show More/Show Less functionality if there are more than 3 items
  if (items.length > maxVisible) {
    const expandButton = document.createElement("div");
    expandButton.textContent = "Show More...";
    expandButton.classList.add("b-text-link");
    container.appendChild(expandButton);

    expandButton.addEventListener("click", () => {
      const hiddenItems = items.slice(maxVisible);
      hiddenItems.forEach(item => createAssetElement(type, folder, container, item, isBackground));
      expandButton.textContent = "Show Less...";
      expandButton.addEventListener("click", () => {
        container.innerHTML = ""; // Clear container and reload only the first 3 items
        loadAssets(type, folder, container, items, isBackground);
      });
    });
  }
}

// Create individual asset elements
function createAssetElement(type, folder, container, file, isBackground) {
  const element = document.createElement("img");
  element.src = `${folder}${file}`;
  element.alt = file;
  element.classList.add(type === "gifs" ? "gif-item" : "bg-item");

  if (isBackground) {
    element.addEventListener("click", () => {
      canvas.style.backgroundImage = `url(${element.src})`;
      canvas.style.backgroundSize = "auto";
      canvas.style.backgroundRepeat = "repeat";
    });
  } else {
    element.draggable = true;
    element.addEventListener("dragstart", e => {
      e.dataTransfer.setData("type", "image");
      e.dataTransfer.setData("src", element.src);
    });
  }

  container.appendChild(element);
}

// Handle background color picker
bgColorPicker.addEventListener("input", e => {
  canvas.style.backgroundImage = "";
  canvas.style.backgroundColor = e.target.value;
});

// Add text elements
addTextBtn.addEventListener("click", () => {
  const textElement = document.createElement("p");
  textElement.textContent = "Edit Me!";
  textElement.contentEditable = true;
  textElement.style.position = "absolute";
  textElement.style.left = "50px";
  textElement.style.top = "50px";
  enableDragging(textElement);
  addRemoveFunctionality(textElement);
  canvas.appendChild(textElement);
  hidePlaceholder();
});

// Add MIDI elements
addMidiBtn.addEventListener("click", () => {
  const midiElement = document.createElement("audio");
  midiElement.src = `${midiFolder}example.mid`; // Replace with actual MIDI files
  midiElement.controls = true;
  midiElement.style.position = "absolute";
  midiElement.style.left = "50px";
  midiElement.style.top = "50px";
  enableDragging(midiElement);
  addRemoveFunctionality(midiElement);
  canvas.appendChild(midiElement);
  hidePlaceholder();
});

// Enable dragging for elements already on the canvas
function enableDragging(element) {
  element.addEventListener("mousedown", e => {
    const offsetX = e.clientX - element.offsetLeft;
    const offsetY = e.clientY - element.offsetTop;

    const move = moveEvent => {
      element.style.left = `${moveEvent.clientX - offsetX}px`;
      element.style.top = `${moveEvent.clientY - offsetY}px`;
    };

    const stopDrag = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", stopDrag);
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", stopDrag);
  });

  element.addEventListener("click", () => {
    if (selectedElement) {
      removeCloseButton(selectedElement);
    }
    selectedElement = element;
    addCloseButton(element);
    if (element.tagName === "P") {
      showToolbar(element);
    } else {
      hideToolbar();
    }
  });
}

// Enable dropping elements on the canvas
canvas.addEventListener("dragover", e => e.preventDefault());
canvas.addEventListener("drop", e => {
  e.preventDefault();
  const type = e.dataTransfer.getData("type");
  const src = e.dataTransfer.getData("src");

  if (type === "image") {
    const newImage = document.createElement("img");
    newImage.src = src;
    newImage.style.position = "absolute";
    newImage.style.left = `${e.clientX - canvas.offsetLeft}px`;
    newImage.style.top = `${e.clientY - canvas.offsetTop}px`;
    enableDragging(newImage);
    addRemoveFunctionality(newImage);
    canvas.appendChild(newImage);
    hidePlaceholder();
  }
});

// Add remove button to elements
function addCloseButton(element) {
  const closeButton = document.createElement("button");
  closeButton.textContent = "X";
  closeButton.className = "close-btn";
  closeButton.addEventListener("click", () => {
    element.remove();
    closeButton.remove();
    showPlaceholder();
  });
  element.appendChild(closeButton);
}

// Remove close button
function removeCloseButton(element) {
  const closeButton = element.querySelector(".close-btn");
  if (closeButton) {
    closeButton.remove();
  }
}

// Add remove functionality to all elements
function addRemoveFunctionality(element) {
  element.addEventListener("click", () => {
    if (selectedElement) {
      removeCloseButton(selectedElement);
    }
    selectedElement = element;
    addCloseButton(element);
  });
}

// Show toolbar for text
function showToolbar(element) {
  const rect = element.getBoundingClientRect();
  toolbar.style.left = `${rect.left}px`;
  toolbar.style.top = `${rect.top - 50}px`;
  toolbar.style.display = "flex";

  headingSelector.value = element.tagName.toLowerCase();
  textColorPicker.value = rgbToHex(element.style.color || "#000");
  fontSizeSelector.value = element.style.fontSize || "16px";
}

// Apply text styles
headingSelector.addEventListener("change", () => {
  if (selectedElement && selectedElement.tagName === "P") {
    const newElement = document.createElement(headingSelector.value);
    newElement.innerHTML = selectedElement.innerHTML;
    newElement.style.cssText = selectedElement.style.cssText;
    newElement.contentEditable = true;
    enableDragging(newElement);
    addRemoveFunctionality(newElement);
    canvas.replaceChild(newElement, selectedElement);
    selectedElement = newElement;
  }
});

textColorPicker.addEventListener("input", () => {
  if (selectedElement) {
    selectedElement.style.color = textColorPicker.value;
  }
});

fontSizeSelector.addEventListener("change", () => {
  if (selectedElement) {
    selectedElement.style.fontSize = fontSizeSelector.value;
  }
});

boldBtn.addEventListener("click", () => {
  if (selectedElement) {
    selectedElement.style.fontWeight = selectedElement.style.fontWeight === "bold" ? "normal" : "bold";
  }
});

italicBtn.addEventListener("click", () => {
  if (selectedElement) {
    selectedElement.style.fontStyle = selectedElement.style.fontStyle === "italic" ? "normal" : "italic";
  }
});

underlineBtn.addEventListener("click", () => {
  if (selectedElement) {
    selectedElement.style.textDecoration = selectedElement.style.textDecoration === "underline" ? "none" : "underline";
  }
});

// Hide toolbar
function hideToolbar() {
  toolbar.style.display = "none";
}

// Convert RGB to HEX
function rgbToHex(rgb) {
  if (!rgb) return "#000000";
  const rgbValues = rgb.match(/\d+/g);
  return `#${rgbValues.map(x => parseInt(x).toString(16).padStart(2, "0")).join("")}`;
}

// Template functionality
loadTemplateBtn.addEventListener("click", () => {
  const selectedTemplate = templateSelector.value;

  if (templates[selectedTemplate]) {
    loadTemplate(templates[selectedTemplate]);
  }
});

function loadTemplate(template) {
  canvas.innerHTML = "";

  if (template.background.type === "image") {
    canvas.style.backgroundImage = `url(${template.background.src})`;
    canvas.style.backgroundSize = "auto";
    canvas.style.backgroundRepeat = "repeat";
  } else if (template.background.type === "color") {
    canvas.style.backgroundImage = "";
    canvas.style.backgroundColor = template.background.color;
  }

  template.elements.forEach(el => {
    let element;
    if (el.type === "text") {
      element = document.createElement("p");
      element.textContent = el.content;
      element.contentEditable = true;
    } else if (el.type === "gif") {
      element = document.createElement("img");
      element.src = el.src;
    } else if (el.type === "audio") {
      element = document.createElement("audio");
      element.src = el.src;
      element.controls = true;
    }

    Object.assign(element.style, el.styles);

    enableDragging(element);
    addRemoveFunctionality(element);

    canvas.appendChild(element);
  });

  hidePlaceholder();
}
