/* =========================================================
   INVICTUS IT SUPPORT
   SCRIPT PRINCIPAL
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    console.log("Invictus IT Support carregado!");

    /* =========================================================
       CONFIGURAÇÕES
       ========================================================= */

    const STORAGE_KEY = "invictus_it_support_tickets";

    /* =========================================================
       DADOS INICIAIS
       ========================================================= */

    const defaultTickets = [
        {
            id: "INC-1001",
            requester: "João Silva",
            subject: "Computador não liga",
            user: "João Silva",
            title: "Computador não liga",
            category: "Hardware",
            priority: "Alta",
            status: "Aberto",
            date: "10/09/2026",
            description: "Computador não apresenta sinais de energia."
        },
        {
            id: "INC-1002",
            requester: "Mariana Costa",
            subject: "Problema no acesso à rede",
            user: "Mariana Costa",
            title: "Problema no acesso à rede",
            category: "Redes",
            priority: "Alta",
            status: "Em andamento",
            date: "10/09/2026",
            description: "Usuária não consegue acessar recursos da rede."
        },
        {
            id: "INC-1003",
            requester: "Carlos Mendes",
            subject: "Instalação de software",
            user: "Carlos Mendes",
            title: "Instalação de software",
            category: "Software",
            priority: "Média",
            status: "Resolvido",
            date: "09/09/2026",
            description: "Solicitação de instalação de software."
        },
        {
            id: "INC-1004",
            requester: "Ana Oliveira",
            subject: "Senha bloqueada",
            user: "Ana Oliveira",
            title: "Senha bloqueada",
            category: "Acesso",
            priority: "Baixa",
            status: "Resolvido",
            date: "09/09/2026",
            description: "Usuária solicitou desbloqueio de senha."
        },
        {
            id: "INC-1005",
            requester: "Pedro Santos",
            subject: "Monitor sem imagem",
            user: "Pedro Santos",
            title: "Monitor sem imagem",
            category: "Hardware",
            priority: "Média",
            status: "Aberto",
            date: "08/09/2026",
            description: "Monitor liga, porém não apresenta imagem."
        }
    ];

    /* =========================================================
       FUNÇÕES AUXILIARES
       ========================================================= */

    function getElement(...ids) {
        for (const id of ids) {
            const element = document.getElementById(id);

            if (element) {
                return element;
            }
        }

        return null;
    }

    function normalizeTicket(ticket) {
        return {
            id: ticket.id || "INC-0000",

            requester:
                ticket.requester ||
                ticket.user ||
                ticket.name ||
                "Não informado",

            subject:
                ticket.subject ||
                ticket.title ||
                "Sem assunto",

            user:
                ticket.user ||
                ticket.requester ||
                ticket.name ||
                "Não informado",

            title:
                ticket.title ||
                ticket.subject ||
                "Sem assunto",

            category: ticket.category || "Geral",

            priority: ticket.priority || "Média",

            status: ticket.status || "Aberto",

            date:
                ticket.date ||
                new Date().toLocaleDateString("pt-BR"),

            time: ticket.time || "",

            description: ticket.description || ""
        };
    }

    function loadTickets() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);

            if (!saved) {
                return defaultTickets.map(normalizeTicket);
            }

            const parsed = JSON.parse(saved);

            if (!Array.isArray(parsed)) {
                return defaultTickets.map(normalizeTicket);
            }

            return parsed.map(normalizeTicket);

        } catch (error) {

            console.error("Erro ao carregar chamados:", error);

            return defaultTickets.map(normalizeTicket);
        }
    }

    function saveTickets() {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(tickets)
            );
        } catch (error) {
            console.error("Erro ao salvar chamados:", error);
        }
    }

    function getNextTicketId() {

        let highestNumber = 1000;

        tickets.forEach(ticket => {

            const match = String(ticket.id).match(/(\d+)$/);

            if (match) {

                const number = parseInt(match[1], 10);

                if (number > highestNumber) {
                    highestNumber = number;
                }
            }
        });

        return `INC-${highestNumber + 1}`;
    }

    function getToday() {
        return new Date().toLocaleDateString("pt-BR");
    }

    function escapeHTML(value) {

        if (value === null || value === undefined) {
            return "";
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    /* =========================================================
       TOAST
       ========================================================= */

    function showToast(message, type = "success") {

        let toast = document.getElementById("toast");

        if (!toast) {

            toast = document.createElement("div");

            toast.id = "toast";

            document.body.appendChild(toast);
        }

        toast.textContent = message;

        toast.className = `toast ${type}`;

        toast.classList.add("show");

        setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }

    /* =========================================================
       VARIÁVEIS
       ========================================================= */

    let tickets = loadTickets();

    /* =========================================================
       NAVEGAÇÃO
       ========================================================= */

    const sections = document.querySelectorAll("[data-section]");

    const allSections = document.querySelectorAll(
        ".content-section, section[id]"
    );

    function showSection(sectionName) {

        if (!sectionName) {
            return;
        }

        sections.forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.section === sectionName
            );
        });

        allSections.forEach(section => {

            const id = section.id;

            if (
                id === sectionName ||
                id === `${sectionName}Section`
            ) {
                section.style.display = "block";
            }
            else if (
                [
                    "dashboard",
                    "tickets",
                    "assets",
                    "users",
                    "knowledge",
                    "reports",
                    "settings"
                ].some(name =>
                    id === name ||
                    id === `${name}Section`
                )
            ) {
                section.style.display = "none";
            }
        });
    }

    sections.forEach(button => {

        button.addEventListener("click", () => {

            showSection(button.dataset.section);
        });
    });

    /* =========================================================
       MODAL NOVO CHAMADO
       ========================================================= */

    const ticketModal = getElement(
        "ticketModal"
    );

    const ticketForm = getElement(
        "ticketForm"
    );

    const closeModal = getElement(
        "closeModal"
    );

    const cancelModal = getElement(
        "cancelModal"
    );

    function openTicketModal() {

        if (!ticketModal) {

            console.error(
                "ERRO: #ticketModal não encontrado."
            );

            showToast(
                "Não foi possível abrir o formulário.",
                "error"
            );

            return;
        }

        ticketModal.classList.add("open");

        ticketModal.style.display = "flex";

        document.body.classList.add("modal-open");

        const firstInput =
            ticketModal.querySelector(
                "input, select, textarea"
            );

        if (firstInput) {

            setTimeout(() => {
                firstInput.focus();
            }, 100);
        }
    }

    function closeTicketModal() {

        if (!ticketModal) {
            return;
        }

        ticketModal.classList.remove("open");

        ticketModal.style.display = "";

        document.body.classList.remove("modal-open");
    }

    /* =========================================================
       BOTÕES NOVO CHAMADO
       ========================================================= */

    /*
       Aqui está uma das correções principais.

       Aceitamos os IDs que já foram utilizados
       durante a construção do projeto.
    */

    const newTicketButtons = [
        "newTicketBtn",
        "newTicketBtn2",
        "newTicketButton",
        "newTicketButtonTickets"
    ];

    newTicketButtons.forEach(id => {

        const button = document.getElementById(id);

        if (!button) {
            return;
        }

        button.addEventListener("click", event => {

            event.preventDefault();

            openTicketModal();
        });
    });

    /*
       Fallback por texto/classe.

       Se o botão estiver com outro ID, ainda conseguimos
       reconhecer o botão pelo texto "Novo chamado".
    */

    document.addEventListener("click", event => {

        const button =
            event.target.closest(
                "button, a"
            );

        if (!button) {
            return;
        }

        const text =
            button.textContent
                .trim()
                .toLowerCase();

        if (
            text.includes("novo chamado") &&
            !button.closest("#ticketModal")
        ) {

            event.preventDefault();

            openTicketModal();
        }
    });

    /* =========================================================
       FECHAR MODAL
       ========================================================= */

    if (closeModal) {

        closeModal.addEventListener(
            "click",
            event => {

                event.preventDefault();

                closeTicketModal();
            }
        );
    }

    if (cancelModal) {

        cancelModal.addEventListener(
            "click",
            event => {

                event.preventDefault();

                closeTicketModal();
            }
        );
    }

    if (ticketModal) {

        ticketModal.addEventListener(
            "click",
            event => {

                if (
                    event.target === ticketModal
                ) {
                    closeTicketModal();
                }
            }
        );
    }

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                ticketModal &&
                ticketModal.classList.contains("open")
            ) {

                closeTicketModal();
            }
        }
    );

    /* =========================================================
       CAMPOS DO FORMULÁRIO
       ========================================================= */

    function findFormField(...names) {

        if (!ticketForm) {
            return null;
        }

        for (const name of names) {

            const byId =
                ticketForm.querySelector(`#${name}`);

            if (byId) {
                return byId;
            }

            const byName =
                ticketForm.querySelector(
                    `[name="${name}"]`
                );

            if (byName) {
                return byName;
            }
        }

        return null;
    }

    function getFieldValue(...names) {

        const field =
            findFormField(...names);

        if (!field) {
            return "";
        }

        return String(field.value || "").trim();
    }

    /* =========================================================
       CRIAR NOVO CHAMADO
       ========================================================= */

    function createNewTicket() {

        const requester =
            getFieldValue(
                "requester",
                "user",
                "name",
                "requesterName"
            );

        const subject =
            getFieldValue(
                "subject",
                "title",
                "ticketSubject"
            );

        const category =
            getFieldValue(
                "category",
                "ticketCategory"
            );

        const priority =
            getFieldValue(
                "priority",
                "ticketPriority"
            );

        const description =
            getFieldValue(
                "description",
                "ticketDescription",
                "details",
                "message"
            );

        /* ==========================================
           VALIDAÇÃO
           ========================================== */

        if (!requester) {

            showToast(
                "Informe o solicitante.",
                "error"
            );

            const field =
                findFormField(
                    "requester",
                    "user",
                    "name",
                    "requesterName"
                );

            if (field) {
                field.focus();
            }

            return false;
        }

        if (!subject) {

            showToast(
                "Informe o assunto do chamado.",
                "error"
            );

            const field =
                findFormField(
                    "subject",
                    "title",
                    "ticketSubject"
                );

            if (field) {
                field.focus();
            }

            return false;
        }

        if (!category) {

            showToast(
                "Selecione uma categoria.",
                "error"
            );

            return false;
        }

        if (!priority) {

            showToast(
                "Selecione a prioridade.",
                "error"
            );

            return false;
        }

        if (!description) {

            showToast(
                "Descreva o problema ou solicitação.",
                "error"
            );

            const field =
                findFormField(
                    "description",
                    "ticketDescription",
                    "details",
                    "message"
                );

            if (field) {
                field.focus();
            }

            return false;
        }

        /* ==========================================
           NOVO CHAMADO
           ========================================== */

        const newTicket = normalizeTicket({

            id: getNextTicketId(),

            requester: requester,

            subject: subject,

            user: requester,

            title: subject,

            category: category,

            priority: priority,

            status: "Aberto",

            date: getToday(),

            time: new Date().toLocaleTimeString(
                "pt-BR",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            ),

            description: description
        });

        /* ==========================================
           ADICIONA NA LISTA
           ========================================== */

        tickets.unshift(newTicket);

        /* ==========================================
           SALVA
           ========================================== */

        saveTickets();

        /* ==========================================
           ATUALIZA TUDO
           ========================================== */

        renderDashboard();

        renderTickets();

        updateTicketCounters();

        updateNavTicketCount();

        /* ==========================================
           LIMPA FORMULÁRIO
           ========================================== */

        if (ticketForm) {
            ticketForm.reset();
        }

        /* ==========================================
           FECHA MODAL
           ========================================== */

        closeTicketModal();

        /* ==========================================
           CONFIRMAÇÃO
           ========================================== */

        showToast(
            `Chamado ${newTicket.id} criado com sucesso!`
        );

        return true;
    }

    /* =========================================================
       SUBMIT DO FORMULÁRIO
       ========================================================= */

    if (ticketForm) {

        ticketForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                createNewTicket();
            }
        );
    }

    /* =========================================================
       DASHBOARD
       ========================================================= */

    function renderDashboard() {

        const total =
            getElement("totalTickets");

        const open =
            getElement("openTickets");

        const active =
            getElement("activeTickets");

        const resolved =
            getElement("resolvedTickets");

        const high =
            getElement("highPriorityCount");

        const totalValue =
            tickets.length;

        const openValue =
            tickets.filter(
                ticket =>
                    ticket.status === "Aberto"
            ).length;

        const activeValue =
            tickets.filter(
                ticket =>
                    ticket.status === "Em andamento"
            ).length;

        const resolvedValue =
            tickets.filter(
                ticket =>
                    ticket.status === "Resolvido"
            ).length;

        const highValue =
            tickets.filter(
                ticket =>
                    ticket.priority === "Alta"
            ).length;

        if (total) {
            total.textContent = totalValue;
        }

        if (open) {
            open.textContent = openValue;
        }

        if (active) {
            active.textContent = activeValue;
        }

        if (resolved) {
            resolved.textContent = resolvedValue;
        }

        if (high) {
            high.textContent = highValue;
        }

        renderRecentTickets();
    }

    /* =========================================================
       CHAMADOS RECENTES
       ========================================================= */

    function renderRecentTickets() {

        const table =
            getElement("recentTickets");

        if (!table) {
            return;
        }

        const recent =
            tickets.slice(0, 5);

        table.innerHTML = "";

        recent.forEach(ticket => {

            const row =
                document.createElement("tr");

            row.innerHTML = `
                <td>
                    <strong>${escapeHTML(ticket.id)}</strong>
                </td>

                <td>
                    ${escapeHTML(ticket.requester)}
                </td>

                <td>
                    ${escapeHTML(ticket.subject)}
                </td>

                <td>
                    ${escapeHTML(ticket.priority)}
                </td>

                <td>
                    ${escapeHTML(ticket.status)}
                </td>

                <td>
                    ${escapeHTML(ticket.date)}
                </td>
            `;

            table.appendChild(row);
        });
    }

    /* =========================================================
       TABELA DE CHAMADOS
       ========================================================= */

    function renderTickets() {

        const table =
            getElement("allTickets");

        if (!table) {
            return;
        }

        const searchInput =
            getElement("ticketFilter");

        const statusFilter =
            getElement("statusFilter");

        const priorityFilter =
            getElement("priorityFilter");

        const search =
            searchInput
                ? searchInput.value
                    .trim()
                    .toLowerCase()
                : "";

        const status =
            statusFilter
                ? statusFilter.value
                : "";

        const priority =
            priorityFilter
                ? priorityFilter.value
                : "";

        const filtered =
            tickets.filter(ticket => {

                const matchesSearch =
                    !search ||
                    ticket.id
                        .toLowerCase()
                        .includes(search) ||
                    ticket.requester
                        .toLowerCase()
                        .includes(search) ||
                    ticket.subject
                        .toLowerCase()
                        .includes(search);

                const matchesStatus =
                    !status ||
                    status === "Todos" ||
                    ticket.status === status;

                const matchesPriority =
                    !priority ||
                    priority === "Todas" ||
                    ticket.priority === priority;

                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesPriority
                );
            });

        table.innerHTML = "";

        if (filtered.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="100%">
                        Nenhum chamado encontrado.
                    </td>
                </tr>
            `;

            return;
        }

        filtered.forEach(ticket => {

            const row =
                document.createElement("tr");

            row.innerHTML = `
                <td>
                    <strong>${escapeHTML(ticket.id)}</strong>
                </td>

                <td>
                    ${escapeHTML(ticket.requester)}
                </td>

                <td>
                    ${escapeHTML(ticket.subject)}
                </td>

                <td>
                    ${escapeHTML(ticket.category)}
                </td>

                <td>
                    ${escapeHTML(ticket.priority)}
                </td>

                <td>
                    ${escapeHTML(ticket.status)}
                </td>

                <td>
                    ${escapeHTML(ticket.date)}
                </td>

                <td>
                    <button
                        class="action-btn"
                        type="button"
                        data-ticket-id="${escapeHTML(ticket.id)}"
                    >
                        Ver
                    </button>
                </td>
            `;

            table.appendChild(row);
        });
    }

    /* =========================================================
       CONTADORES
       ========================================================= */

    function updateTicketCounters() {

        const total =
            getElement("totalTickets");

        const open =
            getElement("openTickets");

        const active =
            getElement("activeTickets");

        const resolved =
            getElement("resolvedTickets");

        const high =
            getElement("highPriorityCount");

        if (total) {
            total.textContent = tickets.length;
        }

        if (open) {
            open.textContent =
                tickets.filter(
                    t => t.status === "Aberto"
                ).length;
        }

        if (active) {
            active.textContent =
                tickets.filter(
                    t => t.status === "Em andamento"
                ).length;
        }

        if (resolved) {
            resolved.textContent =
                tickets.filter(
                    t => t.status === "Resolvido"
                ).length;
        }

        if (high) {
            high.textContent =
                tickets.filter(
                    t => t.priority === "Alta"
                ).length;
        }
    }

    function updateNavTicketCount() {

        const counter =
            getElement("navTicketCount");

        if (counter) {
            counter.textContent = tickets.length;
        }
    }

    /* =========================================================
       FILTROS DE CHAMADOS
       ========================================================= */

    [
        "ticketFilter",
        "statusFilter",
        "priorityFilter"
    ].forEach(id => {

        const element =
            document.getElementById(id);

        if (!element) {
            return;
        }

        element.addEventListener(
            "input",
            renderTickets
        );

        element.addEventListener(
            "change",
            renderTickets
        );
    });

    /* =========================================================
       ATIVOS DE TI
       ========================================================= */

    const assets = [
        {
            id: "PAT-001",
            name: "Notebook Dell Latitude 5420",
            model: "Latitude 5420",
            type: "Notebook",
            user: "João Silva",
            location: "São Paulo",
            status: "Em uso"
        },
        {
            id: "PAT-002",
            name: "Notebook Lenovo ThinkPad E14",
            model: "ThinkPad E14",
            type: "Notebook",
            user: "Mariana Costa",
            location: "São Paulo",
            status: "Em uso"
        },
        {
            id: "PAT-003",
            name: "Desktop Dell OptiPlex 7090",
            model: "OptiPlex 7090",
            type: "Desktop",
            user: "Pedro Santos",
            location: "São Paulo",
            status: "Em uso"
        },
        {
            id: "PAT-004",
            name: "Monitor Dell P2422H",
            model: "P2422H",
            type: "Monitor",
            user: "Ana Oliveira",
            location: "São Paulo",
            status: "Em uso"
        },
        {
            id: "PAT-005",
            name: "Notebook HP ProBook 440 G8",
            model: "ProBook 440 G8",
            type: "Notebook",
            user: "Lucas Almeida",
            location: "São Paulo",
            status: "Em uso"
        },
        {
            id: "PAT-006",
            name: "Impressora HP LaserJet Pro",
            model: "LaserJet Pro",
            type: "Impressora",
            user: "—",
            location: "Recepção",
            status: "Em uso"
        },
        {
            id: "PAT-007",
            name: "Switch Cisco CBS350",
            model: "CBS350",
            type: "Switch",
            user: "—",
            location: "CPD",
            status: "Disponível"
        },
        {
            id: "PAT-008",
            name: "Servidor Dell PowerEdge R740",
            model: "PowerEdge R740",
            type: "Servidor",
            user: "—",
            location: "CPD",
            status: "Manutenção"
        }
    ];

    function renderAssets() {

        const table =
            getElement("assetsTable");

        if (!table) {
            return;
        }

        const search =
            (
                getElement("assetFilter")
                    ?.value || ""
            )
                .toLowerCase()
                .trim();

        const type =
            getElement("assetTypeFilter")
                ?.value || "";

        const status =
            getElement("assetStatusFilter")
                ?.value || "";

        const filtered =
            assets.filter(asset => {

                const text =
                    `
                    ${asset.id}
                    ${asset.name}
                    ${asset.model}
                    ${asset.user}
                    ${asset.location}
                    `
                        .toLowerCase();

                return (
                    (!search ||
                        text.includes(search)) &&
                    (!type ||
                        type === "Todos" ||
                        asset.type === type) &&
                    (!status ||
                        status === "Todos" ||
                        asset.status === status)
                );
            });

        table.innerHTML = "";

        filtered.forEach(asset => {

            const row =
                document.createElement("tr");

            row.innerHTML = `
                <td>${escapeHTML(asset.id)}</td>
                <td>${escapeHTML(asset.name)}</td>
                <td>${escapeHTML(asset.model)}</td>
                <td>${escapeHTML(asset.user)}</td>
                <td>${escapeHTML(asset.location)}</td>
                <td>${escapeHTML(asset.status)}</td>
                <td>
                    <button
                        class="action-btn"
                        type="button"
                    >
                        Ver
                    </button>
                </td>
            `;

            table.appendChild(row);
        });
    }

    [
        "assetFilter",
        "assetTypeFilter",
        "assetStatusFilter"
    ].forEach(id => {

        const element =
            document.getElementById(id);

        if (!element) {
            return;
        }

        element.addEventListener(
            "input",
            renderAssets
        );

        element.addEventListener(
            "change",
            renderAssets
        );
    });

    /* =========================================================
       USUÁRIOS
       ========================================================= */

    const users = [
        {
            name: "João Silva",
            email: "joao.silva@empresa.com",
            department: "Tecnologia",
            role: "Técnico",
            status: "Ativo",
            access: "Hoje 14:52"
        },
        {
            name: "Mariana Costa",
            email: "mariana.costa@empresa.com",
            department: "Financeiro",
            role: "Usuário",
            status: "Ativo",
            access: "Hoje 13:28"
        },
        {
            name: "Carlos Mendes",
            email: "carlos.mendes@empresa.com",
            department: "Tecnologia",
            role: "Administrador",
            status: "Ativo",
            access: "Hoje 12:15"
        },
        {
            name: "Ana Oliveira",
            email: "ana.oliveira@empresa.com",
            department: "Recursos Humanos",
            role: "Usuário",
            status: "Ativo",
            access: "Ontem 17:40"
        }
    ];

    function renderUsers() {

        const table =
            getElement("usersTable");

        if (!table) {
            return;
        }

        const search =
            (
                getElement("userFilter")
                    ?.value || ""
            )
                .toLowerCase()
                .trim();

        const role =
            getElement("userRoleFilter")
                ?.value || "";

        const status =
            getElement("userStatusFilter")
                ?.value || "";

        const filtered =
            users.filter(user => {

                const text =
                    `
                    ${user.name}
                    ${user.email}
                    ${user.department}
                    ${user.role}
                    `
                        .toLowerCase();

                return (
                    (!search ||
                        text.includes(search)) &&
                    (!role ||
                        role === "Todos" ||
                        user.role === role) &&
                    (!status ||
                        status === "Todos" ||
                        user.status === status)
                );
            });

        table.innerHTML = "";

        filtered.forEach(user => {

            const row =
                document.createElement("tr");

            row.innerHTML = `
                <td>${escapeHTML(user.name)}</td>
                <td>${escapeHTML(user.email)}</td>
                <td>${escapeHTML(user.department)}</td>
                <td>${escapeHTML(user.role)}</td>
                <td>${escapeHTML(user.status)}</td>
                <td>${escapeHTML(user.access)}</td>
                <td>
                    <button
                        class="action-btn"
                        type="button"
                    >
                        Ver
                    </button>
                </td>
            `;

            table.appendChild(row);
        });
    }

    [
        "userFilter",
        "userRoleFilter",
        "userStatusFilter"
    ].forEach(id => {

        const element =
            document.getElementById(id);

        if (!element) {
            return;
        }

        element.addEventListener(
            "input",
            renderUsers
        );

        element.addEventListener(
            "change",
            renderUsers
        );
    });

    /* =========================================================
       BASE DE CONHECIMENTO
       ========================================================= */

    const articles = [
        {
            title:
                "Como diagnosticar um notebook que não liga",
            category: "Hardware",
            description:
                "Procedimento básico para identificar falhas de energia e hardware.",
            steps: [
                "Verifique a fonte de alimentação.",
                "Teste o carregador e o cabo de energia.",
                "Verifique indicadores de energia.",
                "Teste a memória RAM.",
                "Verifique bateria e conexões internas."
            ]
        },
        {
            title:
                "Configuração básica de rede TCP/IP",
            category: "Redes",
            description:
                "Procedimento para verificar e configurar parâmetros básicos de rede.",
            steps: [
                "Verifique o endereço IP.",
                "Confirme a máscara de rede.",
                "Verifique o gateway padrão.",
                "Teste o DNS.",
                "Execute um ping para validar conectividade."
            ]
        },
        {
            title:
                "Procedimento para desbloqueio de usuário",
            category: "Segurança",
            description:
                "Procedimento básico para desbloqueio de contas.",
            steps: [
                "Identifique o usuário.",
                "Confirme a solicitação.",
                "Verifique o status da conta.",
                "Realize o desbloqueio.",
                "Solicite novo acesso ao usuário."
            ]
        },
        {
            title:
                "Solução para problemas do Windows Update",
            category: "Windows",
            description:
                "Procedimento para problemas comuns do Windows Update.",
            steps: [
                "Verifique a conexão com a internet.",
                "Reinicie o serviço Windows Update.",
                "Execute a solução de problemas.",
                "Limpe o cache do Windows Update.",
                "Tente executar a atualização novamente."
            ]
        }
    ];

    function renderKnowledge() {

        const list =
            getElement("knowledgeList");

        if (!list) {
            return;
        }

        const search =
            (
                getElement("knowledgeFilter")
                    ?.value || ""
            )
                .toLowerCase()
                .trim();

        const category =
            getElement(
                "knowledgeCategoryFilter"
            )?.value || "";

        const filtered =
            articles.filter(article => {

                const text =
                    `
                    ${article.title}
                    ${article.category}
                    ${article.description}
                    `
                        .toLowerCase();

                return (
                    (!search ||
                        text.includes(search)) &&
                    (!category ||
                        category === "Todas" ||
                        article.category === category)
                );
            });

        list.innerHTML = "";

        filtered.forEach((article, index) => {

            const item =
                document.createElement("div");

            item.className =
                "knowledge-item";

            item.innerHTML = `
                <div>
                    <span class="knowledge-category">
                        ${escapeHTML(article.category)}
                    </span>

                    <h3>
                        ${escapeHTML(article.title)}
                    </h3>

                    <p>
                        ${escapeHTML(article.description)}
                    </p>
                </div>

                <button
                    type="button"
                    class="article-read-button"
                    data-article-index="${index}"
                >
                    Ler artigo
                </button>
            `;

            list.appendChild(item);
        });
    }

    [
        "knowledgeFilter",
        "knowledgeCategoryFilter"
    ].forEach(id => {

        const element =
            document.getElementById(id);

        if (!element) {
            return;
        }

        element.addEventListener(
            "input",
            renderKnowledge
        );

        element.addEventListener(
            "change",
            renderKnowledge
        );
    });

    /* =========================================================
       MODAL DE ARTIGO
       ========================================================= */

    function openArticle(article) {

        let modal =
            document.getElementById(
                "articleModalCustom"
            );

        if (!modal) {

            modal =
                document.createElement("div");

            modal.id =
                "articleModalCustom";

            modal.innerHTML = `
                <div class="article-modal-box">

                    <button
                        type="button"
                        class="article-modal-close"
                    >
                        ×
                    </button>

                    <span
                        class="article-modal-category"
                    ></span>

                    <h2
                        class="article-modal-title"
                    ></h2>

                    <p
                        class="article-modal-description"
                    ></p>

                    <h3>
                        Passo a passo
                    </h3>

                    <ol
                        class="article-modal-steps"
                    ></ol>

                </div>
            `;

            document.body.appendChild(modal);

            const style =
                document.createElement("style");

            style.textContent = `
                #articleModalCustom {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,.65);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    z-index: 9999;
                }

                .article-modal-box {
                    position: relative;
                    width: min(650px, 100%);
                    max-height: 85vh;
                    overflow-y: auto;
                    background: #ffffff;
                    border-radius: 14px;
                    padding: 30px;
                    box-shadow: 0 20px 60px rgba(0,0,0,.3);
                }

                .article-modal-close {
                    position: absolute;
                    right: 18px;
                    top: 14px;
                    border: none;
                    background: transparent;
                    font-size: 28px;
                    cursor: pointer;
                }

                .article-modal-category {
                    font-size: 13px;
                    font-weight: 700;
                    text-transform: uppercase;
                }

                .article-modal-title {
                    margin: 10px 0;
                }

                .article-modal-description {
                    line-height: 1.6;
                }

                .article-modal-steps {
                    line-height: 1.8;
                    padding-left: 22px;
                }

                .article-read-button {
                    border: none;
                    cursor: pointer;
                    padding: 9px 14px;
                    border-radius: 7px;
                    font-weight: 600;
                    background: #2563eb;
                    color: #ffffff;
                }
            `;

            document.head.appendChild(style);

            modal
                .querySelector(
                    ".article-modal-close"
                )
                .addEventListener(
                    "click",
                    () => {
                        modal.remove();
                    }
                );

            modal.addEventListener(
                "click",
                event => {

                    if (event.target === modal) {
                        modal.remove();
                    }
                }
            );
        }

        modal.querySelector(
            ".article-modal-category"
        ).textContent =
            article.category;

        modal.querySelector(
            ".article-modal-title"
        ).textContent =
            article.title;

        modal.querySelector(
            ".article-modal-description"
        ).textContent =
            article.description;

        const steps =
            modal.querySelector(
                ".article-modal-steps"
            );

        steps.innerHTML = "";

        article.steps.forEach(step => {

            const li =
                document.createElement("li");

            li.textContent = step;

            steps.appendChild(li);
        });
    }

    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    ".article-read-button"
                );

            if (!button) {
                return;
            }

            const index =
                parseInt(
                    button.dataset.articleIndex,
                    10
                );

            if (
                !Number.isNaN(index) &&
                articles[index]
            ) {

                openArticle(
                    articles[index]
                );
            }
        }
    );

    /* =========================================================
       RELATÓRIOS
       ========================================================= */

    function updateReports() {

        const total =
            tickets.length;

        const resolved =
            tickets.filter(
                t =>
                    t.status === "Resolvido"
            ).length;

        const rate =
            total > 0
                ? Math.round(
                    (resolved / total) * 100
                )
                : 0;

        const reportRate =
            getElement(
                "resolutionRate"
            );

        if (reportRate) {
            reportRate.textContent =
                `${rate}%`;
        }
    }

    const exportReportBtn =
        getElement(
            "exportReportBtn"
        );

    if (exportReportBtn) {

        exportReportBtn.addEventListener(
            "click",
            () => {

                const data = {
                    generatedAt:
                        new Date().toLocaleString(
                            "pt-BR"
                        ),

                    totalTickets:
                        tickets.length,

                    openTickets:
                        tickets.filter(
                            t =>
                                t.status === "Aberto"
                        ).length,

                    activeTickets:
                        tickets.filter(
                            t =>
                                t.status ===
                                "Em andamento"
                        ).length,

                    resolvedTickets:
                        tickets.filter(
                            t =>
                                t.status ===
                                "Resolvido"
                        ).length,

                    tickets
                };

                const blob =
                    new Blob(
                        [
                            JSON.stringify(
                                data,
                                null,
                                2
                            )
                        ],
                        {
                            type:
                                "application/json"
                        }
                    );

                const url =
                    URL.createObjectURL(blob);

                const link =
                    document.createElement("a");

                link.href = url;

                link.download =
                    "relatorio-invictus-it-support.json";

                link.click();

                URL.revokeObjectURL(url);

                showToast(
                    "Relatório exportado com sucesso!"
                );
            }
        );
    }

    /* =========================================================
       CONFIGURAÇÕES
       ========================================================= */

    const saveProfileBtn =
        getElement(
            "saveProfileBtn"
        );

    if (saveProfileBtn) {

        saveProfileBtn.addEventListener(
            "click",
            () => {

                showToast(
                    "Perfil salvo com sucesso!"
                );
            }
        );
    }

    /* =========================================================
       BOTÕES DE PRÓXIMA ETAPA
       ========================================================= */

    const newAssetBtn =
        getElement(
            "newAssetBtn"
        );

    if (newAssetBtn) {

        newAssetBtn.addEventListener(
            "click",
            () => {

                showToast(
                    "Cadastro de ativo será implementado na próxima etapa."
                );
            }
        );
    }

    const newUserBtn =
        getElement(
            "newUserBtn"
        );

    if (newUserBtn) {

        newUserBtn.addEventListener(
            "click",
            () => {

                showToast(
                    "Cadastro de usuário será implementado na próxima etapa."
                );
            }
        );
    }

    const newArticleBtn =
        getElement(
            "newArticleBtn"
        );

    if (newArticleBtn) {

        newArticleBtn.addEventListener(
            "click",
            () => {

                showToast(
                    "Criação de artigo será implementada na próxima etapa."
                );
            }
        );
    }

    /* =========================================================
       PESQUISA GLOBAL
       ========================================================= */

    const globalSearch =
        getElement(
            "globalSearch"
        );

    if (globalSearch) {

        globalSearch.addEventListener(
            "input",
            () => {

                const query =
                    globalSearch.value
                        .trim()
                        .toLowerCase();

                if (!query) {
                    return;
                }

                const matches =
                    tickets.filter(ticket =>
                        ticket.id
                            .toLowerCase()
                            .includes(query) ||
                        ticket.requester
                            .toLowerCase()
                            .includes(query) ||
                        ticket.subject
                            .toLowerCase()
                            .includes(query)
                    );

                console.log(
                    "Pesquisa global:",
                    matches
                );
            }
        );
    }

    /* =========================================================
       MENU MOBILE
       ========================================================= */

    const mobileMenu =
        getElement(
            "mobileMenu"
        );

    if (mobileMenu) {

        mobileMenu.addEventListener(
            "click",
            () => {

                const sidebar =
                    document.querySelector(
                        ".sidebar"
                    );

                if (sidebar) {
                    sidebar.classList.toggle(
                        "open"
                    );
                }
            }
        );
    }

    /* =========================================================
       CLIQUE "VER" CHAMADO
       ========================================================= */

    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-ticket-id]"
                );

            if (!button) {
                return;
            }

            const id =
                button.dataset.ticketId;

            const ticket =
                tickets.find(
                    item =>
                        item.id === id
                );

            if (!ticket) {
                return;
            }

            showTicketDetails(ticket);
        }
    );

    function showTicketDetails(ticket) {

        let message =
            `Chamado: ${ticket.id}\n\n` +
            `Solicitante: ${ticket.requester}\n` +
            `Assunto: ${ticket.subject}\n` +
            `Categoria: ${ticket.category}\n` +
            `Prioridade: ${ticket.priority}\n` +
            `Status: ${ticket.status}\n` +
            `Data: ${ticket.date}\n\n` +
            `Descrição:\n${ticket.description}`;

        alert(message);
    }

    /* =========================================================
       INICIALIZAÇÃO
       ========================================================= */

    renderDashboard();

    renderTickets();

    renderAssets();

    renderUsers();

    renderKnowledge();

    updateTicketCounters();

    updateNavTicketCount();

    updateReports();

    /*
       Garante que a página inicial seja o Dashboard.
    */

    showSection("dashboard");

    console.log(
        "Sistema inicializado com sucesso."
    );

});