import os
import sys
import time
import openai

import openai
from flask import Flask, redirect, render_template, request, url_for
from langchain.chat_models import AzureChatOpenAI
from langchain.embeddings import OpenAIEmbeddings

app = Flask(__name__)
OPENAI_API_KEY = 
OPENAI_DEPLOYMENT_NAME = 
OPENAI_EMBEDDING_MODEL_NAME = "text-embedding-ada-002"
OPENAI_API_VERSION = "2023-05-15"
OPENAI_API_BASE = 
api_type = "azure"
api_base = 
api_version = OPENAI_API_VERSION
api_key = OPENAI_API_KEY


# Configure Azure OpenAI Service API
openai.api_type = "azure"
openai.api_version = "2023-03-15-preview"
openai.api_base = OPENAI_API_BASE
openai.api_key = OPENAI_API_KEY

# Init LLM and embeddings model
llm = AzureChatOpenAI(
    deployment_name="gpt-4-32k", 
    openai_api_key=OPENAI_API_KEY,
    openai_api_base=OPENAI_API_BASE,
    temperature=0, 
    openai_api_version="2023-03-15-preview"        
)

# Init embeddings model
embeddings = OpenAIEmbeddings(
    openai_api_key= OPENAI_API_KEY,
    model="text-embedding-ada-002", 
    chunk_size=1,
)

from langchain.chains import ConversationalRetrievalChain
from langchain.prompts import PromptTemplate

# Use FAISS to index the embeddings. This will allow us to perform a similarity search on the texts using the embeddings.
from langchain.vectorstores import FAISS
#Load FAISS iIndex
db = FAISS.load_local("C:/vdb.index", embeddings)

# Adapt if needed
CONDENSE_QUESTION_PROMPT = PromptTemplate.from_template("""Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:""")

CB = ConversationalRetrievalChain.from_llm(llm=llm,
                                        retriever=db.as_retriever(),
                                        condense_question_prompt=CONDENSE_QUESTION_PROMPT,
                                        return_source_documents=True,
                                        verbose=False
                                        )

from langchain.schema import (AIMessage, HumanMessage, SystemMessage)
chat_history = []

systemPrompt = { "role": "system", "content": "You are a helpful assistant." }
data = []

def get_response(incoming_msg):
    question = HumanMessage(content=incoming_msg)
    response = CB({"question": question.content, "chat_history": chat_history}) 

    #messages = [ systemPrompt ]
    #messages.extend(data)

    content = response["answer"]
    return content
