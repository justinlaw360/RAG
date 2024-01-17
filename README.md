# Retrieval-Augmented Generation using Azure OpenAI

The company policies set out the guidelines and standards on management of information in conducting its business, with highlights on the general principles and areas of law and management which staff should have regard to in implementation.

As of Oct 2023, there are over 120 policy instructions published by management, covering various areas, such as HR, IT, security, administration, management instructions, corporate governance, finance, asset, health and safety.  More and more policies make the staff  be difficult to figure out the relevant CGIs to follow.

The PoC aims to let machine “learning” all the CGIs and using ChatGPT provide advices to staff about the relevant CGIs in natural language.

### What is retrieval-augmented generation?
RAG is an AI framework for retrieving facts from an external knowledge base to ground large language models (LLMs) on the most accurate, up-to-date information and to give users insight into LLMs' generative process.  Implementing RAG in an LLM-based question answering system has two main benefits: It ensures that the model has access to the most current, reliable facts, and that users have access to the model’s sources, ensuring that its claims can be checked for accuracy and ultimately trusted.

As the name suggests, RAG has two phases: retrieval and content generation. In the retrieval phase, algorithms search for and retrieve snippets of information relevant to the user’s prompt or question. In an open-domain, consumer setting, those facts can come from indexed documents on the internet; in a closed-domain, enterprise setting, a narrower set of sources are typically used for added security and reliability.

This assortment of external knowledge is appended to the user’s prompt and passed to the language model. In the generative phase, the LLM draws from the augmented prompt and its internal representation of its training data to synthesize an engaging answer tailored to the user in that instant. The answer can then be passed to a chatbot with links to its sources.

### The Flow
I simplified the flow how OpenAI model "learn" the company policies and response based on the policies, as illustrated below.
![image](https://github.com/justinlaw360/RAG/blob/main/rag.jpg)

### Step 1 - Data collection
255 (English and Chinese) CGIs are downloaded from HR Library

![image](https://github.com/justinlaw360/RAG/assets/4946026/d0ec160b-c157-4ebf-9f20-0fd1322e1d74)HR Library

And store locally on my PC

![image](https://github.com/justinlaw360/RAG/assets/4946026/53c17c03-9c57-43a7-ad1a-33cae2bf5397)

### Step 2 - Embedding Data
I use Azure OpenAI embedding model "text-embedding-ada-002“ to embed the documents into vectors. Text-embedding-ada-002 is an embedding model from OpenAI published in Dec 2022 for text search, text similarity, and code search. 

![image](https://github.com/justinlaw360/RAG/assets/4946026/7220b306-aa0c-481b-9961-fccf88984ab1)

### Step 3 - VectorDB
VectorDB is a database designed for storing and retrieving text using chunking, embedding, and vector search techniques. 

![image](https://github.com/justinlaw360/RAG/assets/4946026/96edf610-f2ba-47f7-a940-284570f84d9c)

### Step 4 - Perform Similarity Search against CGIs
In this PoC, I choose FAISS (Facebook AI Similarity Search) to enable vectors to be compared with L2 (Euclidean) distances or dot products and uses quantization and binary indexes to reduce search latency at the cost of recall.

![image](https://github.com/justinlaw360/RAG/assets/4946026/c70144b1-3d03-4503-a64a-d6eb486e5c96)

### Step 5 - Response in Nature Language using GPT4
Generative Pre-trained Transformer (GPT) is a large language model (LLM) that is capable of generating human-like text.

![image](https://github.com/justinlaw360/RAG/assets/4946026/9cf31c9e-4819-4dd0-b438-b8fcb6eaac97)
<br>Transfer model

### Step 6 - Build a simple GUI to interactive with the model using Flask
![image](https://github.com/justinlaw360/RAG/blob/main/Animation.gif)

### Lesson learnt
Data is a crucial component in the Machine Learning, I spend almost 40% of time to search the full set of data, removing duplication and encoding non English texts.  It is also important that the policy is sensitive data and it should not be disclosed to public.  Data security is another area I play most attention, all data are stored locally.

By using LangChain model, I can plug and play another models, such as Meta LLAMA2 replacing the OpenAI models.





