from pyspark.sql import SparkSession
from pyspark.sql.functions import count, avg, sum, hour, to_date

spark = (SparkSession.builder
    .appName("strata-gold-aggregate")
    .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension")
    .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog")
    .getOrCreate())

df = spark.read.format("delta").load("spark/delta/silver/trips")

agg1 = df.groupBy(to_date("tpep_pickup_datetime").alias("pickup_date")).agg(
    count("*").alias("trip_count"),
    avg("fare_amount").alias("avg_fare"),
    sum("total_amount").alias("total_revenue"),
    avg("trip_distance").alias("avg_distance")
)
agg1.orderBy("pickup_date").write.format("delta").mode("overwrite").save("spark/delta/gold/date")

agg2 = df.groupBy("PULocationID").agg(
    count("*").alias("trip_count"),
    avg("fare_amount").alias("avg_fare"),
    sum("total_amount").alias("total_revenue"),
    avg("trip_distance").alias("avg_distance")
)
agg2.orderBy("PULocationID").write.format("delta").mode("overwrite").save("spark/delta/gold/pickup_location")

agg3 = df.groupBy(hour("tpep_pickup_datetime").alias("pickup_hour")).agg(
    count("*").alias("trip_count"),
    avg("fare_amount").alias("avg_fare"),
    avg("tip_amount").alias("avg_tip")
)
agg3.orderBy("pickup_hour").write.format("delta").mode("overwrite").save("spark/delta/gold/hour")

agg4 = df.groupBy("payment_type").agg(
    count("*").alias("trip_count"),
    avg("total_amount").alias("avg_total"),
    avg("tip_amount").alias("avg_tip")
)
agg4.write.format("delta").mode("overwrite").save("spark/delta/gold/payment_type")

agg5 = df.groupBy("PULocationID", "DOLocationID").agg(
    count("*").alias("trip_count"),
    avg("trip_distance").alias("avg_distance"),
    avg("fare_amount").alias("avg_fare")
)
agg5.write.format("delta").mode("overwrite").save("spark/delta/gold/routes")

print("Gold tables written: date, pickup_location, hour, payment_type, routes")