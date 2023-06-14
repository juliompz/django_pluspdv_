




var app = new Vue({
    el: '#acesso',
    delimiters: ['${', '}'],
    data: {

        baseUrl: '',

        cpf: '',
        nomeUsuario: '',

        cnpj: '',
        empresa_nome: '',
        empresa_localizacao: '',

        // grafico 
        myChart: null,

        // CALENDARIO

        currentDate: new Date(),
        currentMonth: '',
        currentYear: '',

        // AREA TROCAR EMPRESA
        trocar_empresa: [],
        cnpjEscolhido:'',
        base_urlEscolhida: '',

        // AREA DO TICKET MEDIO
        vendas_totais: '',
        desconto_total: '',
        quantidades_vendidas: '',
        vendas: [],
        data: '',
        data_min:'2023%2F05%2F08',
        data_max:'2023%2F05%2F14',

        // DIAS SEPARADOS
        dia1: '',
        dia2: '',
        dia3: '',
        dia4: '',
        dia5: '',
        dia6: '',
        dia7: '',


    },
    computed: {
    },
    watch: {
    },
    methods:{
        // PARTE AZUL SAUDACAO //
        getUsuario(){
            this.cpf = localStorage.getItem('cpfUser')
            console.log(this.cpf)
            axios.get(`${this.baseUrl}/api/Cliente?cpf=${this.cpf}`)
            .then(response => {
                console.log(response.data)
                this.nomeUsuario = response.data[0].name
            })
            .catch(error =>{
                console.log(error)
            })
        },

        getEmpresasCadastradas(){
            axios.get(`${this.baseUrl}/api/Empresa`)
            .then(response => {
                this.trocar_empresa = response.data
                console.log(response)                
            })
        },
        selectCnpj(cnpj) {
            this.cnpjEscolhido = cnpj;
            axios.get(`http://concentrador.pluspdv.com.br:51000/${this.cnpjEscolhido}`)
            .then(response => {
                this.base_urlEscolhida = `http://${response.data.api_url}:${response.data.api_port}`
                localStorage.removeItem('empresa_nome', 'empresa_cnpj')
                localStorage.setItem('base_urlEscolhida', this.base_urlEscolhida)

                window.location.href = '/login'
            })
            .catch(error => {
                console.log(error)
            })
            
        },

        getEmpresaLoc(){
            axios.get(`${this.baseUrl}/api/Empresa?cnpj=${this.cnpj}`)
            .then(response =>{
                console.log(response.data)
                this.empresa_localizacao = response.data[0].address.street_name
                console.log(this.empresa_localizacao)
            })

        },
        fetchTicketMedio(){
            axios.get(`http://165.227.177.3:50390/Relatorios/TicketMedio?company_id=1&date_min=${this.data_min}&date_max=${this.data_max}`)
            .then(response => {
                this.vendas_totais = response.data.sales_value_total
                this.quantidades_vendidas = response.data.sales_count_total
                this.desconto_total = response.data.discount_total

              

                // TICKET MEDIO DIARIO
                this.vendas = response.data.dates

                this.dia1 = response.data.dates[0]
                this.dia2 = response.data.dates[1]
                this.dia3 = response.data.dates[2]
                this.dia4 = response.data.dates[3]
                this.dia5 = response.data.dates[4]
                this.dia6 = response.data.dates[5]
                this.dia7 = response.data.dates[6]

                const labels = [
                    ['Seg', this.formatarData(this.dia1.date)],
                    ['Ter', this.formatarData(this.dia2.date)],
                    ['Qua', this.formatarData(this.dia3.date)],
                    ['Qui', this.formatarData(this.dia4.date)],
                    ['Sex', this.formatarData(this.dia5.date)],
                    ['Sab', this.formatarData(this.dia6.date)],
                    ['Dom', this.formatarData(this.dia7.date)],
                ];
                
                const dados = [
                    [this.dia1.sales_value, this.dia1.sales_count],
                    [this.dia2.sales_value, this.dia2.sales_count],
                    [this.dia3.sales_value, this.dia3.sales_count],
                    [this.dia4.sales_value, this.dia4.sales_count],
                    [this.dia5.sales_value, this.dia5.sales_count],
                    [this.dia6.sales_value, this.dia6.sales_count],
                    [this.dia7.sales_value, this.dia7.sales_count],
                ]

            if (this.myChart) {
                this.myChart.destroy();
            }
                        
            // GRAFICO BARRAS
            var ctx = document.getElementById('myChart').getContext('2d');
            var config = {
                type: 'bar',
                data: {
                    labels:labels,

                    datasets: [{
                        label: 'Vendas',
                        data: dados,
                        backgroundColor: '#2B4B88', // Cor de fundo das barras
                        borderColor: '#2B4B88', // Cor da borda das barras
                        borderWidth: 1, // Largura da borda das barras
                        borderRadius:50,
                        borderSkipped: false,
                        barThickness: 15,
                        barPercentage:0.5, 
                    },
                
                ]
                },
                plugins: [ChartDataLabels],
                options: {
                    skipNull: false,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            offset: true, // Habilita o deslocamento da escala X
                            grid: {
                              offset: true // Habilita o deslocamento das linhas de grade
                            }
                          },
                        y: {
                            max: 5000,
                            display: false,
                        },

                    },
                    
                    plugins: {
                        legend: {
                            display: false
                        },  
                        datalabels: {

                            color:'black',
                            anchor:'end',
                            align:'end',
                            offset: 1,
                            font:{
                                family: 'Poppins, sans-serif',
                                weight: 400,
                                size: 10
                            },
                            textAlign: 'center',

                            formatter: function(value, context) {
                                if(value[1] === 0){
                                    return ''
                                }
                                var valorFormatado = `R$${value[0]}`;
                                var quantidadeVendas = `${value[1]} ven`;
                                return `${valorFormatado}\n${quantidadeVendas}`;
                              }
                        }
                    },
                }
            }

            if(this.myChart != null){
                this.myChart.destroy();
            }

            this.myChart = new Chart(ctx, config);



            // END GRAFICO BARRA //

                console.log(this.dia1)
                console.log(response.data)
            })
            .catch(error => {
                console.log(error)
            })
        },
        calendario(){
            

        },

        diminuirData() {

            const dataMin = moment(this.data_min, 'YYYY%2FMM%2FDD');
            const dataMax = moment(this.data_max, 'YYYY%2FMM%2FDD');

            // Retroceder 7 dias nas datas mínima e máxima
            const novaDataMin = dataMin.subtract(7, 'days').format('YYYY%2FMM%2FDD');
            const novaDataMax = dataMax.subtract(7, 'days').format('YYYY%2FMM%2FDD');
            this.data_min = novaDataMin
            this.data_max = novaDataMax
            this.fetchTicketMedio()

          },
          aumentarData(){

            const dataMin = moment(this.data_min, 'YYYY%2FMM%2FDD');
            const dataMax = moment(this.data_max, 'YYYY%2FMM%2FDD');

            // Retroceder 7 dias nas datas mínima e máxima
            const novaDataMin = dataMin.add(7, 'days').format('YYYY%2FMM%2FDD');
            const novaDataMax = dataMax.add(7, 'days').format('YYYY%2FMM%2FDD');
            this.data_min = novaDataMin
            this.data_max = novaDataMax
            this.fetchTicketMedio()
            
          },

        // FORMATAR DATA
        formatDate(date) {
            return moment(date).format('DD/MM/YY');
        },
        formatarData(data){
            return moment(data).format('DD/MM');
        },
        formatDataUrl(data){
            return moment(data).format('YYYY%2FMM%2FDD')
        },
        // FORMATAR CNPJ
        formatCnpj(cnpj) {
            const cnpjRegex = /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/;
            return cnpj.replace(cnpjRegex, '$1.$2.$3/$4-$5');
        },

    },
    mounted(){
        
    },
    created(){
        
        const token = localStorage.getItem('token')
        this.baseUrl = localStorage.getItem('base_url')
        if(token){

            this.cnpj = localStorage.getItem('empresa_cnpj')
            this.empresa_nome = localStorage.getItem('empresa_nome');

            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            this.calendario(),
            this.getUsuario(),
            this.getEmpresaLoc(),
            this.getEmpresasCadastradas(),
            this.fetchTicketMedio(),
            console.log(token),
            console.log(this.cnpj)
        }
        if(!token){
            window.location.href = '/login'
        }
    }
});

 // APARECER E DESAPARECER TROCAR EMPRESA//
 const conteudoPagina = document.getElementById('acesso')
 const buttonTrocarEmpresa = document.getElementById('trocar_empresa')
 const opcaoEmpresa = document.getElementById('opcao_empresa')
 const sobreposicao = document.getElementById('sobreposicao')
 const footer = document.getElementById('footer')

 buttonTrocarEmpresa.addEventListener('click', (evento) => {
     evento.stopPropagation(); // Impede a propagação do clique para o documento
     opcaoEmpresa.style.display = 'block';
     sobreposicao.style.display = 'block';
     footer.style.display = 'none'
     
 }),
 
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
 })
 // END //

// CODIGO DO CALENDARIO //

// APARECER E DESAPARECER CALENDARIO //
const iconData = document.getElementById('icon_data')
const calendario = document.getElementById('calendario')

iconData.addEventListener('click', () => {
    calendario.style.display = 'block';
}),

document.addEventListener('click', (event) => {
    const targetElement = event.target;
    if (
    targetElement !== iconData &&
    targetElement !== calendario &&
    !calendario.contains(targetElement)
    ) {
    calendario.style.display = 'none';
    }
})
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


 





