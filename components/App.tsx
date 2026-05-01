"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Auth from "./Auth";

const FONT = "https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&display=swap";

const translations: Record<string, any> = {
  pl: {
    dashboard: "Pulpit", clients: "Klienci", projects: "Projekty", invoices: "Faktury", offerGenerator: "Generator ofert",
    logout: "Wyloguj", darkMode: "Ciemny tryb", lightMode: "Jasny tryb",
    activeProjects: "Aktywne projekty", recentProjects: "Ostatnie projekty", recentInvoices: "Ostatnie faktury",
    noProjects: "Brak projektów", noInvoices: "Brak faktur", noClients: "Brak klientów",
    addClient: "+ Dodaj klienta", newProject: "+ Nowy projekt", newInvoice: "+ Nowa faktura",
    cancel: "Anuluj", save: "Zapisz", delete: "Usuń",
    name: "Nazwa", email: "Email", phone: "Telefon", notes: "Notatki", added: "Dodano",
    projectName: "Nazwa projektu", client: "Klient", deadline: "Deadline", budget: "Budżet", description: "Opis",
    status: "Status", inProgress: "w toku", paused: "wstrzymany", finished: "zakończony",
    invoiceNumber: "Numer", amount: "Kwota", paymentDeadline: "Termin płatności", serviceDesc: "Opis usługi",
    draft: "szkic", sent: "wysłana", paid: "opłacona",
    generateOffer: "Generuj ofertę →", generating: "Generuję...", result: "Wynik", copy: "Kopiuj", copied: "Skopiowano",
    yourCompany: "Twoja firma / imię", clientField: "Klient", projectDesc: "Opis projektu *", time: "Czas realizacji",
    connectionError: "Błąd połączenia.", enterDesc: "Wpisz opis projektu!",
    offerPlaceholder: "Tutaj pojawi się oferta...", choose: "— wybierz —", overdue: "⚠ deadline:",
    loading: "Ładowanie...",
  },
  en: {
    dashboard: "Dashboard", clients: "Clients", projects: "Projects", invoices: "Invoices", offerGenerator: "Offer Generator",
    logout: "Logout", darkMode: "Dark mode", lightMode: "Light mode",
    activeProjects: "Active projects", recentProjects: "Recent projects", recentInvoices: "Recent invoices",
    noProjects: "No projects", noInvoices: "No invoices", noClients: "No clients",
    addClient: "+ Add client", newProject: "+ New project", newInvoice: "+ New invoice",
    cancel: "Cancel", save: "Save", delete: "Delete",
    name: "Name", email: "Email", phone: "Phone", notes: "Notes", added: "Added",
    projectName: "Project name", client: "Client", deadline: "Deadline", budget: "Budget", description: "Description",
    status: "Status", inProgress: "in progress", paused: "paused", finished: "finished",
    invoiceNumber: "Number", amount: "Amount", paymentDeadline: "Payment deadline", serviceDesc: "Service description",
    draft: "draft", sent: "sent", paid: "paid",
    generateOffer: "Generate offer →", generating: "Generating...", result: "Result", copy: "Copy", copied: "Copied",
    yourCompany: "Your company / name", clientField: "Client", projectDesc: "Project description *", time: "Timeline",
    connectionError: "Connection error.", enterDesc: "Enter project description!",
    offerPlaceholder: "Your offer will appear here...", choose: "— choose —", overdue: "⚠ deadline:",
    loading: "Loading...",
  },
  de: {
    dashboard: "Übersicht", clients: "Kunden", projects: "Projekte", invoices: "Rechnungen", offerGenerator: "Angebotsgenerator",
    logout: "Abmelden", darkMode: "Dunkler Modus", lightMode: "Heller Modus",
    activeProjects: "Aktive Projekte", recentProjects: "Letzte Projekte", recentInvoices: "Letzte Rechnungen",
    noProjects: "Keine Projekte", noInvoices: "Keine Rechnungen", noClients: "Keine Kunden",
    addClient: "+ Kunde hinzufügen", newProject: "+ Neues Projekt", newInvoice: "+ Neue Rechnung",
    cancel: "Abbrechen", save: "Speichern", delete: "Löschen",
    name: "Name", email: "E-Mail", phone: "Telefon", notes: "Notizen", added: "Hinzugefügt",
    projectName: "Projektname", client: "Kunde", deadline: "Frist", budget: "Budget", description: "Beschreibung",
    status: "Status", inProgress: "in Arbeit", paused: "pausiert", finished: "abgeschlossen",
    invoiceNumber: "Nummer", amount: "Betrag", paymentDeadline: "Zahlungsfrist", serviceDesc: "Leistungsbeschreibung",
    draft: "Entwurf", sent: "Gesendet", paid: "Bezahlt",
    generateOffer: "Angebot erstellen →", generating: "Erstelle...", result: "Ergebnis", copy: "Kopieren", copied: "Kopiert",
    yourCompany: "Ihre Firma / Name", clientField: "Kunde", projectDesc: "Projektbeschreibung *", time: "Zeitplan",
    connectionError: "Verbindungsfehler.", enterDesc: "Projektbeschreibung eingeben!",
    offerPlaceholder: "Ihr Angebot erscheint hier...", choose: "— wählen —", overdue: "⚠ Frist:",
    loading: "Laden...",
  },
  fr: {
    dashboard: "Tableau de bord", clients: "Clients", projects: "Projets", invoices: "Factures", offerGenerator: "Générateur d'offres",
    logout: "Déconnexion", darkMode: "Mode sombre", lightMode: "Mode clair",
    activeProjects: "Projets actifs", recentProjects: "Projets récents", recentInvoices: "Factures récentes",
    noProjects: "Aucun projet", noInvoices: "Aucune facture", noClients: "Aucun client",
    addClient: "+ Ajouter client", newProject: "+ Nouveau projet", newInvoice: "+ Nouvelle facture",
    cancel: "Annuler", save: "Enregistrer", delete: "Supprimer",
    name: "Nom", email: "Email", phone: "Téléphone", notes: "Notes", added: "Ajouté",
    projectName: "Nom du projet", client: "Client", deadline: "Échéance", budget: "Budget", description: "Description",
    status: "Statut", inProgress: "en cours", paused: "pausé", finished: "terminé",
    invoiceNumber: "Numéro", amount: "Montant", paymentDeadline: "Date de paiement", serviceDesc: "Description du service",
    draft: "brouillon", sent: "envoyée", paid: "payée",
    generateOffer: "Générer l'offre →", generating: "Génération...", result: "Résultat", copy: "Copier", copied: "Copié",
    yourCompany: "Votre entreprise / nom", clientField: "Client", projectDesc: "Description du projet *", time: "Délai",
    connectionError: "Erreur de connexion.", enterDesc: "Entrez la description du projet!",
    offerPlaceholder: "Votre offre apparaîtra ici...", choose: "— choisir —", overdue: "⚠ échéance:",
    loading: "Chargement...",
  },
  es: {
    dashboard: "Panel", clients: "Clientes", projects: "Proyectos", invoices: "Facturas", offerGenerator: "Generador de ofertas",
    logout: "Cerrar sesión", darkMode: "Modo oscuro", lightMode: "Modo claro",
    activeProjects: "Proyectos activos", recentProjects: "Proyectos recientes", recentInvoices: "Facturas recientes",
    noProjects: "Sin proyectos", noInvoices: "Sin facturas", noClients: "Sin clientes",
    addClient: "+ Añadir cliente", newProject: "+ Nuevo proyecto", newInvoice: "+ Nueva factura",
    cancel: "Cancelar", save: "Guardar", delete: "Eliminar",
    name: "Nombre", email: "Email", phone: "Teléfono", notes: "Notas", added: "Añadido",
    projectName: "Nombre del proyecto", client: "Cliente", deadline: "Fecha límite", budget: "Presupuesto", description: "Descripción",
    status: "Estado", inProgress: "en curso", paused: "pausado", finished: "terminado",
    invoiceNumber: "Número", amount: "Importe", paymentDeadline: "Fecha de pago", serviceDesc: "Descripción del servicio",
    draft: "borrador", sent: "enviada", paid: "pagada",
    generateOffer: "Generar oferta →", generating: "Generando...", result: "Resultado", copy: "Copiar", copied: "Copiado",
    yourCompany: "Su empresa / nombre", clientField: "Cliente", projectDesc: "Descripción del proyecto *", time: "Plazo",
    connectionError: "Error de conexión.", enterDesc: "¡Ingrese la descripción del proyecto!",
    offerPlaceholder: "Su oferta aparecerá aquí...", choose: "— elegir —", overdue: "⚠ fecha límite:",
    loading: "Cargando...",
  },
  pt: {
    dashboard: "Painel", clients: "Clientes", projects: "Projetos", invoices: "Faturas", offerGenerator: "Gerador de ofertas",
    logout: "Sair", darkMode: "Modo escuro", lightMode: "Modo claro",
    activeProjects: "Projetos ativos", recentProjects: "Projetos recentes", recentInvoices: "Faturas recentes",
    noProjects: "Sem projetos", noInvoices: "Sem faturas", noClients: "Sem clientes",
    addClient: "+ Adicionar cliente", newProject: "+ Novo projeto", newInvoice: "+ Nova fatura",
    cancel: "Cancelar", save: "Salvar", delete: "Excluir",
    name: "Nome", email: "Email", phone: "Telefone", notes: "Notas", added: "Adicionado",
    projectName: "Nome do projeto", client: "Cliente", deadline: "Prazo", budget: "Orçamento", description: "Descrição",
    status: "Status", inProgress: "em andamento", paused: "pausado", finished: "concluído",
    invoiceNumber: "Número", amount: "Valor", paymentDeadline: "Prazo de pagamento", serviceDesc: "Descrição do serviço",
    draft: "rascunho", sent: "enviada", paid: "paga",
    generateOffer: "Gerar oferta →", generating: "Gerando...", result: "Resultado", copy: "Copiar", copied: "Copiado",
    yourCompany: "Sua empresa / nome", clientField: "Cliente", projectDesc: "Descrição do projeto *", time: "Prazo",
    connectionError: "Erro de conexão.", enterDesc: "Digite a descrição do projeto!",
    offerPlaceholder: "Sua oferta aparecerá aqui...", choose: "— escolher —", overdue: "⚠ prazo:",
    loading: "Carregando...",
  },
  it: {
    dashboard: "Pannello", clients: "Clienti", projects: "Progetti", invoices: "Fatture", offerGenerator: "Generatore di offerte",
    logout: "Esci", darkMode: "Modalità scura", lightMode: "Modalità chiara",
    activeProjects: "Progetti attivi", recentProjects: "Progetti recenti", recentInvoices: "Fatture recenti",
    noProjects: "Nessun progetto", noInvoices: "Nessuna fattura", noClients: "Nessun cliente",
    addClient: "+ Aggiungi cliente", newProject: "+ Nuovo progetto", newInvoice: "+ Nuova fattura",
    cancel: "Annulla", save: "Salva", delete: "Elimina",
    name: "Nome", email: "Email", phone: "Telefono", notes: "Note", added: "Aggiunto",
    projectName: "Nome progetto", client: "Cliente", deadline: "Scadenza", budget: "Budget", description: "Descrizione",
    status: "Stato", inProgress: "in corso", paused: "in pausa", finished: "completato",
    invoiceNumber: "Numero", amount: "Importo", paymentDeadline: "Scadenza pagamento", serviceDesc: "Descrizione servizio",
    draft: "bozza", sent: "inviata", paid: "pagata",
    generateOffer: "Genera offerta →", generating: "Generazione...", result: "Risultato", copy: "Copia", copied: "Copiato",
    yourCompany: "La tua azienda / nome", clientField: "Cliente", projectDesc: "Descrizione progetto *", time: "Tempistica",
    connectionError: "Errore di connessione.", enterDesc: "Inserisci la descrizione del progetto!",
    offerPlaceholder: "La tua offerta apparirà qui...", choose: "— scegli —", overdue: "⚠ scadenza:",
    loading: "Caricamento...",
  },
  nl: {
    dashboard: "Dashboard", clients: "Klanten", projects: "Projecten", invoices: "Facturen", offerGenerator: "Offertemaker",
    logout: "Uitloggen", darkMode: "Donkere modus", lightMode: "Lichte modus",
    activeProjects: "Actieve projecten", recentProjects: "Recente projecten", recentInvoices: "Recente facturen",
    noProjects: "Geen projecten", noInvoices: "Geen facturen", noClients: "Geen klanten",
    addClient: "+ Klant toevoegen", newProject: "+ Nieuw project", newInvoice: "+ Nieuwe factuur",
    cancel: "Annuleren", save: "Opslaan", delete: "Verwijderen",
    name: "Naam", email: "Email", phone: "Telefoon", notes: "Notities", added: "Toegevoegd",
    projectName: "Projectnaam", client: "Klant", deadline: "Deadline", budget: "Budget", description: "Beschrijving",
    status: "Status", inProgress: "bezig", paused: "gepauzeerd", finished: "voltooid",
    invoiceNumber: "Nummer", amount: "Bedrag", paymentDeadline: "Betalingstermijn", serviceDesc: "Servicebeschrijving",
    draft: "concept", sent: "verzonden", paid: "betaald",
    generateOffer: "Offerte genereren →", generating: "Genereren...", result: "Resultaat", copy: "Kopiëren", copied: "Gekopieerd",
    yourCompany: "Uw bedrijf / naam", clientField: "Klant", projectDesc: "Projectbeschrijving *", time: "Tijdlijn",
    connectionError: "Verbindingsfout.", enterDesc: "Voer projectbeschrijving in!",
    offerPlaceholder: "Uw offerte verschijnt hier...", choose: "— kiezen —", overdue: "⚠ deadline:",
    loading: "Laden...",
  },
  ru: {
    dashboard: "Панель", clients: "Клиенты", projects: "Проекты", invoices: "Счета", offerGenerator: "Генератор предложений",
    logout: "Выйти", darkMode: "Тёмный режим", lightMode: "Светлый режим",
    activeProjects: "Активные проекты", recentProjects: "Последние проекты", recentInvoices: "Последние счета",
    noProjects: "Нет проектов", noInvoices: "Нет счетов", noClients: "Нет клиентов",
    addClient: "+ Добавить клиента", newProject: "+ Новый проект", newInvoice: "+ Новый счёт",
    cancel: "Отмена", save: "Сохранить", delete: "Удалить",
    name: "Название", email: "Email", phone: "Телефон", notes: "Заметки", added: "Добавлено",
    projectName: "Название проекта", client: "Клиент", deadline: "Срок", budget: "Бюджет", description: "Описание",
    status: "Статус", inProgress: "в работе", paused: "на паузе", finished: "завершён",
    invoiceNumber: "Номер", amount: "Сумма", paymentDeadline: "Срок оплаты", serviceDesc: "Описание услуги",
    draft: "черновик", sent: "отправлен", paid: "оплачен",
    generateOffer: "Создать предложение →", generating: "Создаю...", result: "Результат", copy: "Копировать", copied: "Скопировано",
    yourCompany: "Ваша компания / имя", clientField: "Клиент", projectDesc: "Описание проекта *", time: "Сроки",
    connectionError: "Ошибка подключения.", enterDesc: "Введите описание проекта!",
    offerPlaceholder: "Здесь появится ваше предложение...", choose: "— выбрать —", overdue: "⚠ срок:",
    loading: "Загрузка...",
  },
  uk: {
    dashboard: "Панель", clients: "Клієнти", projects: "Проєкти", invoices: "Рахунки", offerGenerator: "Генератор пропозицій",
    logout: "Вийти", darkMode: "Темний режим", lightMode: "Світлий режим",
    activeProjects: "Активні проєкти", recentProjects: "Останні проєкти", recentInvoices: "Останні рахунки",
    noProjects: "Немає проєктів", noInvoices: "Немає рахунків", noClients: "Немає клієнтів",
    addClient: "+ Додати клієнта", newProject: "+ Новий проєкт", newInvoice: "+ Новий рахунок",
    cancel: "Скасувати", save: "Зберегти", delete: "Видалити",
    name: "Назва", email: "Email", phone: "Телефон", notes: "Нотатки", added: "Додано",
    projectName: "Назва проєкту", client: "Клієнт", deadline: "Дедлайн", budget: "Бюджет", description: "Опис",
    status: "Статус", inProgress: "в роботі", paused: "на паузі", finished: "завершено",
    invoiceNumber: "Номер", amount: "Сума", paymentDeadline: "Термін оплати", serviceDesc: "Опис послуги",
    draft: "чернетка", sent: "надіслано", paid: "оплачено",
    generateOffer: "Створити пропозицію →", generating: "Створюю...", result: "Результат", copy: "Копіювати", copied: "Скопійовано",
    yourCompany: "Ваша компанія / ім'я", clientField: "Клієнт", projectDesc: "Опис проєкту *", time: "Терміни",
    connectionError: "Помилка підключення.", enterDesc: "Введіть опис проєкту!",
    offerPlaceholder: "Тут з'явиться ваша пропозиція...", choose: "— обрати —", overdue: "⚠ дедлайн:",
    loading: "Завантаження...",
  },
};

