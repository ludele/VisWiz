import * as options from "./settings.js"

function visualizeAudio(buffer, audioContext) {
   const analyser = audioContext.createAnalyser();
   analyser.fftSize = 2048;
   const dataArray = new Uint8Array(analyser.frequencyBinCount);

   const source = audioContext.createBufferSource();
   source.buffer = buffer;
   source.connect(analyser);
   analyser.connect(audioContext.destination);

   source.start();

   function draw() {
      const canvas = document.getElementById("myCanvas");
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, WIDTH, HEIGHT);

      ctx.fillStyle = "rgb(200 200 200)";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      ctx.lineWidth = 2;
      ctx.strokeStyle = "rbg(0 0 0)";
      ctx.beginPath();

      const sliceWidth = WIDTH / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
         const v = dataArray[i] / 128.0;
         const y = v * (HEIGHT / 2);

         if (i === 0) {
            ctx.moveTo(x, y);
         } else {
            ctx.lineTo(x, y);
         }

         x += sliceWidth;
      }

      ctx.lineTo(WIDTH, HEIGHT / 2);
      ctx.stroke();

      requestAnimationFrame(draw);
   }

   draw()
}

function generateCanvas() {
   var visualizationBox = document.getElementById("visualization");
   const canvas = document.createElement("canvas");
   canvas.classList.add("myCanvas");
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
         visualizeAudio(buffer, audioContext);
      }, function (e) {
         console.log('Error decoding file', e);
      });
   };

   reader.readAsArrayBuffer(file);
});

draw();