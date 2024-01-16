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
    const futureDate = calculateFutureDate();
    await api.databaseHandler({request: 'Add', title: timerTitleInput_el.value, date: futureDate})
    timerList.push({
        title: timerTitleInput_el.value,
        endTime: futureDate
    });
    await populateTimers();
    timerTitleInput_el.value = '';
    addTimerOverlay_el.style.display = 'none';
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
  
    const futureDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + days,
      currentDate.getHours() + hours,
      currentDate.getMinutes() + minutes,
      currentDate.getSeconds() + seconds
    );

    console.log(futureDate);    

    return futureDate;
}