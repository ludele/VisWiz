export const settings = {
   // Default settings - changeable throughout run-time.

   backgroundColor: 'rgb(0, 0, 0)',
   barColor: function (barHeight) {
      return `rgb(${barHeight + 100}, 50, 50)`;
   },
   barWidth: {
      value: 5,
      min: 1,
      max: 20,
      step: 1
   },
   barSpacing: {
      value: 1,
      min: 0,
      max: 10,
      step: 1
   },
   heightScale: {
      value: 0.5,
      min: 0.1,
      max: 2,
      step: 0.1
   },
   smoothingTimeConstant: {
      value: 0.85,
      min: 0.1,
      max: 0.99,
      step: 0.01
   },
   fftSize: {
      value: 2048,
      min: 256,
      max: 4096,
      step: 256
   }
};

function generateSettingsContent(settings) {
   let settingsContainer = document.createElement("ul");

   for (const key in settings) {
      const setting = settings[key];
      let settingsElement = document.createElement("li");
      let label = document.createElement("label");
      label.textContent = key + ": ";
      settingsElement.appendChild(label);

      if (typeof setting.value === 'number') {
         let input = document.createElement("input");
         input.type = "text";
         input.value = setting.value;

         let slider = document.createElement("input");
         slider.type = "range";
         slider.value = setting.value;
         slider.min = setting.min;
         slider.max = setting.max;
         slider.step = setting.step;

         slider.oninput = function () {
            input.value = slider.value;
            settings[key].value = parseFloat(slider.value);
         };

         input.onchange = function () {
            slider.value = input.value;
            settings[key].value = parseFloat(input.value);
         };

         settingsElement.appendChild(input);
         settingsElement.appendChild(slider);
      } else {
         let staticValue = document.createElement("span");
         staticValue.textContent = setting.toString();
         settingsElement.appendChild(staticValue);
      }

      settingsContainer.appendChild(settingsElement);
   }

   return settingsContainer;
}

document.body.appendChild(generateSettingsContent(settings));


function changeVisualizationColorScheme() {

}
function changeAnimationStyle() {

}

function changeComplexityLevel() {

}

function changeSmoothing() {

}

function applyView() {

}