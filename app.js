const estado = {
    admin: {
        loggedIn: 'admin' in localStorage && localStorage.getItem('admin') === 'true'
    }
};

function inicializarEstadoCabecera() {
    const header = document.querySelector('.site-header');
    if (!header) {
        return;
    }

    const estadoCabecera = document.createElement('div');
    estadoCabecera.className = 'status-bar';

    const adminLogueado = localStorage.getItem('admin') === 'true';
    const reservaActiva = localStorage.getItem('reserva') || localStorage.getItem('compra');

    if (adminLogueado) {
        estadoCabecera.classList.add('admin');
        estadoCabecera.textContent = 'Bienvenido, Administrador';
    } else if (reservaActiva) {
        estadoCabecera.classList.add('client');
        estadoCabecera.textContent = 'Reserva o compra activa en curso';

        const alerta = document.createElement('div');
        alerta.className = 'floating-alert';
        alerta.textContent = 'Recuerda que tienes una reserva o compra activa en tu cuenta.';
        document.body.appendChild(alerta);
    } else {
        estadoCabecera.textContent = 'Estado: sin reservas activas';
    }

    header.insertAdjacentElement('afterend', estadoCabecera);
}

inicializarEstadoCabecera();

const equipo = [
	{
		nombre: "Vicente Domínguez",
		rol: "Jefe de equipo",
		foto: "",
		descripcion: "Lider del equipo de charlas, organizador de las actividades y supervisador general.."
	},
	{
		nombre: "Camila Rojas",
		rol: "Asesora de productos",
		foto: "",
		descripcion: "Acompaña a los clientes y explica las características de cada producto. Dando el mayor detalle posible y con la mayor claridad"
	},
	{
		nombre: "Matías Soto",
		rol: "Encargado de atención a clientes",
		foto: "",
		descripcion: "Resuelve consultas y ayuda a encontrar la mejor alternativa para cada cliente."
	}
];

const valoresCorporativos = [
	{
		titulo: "Claridad",
		descripcion: "Explicamos cada servicio de forma sencilla para ayudar a decidir con confianza."
	},
	{
		titulo: "Confianza",
		descripcion: "Nuestra atención se apoya en una comunicación clara, respetuosa y responsable."
	},
	{
		titulo: "Evolución",
		descripcion: "Mejoramos la experiencia del cliente con procesos ordenados y soluciones útiles."
	}
];

function renderizarEquipo() {
	const contenedorEquipo = document.querySelector("#equipo");
	if (!contenedorEquipo) {
		return;
	}

	equipo.forEach((integrante) => {
		const tarjeta = document.createElement("article");
		tarjeta.className = "team-card";

		const imagen = integrante.foto
			? `<img src="${integrante.foto}" alt="Foto de ${integrante.nombre}">`
			: "";

		tarjeta.innerHTML = `
			${imagen}
			<div class="team-card-content">
				<h1>${integrante.nombre}</h1>
				<h2>${integrante.rol}</h2>
				<p>${integrante.descripcion}</p>
			</div>
		`;

		contenedorEquipo.appendChild(tarjeta);
	});
}

function renderizarValores() {
	const contenedorValores = document.querySelector("#valores-corporativos");
	if (!contenedorValores) {
		return;
	}

	const grid = document.createElement("div");
	grid.className = "value-grid";

	valoresCorporativos.forEach((valor) => {
		const articulo = document.createElement("article");
		articulo.className = "value-card";
		articulo.innerHTML = `
			<h3>${valor.titulo}</h3>
			<p>${valor.descripcion}</p>
		`;
		grid.appendChild(articulo);
	});

	contenedorValores.appendChild(grid);
}

renderizarEquipo();
renderizarValores();

const catalogo = [
	{
		nombre: "Charla de productos",
		descripcion: "Presentación general de productos para clientes interesados. Estarás en una lista con nuestros asesores para que recibas información confiable.",
		precio: 120000,
		stock: 10
	},
	{
		nombre: "Asesoría personalizada",
		descripcion: "Orientación para elegir el producto más adecuado, dependiendo de tu necesidades y estado ecónomico.",
		precio: 180000,
		stock: 10
	},
	{
		nombre: "Demostración práctica",
		descripcion: "Explicación sencilla del funcionamiento de un producto.",
		precio: 95000,
		stock: 5
	}
];

function formatearPrecio(precio) {
	return new Intl.NumberFormat("es-CL", {
		style: "currency",
		currency: "CLP",
		maximumFractionDigits: 0
	}).format(precio);
}

function obtenerCarrito() {
	return JSON.parse(localStorage.getItem("carrito") || "[]");
}

function guardarCarrito(carrito) {
	localStorage.setItem("carrito", JSON.stringify(carrito));
}

