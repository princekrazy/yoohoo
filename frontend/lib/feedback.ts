export function playRejectionSound() {
  try {
    const audio = new Audio("/sounds/yoohoo.mp3");
    audio.volume = 0.7;

    void audio.play().catch((error) => {
      console.warn("Could not play rejection sound:", error);
    });
  } catch (error) {
    console.warn("Could not play rejection sound:", error);
  }
}
