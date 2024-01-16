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
        timerList.forEach((entry, index) => {
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

            updateTimerText(entry, timerText_el);
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
            //const endTime = timerList[index].endTime;
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
            const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

            timerText_el.textContent = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
        }
    } else {
        timerText_el.textContent = 'Initializing...';
    }
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
