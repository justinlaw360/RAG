# Retrieval-Augmented Generation using Azure OpenAI

The MTRC policies set out the guidelines and standards on management of information in conducting its business, with highlights on the general principles and areas of law and management which staff should have regard to in implementation.

As of Oct 2023, there are over 120 policy instructions published by management, covering various areas, such as HR, IT, security, administration, management instructions, corporate governance, finance, asset, health and safety.  More and more policies make the staff  be difficult to figure out the relevant CGIs to follow.

The PoC aims to let machine “learning” all the CGIs and using ChatGPT provide advices to staff about the relevant CGIs in natural language.

### What is retrieval-augmented generation?
RAG is an AI framework for retrieving facts from an external knowledge base to ground large language models (LLMs) on the most accurate, up-to-date information and to give users insight into LLMs' generative process.  Implementing RAG in an LLM-based question answering system has two main benefits: It ensures that the model has access to the most current, reliable facts, and that users have access to the model’s sources, ensuring that its claims can be checked for accuracy and ultimately trusted.

As the name suggests, RAG has two phases: retrieval and content generation. In the retrieval phase, algorithms search for and retrieve snippets of information relevant to the user’s prompt or question. In an open-domain, consumer setting, those facts can come from indexed documents on the internet; in a closed-domain, enterprise setting, a narrower set of sources are typically used for added security and reliability.

This assortment of external knowledge is appended to the user’s prompt and passed to the language model. In the generative phase, the LLM draws from the augmented prompt and its internal representation of its training data to synthesize an engaging answer tailored to the user in that instant. The answer can then be passed to a chatbot with links to its sources.

### The Flow
I the simpified the flow how OpenAI model "learn" the company policies and response based on the policies, as illusstrated below.
![image](https://github.com/justinlaw360/RAG/blob/main/rag.jpg)
