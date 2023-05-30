

const app = new Vue({
    el: '#login',
    delimiters: ['${', '}'],
    data: {
        cnpj:'',
        empresa_nome:'',
        mostrarFormularioCnpj: true,
        mostrarFormularioLogin: false,
        mostrarUltimoLogin: false,
        cpf:'',
        password:'',
        token:'',
        base_url:'',
    },
    computed: {
        cnpjFormatado(){
            if (this.cnpj) {
                // Remove todos os caracteres não numéricos
                const cnpjNumerico = this.cnpj.replace(/\D/g, '');
        
                // Aplica a formatação desejada: XX.XXX.XXX/YYYY-ZZ
                const cnpjFormatado = cnpjNumerico.replace(
                  /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
                  '$1.$2.$3/$4-$5'
                );
        
                return cnpjFormatado;
              }
              return '';
            },
        },
    watch: {
    },
    methods:{
        fetchEmpresa(){
            axios.get(`http://concentrador.pluspdv.com.br:51000/${this.cnpj}`)
            .then(response => {
                console.log(response.data)
                this.base_url = `http://${response.data.api_url}:${response.data.api_port}`
                this.empresa_nome = response.data.company_name
                console.log(this.base_url)
                this.mostrarFormularioCnpj = false
                this.mostrarFormularioLogin = true
                localStorage.setItem('empresa_nome', this.empresa_nome)
                localStorage.setItem('empresa_cnpj', this.cnpj)
                localStorage.setItem('base_url', this.base_url)
            })
            .catch(error =>{
                console.log(error)
            })
        },
        fetchLoginUser(){
            const params = {
                app_id: 'PlusPdvApp',
                store_id: this.cnpj,
                login: this.cpf,
                password: this.password
            };
            axios.post(`${this.base_url}/api/Login`, params)
            .then(response => {
                console.log(response.data)
                console.log('ENTROU NA API')
                this.token = response.data.token
                //this.fetchDadosAutenticados()
            })
            .catch(error => {
                console.log(error)
            })
        },
        TrocarEmpresa(){
            localStorage.removeItem('empresa_nome');
            localStorage.removeItem('empresa_cnpj');
            this.cnpj = '';
            this.mostrarFormularioCnpj = true;
            location.reload();
        },
        FazerLoginNovamente(){
            this.base_url = localStorage.getItem('base_url')
            this.mostrarFormularioLogin = true
            this.mostrarUltimoLogin = false
        }
        

        // fetchDadosAutenticados(){
        //     // Requisiçao ------------ //
        //     axios.get(`${this.base_url}/Algum/Caminho`, {
        //         headers: {
        //             Authorization: `Bearer ${this.token}`
        //         }
        //     })
        //     .then(reponse => {
        //         // Tratamento dos dados
        //     })
        // }
    },
    created(){
        const storedEmpresaNome = localStorage.getItem('empresa_nome');
        const storedEmpresaCnpj = localStorage.getItem('empresa_cnpj');
        if (storedEmpresaNome && storedEmpresaCnpj) {
            this.empresa_nome = storedEmpresaNome;
            this.cnpj = storedEmpresaCnpj
            this.mostrarFormularioCnpj = false;
            this.mostrarFormularioLogin = false;
            this.mostrarUltimoLogin = true;
          }
    }
});