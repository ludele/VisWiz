import * as options from "./settings.js"

function generateCanvas() {
   var visualizationBox = document.getElementById("visualization");
   const canvas = document.createElement("canvas");
   visualizationBox.appendChild(canvas);
}

function generateProfileButtons(profiles) {
   const profilesContainer = document.createElement("div");

   profiles.forEach(profile => {
      const profileButton = document.createElement("button");
      profileButton.textContent = profile.name;
      profileButton.onclick = () => applyProfile(profile);
      profilesContainer.appendChild(profileButton);
   });

   return profilesContainer;
}

function applyProfile(profile) {
   options.updateSettingsProfile(profile.settings);
}

function createFileUploadElement(parent, id) {
   let input = document.createElement("input");
   input.setAttribute("type", "file");
   input.classList.add(id);
   parent.appendChild(input);
}

function createStructure() {
   generateCanvas();

   let leftMenu = document.getElementById("leftMenu");
   let rightMenu = document.getElementById("rightMenu");

   let optionsContainer = options.generateSettingsContent(options.visOptions);
   let generalSettings = options.generateSettingsContent(options.generalSettings);

   let container = document.createElement("div");
   container.classList.add("box");

   createFileUploadElement(container, "audioFile");
   generalSettings.appendChild(container);

   leftMenu.appendChild(optionsContainer);
   rightMenu.appendChild(generalSettings);

   
   const profiles = options.loadSettingsProfilesFromLocalStorage();
   const profileButtons = generateProfileButtons(profiles);
   leftMenu.appendChild(profileButtons);
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

document.getElementById('audioFile').addEventListener('change', function (event) {
   const file = event.target.files[0];
   if (!file) {
      return;
   }

   const audioContext = new AudioContext();
   const reader = new FileReader();

   reader.onload = function (fileEvent) {
      const arrayBuffer = fileEvent.target.result;
      audioContext.decodeAudioData(arrayBuffer, function (buffer) {
         playAudio(buffer, audioContext);
      }, function (e) {
         console.log('Error decoding file', e);
      });
   };

   reader.readAsArrayBuffer(file);
});