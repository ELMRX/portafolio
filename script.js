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
                
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});

// --- SISTEMA DE CONTACTO (CORREO Y DISCORD WEBHOOK) ---
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Cambiar el botón a estado "Cargando"
        submitBtn.innerText = "Enviando...";
        submitBtn.disabled = true;

        const name = document.getElementById('form-name').value;
        const email = document.getElementById('form-email').value;
        const message = document.getElementById('form-message').value;

      
        const discordWebhookUrl = 'https://discord.com/api/webhooks/1527446392786649209/gwDo9mJkT1RPEMhbkp9QLeGuOy-e5VBUzdLdo4GBZdeoCLN3i9FWHyJizAnXX47UhECR';

       
        const payload = {
            embeds: [
                {
                    title: "📬 ¡Nuevo mensaje desde tu Portafolio!",
                    color: 3891446, 
                    fields: [
                        { name: "👤 Cliente", value: name, inline: true },
                        { name: "📧 Correo", value: email, inline: true },
                        { name: "💬 Mensaje", value: message }
                    ],
                    timestamp: new Date().toISOString(),
                    footer: { text: "Ramiro.dev Contact System" }
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
            if (discordResponse.ok) {
                discordSuccess = true;
            }
        } catch (error) {
            console.error("Error al enviar a Discord:", error);
        }

       
        let emailSuccess = false;
        try {
            const emailResponse = await fetch('https://formsubmit.co/ajax/ramiroalarcon414@gmail.com', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    Nombre: name,
                    Email: email,
                    Mensaje: message,
                    _subject: `Nuevo contacto de ${name} desde tu Web`
                })
            });
            if (emailResponse.ok) {
                emailSuccess = true;
            }
        } catch (error) {
            console.error("Error al enviar el correo:", error);
        }

        
        submitBtn.disabled = false;
        submitBtn.innerText = "Enviar Mensaje 🚀";

        if (discordSuccess || emailSuccess) {
            alert("🎉 ¡Tu mensaje ha sido enviado con éxito! Te contactaré pronto.");
            contactForm.reset();
        } else {
            alert("❌ Hubo un inconveniente al enviar tu mensaje. Por favor escríbeme directamente en Discord.");
        }
    });
}