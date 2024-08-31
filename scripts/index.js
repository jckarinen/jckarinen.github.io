let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

document.addEventListener("mousedown", function(event) {
    // Check if window is clicked on
    const target = event.target;

    if(target) {
        const scheduleCaption = document.getElementById('schedule-caption');
        if (target === scheduleCaption) {
            const scheduleWindow = document.getElementById('schedule-window')
            const windowStyle = window.getComputedStyle(scheduleWindow);
            const windowX = parseFloat(windowStyle.left);
            const windowY = parseFloat(windowStyle.top);
            const clickX = event.x;
            const clickY = event.y;
            dragOffsetX = clickX - windowX;
            dragOffsetY = clickY - windowY;
            isDragging = true;
        }
    }
});

document.addEventListener("mouseup", function(event) {
    isDragging = false;
    // Reenable highlighting
    document.body.style.userSelect = 'auto';
    // Reset drag offset
    dragOffsetX = 0;
    dragOffsetY = 0;
});

document.addEventListener("mousemove", function(event) {
    if (isDragging) {
        // Disable highlighting
        document.body.style.userSelect = 'none';
        const scheduleWindow = document.getElementById("schedule-window");
        const newX = (event.x - dragOffsetX);
        const newY = (event.y - dragOffsetY);
        scheduleWindow.style.left = newX + 'px';
        scheduleWindow.style.top = newY + 'px';
        let maxViewWidth = window.innerWidth;
        let maxViewHeight = window.innerHeight;

        const windowStyle = window.getComputedStyle(scheduleWindow);
        const windowWidth = parseFloat(windowStyle.width) + 1;
        const windowHeight = parseFloat(windowStyle.height) + 1;

        if (newX < 0) {
            scheduleWindow.style.left = 0 + 'px';
        }
        else if (newX > maxViewWidth - windowWidth) {
            scheduleWindow.style.left = (maxViewWidth - windowWidth)+ 'px';
            // scheduleWindow.style.left = (0)+ 'px';
        }
        if (newY < 0) {
            scheduleWindow.style.top = 0 + 'px';
        }
        else if (newY > maxViewHeight - windowHeight) {
            scheduleWindow.style.top = (maxViewHeight - windowHeight) + 'px';
        }

    }
});

function hideSchedule() {
    const scheduleWindow = document.getElementById('schedule-window');
    scheduleWindow.style.display = 'none';
}

function showSchedule() {
    const scheduleWindow = document.getElementById('schedule-window');
    scheduleWindow.style.display = 'block';
}