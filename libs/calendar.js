/*var winHeight = $(window).height();
var height = ( winHeight * 16.6666 ) / 100;
var lineHeight = height + "px";

$("li").css("line-height", lineHeight);
$("li").css("height", height);
*/
var selected_date = null; var week=null;

let calendar = null;
document.addEventListener('DOMContentLoaded', () => {
    calendar = new VanillaCalendar('#calendar', {
        date: {
            today: new Date(),
        },
        settings: {
            lang: 'en',
            iso8601: true,
            visibility: {
                theme: 'system',
                today: true,
                weekend: true,
                weekNumbers: true,
                showOnInit: false,
            },
        },
        actions: {
            clickWeekNumber(event, number, days, year, self) {
                self.settings.selected.dates = days.map((day) => day.dataset.calendarDay);
                self.update({ dates: true });  
                selected_date = self.selectedDates; week = number;
                showHideCalendar();
                dateChanged();     
            },
            changeToInput(e, self) {
                if (!self.HTMLInputElement) return;
                if (self.selectedDates[0]) {
                  self.HTMLInputElement.innerHTML = self.selectedDates[0];
                  // if you want to hide the calendar after picking a date
                  self.hide();
                } else {
                  self.HTMLInputElement.textContent = '';
                }
              },
            clickDay(e, self, number) {
              selected_date = self.selectedDates; week = number;
              console.log(selected_date);
              showHideCalendar(); 
              dateChanged();     
            },
            clickMonth(e, self) {},
            clickYear(e, self) {},
            clickArrow(e, self) {},
            showCalendar(self) {},
            hideCalendar(self) { },
            updateCalendar(self) {},

        },
        popups: {
            '2024-08-29': {
              modifier: 'bg-red color-pink',
              html: `<div>
                <u><b>12:00 PM</b></u>
                <p style="margin: 5px 0 0;">Airplane in Las Vegas</p>
              </div>`,
              // or just text
              // html: 'Airplane in Las Vegas',
            },
          }
    });
    calendar.init(); //calendar.hide();
});


function showHideCalendar() {
  const calendarDiv = document.getElementById("calendar-div");
  if (calendarDiv) {
    calendarDiv.style.display = calendarDiv.style.display === "none" ? "block" : "none";
  }
}

function dateChanged(){
  if(window.location.href.includes("transactions.html")){
    updateTxList();
  }
}