from __future__ import annotations

from pathlib import Path
from typing import Iterable

import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
SOURCE_CSV = ROOT.parent / "projeto_extensionista" / "microdados_enem_por_escola" / "DADOS" / "MICRODADOS_ENEM_ESCOLA.csv"
OUTPUT_TS = ROOT / "src" / "data" / "enemData.ts"

YEAR_START = 2009
YEAR_END = 2015

UF_REGIONS = {
    "AC": "Norte",
    "AP": "Norte",
    "AM": "Norte",
    "PA": "Norte",
    "RO": "Norte",
    "RR": "Norte",
    "TO": "Norte",
    "AL": "Nordeste",
    "BA": "Nordeste",
    "CE": "Nordeste",
    "MA": "Nordeste",
    "PB": "Nordeste",
    "PE": "Nordeste",
    "PI": "Nordeste",
    "RN": "Nordeste",
    "SE": "Nordeste",
    "DF": "Centro-oeste",
    "GO": "Centro-oeste",
    "MT": "Centro-oeste",
    "MS": "Centro-oeste",
    "ES": "Sudeste",
    "MG": "Sudeste",
    "RJ": "Sudeste",
    "SP": "Sudeste",
    "PR": "Sul",
    "RS": "Sul",
    "SC": "Sul",
}

UF_NAMES = {
    "AC": "Acre",
    "AL": "Alagoas",
    "AP": "Amapa",
    "AM": "Amazonas",
    "BA": "Bahia",
    "CE": "Ceara",
    "DF": "Distrito Federal",
    "ES": "Espirito Santo",
    "GO": "Goias",
    "MA": "Maranhao",
    "MT": "Mato Grosso",
    "MS": "Mato Grosso do Sul",
    "MG": "Minas Gerais",
    "PA": "Para",
    "PB": "Paraiba",
    "PR": "Parana",
    "PE": "Pernambuco",
    "PI": "Piaui",
    "RJ": "Rio de Janeiro",
    "RN": "Rio Grande do Norte",
    "RS": "Rio Grande do Sul",
    "RO": "Rondonia",
    "RR": "Roraima",
    "SC": "Santa Catarina",
    "SP": "Sao Paulo",
    "SE": "Sergipe",
    "TO": "Tocantins",
}

DEPENDENCY_LABELS = {
    1: "Federal",
    2: "Estadual",
    3: "Municipal",
    4: "Privada",
}

SUBJECTS = [
    ("cn", "Ciencias da Natureza", "Natureza", "NU_MEDIA_CN"),
    ("ch", "Ciencias Humanas", "Humanas", "NU_MEDIA_CH"),
    ("lp", "Linguagens", "Linguagens", "NU_MEDIA_LP"),
    ("mt", "Matematica", "Matematica", "NU_MEDIA_MT"),
    ("redacao", "Redacao", "Redacao", "NU_MEDIA_RED"),
]

REGION_ORDER = ["Norte", "Nordeste", "Centro-oeste", "Sudeste", "Sul"]
SUBJECT_COLUMNS = [column for _, _, _, column in SUBJECTS]


def quote(value: str) -> str:
    return "'" + value.replace("\\", "\\\\").replace("'", "\\'") + "'"


def number(value: float | int) -> str:
    if pd.isna(value):
        raise ValueError("Valor numerico ausente encontrado ao gerar o TypeScript.")
    rounded = round(float(value), 2)
    if rounded.is_integer():
        return str(int(rounded))
    return f"{rounded:.2f}".rstrip("0").rstrip(".")


def ts_array(name: str, type_name: str, rows: Iterable[dict[str, object]]) -> str:
    lines = [f"export const {name}: {type_name}[] = ["]
    for row in rows:
        body = ", ".join(
            f"{key}: {quote(value) if isinstance(value, str) else number(value)}"
            for key, value in row.items()
        )
        lines.append(f"  {{ {body} }},")
    lines.append("];")
    return "\n".join(lines)


def round_df(df: pd.DataFrame, columns: list[str]) -> pd.DataFrame:
    df = df.copy()
    for column in columns:
        df[column] = df[column].round(2)
    return df


