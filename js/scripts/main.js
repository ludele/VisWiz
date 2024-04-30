import * as options from "./settings.js"


function generateCanvas() {
   var visualizationBox = document.getElementById("visualization");
   const canvas = document.createElement("canvas");
   visualizationBox.appendChild(canvas);
}

function createStructure() {
   generateCanvas();
   let leftMenu = document.getElementById("leftMenu")
   let rightMenu = document.getElementById("rightMenu")
   let optionsContainer = options.generateSettingsContent(options.visOptions)
   let generalSettings = options.generateSettingsContent(options.generalSettings)

   leftMenu.appendChild(optionsContainer)
   rightMenu.appendChild(generalSettings)
}

createStructure();

window.onresize = function () {
   const isMobile = window.matchMedia("(max-width: 768px)").matches;
   const newWidth = isMobile ? "100%" : "15%";
   document.querySelectorAll('.menu').forEach(menu => {
      if (menu.style.width !== '0') {
         menu.style.width = newWidth;
      }
   });
};

