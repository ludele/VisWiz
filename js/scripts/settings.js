// settings.js

import * as main from "./main.js"

/**
 * - The options to change/control the visualizer.
 */
export const visOptions = {
   // Default settings - changeable throughout run-time.
   // backgroundColor: 'rgb(0, 0, 0)',
   // barColor: function (barHeight) {
   //    return `rgb(${barHeight + 100}, 50, 50)`;
   // },
   mode: {
      value: 'bar',
      options: ['bar', 'spectrogram']
   },
   Red: {
      value: 230,
      min: 0,
      max: 255,
      step: 1
   },
   Blue: {
      value: 200,
      min: 0,
      max: 255,
      step: 1
   },
   Green: {
      value: 130,
      min: 0,
      max: 255,
      step: 1
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
   },
   canvasWidth: {
      value: 600,
      min: 100,
      max: 1920,
      step: 1
   },
   canvasHeight: {
      value: 500,
      min: 100,
      max: 1080,
      step: 1
   }

};

/**
 * 
 */
export const generalSettings = {
   "Colors": "Change the Color Scheme of the page",
   Red: {
      value: 230,
      min: 0,
      max: 255,
      step: 1
   },
   Blue: {
      value: 200,
      min: 0,
      max: 255,
      step: 1
   },
   Green: {
      value: 130,
      min: 0,
      max: 255,
      step: 1
   },
}

/**
 * 
 * @param {*} settings 
 * @returns 
 */
export function generateSettingsContent(settings) {
   let settingsContainer = document.createElement("ul");
   settingsContainer.classList.add("box")

   for (const key in settings) {
      const setting = settings[key];
      let settingsElement = document.createElement("li");
      settingsElement.classList.add("box")
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

         slider.oninput = function () {
            input.value = slider.value;
            settings[key].value = parseFloat(slider.value);
            if (key === 'canvasWidth' || key === 'canvasHeight') {
               main.updateCanvasSize();
            }
         };

         input.onchange = function () {
            slider.value = input.value;
            settings[key].value = parseFloat(input.value);
            if (key === 'canvasWidth' || key === 'canvasHeight') {
               main.updateCanvasSize();
            }
         };

         settingsElement.appendChild(input);
         settingsElement.appendChild(slider);
      } else if (Array.isArray(setting.options)) {
         let select = document.createElement("select");
         setting.options.forEach(option => {
            let optionElement = document.createElement("option");
            optionElement.value = option;
            optionElement.text = option;
            select.appendChild(optionElement);
         });
         select.value = setting.value;
         select.onchange = function () {
            settings[key].value = select.value;
         };
         settingsElement.appendChild(select);
      } else {
         let staticValue = document.createElement("span");
         staticValue.textContent = setting.toString();
         settingsElement.appendChild(staticValue);
      }

      settingsContainer.appendChild(settingsElement);
   }

   return settingsContainer;
}


/**
 * 
 * @param {*} profiles 
 */
export function saveSettingsProfilesToLocalStorage(profiles) {
   localStorage.setItem('settingsProfiles', JSON.stringify(profiles));
}

/**
 * 
 * @returns 
 */
export function loadSettingsProfilesFromLocalStorage() {
   const profiles = localStorage.getItem('settingsProfiles');
   return profiles ? JSON.parse(profiles) : [];
}

/**
 * 
 * @param {*} profiles 
 * @param {*} profile 
 */
export function addSettingsProfile(profiles, profile) {
   profiles.push(profile);
   saveSettingsProfilesToLocalStorage(profiles);
}

/**
 * 
 * @param {*} profiles 
 * @param {*} profileId 
 */
export function removeSettingsProfile(profiles, profileId) {
   const updatedProfiles = profiles.filter(profile => profile.id !== profileId);
   saveSettingsProfilesToLocalStorage(updatedProfiles);
}

/**
 * 
 * @param {*} profiles 
 * @param {*} updatedProfile 
 */
export function updateSettingsProfile(profiles, updatedProfile) {
   const index = profiles.findIndex(profile => profile.id === updatedProfile.id);
   if (index !== -1) {
      profiles[index] = updatedProfile;
      saveSettingsProfilesToLocalStorage(profiles);
   }
}

/**
 * 
 * @param {*} settings 
 */
export function saveSettingsAsJSON(settings) {
   const settingsJSON = JSON.stringify(settings);
   const blob = new Blob([settingsJSON], { type: 'application/json' });
   const url = URL.createObjectURL(blob);
   const a = document.createElement('a');
   a.href = url;
   a.download = 'settings.json';
   document.body.appendChild(a);
   a.click();
   window.URL.revokeObjectURL(url);
}

/**
 * Loads settings from a JSON-file.
 */
export function loadSettingsFromJSON(file) {
   return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function (event) {
         try {
            const settings = JSON.parse(event.target.result);
            resolve(settings);
         } catch (error) {
            reject(error);
         }
      };
      reader.readAsText(file);
   });
}