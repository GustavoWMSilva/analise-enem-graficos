import { useEffect, useMemo, useState } from 'react';
import { Layer, Map as MapLibreMap, Marker, NavigationControl, Popup, Source } from '@vis.gl/react-maplibre';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import type { MapPoint, StateParticipation } from '../data/enemData';

interface EnemMapProps {
  points: MapPoint[];
  states: StateParticipation[];
  selectedUf: string | null;
  onSelectUf: (uf: string) => void;
}

interface StateProperties {
  codigo?: string;
  nome: string;
  uf: string;
  regiao: string;
  registros: number;
  percentual: number;
}

interface MapPointerEvent {
  features?: Array<{ properties?: Record<string, unknown> }>;
  target?: {
    getCanvas?: () => HTMLCanvasElement;
  };
  originalEvent?: {
    stopPropagation?: () => void;
  };
}

const toneClasses: Record<MapPoint['tone'], string> = {
  primary: 'bg-teal-600 ring-teal-200',
  secondary: 'bg-indigo-600 ring-indigo-200',
  accent: 'bg-rose-600 ring-rose-200',
};

const formatNumber = (value: number) => value.toLocaleString('pt-BR');

function getFeatureProperties(event: MapPointerEvent): StateProperties | null {
  const properties = event.features?.[0]?.properties;
  if (!properties) return null;

  return {
    codigo: typeof properties.codigo === 'string' ? properties.codigo : undefined,
    nome: String(properties.nome ?? ''),
    uf: String(properties.uf ?? ''),
    regiao: String(properties.regiao ?? ''),
    registros: Number(properties.registros ?? 0),
    percentual: Number(properties.percentual ?? 0),
  };
}

