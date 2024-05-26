// settings.js

import * as main from "./main.js"

/**
 * - The options to change/control the visualizer.
 *    - Red, Blue, Green: Change the colors of the visualizer bars
 *    - barWidth: The width of the visualization
 *    - barSpacing: How far the bars are apart
 *    - heightScale: The height of the visualization
 *    - smoothingTimeConstant: Timed-updates of the visualizer
 *       - Affects the smoothness.
 *    - fftSize: Changes the density width of the frequenzies generated.
 *       - A higher fftSize will show more detail and draw out the frequenzies on the canvas
 *       - A lower will be more clustered.
 *    - Canvas{Height}{Width}: Will change the canvas size.
 */
export const visOptions = {
   // Default settings - changeable throughout run-time.
   // backgroundColor: 'rgb(0, 0, 0)',
   // barColor: function (barHeight) {
   //    return `rgb(${barHeight + 100}, 50, 50)`;
   // },
   // mode: {
   //    value: 'bar',
   //    options: ['bar', 'spectrogram']
   // },
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
      value: 0.86,
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
      value: 835,
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
 * - General settings for more site-specific values.
 *    - Change the site's color-scheme 
 */
// export const generalSettings = {
//    "Colors": "Change the Color Scheme of the page",
//    Red: {
//       value: 230,
//       min: 0,
//       max: 255,
//       step: 1
//    },
//    Blue: {
//       value: 200,
//       min: 0,
//       max: 255,
//       step: 1
//    },
//    Green: {
//       value: 130,
//       min: 0,
//       max: 255,
//       step: 1
//    },
// }

/**
 * 
 * @param {*} settings 
 * @returns 
 */
export function generateSettingsContent() {
   let settingsContainer = document.createElement("ul");
   settingsContainer.classList.add("box")

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