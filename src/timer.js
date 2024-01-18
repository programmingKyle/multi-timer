const contentDiv_el = document.getElementById('contentDiv');
let timerList = [];
const durationInMilliseconds = 2000;

document.addEventListener('DOMContentLoaded', async () => {
    timerList = await api.databaseHandler({request: 'Get'});
    await populateTimers();
    startTimerUpdates();
});

async function populateTimers() {
    timerList.sort((a, b) => parseFloat(a.endTime.split('.')[0]) - parseFloat(b.endTime.split('.')[0]));
    
    contentDiv_el.innerHTML = '';
    return new Promise(resolve => {
        timerList.forEach((entry, index) => {
            const item_el = document.createElement('div');
            item_el.classList = 'content-item';

            const itemTitle_el = document.createElement('h3');
            itemTitle_el.classList = 'timer-title';
            itemTitle_el.textContent = entry.title;

            const timerText_el = document.createElement('h5');
            timerText_el.classList = 'timer-text';

            item_el.append(itemTitle_el);
            item_el.append(timerText_el);
            contentDiv_el.append(item_el);

            updateTimerText(entry, timerText_el);
        });

        resolve();
    });
}

function startTimerUpdates() {
    setInterval(updateTimers, 1000);
}

function updateTimers() {
    const timerTextElements = document.querySelectorAll('#contentDiv .timer-text');
    
    timerTextElements.forEach((timerText_el, index) => {
        if (!timerText_el.classList.contains('complete')) {
            const entry = timerList[index];
            updateTimerText(entry, timerText_el);
        }
    });
}

async function updateTimerText(entry, timerText_el) {
    if (!isNaN(entry.endTime)) {
      const currentTime = new Date();
      const remainingTime = entry.endTime - currentTime;
  
      if (remainingTime < 0) {
        timerText_el.textContent = 'Complete';
        timerText_el.classList.add('complete');
        await completeListener(entry.id, entry.endTime, timerText_el);
      } else {
        const currentOffset = currentTime.getTimezoneOffset();
        const startOfYearOffset = new Date(currentTime.getFullYear(), 0, 1).getTimezoneOffset();
        const isDST = currentOffset !== startOfYearOffset;
  
        // Adjust remaining time if DST is in effect
        const adjustedRemainingTime = isDST ? remainingTime + 3600000 : remainingTime;
  
        const days = Math.floor(adjustedRemainingTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((adjustedRemainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((adjustedRemainingTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((adjustedRemainingTime % (1000 * 60)) / 1000);
  
        // Display the remaining time with days
        const timerText = days === 0 
        ? timerText_el.textContent = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`
        : timerText_el.textContent = `${days} Days ${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;

        timerText_el.textContent = timerText;
      }
    } else {
      timerText_el.textContent = 'Initializing...';
    }
}
  
  
// Helper function to format time
function formatTime(time) {
return time < 10 ? `0${time}` : time;
}
  

async function completeListener(id, endTime, element){
    element.addEventListener('click', async (event) => {
        event.preventDefault();
        timerList = await api.databaseHandler({request: 'Complete', timerId: id});
        await populateTimers();    
        startTimerUpdates();
    });

    element.addEventListener('mouseenter', () => {
        element.style.filter = 'brightness(1.5)';
    });
    
    element.addEventListener('mouseleave', () => {
        element.style.filter = 'brightness(1)';
    });

    element.style.userSelect = 'none';
    element.style.msUserSelect = 'none';
    element.style.webkitUserSelect = 'none';
}


function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}