export function EnemMap({ points, states, selectedUf, onSelectUf }: EnemMapProps) {
  const [rawStates, setRawStates] = useState<FeatureCollection<Geometry> | null>(null);
  const [hoveredState, setHoveredState] = useState<StateProperties | null>(null);
  const [activePoint, setActivePoint] = useState<MapPoint | null>(null);

  const stateLookup = useMemo(() => new Map(states.map((state) => [state.uf, state])), [states]);
  const totalRecords = useMemo(() => states.reduce((sum, state) => sum + state.registros, 0), [states]);
  const maxRecords = useMemo(() => Math.max(...states.map((state) => state.registros)), [states]);
  const selectedState = selectedUf ? stateLookup.get(selectedUf) ?? null : null;

  useEffect(() => {
    let isMounted = true;

    fetch('/data/br_ufs_2024.geojson')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Nao foi possivel carregar os limites estaduais.');
        }
        return response.json() as Promise<FeatureCollection<Geometry>>;
      })
      .then((data) => {
        if (isMounted) setRawStates(data);
      })
      .catch(() => {
        if (isMounted) setRawStates(null);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const stateSource = useMemo<FeatureCollection<Geometry> | null>(() => {
    if (!rawStates) return null;

    return {
      ...rawStates,
      features: rawStates.features.map((feature) => {
        const properties = feature.properties ?? {};
        const uf = String(properties.uf ?? properties.SIGLA_UF ?? '');
        const state = stateLookup.get(uf);
        const registros = state?.registros ?? 0;

        return {
          ...feature,
          properties: {
            ...properties,
            nome: state?.nome ?? String(properties.nome ?? ''),
            uf,
            regiao: state?.regiao ?? String(properties.regiao ?? ''),
            registros,
            percentual: totalRecords > 0 ? (registros / totalRecords) * 100 : 0,
          },
        } satisfies Feature<Geometry, StateProperties>;
      }),
    };
  }, [rawStates, stateLookup, totalRecords]);

  const pointByUf = useMemo(() => {
    const entries = points
      .filter((point) => point.id.length === 2)
      .map((point) => [point.id.toUpperCase(), point] as const);
    return new Map(entries);
  }, [points]);

  const selectedPoint = selectedUf ? pointByUf.get(selectedUf) : undefined;

  return (
    <div className="relative isolate min-h-[520px] w-full min-w-0 flex-1 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
      <MapLibreMap
        initialViewState={{ longitude: -53.2, latitude: -14.6, zoom: 3.35 }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
        interactiveLayerIds={['enem-state-fill']}
        onClick={(event) => {
          const properties = getFeatureProperties(event as MapPointerEvent);
          if (properties?.uf) onSelectUf(properties.uf);
        }}
        onMouseMove={(event) => {
          const pointerEvent = event as MapPointerEvent;
          const properties = getFeatureProperties(pointerEvent);
          const canvas = pointerEvent.target?.getCanvas?.();
          if (canvas) canvas.style.cursor = properties ? 'pointer' : '';
          setHoveredState(properties);
        }}
        onMouseLeave={(event) => {
          const canvas = (event as MapPointerEvent).target?.getCanvas?.();
          if (canvas) canvas.style.cursor = '';
          setHoveredState(null);
        }}
      >
        <NavigationControl position="top-right" showCompass={false} />

        {stateSource && (
          <Source id="enem-state-boundaries" type="geojson" data={stateSource}>
            <Layer
              id="enem-state-fill"
              type="fill"
              paint={{
                'fill-color': [
                  'interpolate',
                  ['linear'],
                  ['get', 'registros'],
                  0,
                  '#e2e8f0',
                  maxRecords * 0.12,
                  '#99f6e4',
                  maxRecords * 0.35,
                  '#14b8a6',
                  maxRecords,
                  '#0f3f46',
                ],
                'fill-opacity': ['case', ['==', ['get', 'uf'], selectedUf], 0.92, 0.68],
              }}
            />
            <Layer
              id="enem-state-line"
              type="line"
              paint={{
                'line-color': ['case', ['==', ['get', 'uf'], selectedUf], '#be123c', '#ffffff'],
                'line-width': ['case', ['==', ['get', 'uf'], selectedUf], 2.4, 0.9],
                'line-opacity': 0.95,
              }}
            />
          </Source>
        )}

        {points
          .filter((point) => point.id !== 'brasil')
          .map((point) => (
            <Marker
              key={point.id}
              longitude={point.longitude}
              latitude={point.latitude}
              anchor="center"
              onClick={(event) => {
                event.originalEvent.stopPropagation();
                const uf = point.id.length === 2 ? point.id.toUpperCase() : 'RS';
                onSelectUf(uf);
                setActivePoint(point);
              }}
            >
              <button
                type="button"
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white shadow-lg ring-8 ${toneClasses[point.tone]}`}
                aria-label={`Selecionar ${point.label}`}
              >
                {point.label.slice(0, 2)}
              </button>
            </Marker>
          ))}

        {selectedPoint && selectedState && (
          <Popup
            longitude={selectedPoint.longitude}
            latitude={selectedPoint.latitude}
            anchor="bottom"
            closeButton={false}
            offset={24}
          >
            <div className="min-w-48 p-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">UF selecionada</p>
              <h3 className="mt-1 text-sm font-bold text-slate-950">{selectedState.nome}</h3>
              <p className="mt-1 text-xs leading-5 text-slate-600">
                {formatNumber(selectedState.registros)} participantes na amostra do painel.
              </p>
            </div>
          </Popup>
        )}

        {activePoint && !selectedPoint && (
          <Popup
            longitude={activePoint.longitude}
            latitude={activePoint.latitude}
            anchor="bottom"
            closeButton={false}
            offset={24}
            onClose={() => setActivePoint(null)}
          >
            <div className="min-w-48 p-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Referencia territorial</p>
              <h3 className="mt-1 text-sm font-bold text-slate-950">{activePoint.label}</h3>
              <p className="mt-1 text-xs leading-5 text-slate-600">{activePoint.detail}</p>
            </div>
          </Popup>
        )}
      </MapLibreMap>

      <div className="pointer-events-none absolute bottom-3 left-3 w-[min(280px,calc(100%-1.5rem))] rounded-lg border border-white/80 bg-white/95 px-3 py-2 text-xs shadow-lg backdrop-blur">
        <p className="font-bold text-slate-900">Participantes por UF</p>
        {selectedState ? (
          <p className="mt-1 text-slate-600">
            {selectedState.uf}: {formatNumber(selectedState.registros)} registros,{' '}
            {((selectedState.registros / totalRecords) * 100).toFixed(1)}% da base.
          </p>
        ) : (
          <p className="mt-1 text-slate-600">Nenhuma UF destacada no mapa.</p>
        )}
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-rose-600"
            style={{ width: selectedState ? `${Math.max(5, (selectedState.registros / maxRecords) * 100)}%` : '0%' }}
          />
        </div>
      </div>

      {hoveredState && (
        <div className="pointer-events-none absolute right-3 top-3 rounded-lg border border-white/80 bg-white/95 px-3 py-2 text-xs shadow-lg backdrop-blur">
          <p className="font-bold text-slate-900">
            {hoveredState.nome} ({hoveredState.uf})
          </p>
          <p className="mt-1 text-slate-600">
            {formatNumber(hoveredState.registros)} registros - {hoveredState.percentual.toFixed(1)}%
          </p>
        </div>
      )}
    </div>
  );
}
