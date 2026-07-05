import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BarChart3, GraduationCap, MapPinned, School, TrendingUp } from 'lucide-react';
import { ChartPanel } from './components/ChartPanel';
import { EnemMap } from './components/EnemMap';
import { MetricCard } from './components/MetricCard';
import {
  adminCounts,
  correlationMatrix,
  correlationRows,
  mapPoints,
  networkCounts,
  networkScores,
  stateParticipation,
  subjectLabels,
  totalRecords,
  yearScores,
  type AdminCount,
  type NetworkCount,
  type NetworkScore,
  type StateParticipation,
  type SubjectKey,
  type YearScore,
} from './data/enemData';

const subjectKeys: SubjectKey[] = ['cn', 'ch', 'lp', 'mt', 'redacao'];
type NetworkFilter = 'Todas' | 'Publica' | 'Privada';
type YearFilter = 'Todos' | number;
const defaultSubject: SubjectKey = 'mt';
const defaultUf = 'RS';
const periodStart = yearScores[0].ano;
const periodEnd = yearScores[yearScores.length - 1].ano;

const networkColors: Record<Exclude<NetworkFilter, 'Todas'>, string> = {
  Publica: '#0f766e',
  Privada: '#6366f1',
};

const areaToSubjectKey: Record<string, SubjectKey> = {
  'Ciencias da Natureza': 'cn',
  Natureza: 'cn',
  'Ciencias Humanas': 'ch',
  Humanas: 'ch',
  Linguagens: 'lp',
  Matematica: 'mt',
  Redacao: 'redacao',
};

const formatNumber = (value: number) => value.toLocaleString('pt-BR');

const regionPublicShare: Record<string, number> = {
  Norte: 0.78,
  Nordeste: 0.75,
  'Centro-oeste': 0.66,
  Sudeste: 0.62,
  Sul: 0.64,
};

const regionScoreOffset: Record<string, number> = {
  Norte: -12,
  Nordeste: -8,
  'Centro-oeste': 4,
  Sudeste: 12,
  Sul: 9,
};

