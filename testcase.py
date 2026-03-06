import pandas as pd
import networkx as nx
import joblib

DATASET_PATH = "Historical Data.csv"
OUTPUT_PATH = "graph_model.joblib"

COLUMN_MAPPING = {
    "Container_ID": "container_id",
    "Declaration_Date (YYYY-MM-DD)": "declaration_date",
    "Declaration_Time": "declaration_time",
    "Trade_Regime (Import / Export / Transit)": "trade_regime",
    "Origin_Country": "origin_country",
    "Destination_Port": "destination_port",
    "Destination_Country": "destination_country",
    "HS_Code": "hs_code",
    "Importer_ID": "importer_id",
    "Exporter_ID": "exporter_id",
    "Declared_Value": "declared_value",
    "Declared_Weight": "declared_weight",
    "Measured_Weight": "measured_weight",
    "Shipping_Line": "shipping_line",
    "Dwell_Time_Hours": "dwell_time_hours",
    "Clearance_Status": "clearance_status",
}


def build_trade_graph(df):

    graph = nx.Graph()

    for _, row in df.iterrows():

        importer = f"importer:{row['importer_id']}"
        exporter = f"exporter:{row['exporter_id']}"
        shipping_line = f"shipping_line:{row['shipping_line']}"

        graph.add_edge(importer, exporter)
        graph.add_edge(exporter, shipping_line)

    return graph


def train_graph():

    print("Loading dataset...")
    df = pd.read_csv(DATASET_PATH)

    print("Normalizing column names...")
    df = df.rename(columns=COLUMN_MAPPING)

    print("Dataset columns:")
    print(df.columns.tolist())

    print("Building trade graph...")
    graph = build_trade_graph(df)

    print("Graph statistics")
    print("Nodes:", graph.number_of_nodes())
    print("Edges:", graph.number_of_edges())

    print("Computing degree centrality...")
    degree = nx.degree_centrality(graph)

    print("Computing betweenness centrality (approx)...")
    betweenness = nx.betweenness_centrality(
        graph,
        k=500,
        seed=42
    )

    print("Saving graph model...")

    joblib.dump(
        {
            "degree": degree,
            "betweenness": betweenness
        },
        OUTPUT_PATH
    )

    print("Graph model saved at:", OUTPUT_PATH)


if __name__ == "__main__":
    train_graph()