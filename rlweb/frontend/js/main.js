/**
 * Reconheça Brasil Web — front-end
 * Consome a API Node.js (via Nginx em /api) para carregar conteúdo
 * dinâmico e enviar o formulário de contato.
 */

const API_BASE = "/api";

/* Marca o link de navegação da página atual */
(function marcarPaginaAtiva() {
    const atual = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-link").forEach((link) => {
        const href = link.getAttribute("href");
        if (href === atual) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }
    });
})();

/* ---------- Projetos (usado em index.html e projetos.html) ---------- */
async function carregarProjetos(destino, { destaqueSomente = false } = {}) {
    const container = document.querySelector(destino);
    if (!container) return;

    try {
        const resp = await fetch(`${API_BASE}/projetos`);
        if (!resp.ok) throw new Error("Falha ao buscar projetos");
        let projetos = await resp.json();

        if (destaqueSomente) {
            projetos = projetos.filter((p) => p.destaque);
        }

        if (!projetos.length) {
            container.innerHTML = `<p class="loading-placeholder">Nenhum projeto cadastrado ainda.</p>`;
            return;
        }

        container.innerHTML = projetos
            .map(
                (p) => `
            <div class="col-md-4">
                <div class="card shadow">
                    <img src="${p.imagem || "img/projeto-padrao.jpg"}" class="card-img-top" alt="${p.titulo}">
                    <div class="card-body">
                        <h5>${p.titulo}</h5>
                        <p>${p.descricao}</p>
                        <a href="contato.html" class="btn btn-outline-primary btn-sm mt-2">Quero saber mais</a>
                    </div>
                </div>
            </div>`
            )
            .join("");
    } catch (erro) {
        console.error(erro);
        container.innerHTML = `<p class="loading-placeholder">Não foi possível carregar os projetos agora. Tente novamente mais tarde.</p>`;
    }
}

/* ---------- Serviços (usado em servicos.html) ---------- */
async function carregarServicos(destino) {
    const container = document.querySelector(destino);
    if (!container) return;

    try {
        const resp = await fetch(`${API_BASE}/servicos`);
        if (!resp.ok) throw new Error("Falha ao buscar serviços");
        const servicos = await resp.json();

        container.innerHTML = servicos
            .map((s) => {
                const destaque = s.destaque;
                return `
            <div class="col-lg-4">
                <div class="plan-card card ${destaque ? "destaque" : ""} h-100">
                    ${destaque ? '<div class="plan-tag">MAIS CONTRATADO</div>' : ""}
                    <div class="card-body text-center">
                        <h3 class="mt-2">${s.nome}</h3>
                        <div class="plan-price">R$ ${Number(s.preco).toFixed(0)}<small> /site</small></div>
                        <ul class="list-group list-group-flush mt-3 text-start">
                            ${(s.itens || [])
                                .map((item) => `<li class="list-group-item"><i class="bi bi-check-circle-fill"></i>${item}</li>`)
                                .join("")}
                        </ul>
                    </div>
                </div>
            </div>`;
            })
            .join("");
    } catch (erro) {
        console.error(erro);
        container.innerHTML = `<p class="loading-placeholder">Não foi possível carregar os pacotes agora. Tente novamente mais tarde.</p>`;
    }
}

/* ---------- Formulário de contato (usado em contato.html) ---------- */
function configurarFormularioContato(formSeletor) {
    const form = document.querySelector(formSeletor);
    if (!form) return;

    const status = document.getElementById("form-status");
    const botao = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        const dados = {
            nome: form.nome.value.trim(),
            email: form.email.value.trim(),
            assunto: form.assunto.value.trim(),
            mensagem: form.mensagem.value.trim(),
        };

        if (!dados.nome || !dados.email || !dados.mensagem) {
            status.className = "erro";
            status.textContent = "Preencha nome, e-mail e mensagem antes de enviar.";
            return;
        }

        botao.disabled = true;
        botao.textContent = "Enviando...";

        try {
            const resp = await fetch(`${API_BASE}/contato`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados),
            });

            if (!resp.ok) throw new Error("Falha no envio");

            status.className = "ok";
            status.textContent = "Mensagem enviada com sucesso! Em breve entraremos em contato.";
            form.reset();
        } catch (erro) {
            console.error(erro);
            status.className = "erro";
            status.textContent = "Não foi possível enviar sua mensagem agora. Tente novamente em instantes.";
        } finally {
            botao.disabled = false;
            botao.textContent = "Enviar Mensagem";
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    carregarProjetos("#projetos-destaque", { destaqueSomente: true });
    carregarProjetos("#projetos-lista");
    carregarServicos("#servicos-lista");
    configurarFormularioContato("#form-contato");
});
