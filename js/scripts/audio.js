import * as visualizer from "./visualizer.js"

/**
 * - To start audio-listening of an input device. 
 *    - Output is not allowed through Web-API
 * - If the user wants to visualize the Audio they are hearing:
 *    - Temporary file upload
 *       - Important for mobile devices
 *    - Microphone input
 *       - It is possible to reroute output-device to an input-device.
 */
function initializeAudioListening() {

   let currentAudio = new Audio()
   let AudioContext = new AudioContext()
   let audioSource = null
   let initAnalyzer = AudioContext.createAnalyser()

   navigator.mediaDevices.getUserMedia({ audio: true })
      .then(function (stream) {
         let source = AudioContext.createMediaStreamSource(stream)
         source.connect(initAnalyzer)
         // ?
         visualizer.generateVisualization()
      })
      .catch(function (err) {

      })
}

function playAudio(buffer, audioContext, initAnalyzer) {
   const source = audioContext.createBufferSource();
   source.buffer = buffer;

   // Get the analyzer
   // const analyzer = audioContext.createAnalyser();
   source.connect(initAnalyzer);
   analyser.connect(audioContext.destination);
   
   source.start();

   analyzeAudio(initAnalyzer)
}

function analyzeAudio(analyzer) {

}

function calculateAmplitude() { }
function calculateFrequenzy() { }
function calculateWaveform() { }

