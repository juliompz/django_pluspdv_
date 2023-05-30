
const app = new Vue({
    el: '#app',
    delimiters: ['${', '}'],
    data: {
        texto_titulo:'Caixa diário'
    },
    watch: {
    },
    methods:{
        tua_funcao(){
        },
    },
    created(){
    }
});


Chart.defaults.RoundedDoughnut = Chart.helpers.clone(Chart.defaults.doughnut);
Chart.controllers.RoundedDoughnut = Chart.controllers.doughnut.extend({
    draw: function(ease) {
        var ctx = this.chart.ctx;
        var easingDecimal = ease || 1;
        var arcs = this.getMeta().data;
        Chart.helpers.each(arcs, function(arc, i) {
            arc.transition(easingDecimal).draw();

            var pArc = arcs[i === 0 ? arcs.length - 1 : i - 1];
            var pColor = pArc._view.backgroundColor;

            var vm = arc._view;
            var radius = (vm.outerRadius + vm.innerRadius) / 2;
            var thickness = (vm.outerRadius - vm.innerRadius) / 2;
            var startAngle = Math.PI - vm.startAngle - Math.PI / 2;
            var angle = Math.PI - vm.endAngle - Math.PI / 2;

            ctx.save();
            ctx.translate(vm.x, vm.y);

            ctx.fillStyle = i === 0 ? vm.backgroundColor : pColor;
            ctx.beginPath();
            ctx.arc(radius * Math.sin(startAngle), radius * Math.cos(startAngle), thickness, 0, 2 * Math.PI);
            ctx.fill();

            ctx.fillStyle = vm.backgroundColor;
            ctx.beginPath();
            ctx.arc(radius * Math.sin(angle), radius * Math.cos(angle), thickness, 0, 2 * Math.PI);
            ctx.fill();

            ctx.restore();
        });

        // Add center text
        var centerX = (this.chart.chartArea.left + this.chart.chartArea.right) / 2;
        var centerY = (this.chart.chartArea.top + this.chart.chartArea.bottom) / 2;
        ctx.font = '500 20px Poppins, sans-serif';
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillText('Total', centerX, centerY - 15);
        ctx.font = '700 20px Poppins, sans-serif';
        ctx.fillText('R$150', centerX, centerY + 15);
    }
});

window.onload = function() {
    new Chart(document.getElementById('usersChart'), {
        type: 'RoundedDoughnut',
        data: {
            labels: [
                'Dinheiro',
                'Cartão',
                'Cheque',
                'Pix'
            ],
            datasets: [{
                data: [40, 20, 20, 20],
                backgroundColor: [
                    '#0094FF',
                    '#0670BC',
                    '#2B4B88',
                    '#05426D'
                ],
                borderWidth: 0
            }]
        },
        options: {
            cutoutPercentage: 70,
            legend: {
                display: false // Hide the legend
            },
            tooltip: {
                enabled: false // Disable tooltips
            }
        },
    });
};
