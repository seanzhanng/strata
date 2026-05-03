from langchain_core.tools import tool
from pyspark.sql import SparkSession

spark = (SparkSession.builder
    .appName("strata-agent")
    .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension")
    .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog")
    .getOrCreate())

tables = {
    "date": "/app/spark/delta/gold/date",
    "hour": "/app/spark/delta/gold/hour",
    "payment_type": "/app/spark/delta/gold/payment_type",
    "pickup_location": "/app/spark/delta/gold/pickup_location",
    "routes": "/app/spark/delta/gold/routes"
}

for name, path in tables.items():
    spark.read.format("delta").load(path).createOrReplaceTempView(name)

@tool
def run_query(query: str) -> str:
    """run a spark sql query against the gold layer tables: date, hour, payment_type, pickup_location, routes."""
    output = spark.sql(query)
    return output.toPandas().to_string()