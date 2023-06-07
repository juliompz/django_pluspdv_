


// APARECER E DESAPARECER TROCAR EMPRESA//
const conteudoPagina = document.getElementById('acesso')
const buttonTrocarEmpresa = document.getElementById('trocar_empresa')
const opcaoEmpresa = document.getElementById('opcao_empresa')
const sobreposicao = document.getElementById('sobreposicao');
const footer = document.getElementById('footer')

buttonTrocarEmpresa.addEventListener('click', (evento) => {
    evento.stopPropagation(); // Impede a propagação do clique para o documento
    opcaoEmpresa.style.display = 'block';
    sobreposicao.style.display = 'block';
    footer.style.display = 'none'
    
  });
  
  document.addEventListener('click', (event) => {
    const targetElement = event.target;
    if (
      targetElement !== buttonTrocarEmpresa &&
      targetElement !== opcaoEmpresa &&
      !opcaoEmpresa.contains(targetElement)
    ) {
        opcaoEmpresa.style.display = 'none';
        sobreposicao.style.display = 'none';
        footer.style.display = 'flex';
        
    }
  });
// END //


// CODIGO DO CALENDARIO //

// APARECER E DESAPARECER CALENDARIO //
const iconData = document.getElementById('icon_data')
const calendario = document.getElementById('calendario')

iconData.addEventListener('click', () => {
    calendario.style.display = 'block';
});

document.addEventListener('click', (event) => {
    const targetElement = event.target;
    if (
      targetElement !== iconData &&
      targetElement !== calendario &&
      !calendario.contains(targetElement)
    ) {
      calendario.style.display = 'none';
    }
  });
// END APARECER E DESAPARECER CALENDARIO //






const daysTag = document.querySelector(".days"),
currentDate = document.querySelector(".current-date"),
currentYear = document.querySelector(".current-year"),
prevNextIcon = document.querySelectorAll(".icons span");
// getting new date, current year and month
let date = new Date(),
currYear = date.getFullYear(),
currMonth = date.getMonth();
// storing full name of all months in array
const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho",
              "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const renderCalendar = () => {
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(), // getting first day of month
    lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(), // getting last date of month
    lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(), // getting last day of month
    lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(); // getting last date of previous month
    let liTag = "";
    for (let i = firstDayofMonth; i > 0; i--) { // creating li of previous month last days
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }
    for (let i = 1; i <= lastDateofMonth; i++) { // creating li of all days of current month
        // adding active class to li if the current day, month, and year matched
        let isToday = i === date.getDate() && currMonth === new Date().getMonth() 
                     && currYear === new Date().getFullYear() ? "active" : "";
        liTag += `<li class="${isToday}">${i}</li>`;
    }
    for (let i = lastDayofMonth; i < 6; i++) { // creating li of next month first days
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`
    }
    currentDate.innerText = `${months[currMonth]}`; // passing current mon and yr as currentDate text ${currYear}
    currentYear.innerText = `${currYear}`; // passing current mon and yr as currentDate text ${currYear}
    daysTag.innerHTML = liTag;
}
renderCalendar();
prevNextIcon.forEach(icon => { // getting prev and next icons
    icon.addEventListener("click", () => { // adding click event on both icons
        // if clicked icon is previous icon then decrement current month by 1 else increment it by 1
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;
        if(currMonth < 0 || currMonth > 11) { // if current month is less than 0 or greater than 11
            // creating a new date of current year & month and pass it as date value
            date = new Date(currYear, currMonth, new Date().getDate());
            currYear = date.getFullYear(); // updating current year with new date year
            currMonth = date.getMonth(); // updating current month with new date month
        } else {
            date = new Date(); // pass the current date as date value
        }
        renderCalendar(); // calling renderCalendar function
    });
});

// FIM DO CODIGO CALENDARIO //