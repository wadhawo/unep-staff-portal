// Initialize new SpeechSynthesisUtterance object
let speech = new SpeechSynthesisUtterance();

// Set Speech Language
var voices = [];
speech.lang = "en";
speech.rate = 1;
speech.volume = 1;
speech.pitch = 1;

var voices = window.speechSynthesis.getVoices(); // global array of available voices

/*
window.speechSynthesis.onvoiceschanged = () => {
  // Get List of Voices
  voices = window.speechSynthesis.getVoices();

  // Initially set the First Voice in the Array.
  speech.voice = voices[0];

  // Set the Voice Select List. (Set the Index as the value, which we'll use later when the user updates the Voice using the Select Menu.)
  let voiceSelect = document.querySelector("#voices");
  voices.forEach((voice, i) => (voiceSelect.options[i] = new Option(voice.name, i)));
};

document.querySelector("#voices").addEventListener("change", () => {
  // On Voice change, use the value of the select menu (which is the index of the voice in the global voice array)
  speech.voice = voices[document.querySelector("#voices").value];
});*/

function speakNow(text){
    // Set the text property with the text passed
    speech.text = text;
    // Start Speaking
    window.speechSynthesis.speak(speech);
}

function pauseSpeech(){  window.speechSynthesis.pause();  // Pause the speechSynthesis instance
}

function resumeSpeech(){  window.speechSynthesis.resume();  // Resume the paused speechSynthesis instance
}

function cancelSpeech(){  window.speechSynthesis.cancel();  // Cancel the speechSynthesis instance
}


function changeVoice(){
    var voiceList = "\n";
    for (let x=0; x<Object.keys(window.speechSynthesis.getVoices()).length; x++){
        voiceList += x+". "+Object.values(window.speechSynthesis.getVoices())[x]["voiceURI"]+"\n";
    }

    var index1 = prompt("Select a voice:"+voiceList); console.log("Available voices: ", voiceList);
    if(parseInt(index1)-1 > -1){ lStorage.voice = index1;
    }else{ speakNow("Invalid Voice selection! Please select again."); changeVoice();  }
}

//if(lStorage.voice != null){ speech.voice = lStorage.voice; }else{ changeVoice(); }