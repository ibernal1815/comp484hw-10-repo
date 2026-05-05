// GigaPet project
// COMP 484

var pet_info = { name: "Rex", weight: 20, happiness: 7, mood: "Happy" };

$(function() {
    checkAndUpdatePetInfoInHtml();

    // jQuery METHOD 1: .on()
    // .on() attaches an event handler to an element, similar to .click()
    // but more flexible because it can handle multiple event types at once
    // and also works on elements added to the page dynamically.
    // Here I'm using it to attach click events to each button.
    // https://api.jquery.com/on/
    $('.treat-button').on('click', clickedTreatButton);
    $('.play-button').on('click', clickedPlayButton);
    $('.exercise-button').on('click', clickedExerciseButton);
    $('.sleep-button').on('click', clickedSleepButton);
});

function clickedTreatButton() {
    pet_info.happiness += 2;
    pet_info.weight += 1;
    pet_info.mood = "Full";
    checkAndUpdatePetInfoInHtml();
    showNotification("Rex loved the treat!");
    showTongue();
    triggerAnimation('bounce');
}

function clickedPlayButton() {
    pet_info.happiness += 1;
    pet_info.weight -= 1;
    pet_info.mood = "Playful";
    checkAndUpdatePetInfoInHtml();
    showNotification("Rex wants to play more!");
    triggerAnimation('wag');
}

function clickedExerciseButton() {
    pet_info.happiness -= 1;
    pet_info.weight -= 2;
    pet_info.mood = "Tired";
    checkAndUpdatePetInfoInHtml();
    showNotification("Rex is worn out...");
    triggerAnimation('wag');
}

// New button: Sleep
// Rex naps and fully restores his happiness. Weight stays the same.
function clickedSleepButton() {
    pet_info.happiness = 10;
    pet_info.mood = "Rested";
    checkAndUpdatePetInfoInHtml();
    showNotification("Rex is snoring...");

    // Lowering the opacity makes it look like Rex fell asleep,
    // then we restore it after 1.5 seconds when he wakes up.
    $('.pet-image').css('opacity', '0.3');
    setTimeout(function() {
        $('.pet-image').css('opacity', '1');
    }, 1500);
}

function checkWeightAndHappinessBeforeUpdating() {
    if (pet_info.weight < 0) {
        pet_info.weight = 0;
    }
    if (pet_info.happiness < 0) {
        pet_info.happiness = 0;
    }
    if (pet_info.happiness > 10) {
        pet_info.happiness = 10;
    }
}

function checkAndUpdatePetInfoInHtml() {
    checkWeightAndHappinessBeforeUpdating();
    updatePetInfoInHtml();
    updateHappinessBar();
}

function updatePetInfoInHtml() {
    // jQuery METHOD 2: .each()
    // .each() loops over a set of matched elements and runs a function on each one.
    // I'm using it here to go through each stat span and update its text
    // based on the matching key in pet_info.
    // https://api.jquery.com/each/
    var fields = ['name', 'weight', 'happiness', 'mood'];
    $.each(fields, function(index, field) {
        $('.' + field).text(pet_info[field]);
    });
}

function updateHappinessBar() {
    var percentage = (pet_info.happiness / 10) * 100;
    var color = '#3ddc84';

    if (pet_info.happiness < 7) {
        color = '#ff9800';
    }
    if (pet_info.happiness < 4) {
        color = '#f44336';
    }

    $('#happiness-bar').css('width', percentage + '%');
    $('#happiness-bar').css('background-color', color);
}

// Shows a message in the speech bubble after each button press.
// Does not use console.log() or alert().
//
// .fadeIn() shows a hidden element with a fade animation.
// .fadeOut() hides a visible element the same way.
// https://api.jquery.com/fadeIn/
// https://api.jquery.com/fadeOut/
function showNotification(message) {
    $('#notification').text(message);
    $('#notification').stop(true).fadeIn('fast');
    setTimeout(function() {
        $('#notification').fadeOut('slow');
    }, 2000);
}

function triggerAnimation(cls) {
    $('.pet-image').addClass(cls);
    setTimeout(function() {
        $('.pet-image').removeClass(cls);
    }, 700);
}

function showTongue() {
    $('#tongue').css('display', 'block');
    setTimeout(function() {
        $('#tongue').css('display', 'none');
    }, 1400);
}