function actualizarResumenCompra() {
	const cantidadBox = document.querySelector("#carrito-cantidad");
	const totalBox = document.querySelector("#carrito-total");
	if (!cantidadBox || !totalBox) {
		return;
	}

	const carrito = obtenerCarrito();
	const cantidad = carrito.length;
	const total = carrito.reduce((suma, item) => suma + Number(item.precio), 0);

	cantidadBox.textContent = `${cantidad} ${cantidad === 1 ? "servicio" : "servicios"}`;
	totalBox.textContent = `Total: ${formatearPrecio(total)}`;
}

function renderizarCatalogo() {
	const contenedorCatalogo = document.querySelector("#catalogo");
	if (!contenedorCatalogo) {
		return;
	}

	catalogo.forEach((servicio) => {
		const tarjeta = document.createElement("article");
		tarjeta.className = "catalog-card";
		tarjeta.innerHTML = `
			<div class="catalog-card-top">
				<span class="catalog-tag">Servicio</span>
				<span class="catalog-price">${formatearPrecio(servicio.precio)}</span>
			</div>
			<h2>${servicio.nombre}</h2>
			<p>${servicio.descripcion}</p>
			<p class="stock">Disponibles: <span>${servicio.stock}</span></p>
			<button type="button" class="catalog-button">Reservar o comprar</button>
		`;

		const boton = tarjeta.querySelector("button");
		const stock = tarjeta.querySelector(".stock span");
		boton.addEventListener("click", () => {
			if (servicio.stock > 0) {
				servicio.stock -= 1;
				stock.textContent = servicio.stock;
				guardarPedido(servicio.nombre);
				const carrito = obtenerCarrito();
				carrito.push({ nombre: servicio.nombre, precio: servicio.precio });
				guardarCarrito(carrito);
				actualizarResumenCompra();
			}

			if (servicio.stock === 0) {
				boton.disabled = true;
				boton.textContent = "Agotado";
			}
		});

		contenedorCatalogo.appendChild(tarjeta);
	});
}

renderizarCatalogo();
actualizarResumenCompra();

const checkoutButton = document.querySelector("#checkout-button");
if (checkoutButton) {
	checkoutButton.addEventListener("click", () => {
		const carrito = obtenerCarrito();
		const total = carrito.reduce((suma, item) => suma + Number(item.precio), 0);
		if (carrito.length === 0) {
			window.alert("No has reservado o comprado ningún servicio.");
			return;
		}
		localStorage.setItem("reserva", "Compra activa");
		localStorage.setItem("compra", "servicio");
		window.alert(`Pedido confirmado. Total estimado: ${formatearPrecio(total)}.`);
	});
}

function obtenerPedidos() {
	return JSON.parse(localStorage.getItem("pedidos") || "[]");
}

function guardarPedido(servicio) {
	const pedidos = obtenerPedidos();
	const pedido = {
		servicio,
		fecha: new Date().toLocaleString("es-CL"),
		estado: "Solicitado"
	};

	pedidos.push(pedido);
	localStorage.setItem("pedidos", JSON.stringify(pedidos));
	localStorage.setItem("compra", servicio);
}

function renderizarPedidos() {
	const contenedorTabla = document.querySelector("#pedidos-tabla");
	if (!contenedorTabla) {
		return;
	}

	const pedidos = obtenerPedidos();
	if (pedidos.length === 0) {
		contenedorTabla.innerHTML = "<p>No hay pedidos registrados.</p>";
		return;
	}

	const filas = pedidos.map((pedido, indice) => `
		<tr>
			<td>${indice + 1}</td>
			<td>${pedido.servicio}</td>
			<td>${pedido.fecha}</td>
			<td>${pedido.estado}</td>
		</tr>
	`).join("");

	contenedorTabla.innerHTML = `
		<table class="orders-table">
			<thead>
				<tr><th>#</th><th>Servicio</th><th>Fecha</th><th>Estado</th></tr>
			</thead>
			<tbody>${filas}</tbody>
		</table>
	`;
}

function configurarLogin() {
	const formulario = document.querySelector("#login-form");
	if (!formulario) {
		return;
	}

	formulario.addEventListener("submit", (evento) => {
		evento.preventDefault();
		const usuario = document.querySelector("#usuario").value;
		const contrasena = document.querySelector("#contrasena").value;
		const mensaje = document.querySelector("#login-mensaje");

		if (usuario === "admin" && contrasena === "1234") {
			localStorage.setItem("admin", "true");
			document.querySelector("#contacto-interface").hidden = true;
			document.querySelector("#admin-panel").hidden = false;
			renderizarPedidos();
		} else {
			mensaje.textContent = "Información incorrecta. Intente nuevamente.";
		}
	});
}

configurarLogin();

