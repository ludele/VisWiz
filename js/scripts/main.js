// main.js

import * as options from "./settings.js";


// Audio variables
let audioContext;
let audioBuffer;
let audioSource;
let analyser;

let isPlaying = false;
let startTime = 0;
let currentOffset = 0;

let animationId;

/**
 * A function that initalizes and starts to visualize the audio.
 * - Connects the analyser to the audio context.
 * - Draws a visualizer
 */
function visualizeAudio() {
    if (!analyser) {
        analyser = audioContext.createAnalyser();
        analyser.fftSize = options.visOptions.fftSize.value;
        analyser.smoothingTimeConstant = options.visOptions.smoothingTimeConstant.value;
    }
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    /**
     * Draws the visualizer
     * @returns - bollean (stops the draw)
     */
    function draw() {
        if (!isPlaying) return; // Stop drawing when not playing

        const canvas = document.getElementById("myCanvas");
        const ctx = canvas.getContext("2d");
        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;

        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        // if (options.visOptions.mode.value === 'bar') {
        //     drawBars(ctx, dataArray, WIDTH, HEIGHT);
        // } else if (options.visOptions.mode.value === 'spectrogram') {
        //     drawSpectrogram(ctx, dataArray, WIDTH, HEIGHT);
        // }

        drawBars(ctx, dataArray, WIDTH, HEIGHT);
        animationId = requestAnimationFrame(draw);
    }

    /**
     * - Draws bars for the visualizer
     * @param {*} ctx  - Context of the canvas
     * @param {*} dataArray - Array of the amount of bars
     * @param {*} WIDTH - Width of the bars
     * @param {*} HEIGHT - Height of the bars
     */
    function drawBars(ctx, dataArray, WIDTH, HEIGHT) {
        ctx.fillStyle = `rgb(${options.visOptions.Red.value}, ${options.visOptions.Green.value}, ${options.visOptions.Blue.value})`;
        const barWidth = options.visOptions.barWidth.value;
        const barSpacing = options.visOptions.barSpacing.value;
        const heightScale = options.visOptions.heightScale.value;
        let x = 0;

        for (let i = 0; i < dataArray.length; i++) {
            const barHeight = dataArray[i] * heightScale;
            ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
            x += barWidth + barSpacing;
        }
    }

    let spectrogramData = [];

    /**
     * 
     * @param {*} ctx - Context of the canvas
     * @param {*} dataArray 
     * @param {*} WIDTH
     * @param {*} HEIGHT 
     */
    function drawSpectrogram(ctx, dataArray, WIDTH, HEIGHT) {
        spectrogramData.push([...dataArray]);
        if (spectrogramData.length > HEIGHT) {
            spectrogramData.shift();
        }

        const imageData = ctx.createImageData(WIDTH, HEIGHT);
        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                const value = spectrogramData[y][x] || 0;
                const index = (y * WIDTH + x) * 4;
                imageData.data[index] = value;
                imageData.data[index + 1] = value;
                imageData.data[index + 2] = value;
                imageData.data[index + 3] = 255; // Alpha
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }

    draw();
}

/**
 * Updates the canvas
 */
export function updateCanvasSize() {
    const canvas = document.getElementById("myCanvas");
    canvas.width = options.visOptions.canvasWidth.value;
    canvas.height = options.visOptions.canvasHeight.value;
}

/**
 * Generates the canvas tag
 */
function generateCanvas() {
    const visualizationBox = document.getElementById("visualization");
    const canvas = document.createElement("canvas");
    canvas.id = "myCanvas";
    visualizationBox.appendChild(canvas);
    updateCanvasSize();
}

/**
 * Profiles for saved/loaded settings
 * @param {*} profiles 
 * @returns HTMLDivElement
 */
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

/**
 * Load profile for settings
 * @param {*} profile - Profiles for loading presents and saves settings.
 */
function applyProfile(profile) {
    options.updateSettingsProfile(profile.settings);
}

/**
 * @param {*} parent - Container containing the file upload element
 * @param {*} id - id of the file upload element
 */