def load_data() -> pd.DataFrame:
    usecols = [
        "NU_ANO",
        "SG_UF_ESCOLA",
        "TP_DEPENDENCIA_ADM_ESCOLA",
        "TP_LOCALIZACAO_ESCOLA",
        "NU_MEDIA_CN",
        "NU_MEDIA_CH",
        "NU_MEDIA_LP",
        "NU_MEDIA_MT",
        "NU_MEDIA_RED",
        "NU_TAXA_APROVACAO",
        "NU_TAXA_PERMANENCIA",
    ]
    df = pd.read_csv(SOURCE_CSV, sep=";", encoding="latin1", usecols=usecols, low_memory=False)
    df = df[(df["NU_ANO"] >= YEAR_START) & (df["NU_ANO"] <= YEAR_END)].copy()
    df["regiao"] = df["SG_UF_ESCOLA"].map(UF_REGIONS)
    df["rede"] = df["TP_DEPENDENCIA_ADM_ESCOLA"].map(lambda value: "Privada" if value == 4 else "Publica")
    validate_data(df)
    df["mediaGeral"] = df[SUBJECT_COLUMNS].mean(axis=1, skipna=False)
    return df


def validate_data(df: pd.DataFrame) -> None:
    unknown_ufs = sorted(set(df["SG_UF_ESCOLA"].dropna()) - set(UF_REGIONS))
    if unknown_ufs:
        raise ValueError(f"UFs sem mapeamento de regiao: {unknown_ufs}")

    unknown_dependencies = sorted(set(df["TP_DEPENDENCIA_ADM_ESCOLA"].dropna()) - set(DEPENDENCY_LABELS))
    if unknown_dependencies:
        raise ValueError(f"Dependencias administrativas desconhecidas: {unknown_dependencies}")

    unknown_locations = sorted(set(df["TP_LOCALIZACAO_ESCOLA"].dropna()) - {1, 2})
    if unknown_locations:
        raise ValueError(f"Localizacoes desconhecidas: {unknown_locations}")

    if df.empty:
        raise ValueError(f"Nenhum registro encontrado no recorte {YEAR_START}-{YEAR_END}.")


def build_year_scores(df: pd.DataFrame) -> list[dict[str, object]]:
    grouped = df.groupby("NU_ANO")[SUBJECT_COLUMNS].mean().reset_index()
    grouped = round_df(grouped, SUBJECT_COLUMNS)
    return [
        {
            "ano": int(row["NU_ANO"]),
            "cn": row["NU_MEDIA_CN"],
            "ch": row["NU_MEDIA_CH"],
            "lp": row["NU_MEDIA_LP"],
            "mt": row["NU_MEDIA_MT"],
            "redacao": row["NU_MEDIA_RED"],
        }
        for _, row in grouped.iterrows()
    ]


def build_network_counts(df: pd.DataFrame) -> list[dict[str, object]]:
    counts = df["rede"].value_counts()
    total = int(counts.sum())
    return [
        {"rede": "Publica", "registros": int(counts.get("Publica", 0)), "percentual": round(counts.get("Publica", 0) / total * 100, 2)},
        {"rede": "Privada", "registros": int(counts.get("Privada", 0)), "percentual": round(counts.get("Privada", 0) / total * 100, 2)},
    ]


def build_admin_counts(df: pd.DataFrame) -> list[dict[str, object]]:
    counts = df["TP_DEPENDENCIA_ADM_ESCOLA"].map(DEPENDENCY_LABELS).value_counts()
    order = [
        ("Estadual", "Publica"),
        ("Privada", "Privada"),
        ("Municipal", "Publica"),
        ("Federal", "Publica"),
    ]
    return [
        {"dependencia": label, "rede": rede, "registros": int(counts.get(label, 0))}
        for label, rede in order
    ]


def build_state_participation(df: pd.DataFrame) -> list[dict[str, object]]:
    counts = df.groupby("SG_UF_ESCOLA").size().reset_index(name="registros")
    counts["regiao"] = counts["SG_UF_ESCOLA"].map(UF_REGIONS)
    counts["nome"] = counts["SG_UF_ESCOLA"].map(UF_NAMES)
    counts = counts.sort_values("registros", ascending=False)
    return [
        {
            "uf": row["SG_UF_ESCOLA"],
            "nome": row["nome"],
            "regiao": row["regiao"],
            "registros": int(row["registros"]),
        }
        for _, row in counts.iterrows()
    ]


def build_network_scores(df: pd.DataFrame) -> list[dict[str, object]]:
    rows = []
    for _, full_label, _, column in SUBJECTS:
        grouped = df.groupby("rede")[column].mean()
        rows.append({"area": full_label, "publica": grouped.get("Publica", 0), "privada": grouped.get("Privada", 0)})
    return rows


