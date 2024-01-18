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
            timerListItems(entry);
        });

        resolve();
    });
}

function timerListItems(entry){
    const item_el = document.createElement('div');
    item_el.classList = 'content-item';

    // Display Content
    const headerDiv_el = document.createElement('div');
    headerDiv_el.classList = 'content-header-grid';

    const itemTitle_el = document.createElement('h3');
    itemTitle_el.classList = 'timer-title';
    itemTitle_el.textContent = entry.title;

    const deleteButton_el = document.createElement('button');
    deleteButton_el.classList = 'fas fa-trash slim-button'

    headerDiv_el.append(itemTitle_el);
    headerDiv_el.append(deleteButton_el);

    const timerText_el = document.createElement('h5');
    timerText_el.classList = 'timer-text';

    item_el.append(headerDiv_el);
    item_el.append(timerText_el);

    contentDiv_el.append(item_el);

    deleteListener(deleteButton_el, entry.id, item_el, headerDiv_el);
    updateTimerText(entry, timerText_el);
}

function deleteListener(button, id, itemDiv, headerDiv){
    button.addEventListener('click', async () => {
        headerDiv.style.display = 'none';

        const confirmDiv_el = document.createElement('div');
        confirmDiv_el.classList = 'confirm-delete-grid';

        const confirmHeader_el = document.createElement('h3');
        confirmHeader_el.textContent = 'Are you sure?';
        confirmHeader_el.classList = 'timer-title';

        const confirmButton_el = document.createElement('button');
        confirmButton_el.classList = 'slim-button fas fa-check';

        const backButton_el = document.createElement('button');
        backButton_el.classList = 'slim-button fas fa-arrow-left';

        confirmDiv_el.append(confirmHeader_el);
        confirmDiv_el.append(confirmButton_el);
        confirmDiv_el.append(backButton_el);

        itemDiv.prepend(confirmDiv_el);

        backButton_el.addEventListener('click', () => {
            confirmDiv_el.style.display = 'none';
            headerDiv.style.display = 'grid';
        });

        confirmButton_el.addEventListener('click', async () => {
            timerList = await api.databaseHandler({request: 'Delete', timerId: id});
            await populateTimers();
            confirmDiv_el.style.display = 'none';
            headerDiv.style.display = 'grid';
        });
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
