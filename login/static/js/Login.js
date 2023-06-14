
const app = new Vue({
    el: '#login',
    delimiters: ['${', '}'],
    data: {
        // AREA EMPRESA
        cnpj:'',
        storeId: '',
        cnpjteste: '',
        cnpj_error: false,
        empresa_nome:'',
        base_url:'',
        mostrarFormularioCnpj: true,
        cnpjNaoFormatado: '',
        // 
        // AREA LOGIN USUARIO
        cpf:'',
        cpfNaoFormatado:'',
        login_error: false,
        mostrarFormularioLogin: false,
        mostrarUltimoLogin: false,
        password:'',
        token:'',
        tentativa_login: 0,
        entrar_em_contato: false
        // 

    },
    computed: {
        cnpjFormatado(){
            if (this.storeId) {
                // Remove todos os caracteres não numéricos
                const cnpjNumerico = this.storeId.replace(/\D/g, '');
        
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
       
        formatarCNPJ(){
            const cnpjParaFormatar = this.cnpj.replace(/\D/g, '') // Remover caracteres não numéricos
            .replace(/(\d{2})(\d)/, '$1.$2') // Colocar ponto após os primeiros dois dígitos
            .replace(/(\d{3})(\d)/, '$1.$2') // Colocar ponto após os próximos três dígitos
            .replace(/(\d{3})(\d)/, '$1/$2') // Colocar barra após os próximos três dígitos
            .replace(/(\d{4})(\d)/, '$1-$2') // Colocar hífen após os próximos quatro dígitos
            .substring(0, 18); // Limitar o tamanho máximo do CNPJ

            this.cnpj = cnpjParaFormatar;
            this.cnpjNaoFormatado = this.cnpj.replace(/\D/g, ''); // Salvar valor sem formatação
        },
        
        //FUNCAO PARA FORMATAR CPF
        formatarCPF() {

            const cpfParaFormatar = this.cpf.replace(/\D/g, '') // Remover caracteres não numéricos
            .replace(/(\d{3})(\d)/, '$1.$2') // Colocar ponto após os primeiros três dígitos
            .replace(/(\d{3})(\d)/, '$1.$2') // Colocar ponto após os próximos três dígitos
            .replace(/(\d{3})(\d)/, '$1-$2') // Colocar hífen após os próximos três dígitos
            .substring(0, 14); // Limitar o tamanho máximo do CPF

            this.cpf = cpfParaFormatar;
            this.cpfNaoFormatado = this.cpf.replace(/\D/g, ''); // Salvar valor sem formatação
          },
          
        fetchEmpresa(){

            axios.get(`http://concentrador.pluspdv.com.br:51000/${this.cnpjNaoFormatado}`)
            .then(response => {
                console.log(response.data)
                this.base_url = `http://${response.data.api_url}:${response.data.api_port}`
                this.empresa_nome = response.data.company_name
                console.log(this.base_url)
                this.mostrarFormularioCnpj = false
                this.mostrarFormularioLogin = true
                this.storeId = response.data.company_cnpj
                const cnpjNaoFormatado = this.cnpj.replace(/\D/g, '');

                localStorage.setItem('empresa_nome', this.empresa_nome)
                localStorage.setItem('empresa_cnpj', this.cnpjNaoFormatado)
                localStorage.setItem('base_url', this.base_url)
            })
            //Tratando erros ( 404 - Não encontrado )
            .catch(error =>{
                console.log(error)
                console.log(this.cnpj)
                console.log(this.cnpjNaoFormatado)
                if (error.response.status === 404){
                    this.cnpj_error = true
                    this.cnpj = ''
                }
            })
        },
        fetchLoginUser(){
            const params = {
                app_id: 'PlusPdvApp',
                store_id: this.storeId,
                login: this.cpfNaoFormatado,
                password: this.password
            };
            
            const cpfUser = params.login
            localStorage.setItem('cpfUser', cpfUser);
            axios.post(`${this.base_url}/api/Login`, params)
            .then(response => {
                console.log(response.data)
                console.log('ENTROU NA API')

                const token = response.data.token

                localStorage.setItem('token', token);

                window.location.href = '/acesso';
            })
            .catch(error => {
                console.log(error)
                // TRATANDO ERRO QUANDO LOGIN INVALIDO - ERROR 401
                if(error.response.status === 401){
                    this.login_error = true
                    this.cpf = ''
                    this.password = ''
                }
            })
        },
        BotaoLogin(){
            if(this.login_error = true){
                this.tentativa_login++
            }
            console.log(this.tentativa_login)
            if(this.tentativa_login >=2){
                this.entrar_em_contato = true
            }
        },
        TrocarEmpresa(){
            localStorage.removeItem('empresa_nome');
            localStorage.removeItem('empresa_cnpj');
            localStorage.removeItem('cpfUser')
            this.cnpj = '';
            this.mostrarFormularioCnpj = true;
            location.reload();
        },
        FazerLoginNovamente(){
            if(localStorage.getItem('base_url')){
                this.base_url = localStorage.getItem('base_url')
                this.mostrarFormularioLogin = true
                this.mostrarUltimoLogin = false
            }

        },
        // TROCAR EMPRESA QUANDO O USUARIO TAVA LOGADO EM OUTRA
        TrocarEmpresaJaLogado(){
            var base_urlEscolhida = localStorage.getItem('base_urlEscolhida')

            if(base_urlEscolhida){
                this.base_url = base_urlEscolhida
                this.mostrarUltimoLogin = false
                this.mostrarFormularioCnpj = false
                this.mostrarFormularioLogin = true
            }
            
        }

    },
    created(){
        const storedEmpresaNome = localStorage.getItem('empresa_nome');
        const storedEmpresaCnpj = localStorage.getItem('empresa_cnpj');

        if (storedEmpresaNome && storedEmpresaCnpj) {
            this.empresa_nome = storedEmpresaNome;
            this.storeId = storedEmpresaCnpj
            this.mostrarFormularioCnpj = false;
            this.mostrarFormularioLogin = false;
            this.mostrarUltimoLogin = true;
          }
    }
});

