const contentDiv_el = document.getElementById('contentDiv');
let timerList = [];
const durationInMilliseconds = 2000;

document.addEventListener('DOMContentLoaded', async () => {
    timerList = await api.databaseHandler({request: 'Get'});
    await populateTimers();
    startTimerUpdates();
});

async function populateTimers() {
    contentDiv_el.innerHTML = '';
    return new Promise(resolve => {
        timerList.forEach((endTime, index) => {
            const item_el = document.createElement('div');
            item_el.classList = 'content-item';

            const itemTitle_el = document.createElement('h3');
            itemTitle_el.classList = 'timer-title';
            itemTitle_el.textContent = 'Test';

            const timerText_el = document.createElement('h5');
            timerText_el.classList = 'timer-text';

            item_el.append(itemTitle_el);
            item_el.append(timerText_el);
            contentDiv_el.append(item_el);

            updateTimerText(endTime, timerText_el);
        });

        resolve(); // Resolve the promise when timers are populated
    });
}

function startTimerUpdates() {
    setInterval(updateTimers, 1000);
}

function updateTimers() {
    const timerTextElements = document.querySelectorAll('#contentDiv .timer-text');
    
    timerTextElements.forEach((timerText_el, index) => {
        if (!timerText_el.classList.contains('complete')) {
            const endTime = timerList[index].endTime;
            updateTimerText(endTime, timerText_el);
        }
    });
}

function updateTimerText(endTime, timerText_el) {
    if (!isNaN(endTime)) {
        // Convert the endTime string to a Date object
        const endTimeDate = new Date(Number(endTime));

        const currentTime = new Date();
        const remainingTime = endTimeDate - currentTime;

        if (remainingTime < 0) {
            timerText_el.textContent = 'Complete';
            timerText_el.classList.add('complete');
        } else {
            const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

            timerText_el.textContent = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
        }
    } else {
        timerText_el.textContent = 'Initializing...';
    }
}


function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}
