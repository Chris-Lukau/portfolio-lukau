// ============================================================
// Projetos - adicione os SEUS projetos reais aqui
// tipo: "dev" ou "sec"
// link: URL público do repositório no GitHub
// ============================================================
const projetos = [
    // Exemplo (apague quando tiver os seus):
    // {
    //     titulo: "Nome do projeto",
    //     tipo: "dev",
    //     desc: "O que faz, em uma frase, e a tecnologia usada.",
    //     link: "https://github.com/chris-lukau/nome-do-repo"
    // },

];

// Seleciona o container onde os cards serão inseridos
const container = document.querySelector('#lista-projetos');

// Função que cria os cards
function renderizarProjetos(lista) {
    container.innerHTML = '';

    if (lista.length === 0) {
        container.innerHTML = `
            <p class="projetos-vazio">
                Nenhum projeto nesta categoria ainda. Em breve.
            </p>
        `;
        return;
    }

    lista.forEach(proj => {
        const card = document.createElement('div');
        card.className = 'card-projeto';
        card.classList.add('project-enter');

        // Criar elementos com textContent evita XSS se algum campo
        // contiver caracteres especiais (boa prática de segurança)
        const titulo = document.createElement('h3');
        titulo.textContent = proj.titulo;

        const desc = document.createElement('p');
        desc.textContent = proj.desc;

        const tag = document.createElement('span');
        tag.className = `tag tag-${proj.tipo}`;
        tag.textContent = proj.tipo.toUpperCase();

        const link = document.createElement('a');
        link.href = proj.link;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'Ver no GitHub →';

        card.append(titulo, desc, tag, link);
        container.appendChild(card);
    });
}

// Aplica o filtro e atualiza os botões
function aplicarFiltro(tipo) {
    // Atualiza estado visual e acessível dos botões
    document.querySelectorAll('.filtros button').forEach(btn => {
        const ativo = btn.dataset.filtro === tipo;
        btn.classList.toggle('ativo', ativo);
        btn.setAttribute('aria-pressed', String(ativo));
    });

    // Filtra e renderiza
    const lista =
        tipo === 'todos'
            ? projetos
            : projetos.filter(p => p.tipo === tipo);

    renderizarProjetos(lista);
}

// Liga os botões aos filtros
document.querySelectorAll('.filtros button').forEach(btn => {
    btn.addEventListener('click', () => aplicarFiltro(btn.dataset.filtro));
});

// Renderização inicial
aplicarFiltro('todos');

// Efeitos visuais leves; o conteúdo permanece visível sem JavaScript.
function configurarRevelacao() {
    const reduzirMovimento = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    if (reduzirMovimento || !('IntersectionObserver' in window)) return;

    const elementos = document.querySelectorAll(
        '.hero-copy, .hero-visual, .about-layout, .projects-heading, .filtros, .card-projeto, .contact-content, .footer-content'
    );

    elementos.forEach(elemento => elemento.setAttribute('data-reveal', ''));
    document.body.classList.add('motion-ready');

    const observador = new IntersectionObserver((entradas, observer) => {
        entradas.forEach(entrada => {
            if (!entrada.isIntersecting) return;

            entrada.target.classList.add('is-visible');
            observer.unobserve(entrada.target);
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -36px 0px'
    });

    elementos.forEach(elemento => observador.observe(elemento));
}

function configurarProgressoDaPagina() {
    const barra = document.querySelector('.scroll-progress span');
    if (!barra) return;

    let atualizacaoAgendada = false;

    const atualizar = () => {
        const alturaRolavel =
            document.documentElement.scrollHeight - window.innerHeight;
        const progresso = alturaRolavel > 0
            ? window.scrollY / alturaRolavel
            : 0;

        barra.style.transform = `scaleX(${Math.min(1, Math.max(0, progresso))})`;
        atualizacaoAgendada = false;
    };

    window.addEventListener('scroll', () => {
        if (atualizacaoAgendada) return;
        atualizacaoAgendada = true;
        window.requestAnimationFrame(atualizar);
    }, { passive: true });

    window.addEventListener('resize', atualizar, { passive: true });
    atualizar();
}

function configurarLuzDoCursor() {
    const luz = document.querySelector('.pointer-glow');
    const cursorPreciso = window.matchMedia(
        '(hover: hover) and (pointer: fine)'
    ).matches;

    if (!luz || !cursorPreciso) return;

    let quadroAgendado = false;
    let x = 0;
    let y = 0;

    document.addEventListener('pointermove', evento => {
        if (evento.pointerType !== 'mouse') return;

        x = evento.clientX;
        y = evento.clientY;

        if (quadroAgendado) return;
        quadroAgendado = true;

        window.requestAnimationFrame(() => {
            luz.style.left = `${x}px`;
            luz.style.top = `${y}px`;
            luz.classList.add('is-visible');
            quadroAgendado = false;
        });
    }, { passive: true });

    document.addEventListener('pointerleave', () => {
        luz.classList.remove('is-visible');
    });
}

configurarRevelacao();
configurarProgressoDaPagina();
configurarLuzDoCursor();