const openAddTimerButton_el = document.getElementById('openAddTimerButton');
const addTimerOverlay_el = document.getElementById('addTimerOverlay');
const addTimerClose_el = document.getElementById('addTimerClose');
const confirmAddTimerButton_el = document.getElementById('confirmAddTimerButton');
const timerTitleInput_el = document.getElementById('timerTitleInput');

const timerDays_el = document.getElementById('timerDays');
const timerHours_el = document.getElementById('timerHours');
const timerMinutes_el = document.getElementById('timerMinutes');
const timerSeconds_el = document.getElementById('timerSeconds');


openAddTimerButton_el.addEventListener('click', () => {
    addTimerOverlay_el.style.display = 'flex';
});

addTimerClose_el.addEventListener('click', () => {
    addTimerOverlay_el.style.display = 'none';
});

confirmAddTimerButton_el.addEventListener('click', async () => {
    const timerErrorHandling = timeInputErrorHandling();
    if (timerTitleInput_el.value === ''){
        timerTitleInput_el.classList.add('error');
        return;
    } else if (timerErrorHandling === null) {
        return;
    } else {
        const futureDate = calculateFutureDate();
        timerList = await api.databaseHandler({request: 'Add', title: timerTitleInput_el.value, date: futureDate})
        await populateTimers();
        timerTitleInput_el.value = '';
        addTimerOverlay_el.style.display = 'none';    
    }
});

function timeInputErrorHandling() {
    const inputs = [timerDays_el, timerHours_el, timerMinutes_el, timerSeconds_el];

    if (inputs.every(input => parseInt(input.value, 10) === 0)) {
        inputs.forEach(input => {
            input.classList.add('error');
            input.addEventListener('click', () => {
                timerInputReset(inputs);
            });
        });
        return null;
    }
}

function timerInputReset(inputs){
    inputs.forEach(input => {
        if (input.classList.contains('error')){
            input.classList.remove('error');
        }            
    });
}

timerTitleInput_el.addEventListener('click', async () => {
    if (timerTitleInput_el.classList.contains('error')){
        timerTitleInput_el.classList.remove('error');
    }
});

function calculateFutureDate() {
    const daysInput = document.getElementById('timerDays').value;
    const hoursInput = document.getElementById('timerHours').value;
    const minutesInput = document.getElementById('timerMinutes').value;
    const secondsInput = document.getElementById('timerSeconds').value;
  
    const days = parseInt(daysInput, 10) || 0;
    const hours = parseInt(hoursInput, 10) || 0;
    const minutes = parseInt(minutesInput, 10) || 0;
    const seconds = parseInt(secondsInput, 10) || 0;
  
    const currentDate = new Date();
  
    // Calculate the future date in milliseconds
    const futureDateInMilliseconds =
      currentDate.getTime() +
      days * 24 * 60 * 60 * 1000 +
      hours * 60 * 60 * 1000 +
      minutes * 60 * 1000 +
      seconds * 1000;
  
    // Create a new Date object using the calculated milliseconds
    const futureDate = new Date(futureDateInMilliseconds);
  
    return futureDate;
  }
  