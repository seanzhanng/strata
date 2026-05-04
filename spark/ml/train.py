from pyspark.sql import SparkSession
from pyspark.sql.functions import hour
import mlflow
import mlflow.sklearn
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_squared_error, r2_score

spark = (SparkSession.builder
    .appName("strata-ml-train")
    .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension")
    .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog")
    .getOrCreate())

df = spark.read.format("delta").load("spark/delta/silver/trips")
df = df.select(
    "passenger_count",
    "trip_distance",
    "fare_amount",
    "PULocationID",
    "DOLocationID",
    hour("tpep_pickup_datetime").alias("pickup_hour")
)

pdf = df.toPandas()
X = pdf.drop("fare_amount", axis=1)
y = pdf["fare_amount"]

from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

model = GradientBoostingRegressor(n_estimators=100, max_depth=5, random_state=42)
model.fit(X_train, y_train)

preds = model.predict(X_test)
rmse = mean_squared_error(y_test, preds, squared=False)
r2 = r2_score(y_test, preds)

mlflow.set_tracking_uri("file:///app/ml/mlruns")
mlflow.set_experiment("strata-fare-prediction")

with mlflow.start_run():
    mlflow.log_param("model_type", "gradient_boosting")
    mlflow.log_param("test_size", 0.2)
    mlflow.log_param("n_estimators", 100)
    mlflow.log_param("max_depth", 5)
    mlflow.log_metric("rmse", rmse)
    mlflow.log_metric("r2", r2)
    mlflow.sklearn.log_model(model, "model")

print(f"RMSE: {rmse}, R2: {r2}")