function useLocalState(key: string, initial: any) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial; } catch { return initial; }
  });
  function set(v: any) { setVal(v); try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }
  return [val, set];
}

function today() { return new Date().toISOString().slice(0, 10); }
function fmt(n: any) { return Number(n || 0).toLocaleString("pl-PL", { style: "currency", currency: "PLN", maximumFractionDigits: 0 }); }

const icons = {
  dashboard: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  oferta: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/></svg>,
  klienci: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  projekty: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  faktury: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
};

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [user, setUser] = useState<any>(null);
  const [darkMode, setDarkMode] = useLocalState("fp_dark", true);
  const [lang, setLang] = useLocalState("fp_lang", "pl");
  const [klienci, setKlienci] = useState<any[]>([]);
  const [projekty, setProjekty] = useState<any[]>([]);
  const [faktury, setFaktury] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const t = translations[lang] || translations.pl;

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    setLoadingData(true);
    Promise.all([
      supabase.from("klienci").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("projekty").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("faktury").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    ]).then(([k, p, f]) => {
      setKlienci(k.data || []);
      setProjekty(p.data || []);
      setFaktury(f.data || []);
      setLoadingData(false);
    });
  }, [user]);

  if (!user) return <Auth />;

  const TABS = [
    { id: "dashboard", label: t.dashboard, icon: icons.dashboard },
    { id: "oferta", label: t.offerGenerator, icon: icons.oferta },
    { id: "klienci", label: t.clients, icon: icons.klienci },
    { id: "projekty", label: t.projects, icon: icons.projekty },
    { id: "faktury", label: t.invoices, icon: icons.faktury },
  ];

  return (
    <>
      <link rel="stylesheet" href={FONT} />
      <style>{darkMode ? cssDark : cssLight}</style>
      <div className="app">
        <aside className="sidebar">
          <div className="sidebar-logo">freelance<span>FLOW</span></div>
          <nav className="nav">
            {TABS.map(tb => (
              <button key={tb.id} className={`nav-item ${tab === tb.id ? "active" : ""}`} onClick={() => setTab(tb.id)}>
                <span className="nav-icon">{tb.icon}</span>
                <span>{tb.label}</span>
              </button>
            ))}
          </nav>
          <div className="sidebar-foot">
            <select className="inp" style={{ fontSize: 12, marginBottom: 4 }} value={lang} onChange={e => setLang(e.target.value)}>
              <option value="pl">🇵🇱 Polski</option>
              <option value="en">🇬🇧 English</option>
              <option value="de">🇩🇪 Deutsch</option>
              <option value="fr">🇫🇷 Français</option>
              <option value="es">🇪🇸 Español</option>
              <option value="pt">🇵🇹 Português</option>
              <option value="it">🇮🇹 Italiano</option>
              <option value="nl">🇳🇱 Nederlands</option>
              <option value="ru">🇷🇺 Русский</option>
              <option value="uk">🇺🇦 Українська</option>
            </select>
            <button className="btn-ghost" style={{ width: "100%", marginBottom: 4 }} onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "☀️ " + t.lightMode : "🌙 " + t.darkMode}
            </button>
            <button className="btn-ghost" style={{ width: "100%", color: "#ff6b6b" }} onClick={() => supabase.auth.signOut()}>
              {t.logout}
            </button>
            <div className="mono" style={{ color: "#444", fontSize: 11, marginTop: 6 }}>v1.0 · beta</div>
          </div>
        </aside>
        <main className="content">
          {loadingData ? (
            <div style={{ padding: "4rem", textAlign: "center", color: "#555", fontFamily: "'DM Mono', monospace" }}>{t.loading}</div>
          ) : (
            <>
              {tab === "dashboard" && <Dashboard klienci={klienci} projekty={projekty} faktury={faktury} t={t} />}
              {tab === "oferta" && <GeneratorOfert klienci={klienci} t={t} lang={lang} />}
              {tab === "klienci" && <Klienci klienci={klienci} setKlienci={setKlienci} user={user} t={t} />}
              {tab === "projekty" && <Projekty projekty={projekty} setProjekty={setProjekty} klienci={klienci} user={user} t={t} />}
              {tab === "faktury" && <Faktury faktury={faktury} setFaktury={setFaktury} klienci={klienci} projekty={projekty} user={user} t={t} />}
            </>
          )}
        </main>
        <nav className="bottom-nav">
          {TABS.map(tb => (
            <button key={tb.id} className={`bottom-nav-item ${tab === tb.id ? "active" : ""}`} onClick={() => setTab(tb.id)}>
              <span className="bottom-nav-icon">{tb.icon}</span>
              <span className="bottom-nav-label">{tb.label}</span>
            </button>
          ))}
          <select className="bottom-nav-item" style={{ border: "none", background: "none", color: "#444", fontSize: 10, cursor: "pointer", fontFamily: "Syne, sans-serif" }} value={lang} onChange={e => setLang(e.target.value)}>
            <option value="pl">🇵🇱</option>
            <option value="en">🇬🇧</option>
            <option value="de">🇩🇪</option>
            <option value="fr">🇫🇷</option>
            <option value="es">🇪🇸</option>
            <option value="pt">🇵🇹</option>
            <option value="it">🇮🇹</option>
            <option value="nl">🇳🇱</option>
            <option value="ru">🇷🇺</option>
            <option value="uk">🇺🇦</option>
          </select>
          <button className="bottom-nav-item" onClick={() => setDarkMode(!darkMode)}>
            <span className="bottom-nav-icon">{darkMode ? "☀️" : "🌙"}</span>
            <span className="bottom-nav-label">{darkMode ? t.lightMode : t.darkMode}</span>
          </button>
          <button className="bottom-nav-item" style={{ color: "#ff6b6b" }} onClick={() => supabase.auth.signOut()}>
            <span className="bottom-nav-icon">🚪</span>
            <span className="bottom-nav-label">{t.logout}</span>
          </button>
        </nav>
      </div>
    </>
  );
}

