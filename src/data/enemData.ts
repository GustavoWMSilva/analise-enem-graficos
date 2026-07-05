export type SubjectKey = 'cn' | 'ch' | 'lp' | 'mt' | 'redacao';

export interface YearScore {
  ano: number;
  cn: number;
  ch: number;
  lp: number;
  mt: number;
  redacao: number;
}

export interface NetworkCount {
  rede: 'Publica' | 'Privada';
  registros: number;
  percentual: number;
}

export interface NetworkScore {
  area: string;
  publica: number;
  privada: number;
}

export interface AdminCount {
  dependencia: string;
  rede: 'Publica' | 'Privada';
  registros: number;
}

export interface StateParticipation {
  uf: string;
  nome: string;
  regiao: string;
  registros: number;
}

export interface MapPoint {
  id: string;
  label: string;
  detail: string;
  longitude: number;
  latitude: number;
  value: number;
  tone: 'primary' | 'secondary' | 'accent';
}

export const yearScores: YearScore[] = [
  { ano: 2009, cn: 496.39, ch: 496.44, lp: 494.95, mt: 495.5, redacao: 579.78 },
  { ano: 2010, cn: 481.64, ch: 534.33, lp: 505.73, mt: 504.32, redacao: 590.85 },
  { ano: 2011, cn: 489.2, ch: 494.19, lp: 537.01, mt: 554.88, redacao: 559.07 },
  { ano: 2012, cn: 491.17, ch: 536.44, lp: 504.79, mt: 540.58, redacao: 532.64 },
  { ano: 2013, cn: 488.02, ch: 529.47, lp: 501.79, mt: 535.06, redacao: 537.47 },
  { ano: 2014, cn: 498.49, ch: 555.74, lp: 519.81, mt: 495.25, redacao: 514.87 },
  { ano: 2015, cn: 490.61, ch: 566.54, lp: 515.1, mt: 492.18, redacao: 563.33 },
];

export const networkCounts: NetworkCount[] = [
  { rede: 'Publica', registros: 118709, percentual: 68.89 },
  { rede: 'Privada', registros: 53596, percentual: 31.11 },
];

export const adminCounts: AdminCount[] = [
  { dependencia: 'Estadual', rede: 'Publica', registros: 114546 },
  { dependencia: 'Privada', rede: 'Privada', registros: 53596 },
  { dependencia: 'Municipal', rede: 'Publica', registros: 2262 },
  { dependencia: 'Federal', rede: 'Publica', registros: 1901 },
];

export const stateParticipation: StateParticipation[] = [
  { uf: 'SP', nome: 'Sao Paulo', regiao: 'Sudeste', registros: 30849 },
  { uf: 'MG', nome: 'Minas Gerais', regiao: 'Sudeste', registros: 16576 },
  { uf: 'BA', nome: 'Bahia', regiao: 'Nordeste', registros: 11972 },
  { uf: 'RJ', nome: 'Rio de Janeiro', regiao: 'Sudeste', registros: 11051 },
  { uf: 'CE', nome: 'Ceara', regiao: 'Nordeste', registros: 10130 },
  { uf: 'PE', nome: 'Pernambuco', regiao: 'Nordeste', registros: 8749 },
  { uf: 'PR', nome: 'Parana', regiao: 'Sul', registros: 8288 },
  { uf: 'RS', nome: 'Rio Grande do Sul', regiao: 'Sul', registros: 7828 },
  { uf: 'PA', nome: 'Para', regiao: 'Norte', registros: 7367 },
  { uf: 'MA', nome: 'Maranhao', regiao: 'Nordeste', registros: 6999 },
  { uf: 'GO', nome: 'Goias', regiao: 'Centro-oeste', registros: 5986 },
  { uf: 'SC', nome: 'Santa Catarina', regiao: 'Sul', registros: 5525 },
  { uf: 'PB', nome: 'Paraiba', regiao: 'Nordeste', registros: 4789 },
  { uf: 'ES', nome: 'Espirito Santo', regiao: 'Sudeste', registros: 4144 },
  { uf: 'RN', nome: 'Rio Grande do Norte', regiao: 'Nordeste', registros: 3960 },
  { uf: 'PI', nome: 'Piaui', regiao: 'Nordeste', registros: 3776 },
  { uf: 'AL', nome: 'Alagoas', regiao: 'Nordeste', registros: 3499 },
  { uf: 'MT', nome: 'Mato Grosso', regiao: 'Centro-oeste', registros: 3315 },
  { uf: 'AM', nome: 'Amazonas', regiao: 'Norte', registros: 3223 },
  { uf: 'MS', nome: 'Mato Grosso do Sul', regiao: 'Centro-oeste', registros: 2947 },
  { uf: 'SE', nome: 'Sergipe', regiao: 'Nordeste', registros: 2579 },
  { uf: 'DF', nome: 'Distrito Federal', regiao: 'Centro-oeste', registros: 2394 },
  { uf: 'RO', nome: 'Rondonia', regiao: 'Norte', registros: 2026 },
  { uf: 'TO', nome: 'Tocantins', regiao: 'Norte', registros: 1566 },
  { uf: 'AC', nome: 'Acre', regiao: 'Norte', registros: 1013 },
  { uf: 'AP', nome: 'Amapa', regiao: 'Norte', registros: 921 },
  { uf: 'RR', nome: 'Roraima', regiao: 'Norte', registros: 833 },
];

export const networkScores: NetworkScore[] = [
  { area: 'Ciencias da Natureza', publica: 463.96, privada: 537.12 },
  { area: 'Ciencias Humanas', publica: 505.24, privada: 577.19 },
  { area: 'Linguagens', publica: 485.15, privada: 552.48 },
  { area: 'Matematica', publica: 475.89, privada: 576.55 },
  { area: 'Redacao', publica: 438.85, privada: 556.35 },
];

export const correlationRows = [
  { pair: 'CN x LP', value: 0.898 },
  { pair: 'CN x MT', value: 0.88 },
  { pair: 'LP x MT', value: 0.853 },
  { pair: 'CN x CH', value: 0.844 },
  { pair: 'CH x LP', value: 0.846 },
  { pair: 'CN x Redacao', value: 0.74 },
  { pair: 'CH x Redacao', value: 0.634 },
];

export const correlationMatrix = [
  { area: 'Natureza', cn: 1, ch: 0.844, lp: 0.898, mt: 0.88, redacao: 0.74 },
  { area: 'Humanas', cn: 0.844, ch: 1, lp: 0.846, mt: 0.728, redacao: 0.634 },
  { area: 'Linguagens', cn: 0.898, ch: 0.846, lp: 1, mt: 0.853, redacao: 0.718 },
  { area: 'Matematica', cn: 0.88, ch: 0.728, lp: 0.853, mt: 1, redacao: 0.695 },
  { area: 'Redacao', cn: 0.74, ch: 0.634, lp: 0.718, mt: 0.695, redacao: 1 },
];

export const mapPoints: MapPoint[] = [
  {
    id: 'brasil',
    label: 'Brasil',
    detail: 'Base nacional dos microdados ENEM por escola',
    longitude: -53.2,
    latitude: -10.8,
    value: 172305,
    tone: 'primary',
  },
];

export const subjectLabels: Record<SubjectKey, string> = {
  cn: 'Natureza',
  ch: 'Humanas',
  lp: 'Linguagens',
  mt: 'Matematica',
  redacao: 'Redacao',
};

export const totalRecords = networkCounts.reduce((sum, item) => sum + item.registros, 0);

export const averagePublicPrivateGap =
  networkScores.reduce((sum, item) => sum + (item.privada - item.publica), 0) / networkScores.length;