def build_regional_network_scores(df: pd.DataFrame) -> list[dict[str, object]]:
    rows = []
    for region in REGION_ORDER:
        subset = df[df["regiao"] == region]
        for _, full_label, _, column in SUBJECTS:
            grouped = subset.groupby("rede")[column].mean()
            rows.append({"regiao": region, "area": full_label, "publica": grouped.get("Publica", 0), "privada": grouped.get("Privada", 0)})
    return rows


def build_approval_scatter(df: pd.DataFrame) -> list[dict[str, object]]:
    grouped = (
        df.dropna(subset=["mediaGeral", "NU_TAXA_APROVACAO"])
        .groupby(["SG_UF_ESCOLA", "regiao", "rede"], as_index=False)
        .agg(
            mediaGeral=("mediaGeral", "mean"),
            taxaAprovacao=("NU_TAXA_APROVACAO", "mean"),
            taxaPermanencia=("NU_TAXA_PERMANENCIA", "mean"),
            taxaPermanenciaRegistros=("NU_TAXA_PERMANENCIA", "count"),
            registros=("mediaGeral", "size"),
        )
        .sort_values(["SG_UF_ESCOLA", "rede"])
    )
    return [
        {
            "uf": row["SG_UF_ESCOLA"],
            "regiao": row["regiao"],
            "rede": row["rede"],
            "mediaGeral": row["mediaGeral"],
            "taxaAprovacao": row["taxaAprovacao"],
            "taxaPermanencia": row["taxaPermanencia"],
            "taxaPermanenciaRegistros": int(row["taxaPermanenciaRegistros"]),
            "registros": int(row["registros"]),
        }
        for _, row in grouped.iterrows()
    ]


def build_state_score_averages(df: pd.DataFrame) -> list[dict[str, object]]:
    grouped = (
        df.dropna(subset=["mediaGeral"])
        .groupby(["SG_UF_ESCOLA", "regiao"], as_index=False)
        .agg(mediaGeral=("mediaGeral", "mean"), registros=("mediaGeral", "size"))
        .sort_values("mediaGeral", ascending=False)
    )
    return [
        {"uf": row["SG_UF_ESCOLA"], "regiao": row["regiao"], "mediaGeral": row["mediaGeral"], "registros": int(row["registros"])}
        for _, row in grouped.iterrows()
    ]


def build_region_score_averages(df: pd.DataFrame) -> list[dict[str, object]]:
    grouped = (
        df.dropna(subset=["mediaGeral"])
        .groupby("regiao", as_index=False)
        .agg(mediaGeral=("mediaGeral", "mean"), registros=("mediaGeral", "size"))
    )
    by_region = {row["regiao"]: row for _, row in grouped.iterrows()}
    return [
        {"regiao": region, "mediaGeral": by_region[region]["mediaGeral"], "registros": int(by_region[region]["registros"])}
        for region in REGION_ORDER
    ]


def build_state_network_score_averages(df: pd.DataFrame) -> list[dict[str, object]]:
    grouped = (
        df.dropna(subset=["mediaGeral"])
        .groupby(["SG_UF_ESCOLA", "regiao", "rede"], as_index=False)
        .agg(mediaGeral=("mediaGeral", "mean"), registros=("mediaGeral", "size"))
        .sort_values(["rede", "mediaGeral"], ascending=[True, False])
    )
    return [
        {
            "uf": row["SG_UF_ESCOLA"],
            "regiao": row["regiao"],
            "rede": row["rede"],
            "mediaGeral": row["mediaGeral"],
            "registros": int(row["registros"]),
        }
        for _, row in grouped.iterrows()
    ]


def build_region_network_score_averages(df: pd.DataFrame) -> list[dict[str, object]]:
    grouped = (
        df.dropna(subset=["mediaGeral"])
        .groupby(["regiao", "rede"], as_index=False)
        .agg(mediaGeral=("mediaGeral", "mean"), registros=("mediaGeral", "size"))
    )
    by_region_rede = {(row["regiao"], row["rede"]): row for _, row in grouped.iterrows()}
    rows = []
    for region in REGION_ORDER:
        for rede in ["Publica", "Privada"]:
            row = by_region_rede[(region, rede)]
            rows.append(
                {
                    "regiao": region,
                    "rede": rede,
                    "mediaGeral": row["mediaGeral"],
                    "registros": int(row["registros"]),
                }
            )
    return rows


def build_federal_private_urban_scores(df: pd.DataFrame) -> list[dict[str, object]]:
    urban = df[df["TP_LOCALIZACAO_ESCOLA"] == 1].copy()
    urban["grupo"] = urban["TP_DEPENDENCIA_ADM_ESCOLA"].map({1: "Federal urbana", 4: "Privada urbana"})
    urban = urban[urban["grupo"].notna()]
    rows = []
    for _, _, short_label, column in SUBJECTS:
        grouped = urban.groupby("grupo")[column].mean()
        rows.append({"area": short_label, "federalUrbana": grouped.get("Federal urbana", 0), "privadaUrbana": grouped.get("Privada urbana", 0)})
    return rows


