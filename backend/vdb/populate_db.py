import argparse
import os
import shutil
import logging
from typing import List
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.schema.document import Document
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings
from pypdf.errors import PdfStreamError
from app.core.config import settings  


CHROMA_PATH = "chroma"
DATA_PATH = "data"


def main():

    parser = argparse.ArgumentParser()
    parser.add_argument("--reset", action="store_true", help="Reset the database.")
    args = parser.parse_args()
    if args.reset:
        print("✨ Clearing Database")
        clear_database()

    documents = load_documents()
    chunks = split_documents(documents)
    add_to_chroma(chunks)


def load_documents() -> List[Document]:
    """Load documents from the data directory, skipping corrupted files."""
    documents = []
    logging.info(f"Loading documents from {DATA_PATH}")
    
    document_loader = PyPDFDirectoryLoader(DATA_PATH)
    
    # Get all PDF files in the directory
    pdf_files = [f for f in os.listdir(DATA_PATH) if f.endswith('.pdf')]
    
    for pdf_file in pdf_files:
        try:
            file_path = os.path.join(DATA_PATH, pdf_file)
            single_loader = PyPDFDirectoryLoader(os.path.dirname(file_path), glob=pdf_file)
            file_documents = single_loader.load()
            documents.extend(file_documents)
            logging.info(f"Successfully loaded {pdf_file}")
        except (PdfStreamError, Exception) as e:
            logging.error(f"Error loading {pdf_file}: {str(e)}")
            continue
    
    logging.info(f"Successfully loaded {len(documents)} documents")
    return documents


def split_documents(documents: list[Document]):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=80,
        length_function=len,
        is_separator_regex=False,
    )
    return text_splitter.split_documents(documents)


def add_to_chroma(chunks: list[Document]):
    # Load the existing database.
    db = Chroma(
        persist_directory=CHROMA_PATH,
        embedding_function=get_embedding_function()
    )

    # Calculate Page IDs.
    chunks_with_ids = calculate_chunk_ids(chunks)

    # Add or Update the documents.
    existing_items = db.get(include=[])  # IDs are always included by default
    existing_ids = set(existing_items["ids"])
    print(f"Number of existing documents in DB: {len(existing_ids)}")

    # Only add documents that don't exist in the DB.
    new_chunks = []
    for chunk in chunks_with_ids:
        if chunk.metadata["id"] not in existing_ids:
            new_chunks.append(chunk)

    if len(new_chunks):
        print(f"👉 Adding new documents: {len(new_chunks)}")
        new_chunk_ids = [chunk.metadata["id"] for chunk in new_chunks]
        db.add_documents(new_chunks, ids=new_chunk_ids)
        # db.persist()
    else:
        print("✅ No new documents to add")


def calculate_chunk_ids(chunks):

    last_page_id = None
    current_chunk_index = 0

    for chunk in chunks:
        source = chunk.metadata.get("source")
        page = chunk.metadata.get("page")
        current_page_id = f"{source}:{page}"

        if current_page_id == last_page_id:
            current_chunk_index += 1
        else:
            current_chunk_index = 0

        chunk_id = f"{current_page_id}:{current_chunk_index}"
        last_page_id = current_page_id

        chunk.metadata["id"] = chunk_id

    return chunks


def clear_database():
    if os.path.exists(CHROMA_PATH):
        shutil.rmtree(CHROMA_PATH)


def get_embedding_function():
    embeddings = OpenAIEmbeddings(
        api_key=settings.OPENAI_API_KEY,
        model="text-embedding-ada-002"
    )
    return embeddings


if __name__ == "__main__":
    main()
