var vm = new Vue({
    el: '#app',
    mounted: function () {
        this.getPeriodos();
        this.getUsuarios();
    },
    data: {
        users: false,
        periodoStart: false,
        periodoEnd: false,
        searchQuery: "",
    },
    methods: {
        getPeriodos: function () {
            axios.get('http://test.movilbox.co:888/test_mbox/test.php?metodo=periodos')
                .then(function (response) {
                    let data = response.data;
                    vm.periodoStart = data.shift();
                    vm.periodoEnd = data.pop();
                    vm.periodoStart.mes = (vm.periodoStart.mes.length === 1) ? ("0" + vm.periodoStart.mes) : vm.periodoStart.mes;
                    vm.periodoEnd.mes = (vm.periodoEnd.mes.length === 1) ? ("0" + vm.periodoEnd.mes) : vm.periodoEnd.mes;
                    initCalendar();
                })
                .catch(function (error) {
                    vm.periodoStart = false;
                    vm.periodoEnd = false;
                })
        },

        getUsuarios: function () {
            this.users = [];
            axios.get('http://test.movilbox.co:888/test_mbox/test.php?metodo=usuarios')
            .then(function (response) {
                let data = response.data;
                for (let i in data) {
                    vm.users.push({
                        idus: data[i].idus, 
                        nombre: data[i].nombre, 
                        perfil: data[i].perfil, 
                        dias_plani: data[i].dias_plani, 
                        tiendas_plani: data[i].tiendas_plani,
                        color_one: getRandomInt(0, 200),
                        color_two: getRandomInt(0, 200),
                        color_three: getRandomInt(0, 200),
                    })
                }
            })
            .catch(function (error) {
                vm.users = false;
            })
        },

        saveProgramacion: function () {
            let jsonToSave = [];
            let arrEvents = calendar.getEvents();
            if (arrEvents.length > 0){
                for (let e of arrEvents) {
                    jsonToSave.push({"idus": e.id, "fecha": e.startStr})
                }

                axios.post('http://test.movilbox.co:888/test_mbox/test.php?metodo=guardar', JSON.stringify(jsonToSave))
                .then(function (response) {
                    let data = response.data;
                    if (data.state === 1 && data.msg === "Ok"){
                        toastr.success('Eventos guardados correctamente !');
                    } else {
                        toastr.error('Ocurrio un error al guardar los evento, por favor vuelve a intentar !');
                    }
                })
                .catch(function (error) {
                    console.log(error);
                })
            } else {
                toastr.warning('Por favor registre un evento para guardar !');
            }
        },

        setBackgroundColor: function(colorOne, colorTwo, colorThree) {
            return {
                backgroundColor: "rgb(" + colorOne + "," + colorTwo + "," + colorThree + ")"
            }
        },

        setBackgroundColorHover: function(idUser, colorOne, colorTwo, colorThree){
            let element = document.getElementById('ctnUser' + idUser);
            element.style.backgroundColor = "rgb(" + colorOne + "," + colorTwo + "," + colorThree + ", .3)";
        },

        removeBackgroundColorHover: function(idUser, colorOne, colorTwo, colorThree){
            let element = document.getElementById('ctnUser' + idUser);
            element.style.backgroundColor = "white";
        },
    },
    computed: {
        resultQuery() {
            if (this.searchQuery) {
                return this.users.filter((item) => {
                    return this.searchQuery.toLowerCase().split(' ').every(v => item.nombre.toLowerCase().includes(v))
                })
            } else {
                return this.users;
            }
        }
    }
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}