def build_regional_federal_private_urban_scores(df: pd.DataFrame) -> list[dict[str, object]]:
    urban = df[df["TP_LOCALIZACAO_ESCOLA"] == 1].copy()
    urban["grupo"] = urban["TP_DEPENDENCIA_ADM_ESCOLA"].map({1: "Federal urbana", 4: "Privada urbana"})
    urban = urban[urban["grupo"].notna()]
    rows = []
    for region in REGION_ORDER:
        subset = urban[urban["regiao"] == region]
        for _, _, short_label, column in SUBJECTS:
            grouped = subset.groupby("grupo")[column].mean()
            rows.append({"regiao": region, "area": short_label, "federalUrbana": grouped.get("Federal urbana", 0), "privadaUrbana": grouped.get("Privada urbana", 0)})
    return rows


def build_urban_rural_region_scores(df: pd.DataFrame) -> list[dict[str, object]]:
    state_schools = df[df["TP_DEPENDENCIA_ADM_ESCOLA"] == 2].copy()
    state_schools["localizacao"] = state_schools["TP_LOCALIZACAO_ESCOLA"].map({1: "urbana", 2: "rural"})
    grouped = (
        state_schools.dropna(subset=["mediaGeral"])
        .groupby(["regiao", "localizacao"], as_index=False)
        .agg(mediaGeral=("mediaGeral", "mean"), registros=("mediaGeral", "size"))
    )
    scores = grouped.pivot(index="regiao", columns="localizacao", values="mediaGeral")
    counts = grouped.pivot(index="regiao", columns="localizacao", values="registros")
    rows = []
    for region in REGION_ORDER:
        rows.append(
            {
                "regiao": region,
                "urbana": scores.loc[region].get("urbana", 0),
                "rural": scores.loc[region].get("rural", 0),
                "registrosUrbanos": int(counts.loc[region].get("urbana", 0)),
                "registrosRurais": int(counts.loc[region].get("rural", 0)),
            }
        )
    return rows


def build_correlations(df: pd.DataFrame) -> tuple[list[dict[str, object]], list[dict[str, object]]]:
    corr = df[SUBJECT_COLUMNS].corr()
    code_by_column = {column: key.upper() if key != "redacao" else "Redacao" for key, _, _, column in SUBJECTS}
    pair_order = [
        ("NU_MEDIA_CN", "NU_MEDIA_LP"),
        ("NU_MEDIA_CN", "NU_MEDIA_MT"),
        ("NU_MEDIA_LP", "NU_MEDIA_MT"),
        ("NU_MEDIA_CN", "NU_MEDIA_CH"),
        ("NU_MEDIA_CH", "NU_MEDIA_LP"),
        ("NU_MEDIA_CN", "NU_MEDIA_RED"),
        ("NU_MEDIA_CH", "NU_MEDIA_RED"),
    ]
    rows = [
        {"pair": f"{code_by_column[left]} x {code_by_column[right]}", "value": corr.loc[left, right]}
        for left, right in pair_order
    ]
    matrix = []
    for _, _, short_label, row_column in SUBJECTS:
        row = {"area": short_label}
        for key, _, _, column in SUBJECTS:
            row[key] = corr.loc[row_column, column]
        matrix.append(row)
    return rows, matrix


