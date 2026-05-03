from pyspark.sql import SparkSession

spark = (SparkSession.builder
    .appName("strata-silver-ingest")
    .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension")
    .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog")
    .getOrCreate())

df = spark.read.format("delta").load("spark/delta/bronze/trips")
df = (df
    .filter(df.passenger_count > 0)
    .filter(df.trip_distance > 0)
    .filter(df.fare_amount > 0)
    .filter(df.total_amount > 0)
    .filter(df.tpep_pickup_datetime >= "2026-01-01")
    .filter(df.tpep_pickup_datetime < "2026-02-01")
    .dropna(subset=["passenger_count", "RatecodeID", "store_and_fwd_flag"]))
df.write.format("delta").mode("overwrite").save("spark/delta/silver/trips")

print(f"Rows ingested: {df.count()}")