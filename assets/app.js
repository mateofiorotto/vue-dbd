// PASOS PARA REALIZAR EN EL PARCIAL
// PUNTOS PARA EL 4
// 1. Tematica libre eleccion: 1 html, 1 app.js, 1 css. Formulario y mostrar lo que el usuario ingresa: HECHO
// 2. Contenidos reales y estar acompañados de imagenes: HECHO
// 3. USO de dos componentes: HECHO, se utiliza el componente "historia" (hijo) y "crear-aventura" (padre)
// 4. V-FOR para representar datos: HECHO -> se guardan datos en un array de las opciones y se ponen con un v-for en el option del select
//                                            para no tener que andar escribiendo varias lineas de <option> y organizarlo mejor
// 5. Condicionales con V-IF: HECHO, se utiliza para verificar si el formulario no tiene algun campo valido seleciconado (en caso de que)
//                                   el usuario no seleccione nada. Si la propiedad de error es true se muestra el mensaje de error y marca
//                                   los errores
// 6. INFORME: HECHO

// AGREGADOS PARA EL 10
// 7. establecer clases por medio de operador ternario: HECHO, Se utiliza para el form, al validar los campos. Si son incorrectos se marcan rojos,
//                                                      si despues de cargar son validos se marcan verde.
// 8. utilizar FILTROS: HECHO, se utiliza un filtro para poner en mayusculas los textos seleccionados por el usuario en la historia (y tambien)
//                      para las opciones del select y en el h2. Ademas, se usa para agregar la clase bold-rojo
// 9. localStorage: HECHO, se guardan los datos y el div-historias al recargar queda en la pagina. Al tocar el boton de crear otra historia,
//                  no se borra por cuestiones de estetica, pero al recargar se pierde la info
// 10. manejo de props: HECHO, se usan props para pasarle al componente hijo

//PUNTOS HECHOS: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10

//-----------------------------------------------------------------------------

//crear app
const app = Vue.createApp({});

//componente hijo: muestra la historia
app.component("historia", {
  //le pasamos la prop historia y el asesinoBanner (para cambiar el banner segun una clase)
  props: ["historia", "asesinoBanner"],
  //metodos (2 filtros, uno mayusculas y el otro es un scroll)
  methods: {
    filtroMayuscula(texto) {
      return texto.toUpperCase();
    },
    scrollForm() {
      const formulario = document.getElementById("formulario");
      if (formulario) {
        formulario.scrollIntoView();
      }
    },
    crearOtraHistoria() {
      this.scrollForm();
    },
  },
  //aca se le aplican los props y los filtros
  template: `
    <div v-if="historia" :class="asesinoBanner" class="Bannermt-4">
      <div id="div-historia" class="container d-flex">
        <div class="col-lg-6 col-md-12 pt-5">
          <h2>{{ filtroMayuscula("Tu Historia") }}</h2>
          <p class="pt-3" v-html="historia"></p>
          <a @click="crearOtraHistoria" class="mt-3">Crear otra historia</a>
        </div>
      </div>
    </div>
  `,
});