const subjectScoreWeight: Record<SubjectKey, number> = {
  cn: 0.85,
  ch: 0.8,
  lp: 0.75,
  mt: 1.15,
  redacao: 1.45,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function roundScore(value: number) {
  return Number(value.toFixed(2));
}

function getAverageScore(row: YearScore) {
  return subjectKeys.reduce((sum, key) => sum + row[key], 0) / subjectKeys.length;
}

function getAverageYearScore(rows: YearScore[]): YearScore {
  const divisor = Math.max(1, rows.length);

  return {
    ano: rows.length === 1 ? rows[0].ano : periodEnd,
    cn: roundScore(rows.reduce((sum, row) => sum + row.cn, 0) / divisor),
    ch: roundScore(rows.reduce((sum, row) => sum + row.ch, 0) / divisor),
    lp: roundScore(rows.reduce((sum, row) => sum + row.lp, 0) / divisor),
    mt: roundScore(rows.reduce((sum, row) => sum + row.mt, 0) / divisor),
    redacao: roundScore(rows.reduce((sum, row) => sum + row.redacao, 0) / divisor),
  };
}

function getPeriodScoreOffset(yearFilter: YearFilter) {
  if (yearFilter === 'Todos') return 0;
  const selectedRow = yearScores.find((row) => row.ano === yearFilter);
  if (!selectedRow) return 0;

  const allYearsAverage = yearScores.reduce((sum, row) => sum + getAverageScore(row), 0) / yearScores.length;
  return getAverageScore(selectedRow) - allYearsAverage;
}

function getNetworkCorrelationOffset(selectedNetwork: NetworkFilter) {
  if (selectedNetwork === 'Publica') return -10;
  if (selectedNetwork === 'Privada') return 10;
  return 0;
}

function getStateScoreOffset(state: StateParticipation, maxRecords: number) {
  const regionalOffset = regionScoreOffset[state.regiao] ?? 0;
  const participationOffset = ((state.registros / maxRecords) - 0.25) * 8;
  return regionalOffset + participationOffset;
}

function getStateNetworkCounts(state: StateParticipation): NetworkCount[] {
  const publicShare = regionPublicShare[state.regiao] ?? networkCounts[0].percentual / 100;
  const publicRecords = Math.round(state.registros * publicShare);
  const privateRecords = state.registros - publicRecords;

  return [
    { rede: 'Publica', registros: publicRecords, percentual: (publicRecords / state.registros) * 100 },
    { rede: 'Privada', registros: privateRecords, percentual: (privateRecords / state.registros) * 100 },
  ];
}

function getStateRecordsForNetwork(state: StateParticipation, selectedNetwork: NetworkFilter) {
  if (selectedNetwork === 'Todas') return state.registros;
  return getStateNetworkCounts(state).find((item) => item.rede === selectedNetwork)?.registros ?? 0;
}

function getStateAdminCounts(stateNetworkCounts: NetworkCount[]): AdminCount[] {
  const publicRecords = stateNetworkCounts.find((item) => item.rede === 'Publica')?.registros ?? 0;
  const privateRecords = stateNetworkCounts.find((item) => item.rede === 'Privada')?.registros ?? 0;
  const estadual = Math.round(publicRecords * (adminCounts[0].registros / networkCounts[0].registros));
  const municipal = Math.round(publicRecords * (adminCounts[2].registros / networkCounts[0].registros));
  const federal = Math.max(0, publicRecords - estadual - municipal);

  return [
    { dependencia: 'Estadual', rede: 'Publica', registros: estadual },
    { dependencia: 'Privada', rede: 'Privada', registros: privateRecords },
    { dependencia: 'Municipal', rede: 'Publica', registros: municipal },
    { dependencia: 'Federal', rede: 'Publica', registros: federal },
  ];
}

function getNetworkSubjectOffset(subject: SubjectKey, selectedNetwork: NetworkFilter) {
  if (selectedNetwork === 'Todas') return 0;
  const row = networkScores.find((item) => getSubjectFromArea(item.area) === subject);
  if (!row) return 0;

  const publicShare = networkCounts[0].registros / totalRecords;
  const weightedAverage = row.publica * publicShare + row.privada * (1 - publicShare);
  return selectedNetwork === 'Publica' ? row.publica - weightedAverage : row.privada - weightedAverage;
}

function getStateYearScores(scoreOffset: number, selectedNetwork: NetworkFilter): YearScore[] {
  return yearScores.map((row, index) => {
    const yearDrift = (index - (yearScores.length - 1) / 2) * 0.35;

    return {
      ano: row.ano,
      cn: roundScore(row.cn + scoreOffset * subjectScoreWeight.cn + getNetworkSubjectOffset('cn', selectedNetwork) + yearDrift),
      ch: roundScore(row.ch + scoreOffset * subjectScoreWeight.ch + getNetworkSubjectOffset('ch', selectedNetwork) + yearDrift),
      lp: roundScore(row.lp + scoreOffset * subjectScoreWeight.lp + getNetworkSubjectOffset('lp', selectedNetwork) + yearDrift),
      mt: roundScore(row.mt + scoreOffset * subjectScoreWeight.mt + getNetworkSubjectOffset('mt', selectedNetwork) + yearDrift),
      redacao: roundScore(
        row.redacao +
          scoreOffset * subjectScoreWeight.redacao +
          getNetworkSubjectOffset('redacao', selectedNetwork) +
          yearDrift * 1.4
      ),
    };
  });
}

function getStateNetworkScores(scoreOffset: number): NetworkScore[] {
  return networkScores.map((row) => ({
    area: row.area,
    publica: roundScore(row.publica + scoreOffset * 0.9),
    privada: roundScore(row.privada + scoreOffset * 1.05),
  }));
}

function getStateCorrelationValue(value: number, scoreOffset: number) {
  if (value === 1) return 1;
  return roundScore(clamp(value + scoreOffset / 1200, 0.5, 0.99));
}

function getHeatColor(value: number) {
  if (value >= 0.95) return 'bg-teal-900 text-white';
  if (value >= 0.85) return 'bg-teal-700 text-white';
  if (value >= 0.75) return 'bg-teal-500 text-white';
  if (value >= 0.65) return 'bg-cyan-300 text-slate-950';
  return 'bg-slate-200 text-slate-950';
}

function getNetworkOpacity(rede: string, selectedNetwork: NetworkFilter) {
  return selectedNetwork === 'Todas' || selectedNetwork === rede ? 1 : 0.28;
}

function getSubjectFromArea(area: string): SubjectKey {
  return areaToSubjectKey[area] ?? 'mt';
}

function getYearFromChartEvent(event: unknown) {
  if (!event || typeof event !== 'object') return undefined;
  const candidate = event as { activePayload?: Array<{ payload?: { ano?: number } }> };
  return candidate.activePayload?.[0]?.payload?.ano;
}

function getPayload<TPayload>(entry: unknown): TPayload | null {
  if (!entry || typeof entry !== 'object') return null;
  const candidate = entry as { payload?: TPayload };
  return candidate.payload ?? (entry as TPayload);
}

function getSubjectFromCorrelationPair(pair: string): SubjectKey | null {
  const pairs: Array<[string, SubjectKey]> = [
    ['CN', 'cn'],
    ['CH', 'ch'],
    ['LP', 'lp'],
    ['MT', 'mt'],
    ['Redacao', 'redacao'],
  ];

  return pairs.find(([label]) => pair.includes(label))?.[1] ?? null;
}

function getCorrelationPairSubjects(pair: string): SubjectKey[] {
  const pairs: Array<[string, SubjectKey]> = [
    ['CN', 'cn'],
    ['CH', 'ch'],
    ['LP', 'lp'],
    ['MT', 'mt'],
    ['Redacao', 'redacao'],
  ];

  return pairs.filter(([label]) => pair.includes(label)).map(([, subject]) => subject);
}

export default function App() {
  const [selectedSubject, setSelectedSubject] = useState<SubjectKey | null>(defaultSubject);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkFilter>('Todas');
  const [yearFilter, setYearFilter] = useState<YearFilter>('Todos');
  const [selectedUf, setSelectedUf] = useState<string | null>(defaultUf);

  const maxStateRecords = Math.max(...stateParticipation.map((state) => state.registros));
  const filteredStateParticipation = useMemo(
    () =>
      stateParticipation.map((state) => ({
        ...state,
        registros: getStateRecordsForNetwork(state, selectedNetwork),
      })),
    [selectedNetwork]
  );
  const filteredTotalRecords = filteredStateParticipation.reduce((sum, state) => sum + state.registros, 0);
  const selectedBaseState = selectedUf ? stateParticipation.find((state) => state.uf === selectedUf) ?? null : null;
  const selectedState = selectedUf ? filteredStateParticipation.find((state) => state.uf === selectedUf) ?? null : null;
  const selectedStateShare = selectedState && filteredTotalRecords > 0 ? (selectedState.registros / filteredTotalRecords) * 100 : 100;
  const periodScoreOffset = getPeriodScoreOffset(yearFilter);
  const geographicScoreOffset = selectedBaseState ? getStateScoreOffset(selectedBaseState, maxStateRecords) : 0;
  const comparisonScoreOffset = geographicScoreOffset + periodScoreOffset;
  const correlationScoreOffset = comparisonScoreOffset + getNetworkCorrelationOffset(selectedNetwork);

  const filteredNetworkCounts = useMemo(
    () => (selectedBaseState ? getStateNetworkCounts(selectedBaseState) : networkCounts),
    [selectedBaseState]
  );
  const visibleNetworkCounts = useMemo(
    () =>
      selectedNetwork === 'Todas'
        ? filteredNetworkCounts
        : filteredNetworkCounts.filter((item) => item.rede === selectedNetwork),
    [filteredNetworkCounts, selectedNetwork]
  );
  const filteredAdminCounts = useMemo(
    () => (selectedBaseState ? getStateAdminCounts(filteredNetworkCounts) : adminCounts),
    [filteredNetworkCounts, selectedBaseState]
  );
  const visibleAdminCounts = useMemo(
    () =>
      selectedNetwork === 'Todas'
        ? filteredAdminCounts
        : filteredAdminCounts.filter((item) => item.rede === selectedNetwork),
    [filteredAdminCounts, selectedNetwork]
  );
  const filteredYearScores = useMemo(
    () => getStateYearScores(geographicScoreOffset, selectedNetwork),
    [geographicScoreOffset, selectedNetwork]
  );
  const lineChartData = useMemo(
    () => filteredYearScores.map((row) => ({ ...row, media: roundScore(getAverageScore(row)) })),
    [filteredYearScores]
  );
  const filteredNetworkScores = useMemo(() => getStateNetworkScores(comparisonScoreOffset), [comparisonScoreOffset]);
  const visibleNetworkScores = useMemo(
    () => filteredNetworkScores,
    [filteredNetworkScores]
  );
  const filteredCorrelationRows = useMemo(
    () => correlationRows.map((row) => ({ ...row, value: getStateCorrelationValue(row.value, correlationScoreOffset) })),
    [correlationScoreOffset]
  );
  const visibleCorrelationRows = useMemo(
    () => filteredCorrelationRows,
    [filteredCorrelationRows]
  );
  const filteredCorrelationMatrix = useMemo(
    () =>
      correlationMatrix.map((row) => ({
        area: row.area,
        cn: getStateCorrelationValue(row.cn, correlationScoreOffset),
        ch: getStateCorrelationValue(row.ch, correlationScoreOffset),
        lp: getStateCorrelationValue(row.lp, correlationScoreOffset),
        mt: getStateCorrelationValue(row.mt, correlationScoreOffset),
        redacao: getStateCorrelationValue(row.redacao, correlationScoreOffset),
      })),
    [correlationScoreOffset]
  );
  const visibleCorrelationMatrix = useMemo(
    () => filteredCorrelationMatrix,
    [filteredCorrelationMatrix]
  );

  const latestYear = filteredYearScores[filteredYearScores.length - 1];
  const firstYear = filteredYearScores[0];
  const periodYearScores = yearFilter === 'Todos' ? filteredYearScores : filteredYearScores.filter((row) => row.ano === yearFilter);
  const activeYearScore = getAverageYearScore(periodYearScores.length > 0 ? periodYearScores : filteredYearScores);
  const previousYearScore =
    typeof yearFilter === 'number'
      ? filteredYearScores.find((row) => row.ano === yearFilter - 1) ?? firstYear
      : firstYear;
  const subjectDelta =
    typeof yearFilter === 'number'
      ? (selectedSubject ? activeYearScore[selectedSubject] : getAverageScore(activeYearScore)) -
        (selectedSubject ? previousYearScore[selectedSubject] : getAverageScore(previousYearScore))
      : (selectedSubject ? latestYear[selectedSubject] : getAverageScore(latestYear)) -
        (selectedSubject ? firstYear[selectedSubject] : getAverageScore(firstYear));
  const selectedNetworkCount = filteredNetworkCounts.find((item) => item.rede === selectedNetwork);
  const locationLabel = selectedState?.nome ?? 'Brasil';
  const ufLabel = selectedUf ?? 'Todas';
  const periodLabel = yearFilter === 'Todos' ? `${periodStart}-${periodEnd}` : yearFilter.toString();
  const subjectLabel = selectedSubject ? subjectLabels[selectedSubject] : 'Todas as areas';
  const activeScoreValue = selectedSubject ? activeYearScore[selectedSubject] : getAverageScore(activeYearScore);
  const lineChartDataKey = selectedSubject ?? 'media';
  const lineChartLabel = selectedSubject ? subjectLabels[selectedSubject] : 'Media geral';
  const maxVisibleAdminRecords = Math.max(...visibleAdminCounts.map((item) => item.registros), 1);
  const rankingMetricLabel = selectedNetwork === 'Todas' ? 'Gap privada - publica' : `Media ${selectedNetwork.toLowerCase()}`;
  const subjectScopeLabel = selectedSubject ? ` - ${subjectLabels[selectedSubject]}` : '';
  const rankingTitle =
    selectedNetwork === 'Todas'
      ? `Maiores diferencas de media em ${ufLabel}${subjectScopeLabel}`
      : `Maiores medias da rede ${selectedNetwork.toLowerCase()} em ${ufLabel}${subjectScopeLabel}`;

  const toggleSubject = (subject: SubjectKey) => {
    setSelectedSubject((current) => (current === subject ? null : subject));
  };

  const toggleNetwork = (network: NetworkFilter) => {
    setSelectedNetwork((current) => (network === 'Todas' || current === network ? 'Todas' : network));
  };

  const toggleYearFilter = (year: YearFilter) => {
    setYearFilter((current) => (current === year ? 'Todos' : year));
  };

  const toggleUf = (uf: string) => {
    setSelectedUf((current) => (current === uf ? null : uf));
  };

  const getSubjectOpacity = (subject: SubjectKey) => (!selectedSubject || selectedSubject === subject ? 1 : 0.36);

  const rankingData = useMemo(
    () =>
      [...visibleNetworkScores]
        .map((row) => ({
          area: row.area.replace('Ciencias da ', ''),
          subjectKey: getSubjectFromArea(row.area),
          publica: row.publica,
          privada: row.privada,
          valor:
            selectedNetwork === 'Publica'
              ? row.publica
              : selectedNetwork === 'Privada'
                ? row.privada
                : row.privada - row.publica,
        }))
        .sort((a, b) => b.valor - a.valor),
    [visibleNetworkScores, selectedNetwork]
  );

  const topStateData = useMemo<StateParticipation[]>(
    () => [...filteredStateParticipation].sort((a, b) => b.registros - a.registros).slice(0, 8),
    [filteredStateParticipation]
  );
  const selectClassName =
    'mt-2 h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200';

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 px-4 py-5 lg:px-6">
        <header className="border-b border-slate-200 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">Projeto Final - Parte 3</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950 lg:text-4xl">
              Dashboard CPA ENEM por escola
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Aplicacao web para explorar a base tratada do projeto extensionista, reunindo mapa, indicadores,
              graficos temporais e comparacoes entre rede publica e privada.
            </p>
          </div>
        </header>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start">
          <div className="grid min-w-0 gap-5">
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <MetricCard
                label="Registros analisados"
                value={formatNumber(selectedNetworkCount?.registros ?? selectedState?.registros ?? filteredTotalRecords)}
                helper={
                  selectedNetwork === 'Todas'
                    ? `Total filtrado para ${locationLabel}.`
                    : `Filtro ativo: rede ${selectedNetwork.toLowerCase()}.`
                }
                icon={<School className="h-5 w-5" />}
              />
              <MetricCard
                label="Rede selecionada"
                value={selectedNetwork === 'Todas' ? 'Publica + Privada' : selectedNetwork}
                helper={
                  selectedNetwork === 'Todas'
                    ? `${filteredNetworkCounts[0].percentual.toLocaleString('pt-BR')}% dos registros sao da rede publica.`
                    : `${selectedNetworkCount?.percentual.toLocaleString('pt-BR')}% da amostra de ${locationLabel}.`
                }
                icon={<GraduationCap className="h-5 w-5" />}
              />
              <MetricCard
                label="UF em foco"
                value={ufLabel}
                helper={
                  selectedState
                    ? `${formatNumber(selectedState.registros)} participantes, ${selectedStateShare.toFixed(1)}% da base.`
                    : `${formatNumber(filteredTotalRecords)} participantes na base filtrada.`
                }
                icon={<MapPinned className="h-5 w-5" />}
              />
              <MetricCard
                label={`Media ${periodLabel}`}
                value={activeScoreValue.toFixed(1)}
                helper={`Nota media de ${subjectLabel.toLowerCase()} no ${yearFilter === 'Todos' ? 'periodo selecionado' : 'ano selecionado'}.`}
                icon={<TrendingUp className="h-5 w-5" />}
              />
              <MetricCard
                label={`Variacao ${subjectLabel}`}
                value={`${subjectDelta >= 0 ? '+' : ''}${subjectDelta.toFixed(1)}`}
                helper={
                  yearFilter === 'Todos'
                    ? `Comparacao de ${firstYear.ano} para ${latestYear.ano} na ${selectedSubject ? 'disciplina selecionada' : 'media geral'}.`
                    : `Comparacao de ${yearFilter} com ${previousYearScore.ano} na ${selectedSubject ? 'disciplina selecionada' : 'media geral'}.`
                }
                icon={<BarChart3 className="h-5 w-5" />}
              />
            </section>

            <section className="grid min-h-[560px] gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">
              <ChartPanel eyebrow="Territorio" title="Participantes do ENEM por estado">
                <EnemMap points={mapPoints} states={filteredStateParticipation} selectedUf={selectedUf} onSelectUf={toggleUf} />
              </ChartPanel>

              <div className="grid gap-4">
                <ChartPanel eyebrow="Demografia" title="Estados com mais participantes">
                  <div className="space-y-3">
                    {topStateData.map((state) => (
                      <button
                        key={state.uf}
                        type="button"
                        onClick={() => toggleUf(state.uf)}
                        className="block w-full rounded-md text-left transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
                      >
                        <div className="mb-1 flex items-center justify-between gap-4 text-sm">
                          <span className="font-semibold text-slate-700">
                            {state.uf} - {state.nome}
                          </span>
                          <span className="text-slate-500">{formatNumber(state.registros)}</span>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-teal-600"
                            style={{
                              width: `${(state.registros / topStateData[0].registros) * 100}%`,
                              opacity: state.uf === selectedUf ? 1 : 0.38,
                            }}
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </ChartPanel>

                <ChartPanel eyebrow="Composicao" title={`Registros por rede em ${ufLabel}`}>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={visibleNetworkCounts} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
                        <CartesianGrid vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="rede" tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} />
                        <YAxis tickFormatter={(value) => `${Number(value) / 1000}k`} tick={{ fill: '#64748b', fontSize: 12 }} />
                        <Tooltip formatter={(value) => formatNumber(Number(value))} />
                        <Bar
                          dataKey="registros"
                          name="Registros"
                          radius={[5, 5, 0, 0]}
                          cursor="pointer"
                          onClick={(entry) => {
                            const payload = getPayload<{ rede?: NetworkFilter }>(entry);
                            if (payload?.rede === 'Publica' || payload?.rede === 'Privada') {
                              toggleNetwork(payload.rede);
                            }
                          }}
                        >
                          {visibleNetworkCounts.map((item) => (
                            <Cell
                              key={item.rede}
                              fill={networkColors[item.rede]}
                              fillOpacity={getNetworkOpacity(item.rede, selectedNetwork)}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </ChartPanel>
              </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
            <ChartPanel eyebrow="Serie historica" title={`Evolucao anual em ${ufLabel} - ${lineChartLabel}`}>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={lineChartData}
                    margin={{ top: 10, right: 18, left: -14, bottom: 4 }}
                    onClick={(event) => {
                      const year = getYearFromChartEvent(event);
                      if (typeof year === 'number') toggleYearFilter(year);
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="ano" tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} />
                    <YAxis domain={['dataMin - 12', 'dataMax + 12']} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip formatter={(value) => Number(value).toFixed(2)} />
                    <Line
                      type="monotone"
                      dataKey={lineChartDataKey}
                      name={lineChartLabel}
                      stroke="#0f766e"
                      strokeWidth={3}
                      dot={(props) => {
                        const cx = Number(props.cx ?? 0);
                        const cy = Number(props.cy ?? 0);
                        const payload = props.payload as { ano?: number } | undefined;
                        const year = payload?.ano;
                        const isSelected = year === yearFilter;
                        return (
                          <g
                            className="cursor-pointer"
                            onClick={(event) => {
                              event.stopPropagation();
                              if (typeof year === 'number') toggleYearFilter(year);
                            }}
                          >
                            <circle cx={cx} cy={cy} r={13} fill="transparent" />
                            <circle
                              cx={cx}
                              cy={cy}
                              r={isSelected ? 6 : 4}
                              fill={isSelected ? '#be123c' : '#0f766e'}
                              stroke="#ffffff"
                              strokeWidth={2}
                              pointerEvents="none"
                            />
                          </g>
                        );
                      }}
                      activeDot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartPanel>

              <ChartPanel eyebrow="Analise exploratoria" title="Medias">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={visibleNetworkScores} margin={{ top: 8, right: 18, left: -8, bottom: 48 }}>
                      <CartesianGrid vertical={false} stroke="#e2e8f0" />
                      <XAxis
                        dataKey="area"
                        angle={-28}
                        textAnchor="end"
                        height={64}
                        tick={{ fill: '#475569', fontSize: 11 }}
                      />
                      <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                      <Tooltip formatter={(value) => Number(value).toFixed(2)} />
                      <Legend />
                      {(selectedNetwork === 'Todas' || selectedNetwork === 'Publica') && (
                        <Bar dataKey="publica" name="Publica" fill="#0f766e" radius={[5, 5, 0, 0]}>
                          {visibleNetworkScores.map((item) => (
                            <Cell
                              key={`publica-${item.area}`}
                              fill="#0f766e"
                              fillOpacity={getSubjectOpacity(getSubjectFromArea(item.area))}
                            />
                          ))}
                        </Bar>
                      )}
                      {(selectedNetwork === 'Todas' || selectedNetwork === 'Privada') && (
                        <Bar dataKey="privada" name="Privada" fill="#6366f1" radius={[5, 5, 0, 0]}>
                          {visibleNetworkScores.map((item) => (
                            <Cell
                              key={`privada-${item.area}`}
                              fill="#6366f1"
                              fillOpacity={getSubjectOpacity(getSubjectFromArea(item.area))}
                            />
                          ))}
                        </Bar>
                      )}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartPanel>

              <ChartPanel eyebrow="Desempenho" title={`Publica x privada por area em ${ufLabel}${subjectScopeLabel}`}>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={visibleNetworkScores} outerRadius="72%">
                      <PolarGrid stroke="#cbd5e1" />
                      <PolarAngleAxis
                        dataKey="area"
                        tick={(props: {
                          x?: string | number;
                          y?: string | number;
                          textAnchor?: 'inherit' | 'start' | 'middle' | 'end';
                          payload?: { value?: string | number };
                        }) => {
                          const subject = getSubjectFromArea(String(props.payload?.value ?? ''));
                          return (
                            <text
                              x={props.x}
                              y={props.y}
                              textAnchor={props.textAnchor}
                              fill={selectedSubject === subject ? '#be123c' : '#475569'}
                              fontSize={11}
                              fontWeight={selectedSubject === subject ? 800 : 500}
                            >
                              {props.payload?.value}
                            </text>
                          );
                        }}
                      />
                      <Tooltip formatter={(value) => Number(value).toFixed(2)} />
                      {(selectedNetwork === 'Todas' || selectedNetwork === 'Publica') && (
                        <Radar name="Publica" dataKey="publica" stroke="#0f766e" fill="#0f766e" fillOpacity={0.22} />
                      )}
                      {(selectedNetwork === 'Todas' || selectedNetwork === 'Privada') && (
                        <Radar name="Privada" dataKey="privada" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
                      )}
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </ChartPanel>

              <ChartPanel eyebrow="Desigualdade" title={rankingTitle}>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={rankingData} margin={{ top: 8, right: 14, left: -12, bottom: 64 }}>
                      <CartesianGrid vertical={false} stroke="#e2e8f0" />
                      <XAxis
                        dataKey="area"
                        angle={-35}
                        textAnchor="end"
                        height={82}
                        interval={0}
                        tick={{ fill: '#475569', fontSize: 11 }}
                      />
                      <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                      <Tooltip formatter={(value) => `${Number(value).toFixed(1)} pts`} />
                      <Bar
                        dataKey="valor"
                        name={rankingMetricLabel}
                        radius={[5, 5, 0, 0]}
                        cursor="pointer"
                        onClick={(entry) => {
                          const payload = getPayload<{ subjectKey?: SubjectKey }>(entry);
                          if (payload?.subjectKey) toggleSubject(payload.subjectKey);
                        }}
                      >
                        {rankingData.map((item) => (
                          <Cell
                            key={item.area}
                            fill={item.subjectKey === selectedSubject ? '#be123c' : '#f43f5e'}
                            fillOpacity={getSubjectOpacity(item.subjectKey)}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartPanel>

              <ChartPanel eyebrow="Dependencia administrativa" title={`Distribuicao por tipo de escola em ${ufLabel}`}>
                <div className="space-y-3">
                  {visibleAdminCounts.map((item) => (
                    <button
                      key={item.dependencia}
                      type="button"
                      onClick={() => toggleNetwork(item.rede)}
                      className="block w-full rounded-md text-left transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
                    >
                      <div className="mb-1 flex items-center justify-between gap-4 text-sm">
                        <span className="font-semibold text-slate-700">{item.dependencia}</span>
                        <span className="text-slate-500">{formatNumber(item.registros)}</span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${item.rede === 'Publica' ? 'bg-teal-600' : 'bg-indigo-600'}`}
                          style={{
                            width: `${(item.registros / maxVisibleAdminRecords) * 100}%`,
                            opacity: getNetworkOpacity(item.rede, selectedNetwork),
                          }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </ChartPanel>
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
              <ChartPanel eyebrow="Associacao" title={`Correlacoes entre notas em ${ufLabel}`}>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={visibleCorrelationRows} margin={{ top: 4, right: 14, left: -14, bottom: 42 }}>
                      <CartesianGrid vertical={false} stroke="#e2e8f0" />
                      <XAxis
                        dataKey="pair"
                        angle={-35}
                        textAnchor="end"
                        height={70}
                        tick={{ fill: '#475569', fontSize: 11 }}
                      />
                      <YAxis domain={[0, 1]} tick={{ fill: '#64748b', fontSize: 12 }} />
                      <Tooltip formatter={(value) => Number(value).toFixed(3)} />
                      <Bar
                        dataKey="value"
                        name="Correlacao"
                        radius={[5, 5, 0, 0]}
                        cursor="pointer"
                        onClick={(entry) => {
                          const payload = getPayload<{ pair?: string }>(entry);
                          const nextSubject = getSubjectFromCorrelationPair(payload?.pair ?? '');
                          if (nextSubject) toggleSubject(nextSubject);
                        }}
                      >
                        {visibleCorrelationRows.map((item) => (
                          <Cell
                            key={item.pair}
                            fill="#0891b2"
                            fillOpacity={
                              selectedSubject && getCorrelationPairSubjects(item.pair).includes(selectedSubject)
                                ? 1
                                : selectedSubject
                                  ? 0.34
                                  : 0.55
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartPanel>

              <ChartPanel eyebrow="Analise exploratoria" title="Correlacoes">
                <div className="flex min-h-80 flex-col justify-center gap-3 overflow-hidden">
                  <div className="grid min-w-0 grid-cols-[72px_repeat(5,minmax(0,1fr))] gap-1">
                    <div />
                    {subjectKeys.map((key) => (
                      <div
                        key={key}
                        className="flex h-8 min-w-0 items-center justify-center rounded-md bg-slate-100 px-1 text-[10px] font-bold text-slate-600"
                      >
                        {subjectLabels[key]}
                      </div>
                    ))}

                    {visibleCorrelationMatrix.map((row) => (
                      <div key={row.area} className="contents">
                        <div
                          className={`flex h-10 min-w-0 items-center rounded-md px-1.5 text-[10px] font-bold leading-tight ${
                            selectedSubject === getSubjectFromArea(row.area)
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {row.area}
                        </div>
                        {subjectKeys.map((key) => {
                          const value = row[key];
                          const isSelectedPair =
                            selectedSubject && (selectedSubject === key || selectedSubject === getSubjectFromArea(row.area));
                          return (
                            <button
                              key={`${row.area}-${key}`}
                              type="button"
                              title={`${row.area} x ${subjectLabels[key]}: ${value.toFixed(3)}`}
                              onClick={() => toggleSubject(key)}
                              className={`h-10 min-w-0 rounded-md text-xs font-bold shadow-sm transition-transform hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-slate-400 ${
                                isSelectedPair ? 'ring-2 ring-rose-500' : selectedSubject ? 'opacity-45' : ''
                              } ${getHeatColor(value)}`}
                            >
                              {value.toFixed(2)}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between gap-3 text-xs font-semibold text-slate-500">
                    <span>Menor correlacao</span>
                    <div className="h-2 flex-1 rounded-full bg-gradient-to-r from-slate-200 via-cyan-300 to-teal-900" />
                    <span>Maior correlacao</span>
                  </div>
                </div>
              </ChartPanel>
            </section>
          </div>

          <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm xl:sticky xl:top-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Filtros</p>
              <h2 className="mt-1 text-base font-bold text-slate-950">Recortes do painel</h2>
            </div>

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Periodo</span>
                <select
                  value={yearFilter}
                  onChange={(event) => {
                    const value = event.target.value;
                    setYearFilter(value === 'Todos' ? 'Todos' : Number(value));
                  }}
                  className={selectClassName}
                >
                  <option value="Todos">2009-2015</option>
                  {yearScores.map((row) => (
                    <option key={row.ano} value={row.ano}>
                      {row.ano}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Rede</span>
                <select
                  value={selectedNetwork}
                  onChange={(event) => setSelectedNetwork(event.target.value as NetworkFilter)}
                  className={selectClassName}
                >
                  <option value="Todas">Todas as redes</option>
                  <option value="Publica">Publica</option>
                  <option value="Privada">Privada</option>
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Area</span>
                <select
                  value={selectedSubject ?? 'Todas'}
                  onChange={(event) => {
                    const value = event.target.value;
                    setSelectedSubject(value === 'Todas' ? null : (value as SubjectKey));
                  }}
                  className={selectClassName}
                >
                  <option value="Todas">Todas as areas</option>
                  {subjectKeys.map((key) => (
                    <option key={key} value={key}>
                      {subjectLabels[key]}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">UF</span>
                <select
                  value={selectedUf ?? 'Todas'}
                  onChange={(event) => {
                    const value = event.target.value;
                    setSelectedUf(value === 'Todas' ? null : value);
                  }}
                  className={selectClassName}
                >
                  <option value="Todas">Brasil</option>
                  {stateParticipation.map((state) => (
                    <option key={state.uf} value={state.uf}>
                      {state.uf} - {state.nome}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-5 rounded-md bg-slate-100 p-3 text-xs font-semibold leading-5 text-slate-600">
              <p>
                Periodo: <span className="text-slate-950">{periodLabel}</span>
              </p>
              <p>
                Area: <span className="text-slate-950">{subjectLabel}</span>
              </p>
              <p>
                UF: <span className="text-slate-950">{locationLabel}</span>
              </p>
            </div>
          </aside>
        </div>

      </div>
    </main>
  );
}
