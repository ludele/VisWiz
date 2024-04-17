function initializeAudioListening(){

   let currentAudio = new Audio();
   const audioCtx = new window.AudioContext();
   let audioSource = null;
   let analyzer = null;
   
   currentAudio.play();
   audioSource = audioCtx.createMediaElementSource(currentAudio);
   analyzer = audioCtx.createAnalyser();
   audioSource.connect(analyzer);
   analyzer.connect(audioCtx.destination);

}
function analyzeAudio(){}
function calculateAmplitude(){}
function calculateFrequenzy(){}
function calculateWaveform(){}