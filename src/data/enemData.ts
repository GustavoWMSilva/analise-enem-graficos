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

export interface RegionalNetworkScore extends NetworkScore {
  regiao: string;
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

export interface ApprovalScorePoint {
  uf: string;
  regiao: string;
  rede: 'Publica' | 'Privada';
  mediaGeral: number;
  taxaAprovacao: number;
  taxaPermanencia: number;
  escolas: number;
}

export interface StateScoreAverage {
  uf: string;
  regiao: string;
  mediaGeral: number;
  escolas: number;
}

export interface RegionScoreAverage {
  regiao: string;
  mediaGeral: number;
  escolas: number;
}

export interface FederalPrivateUrbanScore {
  area: string;
  federalUrbana: number;
  privadaUrbana: number;
}

export interface RegionalFederalPrivateUrbanScore extends FederalPrivateUrbanScore {
  regiao: string;
}

export interface UrbanRuralRegionScore {
  regiao: string;
  urbana: number;
  rural: number;
  escolasUrbanas: number;
  escolasRurais: number;
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
  { uf: 'SP', nome: 'São Paulo', regiao: 'Sudeste', registros: 30849 },
  { uf: 'MG', nome: 'Minas Gerais', regiao: 'Sudeste', registros: 16576 },
  { uf: 'BA', nome: 'Bahia', regiao: 'Nordeste', registros: 11972 },
  { uf: 'RJ', nome: 'Rio de Janeiro', regiao: 'Sudeste', registros: 11051 },
  { uf: 'CE', nome: 'Ceará', regiao: 'Nordeste', registros: 10130 },
  { uf: 'PE', nome: 'Pernambuco', regiao: 'Nordeste', registros: 8749 },
  { uf: 'PR', nome: 'Paraná', regiao: 'Sul', registros: 8288 },
  { uf: 'RS', nome: 'Rio Grande do Sul', regiao: 'Sul', registros: 7828 },
  { uf: 'PA', nome: 'Pará', regiao: 'Norte', registros: 7367 },
  { uf: 'MA', nome: 'Maranhão', regiao: 'Nordeste', registros: 6999 },
  { uf: 'GO', nome: 'Goiás', regiao: 'Centro-oeste', registros: 5986 },
  { uf: 'SC', nome: 'Santa Catarina', regiao: 'Sul', registros: 5525 },
  { uf: 'PB', nome: 'Paraíba', regiao: 'Nordeste', registros: 4789 },
  { uf: 'ES', nome: 'Espírito Santo', regiao: 'Sudeste', registros: 4144 },
  { uf: 'RN', nome: 'Rio Grande do Norte', regiao: 'Nordeste', registros: 3960 },
  { uf: 'PI', nome: 'Piauí', regiao: 'Nordeste', registros: 3776 },
  { uf: 'AL', nome: 'Alagoas', regiao: 'Nordeste', registros: 3499 },
  { uf: 'MT', nome: 'Mato Grosso', regiao: 'Centro-oeste', registros: 3315 },
  { uf: 'AM', nome: 'Amazonas', regiao: 'Norte', registros: 3223 },
  { uf: 'MS', nome: 'Mato Grosso do Sul', regiao: 'Centro-oeste', registros: 2947 },
  { uf: 'SE', nome: 'Sergipe', regiao: 'Nordeste', registros: 2579 },
  { uf: 'DF', nome: 'Distrito Federal', regiao: 'Centro-oeste', registros: 2394 },
  { uf: 'RO', nome: 'Rondônia', regiao: 'Norte', registros: 2026 },
  { uf: 'TO', nome: 'Tocantins', regiao: 'Norte', registros: 1566 },
  { uf: 'AC', nome: 'Acre', regiao: 'Norte', registros: 1013 },
  { uf: 'AP', nome: 'Amapá', regiao: 'Norte', registros: 921 },
  { uf: 'RR', nome: 'Roraima', regiao: 'Norte', registros: 833 },
];

export const networkScores: NetworkScore[] = [
  { area: 'Ciências da Natureza', publica: 463.96, privada: 537.12 },
  { area: 'Ciências Humanas', publica: 505.24, privada: 577.19 },
  { area: 'Linguagens', publica: 485.15, privada: 552.48 },
  { area: 'Matemática', publica: 475.89, privada: 576.55 },
  { area: 'Redação', publica: 438.85, privada: 556.35 },
];

export const regionalNetworkScores: RegionalNetworkScore[] = [
  { regiao: 'Norte', area: 'Ciências da Natureza', publica: 445.93, privada: 514.46 },
  { regiao: 'Norte', area: 'Ciências Humanas', publica: 489.1, privada: 559.42 },
  { regiao: 'Norte', area: 'Linguagens', publica: 463.22, privada: 531.65 },
  { regiao: 'Norte', area: 'Matemática', publica: 447.3, privada: 532.18 },
  { regiao: 'Norte', area: 'Redação', publica: 504.32, privada: 603.39 },
  { regiao: 'Nordeste', area: 'Ciências da Natureza', publica: 446.64, privada: 515.09 },
  { regiao: 'Nordeste', area: 'Ciências Humanas', publica: 489.38, privada: 559.37 },
  { regiao: 'Nordeste', area: 'Linguagens', publica: 464.36, privada: 533.96 },
  { regiao: 'Nordeste', area: 'Matemática', publica: 451.12, privada: 541.87 },
  { regiao: 'Nordeste', area: 'Redação', publica: 505.1, privada: 604.77 },
  { regiao: 'Centro-oeste', area: 'Ciências da Natureza', publica: 460.68, privada: 532.25 },
  { regiao: 'Centro-oeste', area: 'Ciências Humanas', publica: 502.41, privada: 571.34 },
  { regiao: 'Centro-oeste', area: 'Linguagens', publica: 480.61, privada: 545.43 },
  { regiao: 'Centro-oeste', area: 'Matemática', publica: 466.77, privada: 564.19 },
  { regiao: 'Centro-oeste', area: 'Redação', publica: 506.84, privada: 607.19 },
  { regiao: 'Sudeste', area: 'Ciências da Natureza', publica: 472.53, privada: 548.2 },
  { regiao: 'Sudeste', area: 'Ciências Humanas', publica: 513.56, privada: 586.96 },
  { regiao: 'Sudeste', area: 'Linguagens', publica: 497.99, privada: 562.78 },
  { regiao: 'Sudeste', area: 'Matemática', publica: 490.5, privada: 595.37 },
  { regiao: 'Sudeste', area: 'Redação', publica: 537.59, privada: 621.89 },
  { regiao: 'Sul', area: 'Ciências da Natureza', publica: 476.24, privada: 544.05 },
  { regiao: 'Sul', area: 'Ciências Humanas', publica: 515.32, privada: 580.57 },
  { regiao: 'Sul', area: 'Linguagens', publica: 495.04, privada: 556.88 },
  { regiao: 'Sul', area: 'Matemática', publica: 491.68, privada: 587.98 },
  { regiao: 'Sul', area: 'Redação', publica: 533.99, privada: 605.83 },
];

export const approvalScoreScatter: ApprovalScorePoint[] = [
  { uf: 'AC', regiao: 'Norte', rede: 'Privada', mediaGeral: 549.04, taxaAprovacao: 95.42, taxaPermanencia: 71.15, escolas: 74 },
  { uf: 'AC', regiao: 'Norte', rede: 'Publica', mediaGeral: 462.67, taxaAprovacao: 81.5, taxaPermanencia: 74.83, escolas: 317 },
  { uf: 'AL', regiao: 'Nordeste', rede: 'Privada', mediaGeral: 530.56, taxaAprovacao: 92.34, taxaPermanencia: 71.03, escolas: 637 },
  { uf: 'AL', regiao: 'Nordeste', rede: 'Publica', mediaGeral: 471.09, taxaAprovacao: 71.61, taxaPermanencia: 77.71, escolas: 551 },
  { uf: 'AM', regiao: 'Norte', rede: 'Privada', mediaGeral: 550.18, taxaAprovacao: 92.42, taxaPermanencia: 67.68, escolas: 298 },
  { uf: 'AM', regiao: 'Norte', rede: 'Publica', mediaGeral: 466.35, taxaAprovacao: 83.6, taxaPermanencia: 74.67, escolas: 992 },
  { uf: 'AP', regiao: 'Norte', rede: 'Privada', mediaGeral: 538.68, taxaAprovacao: 96.2, taxaPermanencia: 69.17, escolas: 74 },
  { uf: 'AP', regiao: 'Norte', rede: 'Publica', mediaGeral: 465.21, taxaAprovacao: 71.64, taxaPermanencia: 74.51, escolas: 262 },
  { uf: 'BA', regiao: 'Nordeste', rede: 'Privada', mediaGeral: 567.7, taxaAprovacao: 92.74, taxaPermanencia: 73.46, escolas: 1757 },
  { uf: 'BA', regiao: 'Nordeste', rede: 'Publica', mediaGeral: 478.35, taxaAprovacao: 73.19, taxaPermanencia: 79.23, escolas: 2834 },
  { uf: 'CE', regiao: 'Nordeste', rede: 'Privada', mediaGeral: 556.31, taxaAprovacao: 94.66, taxaPermanencia: 76.62, escolas: 1484 },
  { uf: 'CE', regiao: 'Nordeste', rede: 'Publica', mediaGeral: 466.38, taxaAprovacao: 83.55, taxaPermanencia: 76.22, escolas: 3377 },
  { uf: 'DF', regiao: 'Centro-oeste', rede: 'Privada', mediaGeral: 578.89, taxaAprovacao: 92.64, taxaPermanencia: 70.82, escolas: 569 },
  { uf: 'DF', regiao: 'Centro-oeste', rede: 'Publica', mediaGeral: 506.23, taxaAprovacao: 73.12, taxaPermanencia: 77.09, escolas: 520 },
  { uf: 'ES', regiao: 'Sudeste', rede: 'Privada', mediaGeral: 571.97, taxaAprovacao: 94.01, taxaPermanencia: 73.02, escolas: 726 },
  { uf: 'ES', regiao: 'Sudeste', rede: 'Publica', mediaGeral: 478.3, taxaAprovacao: 77.78, taxaPermanencia: 79.89, escolas: 1906 },
  { uf: 'GO', regiao: 'Centro-oeste', rede: 'Privada', mediaGeral: 563.81, taxaAprovacao: 94.17, taxaPermanencia: 66.3, escolas: 1335 },
  { uf: 'GO', regiao: 'Centro-oeste', rede: 'Publica', mediaGeral: 481.72, taxaAprovacao: 81.56, taxaPermanencia: 72.04, escolas: 2410 },
  { uf: 'MA', regiao: 'Nordeste', rede: 'Privada', mediaGeral: 534.63, taxaAprovacao: 93.65, taxaPermanencia: 66.94, escolas: 747 },
  { uf: 'MA', regiao: 'Nordeste', rede: 'Publica', mediaGeral: 460.82, taxaAprovacao: 78.71, taxaPermanencia: 76.09, escolas: 1692 },
  { uf: 'MG', regiao: 'Sudeste', rede: 'Privada', mediaGeral: 598.5, taxaAprovacao: 93.6, taxaPermanencia: 78.98, escolas: 3781 },
  { uf: 'MG', regiao: 'Sudeste', rede: 'Publica', mediaGeral: 502.56, taxaAprovacao: 80.81, taxaPermanencia: 82.89, escolas: 8411 },
  { uf: 'MS', regiao: 'Centro-oeste', rede: 'Privada', mediaGeral: 567.97, taxaAprovacao: 93.6, taxaPermanencia: 62.75, escolas: 497 },
  { uf: 'MS', regiao: 'Centro-oeste', rede: 'Publica', mediaGeral: 486.3, taxaAprovacao: 73.33, taxaPermanencia: 72.24, escolas: 1466 },
  { uf: 'MT', regiao: 'Centro-oeste', rede: 'Privada', mediaGeral: 547.83, taxaAprovacao: 95.78, taxaPermanencia: 63.79, escolas: 568 },
  { uf: 'MT', regiao: 'Centro-oeste', rede: 'Publica', mediaGeral: 474.27, taxaAprovacao: 69.76, taxaPermanencia: 76.44, escolas: 1361 },
  { uf: 'PA', regiao: 'Norte', rede: 'Privada', mediaGeral: 545.66, taxaAprovacao: 94.86, taxaPermanencia: 62.6, escolas: 857 },
  { uf: 'PA', regiao: 'Norte', rede: 'Publica', mediaGeral: 476.21, taxaAprovacao: 69.5, taxaPermanencia: 67.91, escolas: 1439 },
  { uf: 'PB', regiao: 'Nordeste', rede: 'Privada', mediaGeral: 545.81, taxaAprovacao: 93.72, taxaPermanencia: 69.79, escolas: 690 },
  { uf: 'PB', regiao: 'Nordeste', rede: 'Publica', mediaGeral: 473.1, taxaAprovacao: 77.01, taxaPermanencia: 78.63, escolas: 1498 },
  { uf: 'PE', regiao: 'Nordeste', rede: 'Privada', mediaGeral: 543.55, taxaAprovacao: 93.87, taxaPermanencia: 71.66, escolas: 1724 },
  { uf: 'PE', regiao: 'Nordeste', rede: 'Publica', mediaGeral: 483.06, taxaAprovacao: 83.66, taxaPermanencia: 80.48, escolas: 2584 },
  { uf: 'PI', regiao: 'Nordeste', rede: 'Privada', mediaGeral: 565.92, taxaAprovacao: 92.97, taxaPermanencia: 66.74, escolas: 636 },
  { uf: 'PI', regiao: 'Nordeste', rede: 'Publica', mediaGeral: 459.87, taxaAprovacao: 76.62, taxaPermanencia: 72.19, escolas: 1592 },
  { uf: 'PR', regiao: 'Sul', rede: 'Privada', mediaGeral: 568.2, taxaAprovacao: 95.87, taxaPermanencia: 72.02, escolas: 1930 },
  { uf: 'PR', regiao: 'Sul', rede: 'Publica', mediaGeral: 496.61, taxaAprovacao: 81.72, taxaPermanencia: 83.11, escolas: 4457 },
  { uf: 'RJ', regiao: 'Sudeste', rede: 'Privada', mediaGeral: 579.18, taxaAprovacao: 90.02, taxaPermanencia: 69.78, escolas: 4073 },
  { uf: 'RJ', regiao: 'Sudeste', rede: 'Publica', mediaGeral: 503.49, taxaAprovacao: 76.25, taxaPermanencia: 77.21, escolas: 3916 },
  { uf: 'RN', regiao: 'Nordeste', rede: 'Privada', mediaGeral: 547.54, taxaAprovacao: 93.24, taxaPermanencia: 74.22, escolas: 670 },
  { uf: 'RN', regiao: 'Nordeste', rede: 'Publica', mediaGeral: 472.95, taxaAprovacao: 74.3, taxaPermanencia: 82.37, escolas: 1109 },
  { uf: 'RO', regiao: 'Norte', rede: 'Privada', mediaGeral: 546.27, taxaAprovacao: 93.7, taxaPermanencia: 70.4, escolas: 223 },
  { uf: 'RO', regiao: 'Norte', rede: 'Publica', mediaGeral: 478.28, taxaAprovacao: 76.69, taxaPermanencia: 72.54, escolas: 837 },
  { uf: 'RR', regiao: 'Norte', rede: 'Privada', mediaGeral: 550.86, taxaAprovacao: 94.4, taxaPermanencia: 76.42, escolas: 40 },
  { uf: 'RR', regiao: 'Norte', rede: 'Publica', mediaGeral: 472.18, taxaAprovacao: 79.07, taxaPermanencia: 75.71, escolas: 195 },
  { uf: 'RS', regiao: 'Sul', rede: 'Privada', mediaGeral: 579.39, taxaAprovacao: 92.36, taxaPermanencia: 81.24, escolas: 1868 },
  { uf: 'RS', regiao: 'Sul', rede: 'Publica', mediaGeral: 507.67, taxaAprovacao: 74.44, taxaPermanencia: 86.55, escolas: 5634 },
  { uf: 'SC', regiao: 'Sul', rede: 'Privada', mediaGeral: 578.97, taxaAprovacao: 95.14, taxaPermanencia: 74.48, escolas: 1130 },
  { uf: 'SC', regiao: 'Sul', rede: 'Publica', mediaGeral: 501.06, taxaAprovacao: 83.12, taxaPermanencia: 82.11, escolas: 2840 },
  { uf: 'SE', regiao: 'Nordeste', rede: 'Privada', mediaGeral: 548.09, taxaAprovacao: 91.89, taxaPermanencia: 71.41, escolas: 468 },
  { uf: 'SE', regiao: 'Nordeste', rede: 'Publica', mediaGeral: 464.52, taxaAprovacao: 70.73, taxaPermanencia: 80.22, escolas: 706 },
  { uf: 'SP', regiao: 'Sudeste', rede: 'Privada', mediaGeral: 580.62, taxaAprovacao: 95.79, taxaPermanencia: 77.16, escolas: 10781 },
  { uf: 'SP', regiao: 'Sudeste', rede: 'Publica', mediaGeral: 505.51, taxaAprovacao: 85.19, taxaPermanencia: 79.12, escolas: 12209 },
  { uf: 'TO', regiao: 'Norte', rede: 'Privada', mediaGeral: 563.24, taxaAprovacao: 92.06, taxaPermanencia: 60.12, escolas: 168 },
  { uf: 'TO', regiao: 'Norte', rede: 'Publica', mediaGeral: 459.85, taxaAprovacao: 82.66, taxaPermanencia: 79.18, escolas: 932 },
];

export const stateScoreAverages: StateScoreAverage[] = [
  { uf: 'DF', regiao: 'Centro-oeste', mediaGeral: 544.13, escolas: 1090 },
  { uf: 'RJ', regiao: 'Sudeste', mediaGeral: 543.01, escolas: 8401 },
  { uf: 'SP', regiao: 'Sudeste', mediaGeral: 540.77, escolas: 23004 },
  { uf: 'MG', regiao: 'Sudeste', mediaGeral: 532.34, escolas: 12202 },
  { uf: 'RS', regiao: 'Sul', mediaGeral: 525.53, escolas: 7503 },
  { uf: 'SC', regiao: 'Sul', mediaGeral: 523.88, escolas: 4004 },
  { uf: 'PR', regiao: 'Sul', mediaGeral: 518.26, escolas: 6393 },
  { uf: 'BA', regiao: 'Nordeste', mediaGeral: 513.83, escolas: 4711 },
  { uf: 'GO', regiao: 'Centro-oeste', mediaGeral: 511.12, escolas: 3758 },
  { uf: 'PE', regiao: 'Nordeste', mediaGeral: 507.29, escolas: 4310 },
  { uf: 'MS', regiao: 'Centro-oeste', mediaGeral: 506.98, escolas: 1963 },
  { uf: 'ES', regiao: 'Sudeste', mediaGeral: 504.25, escolas: 2636 },
  { uf: 'AL', regiao: 'Nordeste', mediaGeral: 502.92, escolas: 1240 },
  { uf: 'PA', regiao: 'Norte', mediaGeral: 502.84, escolas: 2331 },
  { uf: 'RN', regiao: 'Nordeste', mediaGeral: 501.03, escolas: 1780 },
  { uf: 'SE', regiao: 'Nordeste', mediaGeral: 498.13, escolas: 1182 },
  { uf: 'MT', regiao: 'Centro-oeste', mediaGeral: 496.9, escolas: 1968 },
  { uf: 'PB', regiao: 'Nordeste', mediaGeral: 496.81, escolas: 2238 },
  { uf: 'CE', regiao: 'Nordeste', mediaGeral: 493.85, escolas: 4864 },
  { uf: 'RO', regiao: 'Norte', mediaGeral: 492.58, escolas: 1060 },
  { uf: 'PI', regiao: 'Nordeste', mediaGeral: 490.38, escolas: 2254 },
  { uf: 'AM', regiao: 'Norte', mediaGeral: 485.74, escolas: 1291 },
  { uf: 'RR', regiao: 'Norte', mediaGeral: 485.57, escolas: 235 },
  { uf: 'MA', regiao: 'Nordeste', mediaGeral: 483.43, escolas: 2439 },
  { uf: 'AP', regiao: 'Norte', mediaGeral: 481.83, escolas: 338 },
  { uf: 'AC', regiao: 'Norte', mediaGeral: 479.02, escolas: 391 },
  { uf: 'TO', regiao: 'Norte', mediaGeral: 475.73, escolas: 1101 },
];

export const regionScoreAverages: RegionScoreAverage[] = [
  { regiao: 'Norte', mediaGeral: 490.5, escolas: 6747 },
  { regiao: 'Nordeste', mediaGeral: 500.03, escolas: 25018 },
  { regiao: 'Centro-oeste', mediaGeral: 511.11, escolas: 8779 },
  { regiao: 'Sudeste', mediaGeral: 536.87, escolas: 46243 },
  { regiao: 'Sul', mediaGeral: 522.57, escolas: 17900 },
];

export const federalPrivateUrbanScores: FederalPrivateUrbanScore[] = [
  { area: 'Natureza', federalUrbana: 550.15, privadaUrbana: 537.45 },
  { area: 'Humanas', federalUrbana: 596.57, privadaUrbana: 577.52 },
  { area: 'Linguagens', federalUrbana: 563.13, privadaUrbana: 552.85 },
  { area: 'Matemática', federalUrbana: 597.24, privadaUrbana: 577.07 },
  { area: 'Redação', federalUrbana: 632.3, privadaUrbana: 614.36 },
];

export const regionalFederalPrivateUrbanScores: RegionalFederalPrivateUrbanScore[] = [
  { regiao: 'Norte', area: 'Natureza', federalUrbana: 510.2, privadaUrbana: 516.17 },
  { regiao: 'Norte', area: 'Humanas', federalUrbana: 563.41, privadaUrbana: 561.35 },
  { regiao: 'Norte', area: 'Linguagens', federalUrbana: 530.04, privadaUrbana: 533.64 },
  { regiao: 'Norte', area: 'Matemática', federalUrbana: 529.46, privadaUrbana: 534.38 },
  { regiao: 'Norte', area: 'Redação', federalUrbana: 592.03, privadaUrbana: 606.33 },
  { regiao: 'Nordeste', area: 'Natureza', federalUrbana: 527.85, privadaUrbana: 515.27 },
  { regiao: 'Nordeste', area: 'Humanas', federalUrbana: 580.78, privadaUrbana: 559.5 },
  { regiao: 'Nordeste', area: 'Linguagens', federalUrbana: 547.36, privadaUrbana: 534.17 },
  { regiao: 'Nordeste', area: 'Matemática', federalUrbana: 562.11, privadaUrbana: 542.18 },
  { regiao: 'Nordeste', area: 'Redação', federalUrbana: 620.26, privadaUrbana: 605.19 },
  { regiao: 'Centro-oeste', area: 'Natureza', federalUrbana: 546.43, privadaUrbana: 532.75 },
  { regiao: 'Centro-oeste', area: 'Humanas', federalUrbana: 598.23, privadaUrbana: 571.86 },
  { regiao: 'Centro-oeste', area: 'Linguagens', federalUrbana: 561.62, privadaUrbana: 545.97 },
  { regiao: 'Centro-oeste', area: 'Matemática', federalUrbana: 581.07, privadaUrbana: 564.88 },
  { regiao: 'Centro-oeste', area: 'Redação', federalUrbana: 628.32, privadaUrbana: 608.18 },
  { regiao: 'Sudeste', area: 'Natureza', federalUrbana: 584.61, privadaUrbana: 548.42 },
  { regiao: 'Sudeste', area: 'Humanas', federalUrbana: 621.95, privadaUrbana: 587.19 },
  { regiao: 'Sudeste', area: 'Linguagens', federalUrbana: 587.82, privadaUrbana: 563.03 },
  { regiao: 'Sudeste', area: 'Matemática', federalUrbana: 653.83, privadaUrbana: 595.73 },
  { regiao: 'Sudeste', area: 'Redação', federalUrbana: 667.23, privadaUrbana: 622.26 },
  { regiao: 'Sul', area: 'Natureza', federalUrbana: 563.16, privadaUrbana: 544.16 },
  { regiao: 'Sul', area: 'Humanas', federalUrbana: 606.04, privadaUrbana: 580.7 },
  { regiao: 'Sul', area: 'Linguagens', federalUrbana: 574.91, privadaUrbana: 557.06 },
  { regiao: 'Sul', area: 'Matemática', federalUrbana: 621.34, privadaUrbana: 588.16 },
  { regiao: 'Sul', area: 'Redação', federalUrbana: 625.37, privadaUrbana: 606.07 },
];

export const urbanRuralRegionScores: UrbanRuralRegionScore[] = [
  { regiao: 'Norte', urbana: 468.47, rural: 445.59, escolasUrbanas: 4461, escolasRurais: 315 },
  { regiao: 'Nordeste', urbana: 468.9, rural: 451.84, escolasUrbanas: 14469, escolasRurais: 736 },
  { regiao: 'Centro-oeste', urbana: 482.06, rural: 463.58, escolasUrbanas: 5322, escolasRurais: 277 },
  { regiao: 'Sudeste', urbana: 500.36, rural: 483, escolasUrbanas: 24399, escolasRurais: 954 },
  { regiao: 'Sul', urbana: 501.23, rural: 488.42, escolasUrbanas: 11798, escolasRurais: 780 },
];

export const correlationRows = [
  { pair: 'CN x LP', value: 0.898 },
  { pair: 'CN x MT', value: 0.88 },
  { pair: 'LP x MT', value: 0.853 },
  { pair: 'CN x CH', value: 0.844 },
  { pair: 'CH x LP', value: 0.846 },
  { pair: 'CN x Redação', value: 0.74 },
  { pair: 'CH x Redação', value: 0.634 },
];

export const correlationMatrix = [
  { area: 'Natureza', cn: 1, ch: 0.844, lp: 0.898, mt: 0.88, redacao: 0.74 },
  { area: 'Humanas', cn: 0.844, ch: 1, lp: 0.846, mt: 0.728, redacao: 0.634 },
  { area: 'Linguagens', cn: 0.898, ch: 0.846, lp: 1, mt: 0.853, redacao: 0.718 },
  { area: 'Matemática', cn: 0.88, ch: 0.728, lp: 0.853, mt: 1, redacao: 0.695 },
  { area: 'Redação', cn: 0.74, ch: 0.634, lp: 0.718, mt: 0.695, redacao: 1 },
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
  mt: 'Matemática',
  redacao: 'Redação',
};

export const totalRecords = networkCounts.reduce((sum, item) => sum + item.registros, 0);

export const averagePublicPrivateGap =
  networkScores.reduce((sum, item) => sum + (item.privada - item.publica), 0) / networkScores.length;
