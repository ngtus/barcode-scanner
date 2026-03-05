const beep = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");

export function playBeep() {
    beep.currentTime = 0; // reset so it can replay quickly
    beep.play();
}