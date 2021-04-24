var calendarEl = "";
var containerEl = "";
var Draggable = "";
var menu = document.querySelector("#context-menu");
var menuItems = menu.querySelectorAll(".context-menu__item");
var menuState = 0;
var contextMenuActive = "context-menu--active";

function initCalendar() {
    Draggable = FullCalendar.Draggable;
    calendarEl = document.getElementById('calendar');
    containerEl = document.getElementById('external-events');

    new Draggable(containerEl, {
        itemSelector: '.item',
        eventData: function (eventEl) {
            return {
                id: eventEl.getAttribute("value"),
                title: eventEl.innerText
            };
        }
    });

    calendar = new FullCalendar.Calendar(calendarEl, {
        locale: 'es',
        initialView: 'dayGridMonth',
        initialDate: vm.periodoStart.anio + "-" + vm.periodoStart.mes + "-01",
        headerToolbar: {
            right: '',
            center: 'prevYear,prev,title,next,nextYear',
            left: '',
        },

        editable: true,
        dayMaxEvents: true,
        droppable: true,
        validRange: {
            start: moment(vm.periodoStart.anio + "-" + vm.periodoStart.mes + "-01").clone().startOf('month').format('YYYY-MM-DD'),
            end: moment(vm.periodoEnd.anio + "-" + vm.periodoEnd.mes + "-01").clone().endOf('month').format('YYYY-MM-DD')
        },
        drop: function (event) {
            let idEventDropped = event.draggedEl.getAttribute("value");
            let dateEventDropped = event.dateStr;
            if ((calendar.getEvents().filter(e => e.id === idEventDropped && e.startStr === dateEventDropped).length > 0) === true) {
                calendar.getEvents().filter(e => e.id === idEventDropped && e.startStr === dateEventDropped)[0].remove();
                toastr.info('Este usuario ya se encuentra programado para este día !');
            }
        }
    });

    calendar.render();

    $(".fc-daygrid-day-events").click(function (e) {
        positionMenu(e);
    });
}

function toggleMenuOn() {
    if (menuState !== 1) {
        menuState = 1;
        menu.classList.add(contextMenuActive);
    }
}

function toggleMenuOff() {
    if (menuState !== 0) {
        menuState = 0;
        menu.classList.remove(contextMenuActive);
    }
}

function positionMenu(e) {
    clickCoords = getPosition(e);
    clickCoordsX = clickCoords.x;
    clickCoordsY = clickCoords.y;
    menuWidth = menu.offsetWidth + 4;
    menuHeight = menu.offsetHeight + 4;

    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    if ((windowWidth - clickCoordsX) < menuWidth) {
        menu.style.left = windowWidth - menuWidth + "px";
    } else {
        menu.style.left = clickCoordsX + "px";
    }

    if ((windowHeight - clickCoordsY) < menuHeight) {
        menu.style.top = windowHeight - menuHeight + "px";
    } else {
        menu.style.top = clickCoordsY + "px";
    }
}

function getPosition(e) {
    var posx = 0;
    var posy = 0;

    if (!e) var e = window.event;

    if (e.pageX || e.pageY) {
        posx = e.pageX;
        posy = e.pageY;
    } else if (e.clientX || e.clientY) {
        posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    return {
        x: posx,
        y: posy
    }
}

$(document).ready(function () {
    $(document).click(function (e) {
        if (e.target.classList.contains('fc-event-title') === true) {
            toggleMenuOn();
        } else {
            toggleMenuOff();
        }
    });
});