function createFileUploadElement(parent, id) {
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.id = id; // Ensure the ID is correctly set
    parent.appendChild(input);
}

function saveSettings() {
    localStorage.setItem('visSettings', JSON.stringify(options.visOptions));
}

function loadSettings() {
    const savedSettings = localStorage.getItem('visSettings');
    if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        for (const key in parsedSettings) {
            if (options.visOptions[key]) {
                options.visOptions[key].value = parsedSettings[key].value;
            }
        }
    }
}

function createSettingsControls() {
    const settingsContainer = document.getElementById("settingsContainer");
    const div = document.createElement("div");
    settingsContainer.appendChild(div);

    loadSettings();

    for (const [key, setting] of Object.entries(options.visOptions)) {
        const settingsElement = document.createElement("li");
        settingsElement.classList.add("box");
        const label = document.createElement("label");
        label.textContent = key + ": ";
        settingsElement.appendChild(label);

        if (typeof setting.value === 'number') {
            const input = document.createElement("input");
            input.type = "text";
            input.value = setting.value;

            const slider = document.createElement("input");
            slider.type = "range";
            slider.value = setting.value;
            slider.min = setting.min;
            slider.max = setting.max;
            slider.step = setting.step;

            slider.oninput = function () {
                input.value = slider.value;
                options.visOptions[key].value = parseFloat(slider.value);
                if (key === 'canvasWidth' || key === 'canvasHeight') {
                    updateCanvasSize();
                }
                if (analyser && (key === "fftSize" || key === "smoothingTimeConstant")) {
                    analyser[key] = options.visOptions[key].value;
                }
                saveSettings();
            };

            input.onchange = function () {
                slider.value = input.value;
                options.visOptions[key].value = parseFloat(input.value);
                if (key === 'canvasWidth' || key === 'canvasHeight') {
                    updateCanvasSize();
                }
                if (analyser && (key === "fftSize" || key === "smoothingTimeConstant")) {
                    analyser[key] = options.visOptions[key].value;
                }
                saveSettings();
            };

            settingsElement.appendChild(input);
            settingsElement.appendChild(slider);
        } else if (Array.isArray(setting.options)) {
            const select = document.createElement("select");
            setting.options.forEach(option => {
                const optionElement = document.createElement("option");
                optionElement.value = option;
                optionElement.text = option;
                select.appendChild(optionElement);
            });
            select.value = setting.value;
            select.onchange = function () {
                options.visOptions[key].value = select.value;
                saveSettings();
            };
            settingsElement.appendChild(select);
        } else {
            const staticValue = document.createElement("span");
            staticValue.textContent = setting.toString();
            settingsElement.appendChild(staticValue);
        }

        settingsContainer.appendChild(settingsElement);
    }
}


/**
 * Creates the whole structure of the elements that are not fully static.
 */
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

    const playButton = document.createElement("button");
    playButton.textContent = "Play";
    playButton.id = "playButton";
    container.appendChild(playButton);

    const pauseButton = document.createElement("button");
    pauseButton.textContent = "Pause";
    pauseButton.id = "pauseButton";
    container.appendChild(pauseButton);

    const infoContainer = document.createElement("div")
    infoContainer.classList.add("box");
    container.appendChild(infoContainer);

    const durationLabel = document.createElement("span");
    durationLabel.id = "durationLabel";
    infoContainer.appendChild(durationLabel);

    const lineBreak = document.createElement("br");
    infoContainer.appendChild(lineBreak);

    const currentTimeLabel = document.createElement("span");
    currentTimeLabel.id = "currentTimeLabel";
    infoContainer.appendChild(currentTimeLabel);

    const seekSlider = document.createElement("input");
    seekSlider.type = "range";
    seekSlider.id = "seekSlider";
    seekSlider.value = "0";
    seekSlider.min = "0";
    seekSlider.max = "100"; // Set max to 100 to represent percentage
    container.appendChild(seekSlider);

    const settingsContainer = document.createElement("div");
    settingsContainer.id = "settingsContainer";
    settingsContainer.classList.add("box");
    rightMenu.appendChild(settingsContainer);
    createSettingsControls();

}

