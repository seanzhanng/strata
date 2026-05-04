from langchain_openai import ChatOpenAI
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_core.prompts import ChatPromptTemplate
from tools import run_query

llm = ChatOpenAI(model="gpt-4o")

prompt = ChatPromptTemplate.from_messages([
    ("system", """you are a data analyst. query the following tables using spark sql:
        date: pickup_date, trip_count, avg_fare, total_revenue, avg_distance
        hour: pickup_hour, trip_count, avg_fare, avg_tip
        pickup_location: PULocationID, trip_count, avg_fare, total_revenue, avg_distance
        payment_type: payment_type, trip_count, avg_total, avg_tip
        routes: PULocationID, DOLocationID, trip_count, avg_distance, avg_fare"""),
    ("human", "{input}"),
    ("placeholder", "{agent_scratchpad}"),
])

agent = create_tool_calling_agent(llm, [run_query], prompt)
executor = AgentExecutor(agent=agent, tools=[run_query])

# test
if __name__ == "__main__":
    output = executor.invoke({"input": "which day had the most trips"})
    print(output["output"])