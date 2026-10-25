export function playRejectionSound() {
  try {
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "square";
    oscillator.frequency.value = 660;
    gain.gain.value = 0.12;

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + 0.25);

    oscillator.onended = () => {
      void context.close();
    };
  } catch (error) {
    console.warn("Could not play rejection sound:", error);
  }
}
