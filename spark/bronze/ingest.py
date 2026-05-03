from pyspark.sql import SparkSession

spark = (SparkSession.builder
    .appName("strata-bronze-ingest")
    .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension")
    .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog")
    .getOrCreate())

df = spark.read.format("parquet").load("data/raw/yellow_tripdata_2026-01.parquet")

df.write.format("delta").mode("overwrite").save("spark/delta/bronze/trips")

print(f"Rows ingested: {df.count()}")