function configurarConsulta() {
	const formulario = document.querySelector("#consulta-form");
	const opcionConsulta = document.querySelector("#quiere-consulta");
	const datosConsulta = document.querySelector("#datos-consulta");
	const campos = {
		nombre: document.querySelector("#nombre-consulta"),
		correo: document.querySelector("#correo-consulta"),
		telefono: document.querySelector("#telefono-consulta"),
		mensaje: document.querySelector("#mensaje-consulta")
	};

	if (!formulario || !opcionConsulta || !datosConsulta) {
		return;
	}

	opcionConsulta.addEventListener("change", () => {
		datosConsulta.hidden = !opcionConsulta.checked;
	});

	formulario.addEventListener("submit", (evento) => {
		evento.preventDefault();
		const errores = {
			nombre: document.querySelector("#nombre-error"),
			correo: document.querySelector("#correo-error"),
			telefono: document.querySelector("#telefono-error"),
			mensaje: document.querySelector("#mensaje-error")
		};
		let formularioValido = true;

		Object.values(errores).forEach((error) => {
			error.textContent = "";
		});

		Object.entries(campos).forEach(([nombre, campo]) => {
			if (!campo.value.trim()) {
				errores[nombre].textContent = "Este campo es obligatorio.";
				formularioValido = false;
			}
		});

		if (!formularioValido) {
			return;
		}

		const telefono = campos.telefono.value.trim();

		if (isNaN(telefono)) {
			errores.telefono.textContent = "El teléfono solo debe contener números.";
			window.alert("Error de tipo: el teléfono debe contener solo números.");
			return;
		}

		if (telefono.length !== 9) {
			errores.telefono.textContent = "El teléfono debe tener exactamente 9 números. Inténtalo nuevamente.";
			window.alert("El teléfono debe tener exactamente 9 números. Inténtalo nuevamente.");
			return;
		}

		window.alert("Tu consulta se ha enviado correctamente.");
		formulario.reset();
		datosConsulta.hidden = true;
	});
}

configurarConsulta();

function configurarCalculadoraMarketing() {
	const formulario = document.querySelector("#marketing-form");
	const campoCpc = document.querySelector("#cpc");
	const campoClics = document.querySelector("#clics-mensuales");
	const resultado = document.querySelector("#marketing-resultado");
	const error = document.querySelector("#marketing-error");
	const advertencia = document.querySelector("#marketing-advertencia");
	const botonCampana = document.querySelector("#cta-campana");
	const costoDominio = 13500;
	const costoHosting = 144000;
	const tarifaHora = 12000;
	const horasProyecto = 130;
	const costoHumano = tarifaHora * horasProyecto;

	const costoTotalProyecto = costoDominio + costoHosting + costoHumano;

	const dominioCosto = document.querySelector("#dominio-costo");
	const hostCosto = document.querySelector("#host-costo");
	const humanCosto = document.querySelector("#human-costo");
	const totalProyecto = document.querySelector("#total-proyecto");

	if (dominioCosto) dominioCosto.textContent = formatearPrecio(costoDominio) + " anual";
	if (hostCosto) hostCosto.textContent = formatearPrecio(costoHosting) + " anual";
	if (humanCosto) humanCosto.textContent = formatearPrecio(costoHumano);
	if (totalProyecto) totalProyecto.textContent = formatearPrecio(costoTotalProyecto);

	if (!formulario || !campoCpc || !campoClics || !resultado || !error || !advertencia || !botonCampana) {
		return;
	}

	formulario.addEventListener("submit", (evento) => {
		evento.preventDefault();
		error.textContent = "";
		resultado.textContent = "";
		resultado.hidden = true;
		advertencia.textContent = "";
		advertencia.hidden = true;
		botonCampana.hidden = true;

		const cpcTexto = campoCpc.value.trim();
		const clicsTexto = campoClics.value.trim();

		if (!cpcTexto || !clicsTexto) {
			error.textContent = "Debes ingresar CPC y clics mensuales.";
			return;
		}

		const cpc = Number(cpcTexto);
		const clicsMensuales = Number(clicsTexto);

		if (Number.isNaN(cpc) || Number.isNaN(clicsMensuales) || cpc < 0 || clicsMensuales < 0) {
			error.textContent = "Ingresa valores válidos para realizar el cálculo.";
			return;
		}

		const costoMarketing = cpc * clicsMensuales;
		const costoFormateado = costoMarketing.toLocaleString("es-CL");
		const costoTotal = costoTotalProyecto + costoMarketing;
		resultado.textContent = `CPC (${cpc.toLocaleString("es-CL")}) x ${clicsMensuales.toLocaleString("es-CL")} clics = Costo de marketing: ${formatearPrecio(costoMarketing)} | Costo total del proyecto: ${formatearPrecio(costoTotal)}`;
		resultado.hidden = false;

		if (costoMarketing > 50000) {
			advertencia.textContent = "⚠️ Presupuesto de marketing alto para fase de lanzamiento";
			advertencia.hidden = false;
			advertencia.classList.add("marketing-warning-visible");
			botonCampana.hidden = false;
		}
	});
}

configurarCalculadoraMarketing();
