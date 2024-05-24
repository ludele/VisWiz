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

        if (options.visOptions.mode.value === 'bar') {
            drawBars(ctx, dataArray, WIDTH, HEIGHT);
        } else if (options.visOptions.mode.value === 'spectrogram') {
            drawSpectrogram(ctx, dataArray, WIDTH, HEIGHT);
        }

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

/**
 * Creates and maps the menu
 */
function createSettingsControls() {
    const settingsContainer = document.getElementById("settingsContainer");
    for (const [key, value] of Object.entries(options.visOptions)) {
        const label = document.createElement("label");
        label.textContent = key;
        const input = document.createElement("input");

        if (key === 'mode') {
            input.type = "select";
            input.id = key;
            const select = document.createElement("select");
            value.options.forEach(option => {
                const optionElement = document.createElement("option");
                optionElement.value = option;
                optionElement.text = option;
                select.appendChild(optionElement);
            });
            select.value = value.value;
            select.addEventListener("change", (event) => {
                options.visOptions[key].value = event.target.value;
            });
            settingsContainer.appendChild(label);
            settingsContainer.appendChild(select);
            continue;
        } else {
            input.type = "range";
            input.min = value.min;
            input.max = value.max;
            input.step = value.step;
            input.value = value.value;
            input.id = key;
            input.addEventListener("input", (event) => {
                options.visOptions[key].value = Number(event.target.value);
                if (analyser && (key === "fftSize" || key === "smoothingTimeConstant")) {
                    analyser[key] = options.visOptions[key].value;
                }
            });
            input.addEventListener('input', (event) => {
                options[key].value = Number(event.target.value);
                if (key === 'canvasWidth' || key === 'canvasHeight') {
                    main.updateCanvasSize();
                }
            });
            settingsContainer.appendChild(label);
            settingsContainer.appendChild(input);
        }
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

    const durationLabel = document.createElement("span");
    durationLabel.id = "durationLabel";
    container.appendChild(durationLabel);

    const currentTimeLabel = document.createElement("span");
    currentTimeLabel.id = "currentTimeLabel";
    container.appendChild(currentTimeLabel);

    const seekSlider = document.createElement("input");
    seekSlider.type = "range";
    seekSlider.id = "seekSlider";
    seekSlider.value = "0";
    seekSlider.min = "0";
    seekSlider.max = "100"; // Set max to 100 to represent percentage
    container.appendChild(seekSlider);

    const settingsContainer = document.createElement("div");
    settingsContainer.id = "settingsContainer";
    rightMenu.appendChild(settingsContainer);
    createSettingsControls();
}

createStructure();

/**
 * - Updates the UI on resize
 * - Updates the canvas if a change in the UI is made
 */
window.onresize = function () {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const newWidth = isMobile ? "100%" : "15%";
    document.querySelectorAll('.menu').forEach(menu => {
        if (menu.style.width !== '0') {
            menu.style.width = newWidth;
        }
    });

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