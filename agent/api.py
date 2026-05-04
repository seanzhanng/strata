from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

from tools import spark, tables
from agent import executor

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

@app.post("/api/chat")
def chat(request: ChatRequest):
    output = executor.invoke({"input": request.message})
    return {"response": output["output"]}

@app.get("/api/gold/{table_name}")
def get_gold_table(table_name: str):
    if table_name not in tables:
        raise HTTPException(status_code=404, detail=f"Table '{table_name}' not found")
    df = spark.read.format("delta").load(tables[table_name])
    return df.toPandas().to_dict(orient="records")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)