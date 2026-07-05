# CPA ENEM - Projeto Final

Aplicacao web da parte 3 do projeto final, criada com React, Tailwind, Vite, Vercel, MapLibre e Recharts.

## Executar

```powershell
npm install
npm run dev
```

## Build

```powershell
npm run build
```

## Dados

Os dados do dashboard sao agregados gerados a partir do CSV original do projeto:

```text
../projeto_extensionista/microdados_enem_por_escola/DADOS/MICRODADOS_ENEM_ESCOLA.csv
```

Para recalcular os agregados usados pelo app:

```powershell
npm run generate:data
```

O script usa o recorte 2009-2015, periodo em que as notas por area do ENEM estao disponiveis, e reescreve `src/data/enemData.ts`. Nao edite esses agregados manualmente.

As contagens do painel representam registros escola-ano, nao escolas unicas nem participantes individuais. A media geral usa apenas registros com notas nas cinco areas, e a taxa de permanencia e calculada somente sobre os registros em que esse campo existe no CSV.
