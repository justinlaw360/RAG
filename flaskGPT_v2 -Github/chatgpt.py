import os

from langchain_openai import AzureOpenAIEmbeddings
from langchain_openai import AzureChatOpenAI

from langchain import hub

from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage

from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain
from langchain.chains import create_history_aware_retriever

# Use FAISS to index the embeddings. This will allow us to perform a similarity search on the texts using the embeddings.
from langchain.vectorstores import FAISS

#from flask import Flask, redirect, render_template, request, url_for


os.environ["AZURE_OPENAI_API_KEY"] = ""
os.environ["AZURE_OPENAI_ENDPOINT"] = ""
os.environ["AZURE_OPENAI_API_VERSION"] = "2024-04-01-preview"
os.environ["AZURE_OPENAI_CHAT_DEPLOYMENT_NAME"] = "gpt-4-32k"

#app = Flask(__name__)

model = AzureChatOpenAI(
    openai_api_version=os.environ["AZURE_OPENAI_API_VERSION"],
    azure_deployment=os.environ[
        "AZURE_OPENAI_CHAT_DEPLOYMENT_NAME"
    ],  # in Azure, this deployment has version 0613 - input and output tokens are counted separately
    model_version="0613",
)

embeddings = AzureOpenAIEmbeddings(
    azure_deployment="text-embedding-ada-002",
    openai_api_version="2023-05-15",
    
)

#Load FAISS iIndex
db = FAISS.load_local("C:/Users/LAWJusHM/Source/Repos/ChatGPTFlask/vdb.index", embeddings, allow_dangerous_deserialization=True)

retriever = db.as_retriever(search_type="similarity", search_kwargs={"k": 6})

contextualize_q_system_prompt = """Given a chat history and the latest user question \
which might reference context in the chat history, formulate a standalone question \
which can be understood without the chat history. Do NOT answer the question, \
just reformulate it if needed and otherwise return it as is."""
contextualize_q_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", contextualize_q_system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ]
)
history_aware_retriever = create_history_aware_retriever(
    model, retriever, contextualize_q_prompt
)


qa_system_prompt = """You are an assistant for question-answering tasks. \
Use the following pieces of retrieved context to answer the question. \
If you don't know the answer, just say that you don't know. \
Use three sentences maximum and keep the answer concise.\

{context}"""

qa_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", qa_system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ]
)

history_aware_retriever = create_history_aware_retriever(
    model, retriever, contextualize_q_prompt
)

question_answer_chain = create_stuff_documents_chain(model, qa_prompt)


rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)

chat_history = []

def get_response(msg):
    #question = HumanMessage(content=msg)
    response = rag_chain.invoke({"input": msg, "chat_history": chat_history})
    chat_history.extend([HumanMessage(content=msg), response["answer"]])
    content = response["answer"]
    return content