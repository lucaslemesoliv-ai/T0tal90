// Service Worker para o PWA T0tal90
const CACHE_NAME = 't0tal90-cache-v2';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './launchericon-192x192.png',
  './launchericon-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
```
eof

```html:Dashboard Financeiro Estilo 90 Pro:index.html
<!DOCTYPE html>
<html lang="pt-br" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>T0tal90 - Dashboard Financeiro Autônomo</title>
    <!-- PWA Manifest Físico para validação perfeita no PWABuilder -->
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#050505">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        brand: '#9D4EDD',
                        darkBg: '#050505',
                        surface: '#121212',
                        surfaceCard: '#1a1a1a',
                        success: '#00FF00',
                        danger: '#FF007F',
                        warning: '#FFA500'
                    }
                }
            }
        }
    </script>
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #050505; color: #ffffff; }
        .neo-card {
            background: #1a1a1a;
            border-radius: 20px;
            box-shadow: 0 10px 25px -5px rgba(157, 78, 221, 0.15), 0 8px 10px -6px rgba(157, 78, 221, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.05);
            transition: all 0.3s ease;
        }
        .neo-card:hover { border-color: rgba(157, 78, 221, 0.3); }
        .btn-nav { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .btn-nav.active { background-color: #9D4EDD; color: white; transform: scale(1.03); box-shadow: 0 0 20px rgba(157, 78, 221, 0.5); }
        .hide-scroll::-webkit-scrollbar { display: none; }
    </style>
</head>
<body class="pb-28 min-h-screen">

    <header class="bg-gradient-to-b from-[#1a0b2e] to-[#050505] text-white pt-8 pb-16 px-6 rounded-b-[40px] shadow-2xl border-b border-purple-900/30">
        <div class="max-w-2xl mx-auto flex justify-between items-center">
            <div>
                <div class="flex items-center space-x-2">
                    <span class="bg-brand text-white text-xs font-black px-2 py-0.5 rounded uppercase tracking-widest">PRO 9.0</span>
                    <span class="text-xs text-purple-300 font-semibold uppercase tracking-wider">Automated Intelligence</span>
                </div>
                <h1 class="text-3xl font-black mt-1 tracking-tight">Sobra Livre Real</h1>
                <p class="text-3xl font-extrabold text-emerald-400 mt-1" id="header-sobra-livre">R$ 548,32</p>
            </div>
            <div class="flex space-x-3">
                <button onclick="carregarCenarioPadrao()" class="bg-purple-950/80 border border-purple-500/50 hover:bg-purple-900 text-purple-200 text-xs font-bold px-3 py-2 rounded-xl transition shadow-lg">
                    ⚡ R$ 1.736 Padrão
                </button>
                <button onclick="abrirModalMenu()" class="h-12 w-12 bg-surfaceCard border border-white/10 rounded-2xl flex items-center justify-center font-bold text-xl hover:border-brand transition">
                    ☰
                </button>
            </div>
        </div>
    </header>

    <nav class="fixed bottom-6 left-1/2 -translate-x-1/2 w-[94%] max-w-xl bg-surface/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-2 flex justify-between shadow-2xl z-50">
        <button onclick="switchTab('resumo')" id="tab-resumo" class="btn-nav active flex-1 py-3 px-1 rounded-2xl text-[10px] font-black uppercase tracking-tight text-center">Início</button>
        <button onclick="switchTab('fatura')" id="tab-fatura" class="btn-nav flex-1 py-3 px-1 rounded-2xl text-[10px] font-black uppercase tracking-tight text-center">Cartão</button>
        <button onclick="switchTab('fixos')" id="tab-fixos" class="btn-nav flex-1 py-3 px-1 rounded-2xl text-[10px] font-black uppercase tracking-tight text-center">Fixos</button>
        <button onclick="switchTab('investimentos')" id="tab-investimentos" class="btn-nav flex-1 py-3 px-1 rounded-2xl text-[10px] font-black uppercase tracking-tight text-center">Ativos</button>
        <button onclick="switchTab('mercado')" id="tab-mercado" class="btn-nav flex-1 py-3 px-1 rounded-2xl text-[10px] font-black uppercase tracking-tight text-center">Mercado</button>
        <button onclick="switchTab('noticias')" id="tab-noticias" class="btn-nav flex-1 py-3 px-1 rounded-2xl text-[10px] font-black uppercase tracking-tight text-center">Radar</button>
    </nav>

    <main class="max-w-2xl mx-auto px-5 -mt-8 relative z-10 space-y-6">

        <section id="sec-resumo" class="space-y-6">
            <div class="neo-card p-6 border-l-4 border-brand">
                <div class="flex items-center justify-between mb-4">
                    <span class="text-xs font-black text-brand uppercase tracking-wider" id="dica-categoria">ADAM SMITH • PARCIMÔNIA</span>
                    <span class="text-xs text-zinc-500 font-bold" id="dica-contador">[1 de 10]</span>
                </div>
                <h3 class="text-lg font-black text-white mb-2" id="dica-titulo">A Parcimônia e o Capital</h3>
                <p class="text-sm text-zinc-300 leading-relaxed mb-4" id="dica-texto">O capital não aumenta pelo trabalho, mas pela parcimônia. Sem economia, a riqueza gerada evapora.</p>
                <div class="bg-black/50 p-3 rounded-xl border border-white/10 mb-4">
                    <p class="text-xs font-bold text-brand mb-1">💡 TÁTICA APLICADA:</p>
                    <p class="text-xs text-zinc-200 italic" id="dica-acao">Separe uma porcentagem fixa antes de pagar os boletos.</p>
                </div>
                <div class="flex justify-between items-center">
                    <button onclick="mudarDica(-1)" class="text-xs font-bold text-zinc-400 hover:text-white">◄ Anterior</button>
                    <button onclick="mudarDica(1)" class="text-xs font-bold text-brand hover:underline">Próxima ►</button>
                </div>
            </div>

            <div class="neo-card p-6">
                <h3 class="font-black text-white text-base mb-1">Distribuição do Salário (R$ 1.736,00)</h3>
                <p class="text-xs text-zinc-400 mb-6">Alocação exata entre obrigações, aportes e consumo.</p>
                <div class="relative w-full h-64">
                    <canvas id="mainChart"></canvas>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="neo-card p-4 flex flex-col items-center justify-center text-center">
                    <span class="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Aporte Mensal</span>
                    <span class="text-xl font-black text-indigo-400 mt-1">R$ 200,00</span>
                </div>
                <div class="neo-card p-4 flex flex-col items-center justify-center text-center">
                    <span class="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Vale Transporte</span>
                    <span class="text-xl font-black text-amber-400 mt-1">R$ 200,00</span>
                </div>
            </div>
        </section>

        <section id="sec-fatura" class="hidden space-y-6">
            <div class="neo-card p-6 bg-gradient-to-br from-zinc-900 to-black border-brand/40">
                <div class="flex justify-between items-start mb-6">
                    <div>
                        <h3 class="font-black text-lg text-white">Teto do Cartão</h3>
                        <p class="text-xs text-zinc-400">Limite pessoal estipulado</p>
                    </div>
                    <span class="text-emerald-400 font-black text-lg" id="teto-valor-label">R$ 400,00</span>
                </div>
                
                <div class="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden mb-3">
                    <div id="teto-progress-bar" class="bg-brand h-full rounded-full transition-all duration-500" style="width: 71.9%"></div>
                </div>
                <div class="flex justify-between text-xs font-bold text-zinc-400 uppercase">
                    <span id="gasto-teto-txt">Gasto no Teto: R$ 287,68</span>
                    <span id="disponivel-teto-txt" class="text-emerald-400">Disponível: R$ 112,32</span>
                </div>
            </div>

            <div class="neo-card p-6">
                <h3 class="font-black text-white text-base mb-4">Adicionar Novo Gasto / Parcela</h3>
                <div class="space-y-3">
                    <input type="text" id="gasto-nome" placeholder="Descrição (Ex: Jantar, Fita 3M)" class="w-full bg-black border border-white/10 rounded-xl p-3 text-sm text-white placeholder-zinc-600 focus:border-brand outline-none">
                    <div class="flex space-x-2">
                        <input type="number" step="0.01" id="gasto-valor" placeholder="Valor (R$)" class="w-1/2 bg-black border border-white/10 rounded-xl p-3 text-sm text-white placeholder-zinc-600 focus:border-brand outline-none">
                        <select id="gasto-tag" class="w-1/2 bg-black border border-white/10 rounded-xl p-3 text-sm text-zinc-300 focus:border-brand outline-none">
                            <option value="Serviço">Serviço / Assinatura</option>
                            <option value="Essencial">Essencial</option>
                            <option value="Parcela">Parcela / Dívida</option>
                            <option value="Casa">Casa / Insumo</option>
                            <option value="Externo">Externo (Outro Bolso)</option>
                        </select>
                    </div>
                    <div class="flex items-center space-x-2 pt-1">
                        <input type="checkbox" id="gasto-externo" class="w-4 h-4 accent-brand rounded">
                        <label for="gasto-externo" class="text-xs text-zinc-300">Pago por fonte externa (não afeta meu teto/salário)</label>
                    </div>
                    <button onclick="adicionarGasto()" class="w-full bg-brand hover:bg-purple-700 text-white font-black py-3 rounded-xl transition text-sm tracking-wider uppercase shadow-lg shadow-purple-900/40">
                        Registrar Movimentação
                    </button>
                </div>
            </div>

            <div class="space-y-3">
                <h4 class="font-black text-white text-sm uppercase tracking-wider ml-1">Fatura Atual do Mês</h4>
                <div id="fatura-list" class="space-y-2"></div>
            </div>
        </section>

        <section id="sec-fixos" class="hidden space-y-6">
            <div class="neo-card p-6 border-l-8 border-emerald-500">
                <h3 class="font-black text-white text-base">MaryJane</h3>
                <p class="text-3xl font-black text-white mt-1">R$ 300,00</p>
                <p class="text-[10px] text-zinc-400 mt-1 uppercase font-bold tracking-widest italic">Custo Mensal Fixo Principal</p>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="neo-card p-5 border-l-4 border-indigo-500">
                    <h4 class="text-[10px] font-black text-zinc-400 uppercase tracking-wider mb-2">Insumos</h4>
                    <p class="text-xl font-black text-white">R$ 100,00</p>
                    <p class="text-[10px] text-zinc-400 mt-1">Seda, Tabaco, Filtro</p>
                </div>
                <div class="neo-card p-5 border-l-4 border-amber-500">
                    <h4 class="text-[10px] font-black text-zinc-400 uppercase tracking-wider mb-2">Emergência</h4>
                    <p class="text-xl font-black text-white">R$ 100,00</p>
                    <p class="text-[10px] text-zinc-400 mt-1">Reserva de Segurança</p>
                </div>
            </div>

            <div class="neo-card p-6">
                <h3 class="font-black text-white text-base mb-3">Controle de Parcelas & Dívidas</h3>
                <div id="parcelas-list" class="space-y-4"></div>
            </div>
        </section>

        <section id="sec-investimentos" class="hidden space-y-6">
            <div class="neo-card p-6 bg-surfaceCard">
                <h3 class="font-black text-white text-base mb-4">Adicionar Novo Aporte</h3>
                <div class="space-y-3">
                    <input type="text" id="inv-nome" placeholder="Nome do Ativo (Ex: Tesouro IPCA+)" class="w-full bg-black border border-white/10 rounded-xl p-3 text-sm text-white placeholder-zinc-600 focus:border-brand outline-none">
                    <div class="flex space-x-2">
                        <input type="text" id="inv-banco" placeholder="Corretora / Banco" class="w-1/2 bg-black border border-white/10 rounded-xl p-3 text-sm text-white placeholder-zinc-600 focus:border-brand outline-none">
                        <select id="inv-tipo" class="w-1/2 bg-black border border-white/10 rounded-xl p-3 text-sm text-zinc-300 focus:border-brand outline-none">
                            <option value="CDB">CDB</option>
                            <option value="LCI/LCA">LCI / LCA</option>
                            <option value="Tesouro">Tesouro Direto</option>
                            <option value="Ações">Ações / FIIs</option>
                            <option value="Cripto">Criptomoeda</option>
                        </select>
                    </div>
                    <input type="number" step="0.01" id="inv-valor" placeholder="Valor Aportado (R$)" class="w-full bg-black border border-white/10 rounded-xl p-3 text-sm text-white placeholder-zinc-600 focus:border-brand outline-none">
                    <button onclick="adicionarInvestimento()" class="w-full bg-emerald-600 hover:bg-emerald-500 text-black font-black py-3 rounded-xl transition text-sm tracking-wider uppercase shadow-lg shadow-emerald-900/30">
                        Aportar Ativo
                    </button>
                </div>
            </div>

            <div class="space-y-3">
                <h4 class="font-black text-white text-sm uppercase tracking-wider ml-1">Sua Carteira de Ativos</h4>
                <div id="investimentos-list" class="space-y-3"></div>
            </div>
        </section>

        <section id="sec-mercado" class="hidden space-y-6">
            <div class="neo-card p-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="font-black text-white text-base">Moedas Fortes (Cotação Real)</h3>
                    <span class="text-[10px] bg-blue-950 text-blue-400 font-bold px-2 py-1 rounded-full animate-pulse">AO VIVO</span>
                </div>
                <div class="grid grid-cols-3 gap-3" id="fiat-grid">
                    <div class="bg-black/40 p-4 rounded-xl border border-white/5 text-center">
                        <span class="text-[10px] font-black text-zinc-500 uppercase">Dólar (USD)</span>
                        <p class="text-sm font-black text-white mt-1" id="fiat-usd">Carregando...</p>
                    </div>
                    <div class="bg-black/40 p-4 rounded-xl border border-white/5 text-center">
                        <span class="text-[10px] font-black text-zinc-500 uppercase">Euro (EUR)</span>
                        <p class="text-sm font-black text-white mt-1" id="fiat-eur">Carregando...</p>
                    </div>
                    <div class="bg-black/40 p-4 rounded-xl border border-white/5 text-center">
                        <span class="text-[10px] font-black text-zinc-500 uppercase">Yuan (CNY)</span>
                        <p class="text-sm font-black text-white mt-1" id="fiat-cny">Carregando...</p>
                    </div>
                </div>
            </div>

            <div class="neo-card p-6">
                <h3 class="font-black text-white text-base mb-2">Taxas Oficiais (Bacen)</h3>
                <p class="text-xs text-zinc-400 mb-4">Indicadores macroeconômicos oficiais em tempo real.</p>
                <div class="grid grid-cols-2 gap-3" id="bacen-grid">
                    <div class="bg-black/40 p-4 rounded-xl border border-white/5">
                        <span class="text-[10px] font-black text-zinc-500 uppercase">SELIC</span>
                        <p class="text-lg font-black text-white mt-1">10,50% a.a.</p>
                    </div>
                    <div class="bg-black/40 p-4 rounded-xl border border-white/5">
                        <span class="text-[10px] font-black text-zinc-500 uppercase">CDI</span>
                        <p class="text-lg font-black text-emerald-400 mt-1">10,40% a.a.</p>
                    </div>
                </div>
            </div>

            <div class="neo-card p-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="font-black text-white text-base">Radar Cripto (30+ Ativos Automáticos)</h3>
                    <span id="market-status" class="text-[10px] bg-emerald-950 text-emerald-400 font-bold px-2 py-1 rounded-full animate-pulse">Atualizando</span>
                </div>
                <div id="mercado-list" class="space-y-2 max-h-96 overflow-y-auto pr-1"></div>
            </div>
        </section>

        <section id="sec-noticias" class="hidden space-y-6">
            <div class="neo-card p-6">
                <h3 class="font-black text-white text-base mb-1">Radar de Notícias Econômicas & Jornais</h3>
                <p class="text-xs text-zinc-400 mb-4">Selecione abaixo quais jornais você deseja acompanhar no seu feed automatizado (32 Portais Livres):</p>
                <div class="flex flex-wrap gap-2 mb-6" id="fontes-selector"></div>
                <div id="noticias-container" class="space-y-3">
                    <div class="text-center py-8 text-zinc-500 text-sm animate-pulse">Carregando feed de notícias multicanal...</div>
                </div>
            </div>
        </section>

    </main>

    <div id="modal-menu" class="fixed inset-0 bg-black/80 backdrop-blur-md z-50 hidden flex justify-end">
        <div class="w-4/5 max-w-sm bg-surfaceCard h-full p-6 flex flex-col justify-between border-l border-white/10 shadow-2xl">
            <div>
                <div class="flex justify-between items-center mb-8">
                    <h2 class="text-lg font-black text-white tracking-wider">CONFIGURAÇÕES</h2>
                    <button onclick="fecharModalMenu()" class="text-zinc-400 hover:text-white font-bold text-xl px-2">✕</button>
                </div>
                
                <div class="space-y-4">
                    <div>
                        <label class="text-xs font-black text-zinc-400 uppercase tracking-widest block mb-2">Teto Máximo do Cartão (R$)</label>
                        <input type="number" id="config-teto" value="400" onchange="atualizarTetoConfig(this.value)" class="w-full bg-black border border-white/10 rounded-xl p-3 text-sm text-white font-bold focus:border-brand outline-none">
                    </div>
                    <div class="pt-4 border-t border-white/10 space-y-2">
                        <button onclick="gerarBackupJSON()" class="w-full bg-black border border-white/10 hover:border-brand text-white font-bold py-3 rounded-xl transition text-xs uppercase tracking-wider">
                            💾 Baixar Backup de Dados
                        </button>
                        <button onclick="restaurarBackupJSON()" class="w-full bg-black border border-white/10 hover:border-brand text-emerald-400 font-bold py-3 rounded-xl transition text-xs uppercase tracking-wider">
                            📂 Importar Backup
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="text-center text-[10px] text-zinc-600 font-bold">
                Dashboard Estilo 90 Pro • Versão Totalmente Automática
            </div>
        </div>
    </div>

    <script>
        // Registro automático de Service Worker para PWA Offline com suporte a cache
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./pwabuilder-sw.js')
                    .then(reg => console.log('Service Worker registrado:', reg))
                    .catch(err => console.log('Erro SW:', err));
            });
        }

        const DICAS_FINANCEIRAS = [
            { titulo: "A Parcimônia e o Capital", categoria: "ADAM SMITH", texto: "O capital não aumenta pelo trabalho, mas pela parcimônia. Sem economia, a riqueza gerada evapora.", acao: "Separe uma porcentagem fixa antes de pagar os boletos." },
            { titulo: "O Controle do Centro", categoria: "ESTRATÉGIA APLICADA", texto: "No xadrez, dominar o centro dita o ritmo. Nas finanças, sua taxa de poupança é o centro. Quem poupa, ataca.", acao: "Sua margem livre permite ditar o jogo ou você só reage aos boletos?" },
            { titulo: "O Preço da Descompressão", categoria: "PSICOLOGIA", texto: "Trabalhos de alta pressão disparam a necessidade de alívio rápido. Um lanche não é fome, é dopamina.", acao: "Orce seus alívios. Tenha uma verba mensal livre só para esses respiros." },
            { titulo: "Contabilidade Mental", categoria: "RICHARD THALER", texto: "Tendemos a gastar um 'bônus' com futilidades, mas protegemos o salário, embora o dinheiro seja o mesmo.", acao: "Trate restituições e dinheiro inesperado com o mesmo rigor do seu salário." },
            { titulo: "Custo de Oportunidade", categoria: "MICROECONOMIA", texto: "Consumir hoje é abrir mão dos rendimentos que esse dinheiro geraria amanhã.", acao: "Pergunte-se: O que eu construo no futuro se eu não comprar isso hoje?" },
            { titulo: "O Tempo e a Maravilha", categoria: "JUROS COMPOSTOS", texto: "A diferença entre começar cedo e tarde é brutal na curva exponencial de juros a longo prazo.", acao: "Não espere 'ter muito' para investir. O tempo no mercado vence o momento do mercado." }
        ];

        const FONTES_NOTICIAS_DISPONIVEIS = [
            { id: 'infomoney', nome: 'InfoMoney', rss: 'https://www.infomoney.com.br/feed/' },
            { id: 'g1_eco', nome: 'G1 Economia', rss: 'https://g1.globo.com/rss/g1/economia/' },
            { id: 'cnn_eco', nome: 'CNN Brasil Economia', rss: 'https://www.cnnbrasil.com.br/economia/feed/' },
            { id: 'exame', nome: 'Exame', rss: 'https://exame.com/feed/' },
            { id: 'investnews', nome: 'InvestNews', rss: 'https://investnews.com.br/feed/' },
            { id: 'neofeed', nome: 'NeoFeed', rss: 'https://neofeed.com.br/feed/' },
            { id: 'ag_brasil', nome: 'Agência Brasil', rss: 'https://agenciabrasil.ebc.com.br/economia/rss.xml' },
            { id: 'poder360', nome: 'Poder360', rss: 'https://www.poder360.com.br/feed/' },
            { id: 'money_times', nome: 'Money Times', rss: 'https://www.moneytimes.com.br/feed/' },
            { id: 'suno', nome: 'Suno Notícias', rss: 'https://www.suno.com.br/noticias/feed/' },
            { id: 'seu_dinheiro', nome: 'Seu Dinheiro', rss: 'https://www.seudinheiro.com/feed/' },
            { id: 'cointelegraph', nome: 'CoinTelegraph Brasil', rss: 'https://br.cointelegraph.com/rss' },
            { id: 'tecnoblog', nome: 'Tecnoblog', rss: 'https://tecnoblog.net/feed/' },
            { id: 'olhar_digital', nome: 'Olhar Digital', rss: 'https://olhardigital.com.br/feed/' },
            { id: 'e_investidor', nome: 'E-Investidor', rss: 'https://einvestidor.estadao.com.br/feed/' },
            { id: 'portal_btc', nome: 'Portal do Bitcoin', rss: 'https://portaldobitcoin.uol.com.br/feed/' },
            { id: 'blocktrends', nome: 'BlockTrends', rss: 'https://blocktrends.com.br/feed/' },
            { id: 'jornal_contabil', nome: 'Jornal Contábil', rss: 'https://www.jornalcontabil.com.br/feed/' },
            { id: 'guia_investidor', nome: 'Guia do Investidor', rss: 'https://guiadoinvestidor.com.br/feed/' },
            { id: 'investidor_10', nome: 'Investidor 10', rss: 'https://investidor10.com.br/noticias/feed/' },
            { id: 'mais_retorno', nome: 'Mais Retorno', rss: 'https://maisretorno.com/portal/feed' },
            { id: 'uol_eco', nome: 'UOL Economia', rss: 'https://noticias.uol.com.br/economia/ultimas/index.rss' },
            { id: 'terra_eco', nome: 'Terra Economia', rss: 'https://www.terra.com.br/noticias/economia/rss.xml' },
            { id: 'istoedinheiro', nome: 'IstoÉ Dinheiro', rss: 'https://www.istoedinheiro.com.br/feed/' },
            { id: 'cartacapital', nome: 'Carta Capital', rss: 'https://www.cartacapital.com.br/feed/' },
            { id: 'brasildefato', nome: 'Brasil de Fato', rss: 'https://www.brasildefato.com.br/rss2.xml' },
            { id: 'tecmundo', nome: 'TecMundo', rss: 'https://www.tecmundo.com.br/rss' },
            { id: 'canaltech', nome: 'Canaltech', rss: 'https://canaltech.com.br/rss/' },
            { id: 'forbes_br', nome: 'Forbes Brasil', rss: 'https://forbes.com.br/feed/' },
            { id: 'exame_negocios', nome: 'Exame Negócios', rss: 'https://exame.com/negocios/feed/' },
            { id: 'cryptoslate', nome: 'CryptoSlate', rss: 'https://cryptoslate.com/feed/' },
            { id: 'coindesk', nome: 'CoinDesk', rss: 'https://www.coindesk.com/arc/outboundfeeds/rss/' }
        ];

        let fontesAtivas = ['infomoney', 'g1_eco', 'cnn_eco', 'exame', 'money_times', 'suno'];

        const LISTA_CRIPTOS = [
            'BTC', 'ETH', 'SOL', 'BNB', 'XRP', 'ADA', 'DOGE', 'LINK', 'MATIC', 'AVAX',
            'LTC', 'BCH', 'ATOM', 'UNI', 'XLM', 'ALGO', 'VET', 'ICP', 'FIL', 'TRX',
            'ETC', 'EOS', 'THETA', 'AAVE', 'XTZ', 'AXS', 'SAND', 'MANA', 'GALA', 'EGLD'
        ];

        let appState = {
            salario: 1736,
            tetoCartao: 400,
            cartao: {
                fatura: [
                    { id: '1', nome: "GamePass", valor: 76.00, tag: "Serviço", isExterno: false },
                    { id: '2', nome: "ACR", valor: 73.72, tag: "Serviço", isExterno: false },
                    { id: '3', nome: "Vivo", valor: 74.00, tag: "Essencial", isExterno: false },
                    { id: '4', nome: "Calças (2/5)", valor: 63.96, tag: "Parcela", isExterno: false },
                    { id: '5', nome: "Fita 3M", valor: 40.00, tag: "Casa", isExterno: false },
                    { id: '6', nome: "Instrumentos (2/10)", valor: 86.86, tag: "Externo", isExterno: true }
                ]
            },
            parcelas: [
                { id: 'p1', nome: "Calças", paga: 2, total: 5, valor: 63.96, restante: 191.88, externa: false },
                { id: 'p2', nome: "Instrumentos", paga: 2, total: 10, valor: 86.86, restante: 694.88, externa: true }
            ],
            investimentos: [
                { id: 'inv1', nome: 'Tesouro IPCA+ 2035', banco: 'Tesouro Direto', tipo: 'Tesouro', valor: 500.00 },
                { id: 'inv2', nome: 'CDB 110% CDI', banco: 'Banco Inter', tipo: 'CDB', valor: 1200.00 }
            ]
        };

        function carregarDadosSalvos() {
            const salvo = localStorage.getItem('app90_state_v9_pro');
            if (salvo) {
                try { appState = JSON.parse(salvo); } catch(e) {}
            }
            const fontesSalvas = localStorage.getItem('app90_fontes_noticias');
            if(fontesSalvas) {
                try { fontesAtivas = JSON.parse(fontesSalvas); } catch(e) {}
            }
            document.getElementById('config-teto').value = appState.tetoCartao;
        }

        function salvarDadosState() {
            localStorage.setItem('app90_state_v9_pro', JSON.stringify(appState));
        }

        function switchTab(tabId) {
            document.querySelectorAll('main > section').forEach(s => s.classList.add('hidden'));
            document.getElementById(`sec-${tabId}`).classList.remove('hidden');
            
            document.querySelectorAll('.btn-nav').forEach(b => b.classList.remove('active'));
            document.getElementById(`tab-${tabId}`).classList.add('active');

            if(tabId === 'resumo') initMainChart();
            if(tabId === 'mercado') { buscarDadosMercado(); buscarFiatMoedas(); }
            if(tabId === 'noticias') renderizarSeletorNoticias();
        }

        function renderFatura() {
            const list = document.getElementById('fatura-list');
            let totalTetoGasto = 0;

            list.innerHTML = appState.cartao.fatura.map(item => {
                if(!item.isExterno) totalTetoGasto += item.valor;
                return `
                    <div class="neo-card p-4 flex justify-between items-center ${item.isExterno ? 'opacity-60 grayscale bg-zinc-950/40' : ''}">
                        <div>
                            <p class="font-black text-sm text-white">${item.nome}</p>
                            <span class="text-[9px] px-2 py-0.5 bg-black/60 rounded-full font-bold text-zinc-400 uppercase tracking-tighter">${item.tag}</span>
                        </div>
                        <div class="flex items-center space-x-3">
                            <div class="text-right">
                                <p class="font-black text-white text-sm">R$ ${item.valor.toFixed(2)}</p>
                                ${item.isExterno ? '<p class="text-[9px] text-blue-400 font-bold uppercase">Pago Externo</p>' : '<p class="text-[9px] text-emerald-400 font-bold uppercase">Entra no Teto</p>'}
                            </div>
                            <button onclick="removerItemFatura('${item.id}')" class="text-zinc-600 hover:text-danger font-bold text-xs p-1">✕</button>
                        </div>
                    </div>
                `;
            }).join('');

            const tetoMax = appState.tetoCartao;
            const pct = Math.min(100, (totalTetoGasto / tetoMax) * 100);
            const disponivel = tetoMax - totalTetoGasto;

            document.getElementById('teto-valor-label').innerText = `R$ ${tetoMax.toFixed(2)}`;
            document.getElementById('gasto-teto-txt').innerText = `Gasto no Teto: R$ ${totalTetoGasto.toFixed(2)}`;
            const dispEl = document.getElementById('disponivel-teto-txt');
            dispEl.innerText = `Disponível: R$ ${disponivel.toFixed(2)}`;
            dispEl.className = disponivel >= 0 ? 'text-emerald-400 font-bold' : 'text-danger font-bold';
            
            const bar = document.getElementById('teto-progress-bar');
            bar.style.width = `${pct}%`;
            bar.className = disponivel >= 0 ? 'bg-brand h-full rounded-full transition-all duration-500' : 'bg-danger h-full rounded-full transition-all duration-500';

            const fixaTotal = 500 + 200 + 200 + totalTetoGasto;
            const sobraLivre = appState.salario - fixaTotal;
            document.getElementById('header-sobra-livre').innerText = `R$ ${sobraLivre.toFixed(2)}`;
            renderParcelas();
        }

        function adicionarGasto() {
            const nome = document.getElementById('gasto-nome').value.trim();
            const valor = parseFloat(document.getElementById('gasto-valor').value);
            const tag = document.getElementById('gasto-tag').value;
            const isExterno = document.getElementById('gasto-externo').checked;

            if(!nome || isNaN(valor) || valor <= 0) return;

            appState.cartao.fatura.push({ id: Date.now().toString(), nome, valor, tag, isExterno });
            document.getElementById('gasto-nome').value = '';
            document.getElementById('gasto-valor').value = '';
            document.getElementById('gasto-externo').checked = false;

            salvarDadosState();
            renderFatura();
            initMainChart();
        }

        function removerItemFatura(id) {
            appState.cartao.fatura = appState.cartao.fatura.filter(i => i.id !== id);
            salvarDadosState();
            renderFatura();
            initMainChart();
        }

        function renderParcelas() {
            const list = document.getElementById('parcelas-list');
            if(!list) return;
            list.innerHTML = appState.parcelas.map(p => `
                <div class="neo-card p-4 relative overflow-hidden">
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <h4 class="font-black text-white text-sm">${p.nome}</h4>
                            <p class="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">${p.paga} de ${p.total} meses</p>
                        </div>
                        <span class="text-xs font-black bg-black/60 px-2 py-1 rounded-lg text-emerald-400">R$ ${p.valor.toFixed(2)}</span>
                    </div>
                    <div class="w-full bg-zinc-800 h-1.5 rounded-full mb-2">
                        <div class="bg-indigo-500 h-full rounded-full" style="width: ${(p.paga/p.total)*100}%"></div>
                    </div>
                    <div class="flex justify-between items-end">
                        <span class="text-[10px] text-zinc-500 font-bold">Saldo Restante</span>
                        <span class="text-xs font-bold text-zinc-300">R$ ${p.restante.toFixed(2)}</span>
                    </div>
                </div>
            `).join('');
        }

        function renderInvestimentos() {
            const list = document.getElementById('investimentos-list');
            list.innerHTML = appState.investimentos.map(i => `
                <div class="neo-card p-4 flex justify-between items-center">
                    <div>
                        <h4 class="font-black text-white text-sm">${i.nome}</h4>
                        <p class="text-[10px] text-zinc-400 uppercase font-bold">${i.banco} • ${i.tipo}</p>
                    </div>
                    <div class="flex items-center space-x-3">
                        <span class="font-black text-emerald-400 text-sm">R$ ${i.valor.toFixed(2)}</span>
                        <button onclick="removerInvestimento('${i.id}')" class="text-zinc-600 hover:text-danger font-bold text-xs p-1">✕</button>
                    </div>
                </div>
            `).join('');
        }

        function adicionarInvestimento() {
            const nome = document.getElementById('inv-nome').value.trim();
            const banco = document.getElementById('inv-banco').value.trim() || 'Carteira';
            const tipo = document.getElementById('inv-tipo').value;
            const valor = parseFloat(document.getElementById('inv-valor').value);

            if(!nome || isNaN(valor) || valor <= 0) return;

            appState.investimentos.push({ id: Date.now().toString(), nome, banco, tipo, valor });
            document.getElementById('inv-nome').value = '';
            document.getElementById('inv-banco').value = '';
            document.getElementById('inv-valor').value = '';

            salvarDadosState();
            renderInvestimentos();
        }

        function removerInvestimento(id) {
            appState.investimentos = appState.investimentos.filter(i => i.id !== id);
            salvarDadosState();
            renderInvestimentos();
        }

        let mainChartInstance = null;
        function initMainChart() {
            const ctx = document.getElementById('mainChart').getContext('2d');
            if(mainChartInstance) mainChartInstance.destroy();

            let totalCartaoTeto = 0;
            appState.cartao.fatura.forEach(i => { if(!i.isExterno) totalCartaoTeto += i.valor; });

            const fixos = 500;
            const vt = 200;
            const aporte = 200;
            const sobra = appState.salario - (fixos + vt + aporte + totalCartaoTeto);

            mainChartInstance = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Fixos', 'VT', 'Aporte', 'Cartão (Teto)', 'Sobra Livre'],
                    datasets: [{
                        data: [fixos, vt, aporte, totalCartaoTeto, Math.max(0, sobra)],
                        backgroundColor: ['#1e293b', '#d97706', '#6366f1', '#9D4EDD', '#00FF00'],
                        borderWidth: 0,
                        hoverOffset: 8
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    cutout: '72%',
                    plugins: {
                        legend: { position: 'bottom', labels: { boxWidth: 10, padding: 15, color: '#a1a1aa', font: { size: 10, weight: 'bold' } } }
                    }
                }
            });
        }

        let indiceDicaAtual = 0;
        function mudarDica(direcao) {
            indiceDicaAtual = (indiceDicaAtual + direcao + DICAS_FINANCEIRAS.length) % DICAS_FINANCEIRAS.length;
            const d = DICAS_FINANCEIRAS[indiceDicaAtual];
            document.getElementById('dica-categoria').innerText = d.categoria;
            document.getElementById('dica-contador').innerText = `[${indiceDicaAtual + 1} de ${DICAS_FINANCEIRAS.length}]`;
            document.getElementById('dica-titulo').innerText = d.titulo;
            document.getElementById('dica-texto').innerText = d.texto;
            document.getElementById('dica-acao').innerText = d.acao;
        }

        function carregarCenarioPadrao() {
            appState.salario = 1736;
            appState.tetoCartao = 400;
            appState.cartao.fatura = [
                { id: '1', nome: "GamePass", valor: 76.00, tag: "Serviço", isExterno: false },
                { id: '2', nome: "ACR", valor: 73.72, tag: "Serviço", isExterno: false },
                { id: '3', nome: "Vivo", valor: 74.00, tag: "Essencial", isExterno: false },
                { id: '4', nome: "Calças (2/5)", valor: 63.96, tag: "Parcela", isExterno: false },
                { id: '5', nome: "Fita 3M", valor: 40.00, tag: "Casa", isExterno: false },
                { id: '6', nome: "Instrumentos (2/10)", valor: 86.86, tag: "Externo", isExterno: true }
            ];
            salvarDadosState();
            renderFatura();
            renderParcelas();
            renderInvestimentos();
            initMainChart();
        }

        async function buscarFiatMoedas() {
            try {
                const res = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,CNY-BRL');
                const data = await res.json();
                if(data.USDBRL) document.getElementById('fiat-usd').innerText = `R$ ${Number(data.USDBRL.bid).toFixed(2)}`;
                if(data.EURBRL) document.getElementById('fiat-eur').innerText = `R$ ${Number(data.EURBRL.bid).toFixed(2)}`;
                if(data.CNYBRL) document.getElementById('fiat-cny').innerText = `R$ ${Number(data.CNYBRL.bid).toFixed(2)}`;
            } catch(e) {
                document.getElementById('fiat-usd').innerText = 'R$ 5,75';
                document.getElementById('fiat-eur').innerText = 'R$ 6,10';
                document.getElementById('fiat-cny').innerText = 'R$ 0,79';
            }
        }

        async function buscarDadosMercado() {
            const list = document.getElementById('mercado-list');
            try {
                const res = await fetch('https://api.binance.com/api/v3/ticker/price');
                const data = await res.json();
                
                let htmlContent = '';
                LISTA_CRIPTOS.forEach(symbol => {
                    const pair = data.find(i => i.symbol === `${symbol}BRL`);
                    if(pair) {
                        htmlContent += `
                            <div class="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5">
                                <span class="text-xs font-bold text-zinc-300">${symbol} / BRL</span>
                                <span class="text-sm font-black text-white">R$ ${Number(pair.price).toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                            </div>
                        `;
                    }
                });
                list.innerHTML = htmlContent;
                document.getElementById('market-status').innerText = 'Tempo Real (Ativo)';
            } catch(e) {
                list.innerHTML = `<p class="text-xs text-zinc-500 text-center py-4">Não foi possível carregar o radar cripto completo no momento.</p>`;
            }
        }

        function renderizarSeletorNoticias() {
            const selector = document.getElementById('fontes-selector');
            selector.innerHTML = FONTES_NOTICIAS_DISPONIVEIS.map(f => {
                const ativa = fontesAtivas.includes(f.id);
                return `
                    <button onclick="toggleFonte('${f.id}')" class="px-3 py-1.5 rounded-full text-xs font-bold border transition ${ativa ? 'bg-brand text-white border-brand' : 'bg-black/40 text-zinc-400 border-white/10 hover:border-white/30'}">
                        ${ativa ? '✓ ' : '+ '}${f.nome}
                    </button>
                `;
            }).join('');
            buscarNoticiasMulti();
        }

        function toggleFonte(id) {
            if(fontesAtivas.includes(id)) {
                if(fontesAtivas.length === 1) return;
                fontesAtivas = fontesAtivas.filter(f => f !== id);
            } else {
                fontesAtivas.push(id);
            }
            localStorage.setItem('app90_fontes_noticias', JSON.stringify(fontesAtivas));
            renderizarSeletorNoticias();
        }

        async function buscarNoticiasMulti() {
            const container = document.getElementById('noticias-container');
            container.innerHTML = `<div class="text-center py-8 text-zinc-400 text-sm animate-pulse">Buscando atualizações dos jornais selecionados...</div>`;
            
            let todasNoticias = [];
            for(const fonteId of fontesAtivas) {
                const portal = FONTES_NOTICIAS_DISPONIVEIS.find(f => f.id === fonteId);
                if(portal) {
                    try {
                        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(portal.rss)}`);
                        const data = await res.json();
                        if(data.items && data.items.length > 0) {
                            data.items.slice(0, 3).forEach(item => {
                                todasNoticias.push({ ...item, fonteNome: portal.nome });
                            });
                        }
                    } catch(e) {}
                }
            }

            if(todasNoticias.length > 0) {
                container.innerHTML = todasNoticias.map(item => `
                    <a href="${item.link}" target="_blank" class="block bg-black/40 p-4 rounded-xl border border-white/5 hover:border-brand transition">
                        <div class="flex items-center space-x-2 mb-1">
                            <span class="text-[9px] bg-purple-950 text-purple-300 font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">${item.fonteNome}</span>
                            <span class="text-[9px] text-zinc-500 font-bold">${new Date(item.pubDate).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <h4 class="text-xs font-black text-white mb-1">${item.title}</h4>
                        <p class="text-[10px] text-zinc-400 line-clamp-2">${item.description ? item.description.replace(/<[^>]*>?/gm, '') : ''}</p>
                    </a>
                `).join('');
            } else {
                container.innerHTML = `<p class="text-xs text-zinc-500 text-center py-4">Sem novas publicações recentes nos canais selecionados.</p>`;
            }
        }

        function abrirModalMenu() { document.getElementById('modal-menu').classList.remove('hidden'); }
        function fecharModalMenu() { document.getElementById('modal-menu').classList.add('hidden'); }
        
        function atualizarTetoConfig(val) {
            const n = parseFloat(val);
            if(!isNaN(n) && n > 0) {
                appState.tetoCartao = n;
                salvarDadosState();
                renderFatura();
            }
        }

        function gerarBackupJSON() {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState, null, 2));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", "dashboard_financeiro_90_pro_backup.json");
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
        }

        function restaurarBackupJSON() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = e => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = event => {
                    try {
                        appState = JSON.parse(event.target.result);
                        salvarDadosState();
                        renderFatura();
                        renderParcelas();
                        renderInvestimentos();
                        initMainChart();
                        fecharModalMenu();
                    } catch(err) {}
                };
                reader.readAsText(file);
            };
            input.click();
        }

        window.onload = () => {
            carregarDadosSalvos();
            renderFatura();
            renderParcelas();
            renderInvestimentos();
            initMainChart();
            buscarDadosMercado();
            buscarFiatMoedas();
        };
    </script>
</body>
</html>
