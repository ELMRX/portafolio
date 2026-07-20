// --- SISTEMA DE FILTRADO DE PROYECTOS ---
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {    
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (filterValue === 'all' || filterValue === 'todos' || cardCategory === filterValue) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});

// --- LÓGICA DE LA VENTANA EMERGENTE (MODAL) ---
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal-cotizar');
    const closeModalBtn = document.getElementById('close-modal');
    const btnCotizarList = document.querySelectorAll('.btn-cotizar-modal');
    const modalPaqueteNombre = document.getElementById('modal-paquete-nombre');
    const modalInputPaquete = document.getElementById('modal-form-paquete');

    // Abrir Modal al hacer clic en Cotizar
    btnCotizarList.forEach(btn => {
        btn.addEventListener('click', () => {
            const paquete = btn.getAttribute('data-paquete');
            modalPaqueteNombre.innerText = `Paquete: ${paquete}`;
            modalInputPaquete.value = paquete;
            modal.style.display = 'flex';
        });
    });

    // Cerrar Modal con la X o clic fuera del recuadro
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => modal.style.display = 'none');
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });
});

// --- ENVÍO DEL FORMULARIO DEL MODAL (DISCORD & CORREO) ---
const modalForm = document.getElementById('modal-contact-form');
const modalSubmitBtn = document.getElementById('modal-submit-btn');

if (modalForm) {
    modalForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        modalSubmitBtn.innerText = "Enviando...";
        modalSubmitBtn.disabled = true;

        const paquete = document.getElementById('modal-form-paquete').value;
        const name = document.getElementById('modal-form-name').value;
        const email = document.getElementById('modal-form-email').value;
        const message = document.getElementById('modal-form-message').value;

        const discordWebhookUrl = 'https://discord.com/api/webhooks/1528575837685809293/75dvRv5Sz8dSynz1eas7lOtGJKawoFcxVxkxyJshXfBGpcB55IODnO4IRw6ZIyU0j0Hd';

        const payload = {
            embeds: [
                {
                    title: "📦 ¡Nueva Solicitud de Paquete Web!",
                    color: 65535, 
                    fields: [
                        { name: "📋 Paquete", value: paquete, inline: false },
                        { name: "👤 Cliente", value: name, inline: true },
                        { name: "📧 Correo", value: email, inline: true },
                        { name: "💬 Detalles", value: message || "Sin detalles adicionales." }
                    ],
                    timestamp: new Date().toISOString(),
                    footer: { text: "Ramiro.dev Paquetes System" }
                }
            ]
        };

        let discordSuccess = false;
        try {
            const discordResponse = await fetch(discordWebhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (discordResponse.ok) discordSuccess = true;
        } catch (error) {
            console.error("Error al enviar a Discord:", error);
        }

        let emailSuccess = false;
        try {
            const emailResponse = await fetch('https://formsubmit.co/ajax/ramiroalarcon414@gmail.com', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    Paquete: paquete,
                    Nombre: name,
                    Email: email,
                    Mensaje: message,
                    _subject: `Nueva cotización de paquete: ${paquete}`
                })
            });
            if (emailResponse.ok) emailSuccess = true;
        } catch (error) {
            console.error("Error al enviar el correo:", error);
        }

        modalSubmitBtn.disabled = false;
        modalSubmitBtn.innerText = "Enviar Pedido 🚀";

        if (discordSuccess || emailSuccess) {
            alert("🎉 ¡Tu pedido ha sido enviado con éxito! Te contactaré muy pronto.");
            modalForm.reset();
            document.getElementById('modal-cotizar').style.display = 'none';
        } else {
            alert("❌ Hubo un inconveniente. Por favor escríbeme directamente por Discord.");
        }
    });
}

// ============================================
// MisterX/DEV - Script Principal
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // --- NAVBAR SCROLL EFFECT ---
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // --- FILTRO DE PROYECTOS/PÁGINAS ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterButtons.length > 0 && projectCards.length > 0) {
        
        // ✅ Función para mostrar solo una categoría
        function filterProjects(category) {
            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (category === 'all' || category === 'todos') {
                    card.style.display = 'flex';
                } else if (cardCategory && cardCategory.includes(category)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        // ✅ Activar botón y filtrar
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Quitar active de todos
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Activar este
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                filterProjects(filterValue);
            });
        });

        // ✅ AL CARGAR: Mostrar solo el primer filtro activo
        const activeButton = document.querySelector('.filter-btn.active');
        if (activeButton) {
            const initialFilter = activeButton.getAttribute('data-filter');
            filterProjects(initialFilter);
        }
    }

    // --- MODAL DE COTIZACIÓN ---
    const modal = document.getElementById('modal-cotizar');
    const closeModal = document.getElementById('close-modal');
    const cotizarButtons = document.querySelectorAll('.btn-cotizar-modal');
    const modalPaqueteNombre = document.getElementById('modal-paquete-nombre');
    const modalFormPaquete = document.getElementById('modal-form-paquete');

    if (modal && closeModal && cotizarButtons.length > 0) {
        
        // Abrir modal
        cotizarButtons.forEach(button => {
            button.addEventListener('click', function() {
                const paquete = this.getAttribute('data-paquete');
                if (modalPaqueteNombre) {
                    modalPaqueteNombre.textContent = '📦 ' + paquete;
                }
                if (modalFormPaquete) {
                    modalFormPaquete.value = paquete;
                }
                modal.style.display = 'flex';
            });
        });

        // Cerrar modal
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
        });

        // Cerrar al hacer clic fuera
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Cerrar con tecla ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                modal.style.display = 'none';
            }
        });
    }

    // --- FORMULARIO DE CONTACTO (index.html) ---
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submit-btn');
            const name = document.getElementById('form-name').value;
            const email = document.getElementById('form-email').value;
            const message = document.getElementById('form-message').value;
            
            if (!name || !email || !message) {
                alert('Por favor completa todos los campos.');
                return;
            }
            
            // Efecto de carga
            if (submitBtn) {
                submitBtn.classList.add('btn-loading');
                submitBtn.textContent = 'Enviando...';
            }
            
            // Simular envío (aquí puedes agregar tu lógica real)
            setTimeout(() => {
                if (submitBtn) {
                    submitBtn.classList.remove('btn-loading');
                    submitBtn.textContent = 'Enviar Mensaje 🚀';
                }
                alert('✅ ¡Mensaje enviado con éxito! Te contactaré pronto.');
                contactForm.reset();
            }, 2000);
        });
    }

    // --- FORMULARIO DEL MODAL ---
    const modalForm = document.getElementById('modal-contact-form');
    
    if (modalForm) {
        modalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = document.getElementById('modal-submit-btn');
            const name = document.getElementById('modal-form-name').value;
            const email = document.getElementById('modal-form-email').value;
            const paquete = document.getElementById('modal-form-paquete').value;
            
            if (!name || !email) {
                alert('Por favor completa los campos obligatorios.');
                return;
            }
            
            if (submitBtn) {
                submitBtn.textContent = 'Enviando...';
                submitBtn.disabled = true;
            }
            
            setTimeout(() => {
                if (submitBtn) {
                    submitBtn.textContent = 'Enviar Solicitud 🚀';
                    submitBtn.disabled = false;
                }
                alert('✅ ¡Solicitud enviada! Te contactaré para darte tu cotización.');
                modalForm.reset();
                if (modal) modal.style.display = 'none';
            }, 2000);
        });
    }

});