createStructure();

/**
 * - Updates the UI on resize
 * - Updates the canvas if a change in the UI is made
 */
// window.onresize = function () {
//     const isMobile = window.matchMedia("(max-width: 768px)").matches;
//     const newWidth = isMobile ? "100%" : "15%";
//     document.querySelectorAll('.menu').forEach(menu => {
//         if (menu.style.width !== '0') {
//             menu.style.width = newWidth;
//         }
//     });

//     updateCanvasSize();
// };

const MENU_OPEN_WIDTH = '29%';
const MENU_CLOSE_WIDTH = '0';

window.onresize = function () {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const rightMenu = document.getElementById('rightMenu');

    if (isMobile) {
        if (rightMenu.style.width !== MENU_CLOSE_WIDTH && rightMenu.style.width !== '') {
            rightMenu.style.width = '100%';
        }
    } else {
        if (rightMenu.style.width === '100%') {
            rightMenu.style.width = MENU_OPEN_WIDTH;
        }
    }

    updateCanvasSize();
};


let selectedFile = null;

/**
 * Loads the audio file. And triggers events for listening and analysis.
 */
document.getElementById('audioFile').addEventListener('change', function (event) {
    selectedFile = event.target.files[0];
    if (!selectedFile) {
        return;
    }

    if (audioContext) {
        audioContext.close();
    }

    audioContext = new AudioContext();
    const reader = new FileReader();

    reader.onload = function (fileEvent) {
        const arrayBuffer = fileEvent.target.result;
        audioContext.decodeAudioData(arrayBuffer, function (buffer) {
            audioBuffer = buffer;
            document.getElementById('durationLabel').textContent = "Duration: " + buffer.duration.toFixed(2) + " seconds";
        }, function (e) {
            console.log('Error decoding file', e);
        });
    };

    reader.readAsArrayBuffer(selectedFile);
});

/**
 * Plays the audio
 */
document.getElementById('playButton').addEventListener('click', function () {
    if (audioBuffer && audioContext) {
        if (!isPlaying) {
            startAudio();
        }
    }
});

document.getElementById('pauseButton').addEventListener('click', function () {
    if (isPlaying) {
        pauseAudio();
    }
});

document.getElementById('seekSlider').addEventListener('input', function (event) {
    if (audioBuffer) {
        const seekTime = (event.target.value / 100) * audioBuffer.duration;
        if (isPlaying) {
            startAudio(seekTime);
        } else {
            currentOffset = seekTime;
        }
        document.getElementById('currentTimeLabel').textContent = "Current Time: " + seekTime.toFixed(2) + " seconds";
    }
});

/**
 * 
 * @param {*} offset 
 */
function startAudio(offset = 0) {
    if (isPlaying && audioSource) {
        audioSource.stop();
    }

    audioSource = audioContext.createBufferSource();
    audioSource.buffer = audioBuffer;
    audioSource.connect(audioContext.destination);
    analyser = audioContext.createAnalyser();
    audioSource.connect(analyser);
    startTime = audioContext.currentTime - offset;
    currentOffset = offset;
    audioSource.start(0, offset);
    isPlaying = true;
    visualizeAudio();
}

/**
 * - A function to pause the audio source
 * - It makes sure to cancel both the animation
 * - Calculates the difference between times.
 */
function pauseAudio() {
    if (audioSource) {
        audioSource.stop();
    }
    isPlaying = false;
    currentOffset = audioContext.currentTime - startTime;
    cancelAnimationFrame(animationId);
}

/**
 * Looping function to control and update second length of song.
 */
setInterval(function () {
    if (audioSource && isPlaying) {
        const currentTime = audioContext.currentTime - startTime;
        document.getElementById('currentTimeLabel').textContent = "Current Time: " + currentTime.toFixed(2) + " seconds";
        const seekSlider = document.getElementById('seekSlider');
        seekSlider.value = (currentTime / audioBuffer.duration) * 100;
    }
}, 100);