//componente padre, maneja el form, la validacion, el localstorage
// tambien genera la historia y se la pasa como prop al hijo
//usa ternarios, v-if, v-for, filtros, eventos
app.component("crear-aventura", {
  data() {
    //creo la constante historia datos para parsear y despues mnandar todo por local a historia-guardar
    //si no existe se da un objeto vacio
    const historiaDatos = JSON.parse(localStorage.getItem("historia-guardar")) || {};
    return {
      //vars de vue, toman valor desde el form o se les asigna una cadena vacia x default
      arma: historiaDatos.arma || "",
      accion: historiaDatos.accion || "",
      reino: historiaDatos.reino || "",
      superviviente: historiaDatos.superviviente || "",
      asesino: historiaDatos.asesino || "",
      asesinoBanner: historiaDatos.asesino || "",
      error: {},
      historiaGenerada: historiaDatos.historia || "",
      //objeto
      opciones: {
        armas: ["el machete","la sierra","el hacha","la motosierra","el garrote"],
        acciones: ["herir", "matar", "dejar escapar", "colgar en un gancho"],
        reinos: ["la finca macmillan","el asilo crotus prenn","el bosque rojo","la granja coldwind","el desguace autohaven"],
        supervivientes: ["dwight fairfield","meg thomas","claudette morel","jake park"],
        asesinos: ["el trampero","la enfermera","la cazadora","el granjero","el espectro"],
      },
    };
  },
  //metodos (funciones + filtros)
  methods: {
    //filtro 1 --> mayusculas
    filtroMayuscula(texto) {
      return texto.toUpperCase();
    },
    //filtro 2 --> aplicar clase
    aplicarClase(texto, clase) {
      return `<span class="${clase}">${texto}</span>`;
    },
    //metodo para scrollear al div una vez se cree la historia
    scrollDivHistoria() {
      //usamos una funcion nativa de js para que luego de crearse la historia se desplaze al div-historia
        //solo para hacerlo mas amigable
        setTimeout(() => {
          const divHistoria = document.getElementById("div-historia");
          if (divHistoria) {
            divHistoria.scrollIntoView();
          }
        }, 0);
    },
    //validacion de form con true / false
    validarFormulario() {
      //si esta vacia se asigna true, sino false
      this.error.arma = !this.arma;
      this.error.accion = !this.accion;
      this.error.reino = !this.reino;
      this.error.superviviente = !this.superviviente;
      this.error.asesino = !this.asesino;

      //  si el error es falso, entonces
      if (!this.error.arma && !this.error.accion && !this.error.reino && !this.error.superviviente && !this.error.asesino) {
        //ejecutamos el metodo generaHistoria y asignamos al asesinoBanner el nombre del asesino seleccionado
        //se hace de esta manera para que el banner solo se actualice cuando se valide el form de nuevo
        this.generarHistoria();
        this.asesinoBanner = this.asesino;
        
        //ejecutamos guardarlocal y scrolldivhistoria
        this.guardarLocal();
        this.scrollDivHistoria()
      }
    },
    //generamos la historia por html, aplicamos filtros tambien
    generarHistoria() {
      this.historiaGenerada = `
        Tu, ${this.aplicarClase(this.filtroMayuscula(this.asesino),"bold-rojo")}, apareces en el reino del ente para causar dolor y pánico.
        Decides tomar ${this.aplicarClase(this.filtroMayuscula(this.arma),"bold-rojo")} con la cual harás sufrir a tus víctimas.
        Un día, te encuentras merodeando por ${this.aplicarClase(this.filtroMayuscula(this.reino),"bold-rojo")} para conseguir tu próxima presa y no dejar escapar a nadie para satisfacer al ente,
        te encuentras en tu camino a ${this.aplicarClase(this.filtroMayuscula(this.superviviente),"bold-rojo")}.
        Luego de una larga persecución decides ${this.aplicarClase(this.filtroMayuscula(this.accion),"bold-rojo")} al superviviente para seguir buscando a los otros tres que están por el reino.
      `;
    },
    //metemos todo al objeto de historiaDatos y lo seteamos, ademas de stringyfearlo
    guardarLocal() {
      const historiaDatos = {
        asesino: this.asesino,
        arma: this.arma,
        accion: this.accion,
        reino: this.reino,
        superviviente: this.superviviente,
        historia: this.historiaGenerada
      };
      localStorage.setItem("historia-guardar", JSON.stringify(historiaDatos));
    },
  },
  //creamos el template del form
  //aca aplicamos eventos, v-for para representar los option en una sola linea y clases
  //ademas usamos un ternario para aplicar border segun si el campo esta seleccionado o no
  template: `
  <div>
  <div class="fondo-form">
    <div class="container">
    <form id="formulario" @submit.prevent="validarFormulario">
      <div class="row justify-content-center align-items-center">

        <div class="col-lg-6 col-md-6 col-sm-12 mb-3">
          <label for="asesino" class="form-label">Selecciona tu asesino</label>
          <select class="form-select" id="asesino" v-model="asesino" :class="error.asesino ? 'borde-rojo' : asesino ? 'borde-verde' : ''">
            <option disabled value="">Elige un asesino</option>
            <option v-for="asesino in opciones.asesinos" :key="asesino" :value="asesino">{{ filtroMayuscula(asesino) }}</option>
          </select>
        </div>

        <div class="col-lg-6 col-md-6 col-sm-12 mb-3">
          <label for="arma" class="form-label">Selecciona tu arma</label>
          <select class="form-select" id="arma" v-model="arma" :class="error.arma ? 'borde-rojo' : arma ? 'borde-verde' : ''">
            <option disabled value="">Elige un arma</option>
            <option v-for="arma in opciones.armas" :key="arma" :value="arma">{{ filtroMayuscula(arma) }}</option>
          </select>
        </div>

        <div class="pt-5 col-lg-6 col-md-6 col-sm-12 mb-3">
          <label for="accion" class="form-label">¿Qué acción tomas?</label>
          <select class="form-select" id="accion" v-model="accion" :class="error.accion ? 'borde-rojo' : accion ? 'borde-verde' : ''">
            <option disabled value="">Elige una acción</option>
            <option v-for="accion in opciones.acciones" :key="accion" :value="accion">{{ filtroMayuscula(accion) }}</option>
          </select>
        </div>

        <div class="pt-5 col-lg-6 col-md-6 col-sm-12 mb-3">
          <label for="reino" class="form-label">Selecciona el reino</label>
          <select class="form-select" id="reino" v-model="reino" :class="error.reino ? 'borde-rojo' : reino ? 'borde-verde' : ''">
            <option disabled value="">Elige un reino</option>
            <option v-for="reino in opciones.reinos" :key="reino" :value="reino">{{ filtroMayuscula(reino) }}</option>
          </select>
        </div>

        <div class="pt-5 col-lg-6 col-md-6 col-sm-12 mb-3">
          <label for="superviviente" class="form-label">Selecciona el superviviente</label>
          <select class="form-select" id="superviviente" v-model="superviviente" :class="error.superviviente ? 'borde-rojo' : superviviente ? 'borde-verde' : ''">
            <option disabled value="">Elige un superviviente</option>
            <option v-for="superviviente in opciones.supervivientes" :key="superviviente" :value="superviviente">{{ filtroMayuscula(superviviente) }}</option>
          </select>
        </div>

      </div>

      <button id="crear-historia" type="submit" class="mt-5">Crear historia</button>
    </form>
    </div>
  </div>
    <historia :asesinoBanner="asesinoBanner" :historia="historiaGenerada"></historia>
  </div>
  `,
  //mandamos al componente hijo el nombre del asesino y la historia
});

app.mount("#app");