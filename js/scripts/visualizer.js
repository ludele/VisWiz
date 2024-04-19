/**
 * - Will need to be further refined for options.
 * - This is a base example.
 * @param {AudioContext.createAnalyser} analyzer - To analyze the audio
 */

export function generateVisualization(analyzer) {
   const canvas = document.getElementById('visualization');
   const ctx = canvas.getContext('2d');
   const bufferLength = analyzer.frequencyBinCount;
   const dataArray = new Uint8Array(bufferLength);

   function draw() {
      requestAnimationFrame(draw);

      analyzer.getByteFrequencyData(dataArray);
      ctx.fillStyle = 'rgb(0, 0, 0)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      let barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
         barHeight = dataArray[i];

         ctx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
         ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);

         x += barWidth + 1;
      }
   }

   draw();
}

function changeGenerationBehavior() {

}

function saveVisualization() {

}

function applyVisualizationColorScheme() {

}

function applyAnimationStyle() {

}

function applyComplexityLevel() {

}

function applySmoothing() {

}