function Dashboard({ klienci, projekty, faktury, t }: any) {
  const aktywne = projekty.filter((p: any) => p.status === "w toku" || p.status === "in progress" || p.status === "in Arbeit" || p.status === "en cours").length;
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">{t.dashboard}</h1>
        <div className="mono text-muted">{new Date().toLocaleDateString("pl-PL", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
      </div>
      <div className="stats-grid">
        <StatCard label={t.activeProjects} value={aktywne} accent="#5ab4f5" />
        <StatCard label={t.clients} value={klienci.length} accent="#c85af5" />
      </div>
      <div className="dash-grid">
        <div className="card">
          <div className="card-title">{t.recentProjects}</div>
          {projekty.length === 0 ? <div className="empty">{t.noProjects}</div> : projekty.slice(0, 4).map((p: any) => (
            <div key={p.id} className="list-row">
              <span>{p.nazwa}</span>
              <span className="badge badge-green">{p.status}</span>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-title">{t.recentInvoices}</div>
          {faktury.length === 0 ? <div className="empty">{t.noInvoices}</div> : faktury.slice(0, 4).map((f: any) => (
            <div key={f.id} className="list-row">
              <span className="mono">{f.numer}</span>
              <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span>{fmt(f.kwota)}</span>
                <span className={`badge badge-${f.status === "oplacona" || f.status === "paid" ? "green" : f.status === "wyslana" || f.status === "sent" ? "yellow" : "gray"}`}>{f.status}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }: any) {
  return (
    <div className="stat-card" style={{ "--accent": accent } as any}>
      <div className="stat-value">{value}</div>
      <div className="stat-label mono">{label}</div>
      <div className="stat-bar" />
    </div>
  );
}

function GeneratorOfert({ klienci, t, lang }: any) {
  const [firma, setFirma] = useState("");
  const [klient, setKlient] = useState("");
  const [opis, setOpis] = useState("");
  const [budzet, setBudzet] = useState("");
  const [czas, setCzas] = useState("");
  const [oferta, setOferta] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const langNames: Record<string, string> = { pl: "Polish", en: "English", de: "German", fr: "French", es: "Spanish", pt: "Portuguese", it: "Italian", nl: "Dutch", ru: "Russian", uk: "Ukrainian" };

  async function generate() {
    if (!opis.trim()) { setError(t.enterDesc); return; }
    setError(""); setLoading(true); setOferta("");
    const prompt = `Write a professional business offer in ${langNames[lang] || "English"}.\n\nDetails:\n- From: ${firma || "Freelancer"}\n- Client: ${klient || "Client"}\n- Service: ${opis}\n${budzet ? `- Budget: ${budzet}\n` : ""}${czas ? `- Timeline: ${czas}\n` : ""}\nInclude: introduction, scope of work (list), timeline, price and payment terms, professional closing. Max 400 words.`;
    try {
      const res = await fetch("/api/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-5", max_tokens: 1000, messages: [{ role: "user", content: prompt }] }),
      });
      const data = await res.json();
      setOferta(data.content?.map((b: any) => b.text || "").join("") || t.connectionError);
    } catch { setError(t.connectionError); }
    setLoading(false);
  }

  return (
    <div className="page">
      <div className="page-header"><h1 className="page-title">{t.offerGenerator}</h1></div>
      <div className="two-col">
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label={t.yourCompany}><input className="inp" value={firma} onChange={e => setFirma(e.target.value)} /></Field>
          {klienci.length > 0
            ? <Field label={t.clientField}><select className="inp" value={klient} onChange={e => setKlient(e.target.value)}><option value="">{t.choose}</option>{klienci.map((k: any) => <option key={k.id} value={k.nazwa}>{k.nazwa}</option>)}</select></Field>
            : <Field label={t.clientField}><input className="inp" value={klient} onChange={e => setKlient(e.target.value)} /></Field>
          }
          <Field label={t.projectDesc}><textarea className="inp" style={{ minHeight: 90 }} value={opis} onChange={e => { setOpis(e.target.value); setError(""); }} /></Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label={t.budget}><input className="inp" value={budzet} onChange={e => setBudzet(e.target.value)} /></Field>
            <Field label={t.time}><input className="inp" value={czas} onChange={e => setCzas(e.target.value)} /></Field>
          </div>
          {error && <div className="error-msg">{error}</div>}
          <button className="btn-primary" onClick={generate} disabled={loading}>{loading ? t.generating : t.generateOffer}</button>
        </div>
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="card-title" style={{ marginBottom: 0 }}>{t.result}</div>
            {oferta && <button className="btn-ghost" onClick={() => { navigator.clipboard.writeText(oferta); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>{copied ? t.copied : t.copy}</button>}
          </div>
          <div className="preview-box mono">{oferta || <span className="text-muted">{t.offerPlaceholder}</span>}</div>
        </div>
      </div>
    </div>
  );
}

function Klienci({ klienci, setKlienci, user, t }: any) {
  const [form, setForm] = useState({ nazwa: "", email: "", telefon: "", notatki: "" });
  const [show, setShow] = useState(false);

  async function add() {
    if (!form.nazwa.trim()) return;
    const { data, error } = await supabase.from("klienci").insert({ ...form, user_id: user.id, data: today() }).select().single();
    if (!error && data) setKlienci([data, ...klienci]);
    setForm({ nazwa: "", email: "", telefon: "", notatki: "" }); setShow(false);
  }

  async function remove(id: string) {
    await supabase.from("klienci").delete().eq("id", id);
    setKlienci(klienci.filter((k: any) => k.id !== id));
  }

  return (
    <div className="page">
      <div className="page-header"><h1 className="page-title">{t.clients}</h1><button className="btn-primary" onClick={() => setShow(!show)}>{show ? t.cancel : t.addClient}</button></div>
      {show && (
        <div className="card" style={{ marginBottom: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label={t.name + " *"}><input className="inp" value={form.nazwa} onChange={e => setForm({ ...form, nazwa: e.target.value })} /></Field>
            <Field label={t.email}><input className="inp" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></Field>
            <Field label={t.phone}><input className="inp" value={form.telefon} onChange={e => setForm({ ...form, telefon: e.target.value })} /></Field>
          </div>
          <Field label={t.notes}><textarea className="inp" value={form.notatki} onChange={e => setForm({ ...form, notatki: e.target.value })} /></Field>
          <button className="btn-primary" style={{ alignSelf: "flex-start" }} onClick={add}>{t.save}</button>
        </div>
      )}
      {klienci.length === 0 ? <div className="card empty">{t.noClients}</div> :
        <div className="table-wrap"><table className="table"><thead><tr><th>{t.name}</th><th>{t.email}</th><th>{t.phone}</th><th>{t.added}</th><th></th></tr></thead><tbody>
          {klienci.map((k: any) => <tr key={k.id}><td><strong>{k.nazwa}</strong></td><td className="mono">{k.email || "—"}</td><td className="mono">{k.telefon || "—"}</td><td className="mono text-muted">{k.data}</td><td><button className="btn-ghost" style={{ color: "#ff6b6b" }} onClick={() => remove(k.id)}>{t.delete}</button></td></tr>)}
        </tbody></table></div>}
    </div>
  );
}

function Projekty({ projekty, setProjekty, klienci, user, t }: any) {
  const [form, setForm] = useState({ nazwa: "", klient: "", deadline: "", budzet: "", status: "w toku", opis: "" });
  const [show, setShow] = useState(false);

  async function add() {
    if (!form.nazwa.trim()) return;
    const { data, error } = await supabase.from("projekty").insert({ ...form, user_id: user.id, data: today() }).select().single();
    if (!error && data) setProjekty([data, ...projekty]);
    setForm({ nazwa: "", klient: "", deadline: "", budzet: "", status: "w toku", opis: "" }); setShow(false);
  }

  async function changeStatus(id: string, status: string) {
    await supabase.from("projekty").update({ status }).eq("id", id);
    setProjekty(projekty.map((p: any) => p.id === id ? { ...p, status } : p));
  }

  async function remove(id: string) {
    await supabase.from("projekty").delete().eq("id", id);
    setProjekty(projekty.filter((p: any) => p.id !== id));
  }

  return (
    <div className="page">
      <div className="page-header"><h1 className="page-title">{t.projects}</h1><button className="btn-primary" onClick={() => setShow(!show)}>{show ? t.cancel : t.newProject}</button></div>
      {show && (
        <div className="card" style={{ marginBottom: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label={t.projectName + " *"}><input className="inp" value={form.nazwa} onChange={e => setForm({ ...form, nazwa: e.target.value })} /></Field>
            <Field label={t.client}><select className="inp" value={form.klient} onChange={e => setForm({ ...form, klient: e.target.value })}><option value="">{t.choose}</option>{klienci.map((k: any) => <option key={k.id} value={k.nazwa}>{k.nazwa}</option>)}</select></Field>
            <Field label={t.deadline}><input className="inp" type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} /></Field>
            <Field label={t.budget}><input className="inp" value={form.budzet} onChange={e => setForm({ ...form, budzet: e.target.value })} /></Field>
          </div>
          <Field label={t.description}><textarea className="inp" value={form.opis} onChange={e => setForm({ ...form, opis: e.target.value })} /></Field>
          <button className="btn-primary" style={{ alignSelf: "flex-start" }} onClick={add}>{t.save}</button>
        </div>
      )}
      {projekty.length === 0 ? <div className="card empty">{t.noProjects}</div> :
        <div className="projects-list">{projekty.map((p: any) => {
          const isOverdue = p.deadline && p.deadline < today() && p.status !== "zakończony" && p.status !== "finished";
          return (
            <div key={p.id} className="project-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div><div style={{ fontWeight: 600, fontSize: 15 }}>{p.nazwa}</div>{p.klient && <div className="mono text-muted" style={{ fontSize: 12 }}>{p.klient}</div>}</div>
                <select className="inp" style={{ width: "auto", fontSize: 12, padding: "4px 8px" }} value={p.status} onChange={e => changeStatus(p.id, e.target.value)}>
                  <option value="w toku">{t.inProgress}</option>
                  <option value="wstrzymany">{t.paused}</option>
                  <option value="zakończony">{t.finished}</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 10, fontSize: 13 }}>
                {p.budzet && <span>{fmt(p.budzet)}</span>}
                {p.deadline && <span className={`mono ${isOverdue ? "text-red" : "text-muted"}`}>{isOverdue ? t.overdue : t.deadline + ":"} {p.deadline}</span>}
              </div>
              {p.opis && <div className="text-muted" style={{ fontSize: 13, marginTop: 8 }}>{p.opis}</div>}
              <button className="btn-ghost" style={{ color: "#ff6b6b", marginTop: 8, fontSize: 12 }} onClick={() => remove(p.id)}>{t.delete}</button>
            </div>
          );
        })}</div>}
    </div>
  );
}

function Faktury({ faktury, setFaktury, klienci, projekty, user, t }: any) {
  const [form, setForm] = useState({ numer: "", klient: "", projekt: "", kwota: "", termin: "", status: "szkic", opis: "" });
  const [show, setShow] = useState(false);

  function nextNum() { const y = new Date().getFullYear(); const n = faktury.filter((f: any) => f.numer?.startsWith(`FV/${y}/`)).length + 1; return `FV/${y}/${String(n).padStart(3, "0")}`; }

  async function add() {
    if (!form.numer || !form.kwota) return;
    const { data, error } = await supabase.from("faktury").insert({ ...form, user_id: user.id, data: today() }).select().single();
    if (!error && data) setFaktury([data, ...faktury]);
    setShow(false);
  }

  async function changeStatus(id: string, status: string) {
    await supabase.from("faktury").update({ status }).eq("id", id);
    setFaktury(faktury.map((f: any) => f.id === id ? { ...f, status } : f));
  }

  async function remove(id: string) {
    await supabase.from("faktury").delete().eq("id", id);
    setFaktury(faktury.filter((f: any) => f.id !== id));
  }

  return (
    <div className="page">
      <div className="page-header"><h1 className="page-title">{t.invoices}</h1><button className="btn-primary" onClick={show ? () => setShow(false) : () => { setForm({ numer: nextNum(), klient: "", projekt: "", kwota: "", termin: "", status: "szkic", opis: "" }); setShow(true); }}>{show ? t.cancel : t.newInvoice}</button></div>
      {show && (
        <div className="card" style={{ marginBottom: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label={t.invoiceNumber + " *"}><input className="inp mono" value={form.numer} onChange={e => setForm({ ...form, numer: e.target.value })} /></Field>
            <Field label={t.amount + " *"}><input className="inp" type="number" value={form.kwota} onChange={e => setForm({ ...form, kwota: e.target.value })} /></Field>
            <Field label={t.client}><select className="inp" value={form.klient} onChange={e => setForm({ ...form, klient: e.target.value })}><option value="">{t.choose}</option>{klienci.map((k: any) => <option key={k.id} value={k.nazwa}>{k.nazwa}</option>)}</select></Field>
            <Field label={t.projects}><select className="inp" value={form.projekt} onChange={e => setForm({ ...form, projekt: e.target.value })}><option value="">{t.choose}</option>{projekty.map((p: any) => <option key={p.id} value={p.nazwa}>{p.nazwa}</option>)}</select></Field>
            <Field label={t.paymentDeadline}><input className="inp" type="date" value={form.termin} onChange={e => setForm({ ...form, termin: e.target.value })} /></Field>
          </div>
          <Field label={t.serviceDesc}><textarea className="inp" value={form.opis} onChange={e => setForm({ ...form, opis: e.target.value })} /></Field>
          <button className="btn-primary" style={{ alignSelf: "flex-start" }} onClick={add}>{t.save}</button>
        </div>
      )}
      {faktury.length === 0 ? <div className="card empty">{t.noInvoices}</div> :
        <div className="table-wrap"><table className="table"><thead><tr><th>{t.invoiceNumber}</th><th>{t.client}</th><th>{t.amount}</th><th>{t.paymentDeadline}</th><th>{t.status}</th><th></th></tr></thead><tbody>
          {faktury.map((f: any) => <tr key={f.id}><td className="mono">{f.numer}</td><td>{f.klient || "—"}</td><td className="mono"><strong>{fmt(f.kwota)}</strong></td><td className="mono text-muted">{f.termin || "—"}</td>
            <td><select className="inp" style={{ width: "auto", fontSize: 12, padding: "4px 8px" }} value={f.status} onChange={e => changeStatus(f.id, e.target.value)}>
              <option value="szkic">{t.draft}</option><option value="wyslana">{t.sent}</option><option value="oplacona">{t.paid}</option>
            </select></td>
            <td><button className="btn-ghost" style={{ color: "#ff6b6b" }} onClick={() => remove(f.id)}>{t.delete}</button></td></tr>)}
        </tbody></table></div>}
    </div>
  );
}

function Field({ label, children }: any) {
  return <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
    <label style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "#555", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</label>
    {children}
  </div>;
}

const cssBase = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
.app { display: flex; min-height: 100vh; font-family: 'Syne', sans-serif; }
.sidebar { width: 220px; min-width: 220px; display: flex; flex-direction: column; padding: 1.5rem 0; position: sticky; top: 0; height: 100vh; overflow-y: auto; }
.sidebar-logo { font-size: 13px; font-weight: 800; letter-spacing: -0.5px; padding: 0 1.25rem 1.5rem; border-bottom: 1px solid; margin-bottom: 1rem; }
.sidebar-logo span { color: #c8f55a; }
.nav { display: flex; flex-direction: column; gap: 2px; padding: 0 0.5rem; flex: 1; }
.nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 14px; border-radius: 8px; border: none; background: none; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; text-align: left; transition: all 0.15s; }
.nav-item.active { color: #c8f55a !important; background: rgba(200,245,90,0.08) !important; }
.nav-icon { display: flex; align-items: center; opacity: 0.8; }
.sidebar-foot { padding: 1rem 1.25rem 0; border-top: 1px solid; display: flex; flex-direction: column; gap: 4px; }
.content { flex: 1; overflow-y: auto; }
.page { padding: 2rem 2.5rem; max-width: 100%; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.75rem; }
.page-title { font-size: 26px; font-weight: 700; letter-spacing: -0.5px; }
.stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px; }
.stat-card { border: 1px solid; border-radius: 10px; padding: 1.25rem; position: relative; overflow: hidden; }
.stat-value { font-size: 32px; font-weight: 700; margin-bottom: 6px; }
.stat-label { font-size: 11px; }
.stat-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--accent); }
.dash-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.card { border: 1px solid; border-radius: 10px; padding: 1.25rem; }
.card-title { font-size: 12px; font-family: 'DM Mono', monospace; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px; }
.list-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid; font-size: 14px; }
.list-row:last-child { border-bottom: none; }
.empty { font-size: 13px; font-family: 'DM Mono', monospace; padding: 1rem 0; }
.badge { font-family: 'DM Mono', monospace; font-size: 10px; padding: 2px 8px; border-radius: 20px; font-weight: 500; text-transform: uppercase; }
.badge-green { background: rgba(200,245,90,0.12); color: #c8f55a; }
.badge-yellow { background: rgba(245,166,35,0.12); color: #f5a623; }
.badge-gray { background: rgba(100,100,100,0.15); color: #666; }
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.inp { border: 1px solid; border-radius: 7px; font-family: 'Syne', sans-serif; font-size: 13px; padding: 9px 12px; outline: none; transition: border-color 0.15s; width: 100%; }
.inp:focus { border-color: #c8f55a; }
textarea.inp { resize: vertical; min-height: 80px; }
.btn-primary { background: #c8f55a; color: #0a0a0a; border: none; border-radius: 7px; padding: 10px 18px; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: opacity 0.15s; white-space: nowrap; }
.btn-primary:hover { opacity: 0.88; }
.btn-primary:disabled { opacity: 0.35; cursor: not-allowed; }
.btn-ghost { background: none; border: 1px solid; border-radius: 6px; font-family: 'Syne', sans-serif; font-size: 12px; padding: 5px 12px; cursor: pointer; transition: all 0.15s; }
.preview-box { border: 1px solid; border-radius: 8px; padding: 1rem; min-height: 360px; font-size: 12.5px; line-height: 1.75; white-space: pre-wrap; flex: 1; overflow-y: auto; }
.error-msg { color: #ff6b6b; font-family: 'DM Mono', monospace; font-size: 12px; }
.table-wrap { overflow-x: auto; }
.table { width: 100%; border-collapse: collapse; font-size: 14px; }
.table th { text-align: left; font-family: 'DM Mono', monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; padding: 8px 12px; border-bottom: 1px solid; }
.table td { padding: 12px 12px; border-bottom: 1px solid; vertical-align: middle; }
.table tr:last-child td { border-bottom: none; }
.projects-list { display: flex; flex-direction: column; gap: 12px; }
.project-card { border: 1px solid; border-radius: 10px; padding: 1.1rem 1.25rem; }
.mono { font-family: 'DM Mono', monospace; }
.text-muted { color: #555; }
.text-red { color: #ff6b6b; }
.bottom-nav { display: none; position: fixed; bottom: 0; left: 0; right: 0; height: 62px; border-top: 1px solid; z-index: 100; padding: 0 4px; padding-bottom: env(safe-area-inset-bottom); }
.bottom-nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; border: none; background: none; cursor: pointer; padding: 6px 2px; transition: color 0.15s; font-family: 'Syne', sans-serif; }
.bottom-nav-item.active { color: #c8f55a !important; }
.bottom-nav-icon { display: flex; align-items: center; }
.bottom-nav-label { font-size: 10px; font-weight: 500; }
@media (max-width: 900px) { .stats-grid { grid-template-columns: 1fr 1fr; } .dash-grid, .two-col { grid-template-columns: 1fr; } .page { padding: 1.5rem 1.25rem; } }
@media (max-width: 600px) { .sidebar { display: none; } .content { padding-bottom: 70px; } .bottom-nav { display: flex; } }
`;

const cssDark = `body { background: #0a0a0a; } ` + cssBase + `
.app { background: #0a0a0a; color: #e8e3da; }
.sidebar { background: #0d0d0d; border-right: 1px solid #1a1a1a; }
.sidebar-logo { color: #e8e3da; border-bottom-color: #1a1a1a; }
.nav-item { color: #555; }
.nav-item:hover { color: #e8e3da; background: #141414; }
.sidebar-foot { border-top-color: #1a1a1a; }
.stat-card { background: #0d0d0d; border-color: #1a1a1a; }
.stat-label { color: #555; }
.card { background: #0d0d0d; border-color: #1a1a1a; }
.card-title { color: #555; }
.list-row { border-bottom-color: #141414; }
.empty { color: #444; }
.inp { background: #141414; border-color: #1e1e1e; color: #e8e3da; }
.btn-ghost { border-color: #1e1e1e; color: #666; }
.btn-ghost:hover { color: #e8e3da; border-color: #444; }
.preview-box { background: #141414; border-color: #1e1e1e; color: #aaa; }
.table th { color: #555; border-bottom-color: #1a1a1a; }
.table td { border-bottom-color: #141414; }
.project-card { background: #0d0d0d; border-color: #1a1a1a; }
.bottom-nav { background: #0d0d0d; border-top-color: #1a1a1a; }
.bottom-nav-item { color: #444; }
select.inp option { background: #141414; }
`;

const cssLight = `body { background: #f5f5f5; } ` + cssBase + `
.app { background: #f5f5f5; color: #1a1a1a; }
.sidebar { background: #ffffff; border-right: 1px solid #e0e0e0; }
.sidebar-logo { color: #1a1a1a; border-bottom-color: #e0e0e0; }
.nav-item { color: #888; }
.nav-item:hover { color: #1a1a1a; background: #f0f0f0; }
.sidebar-foot { border-top-color: #e0e0e0; }
.stat-card { background: #ffffff; border-color: #e0e0e0; }
.stat-label { color: #888; }
.card { background: #ffffff; border-color: #e0e0e0; }
.card-title { color: #888; }
.list-row { border-bottom-color: #f0f0f0; }
.empty { color: #bbb; }
.inp { background: #f9f9f9; border-color: #e0e0e0; color: #1a1a1a; }
.btn-ghost { border-color: #e0e0e0; color: #888; }
.btn-ghost:hover { color: #1a1a1a; border-color: #999; }
.preview-box { background: #f9f9f9; border-color: #e0e0e0; color: #555; }
.table th { color: #888; border-bottom-color: #e0e0e0; }
.table td { border-bottom-color: #f0f0f0; }
.project-card { background: #ffffff; border-color: #e0e0e0; }
.bottom-nav { background: #ffffff; border-top-color: #e0e0e0; }
.bottom-nav-item { color: #aaa; }
select.inp option { background: #ffffff; }
`;