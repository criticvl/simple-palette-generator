import distinctColors from "distinct-colors";
import saveAs from 'file-saver';

var palette_size = 3;

function generatePalette() {
  document.getElementById("color-container").textContent = "";
  palette_size = document.getElementById("palette-size").value;

  if (palette_size < 3) {
    var error_paragraph = document.createElement("p");
    error_paragraph.style.fontSize = "2vw";
    error_paragraph.style.color = "white";
    error_paragraph.textContent = "Palette size must be at least 3";
    document.getElementById("color-container").appendChild(error_paragraph);
    return;
  } else if (palette_size > 16) {
    var error_paragraph = document.createElement("p");
    error_paragraph.style.fontSize = "2vw";
    error_paragraph.style.color = "white";
    error_paragraph.textContent = "Palette size must be at most 16";
    document.getElementById("color-container").appendChild(error_paragraph);
    return;
  }

  function triggerHover(element) {
    element.style.height = "3.6vw";
  }
  function removeHover(element) {
    element.style.height = "1vw";
  }

  // Generating Options
  var hueMinimum = Math.floor(Math.random() * 301);
  var chromaMinimum = Math.floor(Math.random() * 41);
  var options = {
    count: palette_size,
    quality: 100,
    samples: 3200,
    hueMin: hueMinimum,
    hueMax: hueMinimum + 60,
    chromaMin: chromaMinimum,
    chromaMax: chromaMinimum + 60,
  };

  var palette = distinctColors(options).sort(function (a, b) {
    if (a.luminance() < b.luminance()) {
      return -1;
    }
  });
  for (var i = 0; i < palette_size; i++) {
    var color_div = document.createElement("div");
    color_div.className = "color-box";
    var colorInstance = palette[i].hex();
    color_div.style.backgroundColor = colorInstance;

    var color_paragraph = document.createElement("p");
    color_paragraph.className = "hex-color";
    color_paragraph.textContent = palette[i].name();

    if (palette[i].luminance() <= 0.5) {
      var previewDivColor = palette[i].brighten(2.5).hex();
    } else {
      var previewDivColor = palette[i].darken(2.5).hex();
    }

    color_paragraph.style.color = colorInstance;

    var preview_div = document.createElement("div");
    preview_div.className = "color-preview";
    preview_div.style.backgroundColor = previewDivColor;
    preview_div.style.border = "solid 0.1vw " + colorInstance;
    preview_div.appendChild(color_paragraph);
    color_div.appendChild(preview_div);

    color_div.addEventListener("mouseover", function () {
      triggerHover(this.firstChild);
    });
    color_div.addEventListener("mouseout", function () {
      removeHover(this.firstChild);
    });

    document.getElementById("color-container").appendChild(color_div);
  }
}
document
  .getElementById("generate-button")
  .addEventListener("click", function () {
    try {
      generatePalette();
    } catch (e) {
      console.log(e);
      generatePalette();
    }
  });

function savePalette() {
  var hexElementsArray = document.getElementsByClassName("hex-color");
  var hexArray = [];
  Array.prototype.forEach.call(hexElementsArray, function (element) {
    hexArray.push(element.textContent + "\n");
  });
  var paletteBlob = new Blob(hexArray, {
    type: "text/plain;charset=utf-8",
  });
  if (paletteBlob.size > 0) {
    saveAs(paletteBlob, "palette.txt");
  }
}

document
  .getElementById("export-button-desktop")
  .addEventListener("click", function () {
    savePalette();
  });
document
  .getElementById("export-button-portable")
  .addEventListener("click", function () {
    savePalette();
  });