def build_ts() -> str:
    df = load_data()
    correlation_rows, correlation_matrix = build_correlations(df)

    parts = [
        "// Auto-generated by scripts/generate_enem_data.py.",
        f"// Source: {SOURCE_CSV.relative_to(ROOT.parent)}.",
        f"// Recorte de desempenho: {YEAR_START}-{YEAR_END}. Nao edite os agregados manualmente.",
        "",
        "export type SubjectKey = 'cn' | 'ch' | 'lp' | 'mt' | 'redacao';",
        "",
        "export interface YearScore { ano: number; cn: number; ch: number; lp: number; mt: number; redacao: number; }",
        "export interface NetworkCount { rede: 'Publica' | 'Privada'; registros: number; percentual: number; }",
        "export interface NetworkScore { area: string; publica: number; privada: number; }",
        "export interface RegionalNetworkScore extends NetworkScore { regiao: string; }",
        "export interface AdminCount { dependencia: string; rede: 'Publica' | 'Privada'; registros: number; }",
        "export interface StateParticipation { uf: string; nome: string; regiao: string; registros: number; }",
        "export interface ApprovalScorePoint { uf: string; regiao: string; rede: 'Publica' | 'Privada'; mediaGeral: number; taxaAprovacao: number; taxaPermanencia: number; taxaPermanenciaRegistros: number; registros: number; }",
        "export interface StateScoreAverage { uf: string; regiao: string; mediaGeral: number; registros: number; }",
        "export interface RegionScoreAverage { regiao: string; mediaGeral: number; registros: number; }",
        "export interface StateNetworkScoreAverage extends StateScoreAverage { rede: 'Publica' | 'Privada'; }",
        "export interface RegionNetworkScoreAverage extends RegionScoreAverage { rede: 'Publica' | 'Privada'; }",
        "export interface FederalPrivateUrbanScore { area: string; federalUrbana: number; privadaUrbana: number; }",
        "export interface RegionalFederalPrivateUrbanScore extends FederalPrivateUrbanScore { regiao: string; }",
        "export interface UrbanRuralRegionScore { regiao: string; urbana: number; rural: number; registrosUrbanos: number; registrosRurais: number; }",
        "export interface MapPoint { id: string; label: string; detail: string; longitude: number; latitude: number; value: number; tone: 'primary' | 'secondary' | 'accent'; }",
        "",
        ts_array("yearScores", "YearScore", build_year_scores(df)),
        "",
        ts_array("networkCounts", "NetworkCount", build_network_counts(df)),
        "",
        ts_array("adminCounts", "AdminCount", build_admin_counts(df)),
        "",
        ts_array("stateParticipation", "StateParticipation", build_state_participation(df)),
        "",
        ts_array("networkScores", "NetworkScore", build_network_scores(df)),
        "",
        ts_array("regionalNetworkScores", "RegionalNetworkScore", build_regional_network_scores(df)),
        "",
        ts_array("approvalScoreScatter", "ApprovalScorePoint", build_approval_scatter(df)),
        "",
        ts_array("stateScoreAverages", "StateScoreAverage", build_state_score_averages(df)),
        "",
        ts_array("regionScoreAverages", "RegionScoreAverage", build_region_score_averages(df)),
        "",
        ts_array("stateNetworkScoreAverages", "StateNetworkScoreAverage", build_state_network_score_averages(df)),
        "",
        ts_array("regionNetworkScoreAverages", "RegionNetworkScoreAverage", build_region_network_score_averages(df)),
        "",
        ts_array("federalPrivateUrbanScores", "FederalPrivateUrbanScore", build_federal_private_urban_scores(df)),
        "",
        ts_array("regionalFederalPrivateUrbanScores", "RegionalFederalPrivateUrbanScore", build_regional_federal_private_urban_scores(df)),
        "",
        ts_array("urbanRuralRegionScores", "UrbanRuralRegionScore", build_urban_rural_region_scores(df)),
        "",
        ts_array("correlationRows", "{ pair: string; value: number }", correlation_rows),
        "",
        ts_array("correlationMatrix", "({ area: string } & Record<SubjectKey, number>)", correlation_matrix),
        "",
        "export const mapPoints: MapPoint[] = [",
        f"  {{ id: 'brasil', label: 'Brasil', detail: 'Base nacional dos microdados ENEM por escola ({YEAR_START}-{YEAR_END})', longitude: -53.2, latitude: -10.8, value: {len(df)}, tone: 'primary' }},",
        "];",
        "",
        "export const subjectLabels: Record<SubjectKey, string> = {",
        "  cn: 'Natureza',",
        "  ch: 'Humanas',",
        "  lp: 'Linguagens',",
        "  mt: 'Matematica',",
        "  redacao: 'Redacao',",
        "};",
        "",
        "export const totalRecords = networkCounts.reduce((sum, item) => sum + item.registros, 0);",
        "export const averagePublicPrivateGap = networkScores.reduce((sum, item) => sum + (item.privada - item.publica), 0) / networkScores.length;",
        "",
    ]
    return "\n".join(parts)


def main() -> None:
    if not SOURCE_CSV.exists():
        raise FileNotFoundError(f"CSV de origem nao encontrado: {SOURCE_CSV}")
    OUTPUT_TS.write_text(build_ts(), encoding="utf-8", newline="\n")
    print(f"Gerado {OUTPUT_TS.relative_to(ROOT)} a partir de {SOURCE_CSV.relative_to(ROOT.parent)}")


if __name__ == "__main__":
    main()
