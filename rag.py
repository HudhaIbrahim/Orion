import os
from typing import List, Dict

from langchain.document_loaders import (
    PyPDFLoader,
    TextLoader,
    UnstructuredWordDocumentLoader,
)
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from openai import OpenAI

from config import settings
from roles_skills import AVAILABLE_ROLES

client = OpenAI(api_key=settings.openai_api_key)

# Initialize embeddings
embeddings = OpenAIEmbeddings(openai_api_key=settings.openai_api_key)

# Path to the folder containing all docs for FAQs
DOCS_PATH = "./docs"  # adjust as needed
VECTOR_STORE_PATH = "./vector_store"  # folder to store FAISS index


def load_all_documents(folder_path: str) -> List:
    """
    Load all PDFs, text files, and Word docs from a folder
    """
    documents = []
    for filename in os.listdir(folder_path):
        filepath = os.path.join(folder_path, filename)
        if filename.lower().endswith(".pdf"):
            loader = PyPDFLoader(filepath)
            documents.extend(loader.load())
        elif filename.lower().endswith(".txt"):
            loader = TextLoader(filepath, encoding="utf-8")
            documents.extend(loader.load())
        elif filename.lower().endswith(".docx"):
            loader = UnstructuredWordDocumentLoader(filepath)
            documents.extend(loader.load())
    return documents


def split_documents(
    documents: List, chunk_size: int = 1000, chunk_overlap: int = 100
) -> List:
    """
    Split documents into chunks for embedding
    """
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
    )
    return splitter.split_documents(documents)


def create_vector_store(
    documents: List, vector_store_path: str = VECTOR_STORE_PATH
) -> FAISS:
    """
    Create or load a FAISS vector store from document embeddings
    """
    if os.path.exists(vector_store_path):
        return FAISS.load_local(vector_store_path, embeddings)
    vectorstore = FAISS.from_documents(documents, embeddings)
    vectorstore.save_local(vector_store_path)
    return vectorstore


def query_vector_store(query: str, vectorstore: FAISS, k: int = 5) -> List[Dict]:
    """
    Retrieve top-k relevant chunks from the vector store
    """
    results = vectorstore.similarity_search(query, k=k)
    # Return only text content
    return [{"text": doc.page_content, "metadata": doc.metadata} for doc in results]


def suggest_roles(candidate_skills):
    suggested_roles = []
    for role_name, role_info in AVAILABLE_ROLES.items():
        required = set(
            role_info.get("technical_skills", [])
            + role_info.get("soft_skills", [])
        )
        if len(set(candidate_skills).intersection(required)) / len(required) >= 0.5:
            suggested_roles.append(role_name)
    return suggested_roles


# ----------------------
# Helper: full setup
# ----------------------


def initialize_rag_system():
    """
    Load docs, split, embed, and create FAISS vector store.
    Call this once at startup.
    """
    print("[RAG] Loading documents...")
    documents = load_all_documents(DOCS_PATH)
    print(f"[RAG] Loaded {len(documents)} documents")

    print("[RAG] Splitting documents...")
    chunks = split_documents(documents)
    print(f"[RAG] Split into {len(chunks)} chunks")

    print("[RAG] Creating FAISS vector store...")
    vectorstore = create_vector_store(chunks)
    print("[RAG] FAISS vector store ready")
    return vectorstore
